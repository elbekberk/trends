/**
 * Interim Reddit listing fetch: lane-major rotation, adaptive listing budget gate.
 * TEMPORARY — see `collectorState.ts`. Replaceable without changing topic extraction.
 */

import {
  LANE_ORDER,
  type RedditCollectorState,
} from "@/src/lib/reddit/collectorState";
import { commentSubBudgetSlots } from "@/src/lib/reddit/adaptiveBudget";
import type { RedditApiClient, RedditClientExtras, RedditHttpStats } from "@/src/lib/reddit/redditClient";
import {
  createRedditApiClient,
  createRedditPublicJsonClient,
  recordRedditHttpAttempt,
} from "@/src/lib/reddit/redditClient";
import { RedditHttpBudgetGate } from "@/src/lib/reddit/redditBudgetGate";
import type { RedditIngestEnv } from "@/src/lib/reddit/redditEnv";
import { getListingsForSubreddit } from "@/src/lib/reddit/redditBatch";
import { getRedditAccessToken, loadRedditIngestEnv } from "@/src/lib/reddit";
import { parseRedditListing, redditThreadUrl } from "@/src/lib/reddit/parseListing";
import type { RedditListing, RedditSourcePool, SourcePost } from "@/src/lib/reddit/types";

type PoolsConfig = {
  pools: Record<RedditSourcePool, readonly string[]>;
  limitsByListing: Record<RedditListing, number>;
};

export type ListingFetchResult = {
  posts: SourcePost[];
  listingCounts: Record<string, number>;
  byPool: Record<
    RedditSourcePool,
    { bySubredditListing: Record<string, number>; uniquePosts: number }
  >;
  dedupedCount: number;
  redditHttp: RedditHttpStats;
  redditEnv: RedditIngestEnv;
  redditClient: RedditApiClient | null;
  clientExtras: RedditClientExtras;
  oauthConfigured: boolean;
  oauthInUse: boolean;
  /** True when using www.reddit.com public JSON (no OAuth token). */
  redditPublicFallback: boolean;
  selectedSubreddits: string[];
  skippedSubreddits: string[];
  fetchAttemptsByPool: Record<RedditSourcePool, number>;
  listingHttpAttempts: number;
  commentBudgetGate: RedditHttpBudgetGate | null;
  collector: RedditCollectorState;
  metrics: {
    lane429: Record<RedditSourcePool, number>;
    abortedEarly: boolean;
    abortReason: "budget" | "429" | null;
    completedLanes: RedditSourcePool[];
    skippedReason: "backoff" | "next_eligible" | null;
  };
  configSummary: {
    listings: string[];
    limitsByListing: Record<RedditListing, number>;
    subredditsByPool: Record<RedditSourcePool, number>;
    fetchAttempts: number;
  };
};

function createRedditHttpStats(): RedditHttpStats {
  return {
    totalRedditRequests: 0,
    successfulRedditRequests: 0,
    failedRedditRequests: 0,
    emptyResponses: 0,
    statusCounts: {},
  };
}

