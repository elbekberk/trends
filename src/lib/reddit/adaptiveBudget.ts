/**
 * Bounded adaptive request budget — adjusts from observed HTTP outcomes.
 * TEMPORARY heuristics; retune or replace with a future collector.
 */

import type { RedditHttpStats } from "@/src/lib/reddit/redditClient";
import type { RedditCollectorState } from "@/src/lib/reddit/collectorState";

export type AdaptiveSignals = {
  totalRequests: number;
  successCount: number;
  failedCount: number;
  count429: number;
  count401: number;
  count403: number;
  emptyResponses: number;
  /** Listing HTTP calls this run. */
  listingHttp: number;
  /** Comment HTTP calls this run. */
  commentHttp: number;
  /** Collection aborted early (e.g. too many 429). */
  abortedEarly: boolean;
  /** Lane that triggered last failure spike (optional). */
  worstLane: string | null;
};

const HIGH_SUCCESS = 0.92;
const MID_SUCCESS = 0.75;
const BAD_FAILURE = 0.2;

export function buildSignalsFromStats(
  stats: RedditHttpStats,
  extras: {
    listingHttp: number;
    commentHttp: number;
    abortedEarly: boolean;
    worstLane: string | null;
  },
): AdaptiveSignals {
  const total = stats.totalRedditRequests;
  const ok = stats.successfulRedditRequests;
  const failed = stats.failedRedditRequests;
  return {
    totalRequests: total,
    successCount: ok,
    failedCount: failed,
    count429: stats.statusCounts["429"] ?? 0,
    count401: stats.statusCounts["401"] ?? 0,
    count403: stats.statusCounts["403"] ?? 0,
    emptyResponses: stats.emptyResponses,
    listingHttp: extras.listingHttp,
    commentHttp: extras.commentHttp,
    abortedEarly: extras.abortedEarly,
    worstLane: extras.worstLane,
  };
}

export function computeNextAdaptiveBudget(
  state: RedditCollectorState,
  sig: AdaptiveSignals,
): { next: number; reason: string; globalBackoffUntil: string | null; lanePenaltyDelta: Partial<
  Record<import("@/src/lib/reddit/types").RedditSourcePool, number>
> } {
  const { minRequestBudget: minB, maxRequestBudget: maxB } = state;
  let cur = state.currentRequestBudget;
  let reason = "no_change";
  let backoff: string | null = null;
  const laneDelta: Partial<Record<import("@/src/lib/reddit/types").RedditSourcePool, number>> = {};

  const total = Math.max(1, sig.totalRequests);
  const successRate = sig.successCount / total;
  const failRate = sig.failedCount / total;

  if (sig.totalRequests === 0) {
    return { next: clamp(cur, minB, maxB), reason: "no_requests_observed", globalBackoffUntil: null, lanePenaltyDelta: {} };
  }

  // Very bad: many 429 or forced abort
  if (sig.abortedEarly || sig.count429 >= 5) {
    cur = Math.max(minB, Math.floor(cur * 0.55));
    reason = "severe_rate_limit_or_abort";
    backoff = new Date(Date.now() + 3 * 60_000).toISOString();
    if (sig.worstLane) {
      const k = sig.worstLane as import("@/src/lib/reddit/types").RedditSourcePool;
      laneDelta[k] = 0.15;
    }
    return { next: clamp(cur, minB, maxB), reason, globalBackoffUntil: backoff, lanePenaltyDelta: laneDelta };
  }

  if (sig.count429 >= 2 || failRate >= BAD_FAILURE || sig.count401 + sig.count403 >= 3) {
    cur = Math.max(minB, Math.floor(cur * 0.7));
    reason = "elevated_429_or_failures";
    if (sig.count429 >= 2) {
      backoff = new Date(Date.now() + 90_000).toISOString();
    }
    if (sig.worstLane) {
      const k = sig.worstLane as import("@/src/lib/reddit/types").RedditSourcePool;
      laneDelta[k] = 0.08;
    }
    return { next: clamp(cur, minB, maxB), reason, globalBackoffUntil: backoff, lanePenaltyDelta: laneDelta };
  }

  if (successRate >= HIGH_SUCCESS && sig.count429 === 0 && failRate < 0.08) {
    cur = Math.min(maxB, cur + 3);
    reason = "healthy_increase_small";
    return { next: clamp(cur, minB, maxB), reason, globalBackoffUntil: null, lanePenaltyDelta: {} };
  }

  if (successRate >= MID_SUCCESS && sig.count429 <= 1) {
    cur = Math.min(maxB, cur + 1);
    reason = "mixed_slight_increase";
    return { next: clamp(cur, minB, maxB), reason, globalBackoffUntil: null, lanePenaltyDelta: {} };
  }

  reason = "stable_mixed";
  return { next: clamp(cur, minB, maxB), reason, globalBackoffUntil: null, lanePenaltyDelta: {} };
}

function clamp(n: number, minB: number, maxB: number): number {
  return Math.min(maxB, Math.max(minB, Math.floor(n)));
}

/** Comment sub-budget: fraction of listing budget, capped. */
export function commentSubBudgetSlots(listingBudgetRemaining: number): number {
  const frac = Math.min(0.35, Math.max(0.1, parseFloat(process.env.REDDIT_COMMENT_BUDGET_FRACTION ?? "0.28") || 0.28));
  return Math.max(0, Math.floor(listingBudgetRemaining * frac));
}
