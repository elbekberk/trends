import type { RedditListing, RedditSourcePool } from "@/src/lib/reddit/types";

function parseBool(v: string | undefined, fallback: boolean): boolean {
  if (v == null || v === "") return fallback;
  return /^(1|true|yes|on)$/i.test(v.trim());
}

function parseIntEnv(v: string | undefined, fallback: number): number {
  if (v == null || v === "") return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function parseListings(s: string | undefined, fallback: RedditListing[]): RedditListing[] {
  if (s == null || s.trim() === "") return [...fallback];
  const allowed = new Set<RedditListing>(["hot", "new", "rising"]);
  const out: RedditListing[] = [];
  for (const part of s.split(",")) {
    const t = part.trim().toLowerCase() as RedditListing;
    if (allowed.has(t) && !out.includes(t)) out.push(t);
  }
  return out.length > 0 ? out : [...fallback];
}

function parsePoolList(s: string | undefined, fallback: RedditSourcePool[]): RedditSourcePool[] {
  const all: RedditSourcePool[] = ["technology", "economy", "geopolitics", "general"];
  const set = new Set<RedditSourcePool>();
  if (s == null || s.trim() === "") return [...fallback];
  for (const part of s.split(",")) {
    const t = part.trim().toLowerCase();
    if (t === "technology") set.add("technology");
    if (t === "economy") set.add("economy");
    if (t === "geopolitics") set.add("geopolitics");
    if (t === "general") set.add("general");
  }
  return set.size > 0 ? all.filter((p) => set.has(p)) : [...fallback];
}

export type RedditOAuthEnv = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  userAgent: string;
};

export type RedditIngestEnv = {
  oauth: RedditOAuthEnv | null;
  oauthComplete: boolean;
  targetQpm: number;
  windowMinutes: number;
  maxConcurrency: number;
  minDelayMs: number;
  jitterMs: number;
  enableJitter: boolean;
  /** Subreddits to fetch per pool this ingest (round-robin). */
  batchSizeByPool: Record<RedditSourcePool, number>;
  /** First N names in each non-general pool use `listingsCore`; rest use `listingsStandard`. */
  coreSubredditsPerPool: number;
  listingsCore: RedditListing[];
  listingsStandard: RedditListing[];
  /** Used for `general` pool entirely. */
  listingsLight: RedditListing[];
  commentMinScore: number;
  commentMinComments: number;
  commentRelaxPools: RedditSourcePool[];
  commentRelaxedMinScore: number;
  commentRelaxedMinComments: number;
  /** When true, never attempt OAuth — public JSON only (interim deterministic mode). */
  redditPublicFallbackOnly: boolean;
};

const DEFAULT_BATCH: Record<RedditSourcePool, number> = {
  technology: 5,
  economy: 5,
  geopolitics: 4,
  general: 2,
};

export function loadRedditIngestEnv(): RedditIngestEnv {
  const clientId = process.env.REDDIT_CLIENT_ID?.trim() ?? "";
  const clientSecret = process.env.REDDIT_CLIENT_SECRET?.trim() ?? "";
  const refreshToken = process.env.REDDIT_REFRESH_TOKEN?.trim() ?? "";
  const userAgent = process.env.REDDIT_USER_AGENT?.trim() ?? "";

  const oauthComplete =
    clientId.length > 0 &&
    clientSecret.length > 0 &&
    refreshToken.length > 0 &&
    userAgent.length > 0;

  const oauth: RedditOAuthEnv | null = oauthComplete
    ? { clientId, clientSecret, refreshToken, userAgent }
    : null;

  /** Legacy display only — adaptive collector does not use a fixed QPM window. */
  const targetQpm = Math.max(1, parseIntEnv(process.env.REDDIT_TARGET_QPM, 70));
  const windowMinutes = Math.max(1, parseIntEnv(process.env.REDDIT_WINDOW_MINUTES, 10));
  const maxConcurrency = Math.max(1, Math.min(8, parseIntEnv(process.env.REDDIT_MAX_CONCURRENCY, 2)));
  const autoDelayLegacy = Math.ceil(60_000 / targetQpm);
  const minDelayMs = Math.max(
    0,
    process.env.REDDIT_MIN_DELAY_MS != null && process.env.REDDIT_MIN_DELAY_MS !== ""
      ? parseIntEnv(process.env.REDDIT_MIN_DELAY_MS, autoDelayLegacy)
      : parseIntEnv(process.env.REDDIT_ADAPTIVE_MIN_DELAY_MS, 280),
  );
  const jitterMs = Math.max(0, parseIntEnv(process.env.REDDIT_JITTER_MS, 50));
  const enableJitter = parseBool(process.env.REDDIT_ENABLE_JITTER, true);

  const batchSizeByPool: Record<RedditSourcePool, number> = {
    technology: Math.max(0, parseIntEnv(process.env.REDDIT_BATCH_TECHNOLOGY, DEFAULT_BATCH.technology)),
    economy: Math.max(0, parseIntEnv(process.env.REDDIT_BATCH_ECONOMY, DEFAULT_BATCH.economy)),
    geopolitics: Math.max(0, parseIntEnv(process.env.REDDIT_BATCH_GEOPOLITICS, DEFAULT_BATCH.geopolitics)),
    general: Math.max(0, parseIntEnv(process.env.REDDIT_BATCH_GENERAL, DEFAULT_BATCH.general)),
  };

  const coreSubredditsPerPool = Math.max(0, parseIntEnv(process.env.REDDIT_CORE_SUBS_PER_POOL, 10));

  const listingsCore = parseListings(process.env.REDDIT_LISTINGS_CORE, ["hot", "new", "rising"]);
  const listingsStandard = parseListings(process.env.REDDIT_LISTINGS_STANDARD, ["hot", "rising"]);
  const listingsLight = parseListings(process.env.REDDIT_LISTINGS_LIGHT, ["hot", "rising"]);

  const commentMinScore = parseIntEnv(process.env.REDDIT_COMMENT_MIN_SCORE, 5);
  const commentMinComments = parseIntEnv(process.env.REDDIT_COMMENT_MIN_COMMENTS, 8);
  const commentRelaxPools = parsePoolList(process.env.REDDIT_COMMENT_RELAX_POOLS, [
    "technology",
    "economy",
  ]);
  const commentRelaxedMinScore = parseIntEnv(process.env.REDDIT_COMMENT_RELAXED_MIN_SCORE, 2);
  const commentRelaxedMinComments = parseIntEnv(process.env.REDDIT_COMMENT_RELAXED_MIN_COMMENTS, 4);

  const redditPublicFallbackOnly = parseBool(process.env.REDDIT_PUBLIC_FALLBACK_ONLY, true);

  return {
    oauth,
    oauthComplete,
    redditPublicFallbackOnly,
    targetQpm,
    windowMinutes,
    maxConcurrency,
    minDelayMs,
    jitterMs,
    enableJitter,
    batchSizeByPool,
    coreSubredditsPerPool,
    listingsCore,
    listingsStandard,
    listingsLight,
    commentMinScore,
    commentMinComments,
    commentRelaxPools,
    commentRelaxedMinScore,
    commentRelaxedMinComments,
  };
}