export async function runRedditListingFetchPhase(input: {
  fetchedAt: Date;
  bucketTimeIso: string;
  collector: RedditCollectorState;
  poolsConfig: PoolsConfig;
}): Promise<ListingFetchResult> {
  const { fetchedAt, bucketTimeIso, collector, poolsConfig } = input;
  const pools = poolsConfig.pools;
  const limitsByListing = poolsConfig.limitsByListing;
  const redditEnv = loadRedditIngestEnv();
  const redditHttp = createRedditHttpStats();
  const clientExtras: RedditClientExtras = {
    rateLimitHeadersLast: {},
    backoffTriggered: false,
  };

  const empty = (
    skippedReason: NonNullable<ListingFetchResult["metrics"]["skippedReason"]>,
  ): ListingFetchResult => ({
    posts: [],
    listingCounts: {},
    byPool: {
      technology: { bySubredditListing: {}, uniquePosts: 0 },
      economy: { bySubredditListing: {}, uniquePosts: 0 },
      geopolitics: { bySubredditListing: {}, uniquePosts: 0 },
      general: { bySubredditListing: {}, uniquePosts: 0 },
    },
    dedupedCount: 0,
    redditHttp,
    redditEnv,
    redditClient: null,
    clientExtras,
    oauthConfigured: redditEnv.oauthComplete,
    oauthInUse: false,
    redditPublicFallback: redditEnv.redditPublicFallbackOnly,
    selectedSubreddits: [],
    skippedSubreddits: [],
    fetchAttemptsByPool: { technology: 0, economy: 0, geopolitics: 0, general: 0 },
    listingHttpAttempts: 0,
    commentBudgetGate: null,
    collector,
    metrics: {
      lane429: { technology: 0, economy: 0, geopolitics: 0, general: 0 },
      abortedEarly: false,
      abortReason: null,
      completedLanes: [],
      skippedReason,
    },
    configSummary: {
      listings: [...redditEnv.listingsCore],
      limitsByListing: { ...limitsByListing },
      subredditsByPool: {
        technology: pools.technology.length,
        economy: pools.economy.length,
        geopolitics: pools.geopolitics.length,
        general: pools.general.length,
      },
      fetchAttempts: 0,
    },
  });

  if (collector.nextEligibleCollectAt && new Date(collector.nextEligibleCollectAt) > fetchedAt) {
    return empty("next_eligible");
  }
  if (collector.globalBackoffUntil && new Date(collector.globalBackoffUntil) > fetchedAt) {
    return empty("backoff");
  }

  const listingBudget = Math.max(0, collector.currentRequestBudget);
  const commentSlots = commentSubBudgetSlots(listingBudget);
  const gate = new RedditHttpBudgetGate(listingBudget, commentSlots);

  let client: RedditApiClient;
  let oauthInUse = false;
  let redditPublicFallback = false;

  if (redditEnv.redditPublicFallbackOnly) {
    client = createRedditPublicJsonClient(redditEnv, redditHttp, clientExtras);
    redditPublicFallback = true;
    oauthInUse = false;
  } else if (redditEnv.oauthComplete && redditEnv.oauth) {
    const tokenOk = await getRedditAccessToken(redditEnv.oauth);
    if (tokenOk) {
      client = createRedditApiClient(redditEnv, redditEnv.oauth, redditHttp, clientExtras);
      oauthInUse = true;
    } else {
      client = createRedditPublicJsonClient(redditEnv, redditHttp, clientExtras);
      redditPublicFallback = true;
    }
  } else {
    client = createRedditPublicJsonClient(redditEnv, redditHttp, clientExtras);
    redditPublicFallback = true;
  }

  collector.lastAttemptAt = fetchedAt.toISOString();
  collector.pendingBucketTimeIso = bucketTimeIso;
  collector.currentCycleStatus = "collecting";
  collector.currentLane = null;

  const results: SourcePost[] = [];
  const seen = new Set<string>();
  const listingCounts: Record<string, number> = {};
  const byPool: ListingFetchResult["byPool"] = {
    technology: { bySubredditListing: {}, uniquePosts: 0 },
    economy: { bySubredditListing: {}, uniquePosts: 0 },
    geopolitics: { bySubredditListing: {}, uniquePosts: 0 },
    general: { bySubredditListing: {}, uniquePosts: 0 },
  };
  const fetchAttemptsByPool: Record<RedditSourcePool, number> = {
    technology: 0,
    economy: 0,
    geopolitics: 0,
    general: 0,
  };

  const lane429: Record<RedditSourcePool, number> = {
    technology: 0,
    economy: 0,
    geopolitics: 0,
    general: 0,
  };

  let listingHttpAttempts = 0;
  let abortListings = false;
  let count429 = 0;
  let abortReason: "budget" | "429" | null = null;
  /** Pool where 429 threshold tripped (for lane labeling). */
  let abort429Pool: RedditSourcePool | null = null;
  const completedLanes: RedditSourcePool[] = [];
  const selectedSubs: string[] = [];
  const skippedSubs: string[] = [];

  const metrics = {
    lane429,
    abortedEarly: false,
    abortReason: null as "budget" | "429" | null,
    completedLanes,
    skippedReason: null as ListingFetchResult["metrics"]["skippedReason"],
  };

  for (const pool of LANE_ORDER) {
    if (abortListings) break;
    collector.currentLane = pool;
    const penalty = Math.min(0.5, collector.lanePenalty[pool] ?? 0);
    const batchBase = redditEnv.batchSizeByPool[pool];
    const take = Math.max(0, Math.floor(batchBase * (1 - penalty)));
    const all = pools[pool];
    if (take === 0 || all.length === 0) {
      completedLanes.push(pool);
      continue;
    }
    const start = ((collector.cursors[pool] % all.length) + all.length) % all.length;
    const picked: string[] = [];
    for (let i = 0; i < take; i++) {
      picked.push(all[(start + i) % all.length]!);
    }
    const nextCursor = (start + take) % all.length;
    const pickSet = new Set(picked);
    skippedSubs.push(...all.filter((s) => !pickSet.has(s)));

    let laneOk = true;
    for (const subreddit of picked) {
      if (abortListings) {
        laneOk = false;
        break;
      }
      selectedSubs.push(subreddit);
      const poolSubs = pools[pool];
      const listings = getListingsForSubreddit(pool, subreddit, poolSubs, redditEnv);

      for (const listing of listings) {
        if (abortListings) {
          laneOk = false;
          break;
        }
        if (!gate.tryConsumeListing()) {
          abortListings = true;
          abortReason = "budget";
          metrics.abortedEarly = true;
          laneOk = false;
          break;
        }

        const flatKey = `${pool}.${subreddit}.${listing}`;
        const subListingKey = `${subreddit}.${listing}`;
        listingCounts[flatKey] = 0;

        const limit = limitsByListing[listing];
        const path = `/r/${subreddit}/${listing}.json?limit=${limit}`;
        listingHttpAttempts += 1;
        fetchAttemptsByPool[pool] += 1;

        const res = await client.fetchJson(path);
        if (res.ok && !redditPublicFallback) oauthInUse = true;

        let posts: unknown[] = [];
        if (res.ok) {
          try {
            const data = (await res.json()) as { data?: { children?: unknown[] } };
            posts = Array.isArray(data?.data?.children) ? data.data!.children! : [];
          } catch {
            posts = [];
          }
        }
        recordRedditHttpAttempt(redditHttp, res, res.ok && posts.length === 0);

        if (res.status === 429) {
          lane429[pool] += 1;
          count429 += 1;
          if (count429 >= 4) {
            abortListings = true;
            abortReason = "429";
            metrics.abortedEarly = true;
            laneOk = false;
            abort429Pool = pool;
            break;
          }
        }

        if (!res.ok) continue;

        for (const item of posts) {
          const p = (item as { data?: Record<string, unknown> } | null)?.data;
          if (!p?.id || !p?.title) continue;
          const permalink = p.permalink != null ? String(p.permalink) : "";
          if (!permalink) continue;

          const dedupeKey = `reddit:${p.id}`;
          if (seen.has(dedupeKey)) continue;
          seen.add(dedupeKey);

          const threadUrl = redditThreadUrl(permalink);
          const discussion = parseRedditListing(
            p as Record<string, unknown>,
            pool,
            subreddit,
            listing,
          );

          results.push({
            source: "reddit",
            externalId: String(p.id),
            title: String(p.title),
            url: threadUrl,
            createdAt:
              typeof p.created_utc === "number"
                ? new Date(p.created_utc * 1000)
                : null,
            reddit: discussion,
          });
          listingCounts[flatKey] += 1;
          byPool[pool].bySubredditListing[subListingKey] =
            (byPool[pool].bySubredditListing[subListingKey] ?? 0) + 1;
          byPool[pool].uniquePosts += 1;
        }
      }
    }

    collector.cursors[pool] = nextCursor;
    collector.laneLastCollectedAt[pool] = fetchedAt.toISOString();
    if (laneOk && !abortListings) {
      completedLanes.push(pool);
    }
  }

  metrics.abortedEarly = metrics.abortedEarly || abortListings;
  metrics.abortReason = abortReason;
  if (abortListings && !metrics.abortReason) metrics.abortReason = "budget";

  if (metrics.abortedEarly && metrics.abortReason === "429") {
    collector.currentCycleStatus = "aborted_429";
  } else if (metrics.abortedEarly) {
    collector.currentCycleStatus = "aborted_budget";
  } else if (completedLanes.length >= 4) {
    collector.currentCycleStatus = "complete";
  } else {
    collector.currentCycleStatus = "partial";
  }

  collector.completedLanes = [...completedLanes];
  const incomplete = LANE_ORDER.filter((p) => !completedLanes.includes(p));
  if (metrics.abortReason === "429" && abort429Pool) {
    collector.failedLanes = [abort429Pool];
    collector.deferredLanes = incomplete.filter((p) => p !== abort429Pool);
  } else {
    collector.failedLanes = [];
    collector.deferredLanes = incomplete;
  }

  const subredditsByPool = {
    technology: pools.technology.length,
    economy: pools.economy.length,
    geopolitics: pools.geopolitics.length,
    general: pools.general.length,
  };

  return {
    posts: results,
    listingCounts,
    byPool,
    dedupedCount: results.length,
    redditHttp,
    redditEnv,
    redditClient: client,
    clientExtras,
    oauthConfigured: redditEnv.oauthComplete,
    oauthInUse,
    redditPublicFallback,
    selectedSubreddits: selectedSubs,
    skippedSubreddits: skippedSubs,
    fetchAttemptsByPool,
    listingHttpAttempts,
    commentBudgetGate: gate,
    collector,
    metrics: {
      ...metrics,
      completedLanes,
    },
    configSummary: {
      listings: [
        ...new Set([
          ...redditEnv.listingsCore,
          ...redditEnv.listingsStandard,
          ...redditEnv.listingsLight,
        ]),
      ],
      limitsByListing: { ...limitsByListing },
      subredditsByPool,
      fetchAttempts: listingHttpAttempts,
    },
  };
}
