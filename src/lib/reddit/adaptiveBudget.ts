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
  /** Why listing stopped early — budget exhaustion vs rate limit (affects penalty strength). */
  listingAbortReason: "budget" | "429" | null;
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
    listingAbortReason: "budget" | "429" | null;
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
    listingAbortReason: extras.listingAbortReason,
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

  const abortKind =
    sig.listingAbortReason ?? (sig.abortedEarly ? ("budget" as const) : null);

  // Listing stopped because slots ran out — expected under load; do not treat like a 429 storm.
  if (sig.abortedEarly && abortKind === "budget") {
    cur = Math.max(minB, Math.floor(cur * 0.88));
    reason = "listing_budget_exhausted_partial";
    if (sig.worstLane) {
      const k = sig.worstLane as import("@/src/lib/reddit/types").RedditSourcePool;
      laneDelta[k] = 0.06;
    }
    return { next: clamp(cur, minB, maxB), reason, globalBackoffUntil: null, lanePenaltyDelta: laneDelta };
  }

  // True rate-limit abort or many 429s without finishing listing.
  if (sig.abortedEarly && abortKind === "429") {
    cur = Math.max(minB, Math.floor(cur * 0.62));
    reason = "severe_rate_limit_abort";
    backoff = new Date(Date.now() + 3 * 60_000).toISOString();
    if (sig.worstLane) {
      const k = sig.worstLane as import("@/src/lib/reddit/types").RedditSourcePool;
      laneDelta[k] = 0.14;
    }
    return { next: clamp(cur, minB, maxB), reason, globalBackoffUntil: backoff, lanePenaltyDelta: laneDelta };
  }

  if (!sig.abortedEarly && sig.count429 >= 5) {
    cur = Math.max(minB, Math.floor(cur * 0.62));
    reason = "elevated_429_many";
    backoff = new Date(Date.now() + 2 * 60_000).toISOString();
    if (sig.worstLane) {
      const k = sig.worstLane as import("@/src/lib/reddit/types").RedditSourcePool;
      laneDelta[k] = 0.12;
    }
    return { next: clamp(cur, minB, maxB), reason, globalBackoffUntil: backoff, lanePenaltyDelta: laneDelta };
  }

  if (sig.count429 >= 2 || failRate >= BAD_FAILURE || sig.count401 + sig.count403 >= 3) {
    cur = Math.max(minB, Math.floor(cur * 0.82));
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
    cur = Math.min(maxB, cur + 2);
    reason = "healthy_increase_small";
    return { next: clamp(cur, minB, maxB), reason, globalBackoffUntil: null, lanePenaltyDelta: {} };
  }

  if (successRate >= MID_SUCCESS && sig.count429 <= 1) {
    cur = Math.min(maxB, cur + 2);
    reason = "mixed_slight_increase";
    return { next: clamp(cur, minB, maxB), reason, globalBackoffUntil: null, lanePenaltyDelta: {} };
  }

  reason = "stable_mixed";
  return { next: clamp(cur, minB, maxB), reason, globalBackoffUntil: null, lanePenaltyDelta: {} };
}

function clamp(n: number, minB: number, maxB: number): number {
  return Math.min(maxB, Math.max(minB, Math.floor(n)));
}

/** Comment sub-budget: fraction of listing budget, capped (listing fairness > comment enrichment). */
export function commentSubBudgetSlots(listingBudgetRemaining: number): number {
  const frac = Math.min(0.22, Math.max(0.06, parseFloat(process.env.REDDIT_COMMENT_BUDGET_FRACTION ?? "0.14") || 0.14));
  return Math.max(0, Math.floor(listingBudgetRemaining * frac));
}
