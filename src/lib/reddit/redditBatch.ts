import { db } from "@/src/lib/db";
import type { RedditIngestEnv } from "@/src/lib/reddit/redditEnv";
import type { RedditListing, RedditSourcePool } from "@/src/lib/reddit/types";

const EMPTY_CURSOR: Record<RedditSourcePool, number> = {
  technology: 0,
  economy: 0,
  geopolitics: 0,
  general: 0,
};

export async function loadSubredditBatchCursor(): Promise<Record<RedditSourcePool, number>> {
  try {
    const row = await db.redditIngestState.findUnique({ where: { id: 1 } });
    if (!row?.cursorJson) return { ...EMPTY_CURSOR };
    const v = JSON.parse(row.cursorJson) as Partial<Record<RedditSourcePool, number>>;
    return {
      technology: typeof v.technology === "number" && Number.isFinite(v.technology) ? v.technology : 0,
      economy: typeof v.economy === "number" && Number.isFinite(v.economy) ? v.economy : 0,
      geopolitics:
        typeof v.geopolitics === "number" && Number.isFinite(v.geopolitics) ? v.geopolitics : 0,
      general: typeof v.general === "number" && Number.isFinite(v.general) ? v.general : 0,
    };
  } catch {
    return { ...EMPTY_CURSOR };
  }
}

export async function saveSubredditBatchCursor(
  cursor: Record<RedditSourcePool, number>,
): Promise<void> {
  try {
    await db.redditIngestState.upsert({
      where: { id: 1 },
      create: { id: 1, cursorJson: JSON.stringify(cursor) },
      update: { cursorJson: JSON.stringify(cursor) },
    });
  } catch {
    /* DB may lag migrations */
  }
}

export function getListingsForSubreddit(
  pool: RedditSourcePool,
  subreddit: string,
  poolSubs: readonly string[],
  env: RedditIngestEnv,
): RedditListing[] {
  if (pool === "general") return [...env.listingsLight];
  const idx = poolSubs.indexOf(subreddit);
  const isCore = idx >= 0 && idx < env.coreSubredditsPerPool;
  return [...(isCore ? env.listingsCore : env.listingsStandard)];
}

export function buildSubredditWorklist(
  pools: Record<RedditSourcePool, readonly string[]>,
  batchSizeByPool: Record<RedditSourcePool, number>,
  cursor: Record<RedditSourcePool, number>,
): {
  work: Array<{ pool: RedditSourcePool; subreddit: string }>;
  nextCursor: Record<RedditSourcePool, number>;
  selectedByPool: Record<RedditSourcePool, string[]>;
  skippedByPool: Record<RedditSourcePool, string[]>;
} {
  const work: Array<{ pool: RedditSourcePool; subreddit: string }> = [];
  const selectedByPool: Record<RedditSourcePool, string[]> = {
    technology: [],
    economy: [],
    geopolitics: [],
    general: [],
  };
  const skippedByPool: Record<RedditSourcePool, string[]> = {
    technology: [],
    economy: [],
    geopolitics: [],
    general: [],
  };
  const nextCursor: Record<RedditSourcePool, number> = { ...cursor };

  const poolOrder: RedditSourcePool[] = ["technology", "economy", "geopolitics", "general"];

  for (const pool of poolOrder) {
    const all = pools[pool];
    const take = batchSizeByPool[pool];
    if (take === 0 || all.length === 0) {
      skippedByPool[pool] = [...all];
      continue;
    }
    const n = all.length;
    const start = ((cursor[pool] % n) + n) % n;
    const picked: string[] = [];
    for (let i = 0; i < take; i++) {
      const sub = all[(start + i) % n]!;
      picked.push(sub);
      work.push({ pool, subreddit: sub });
    }
    nextCursor[pool] = (start + take) % n;
    selectedByPool[pool] = picked;
    const pickSet = new Set(picked);
    skippedByPool[pool] = all.filter((s) => !pickSet.has(s));
  }

  return { work, nextCursor, selectedByPool, skippedByPool };
}
