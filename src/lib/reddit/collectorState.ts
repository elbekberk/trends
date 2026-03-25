/**
 * Interim durable state for the adaptive Reddit collector.
 *
 * TEMPORARY: Tuned for limited OAuth/API access until a fuller integration replaces this module.
 * Persisted in `RedditIngestState.collectorJson` — safe to swap for a future collector if JSON
 * shape is migrated or ignored.
 *
 * Timestamps in JSON are ISO-8601 UTC strings.
 */

import { db } from "@/src/lib/db";
import type { RedditSourcePool } from "@/src/lib/reddit/types";

export const COLLECTOR_SCHEMA_VERSION = 1 as const;

export const LANE_ORDER: readonly RedditSourcePool[] = [
  "technology",
  "economy",
  "geopolitics",
  "general",
] as const;

/** Next run visits deferred/unfinished lanes first (stable lane order), then the rest — avoids starving tail pools. */
export function laneVisitOrderForRun(collector: RedditCollectorState): RedditSourcePool[] {
  const raw = collector.deferredLanes ?? [];
  if (raw.length === 0) return [...LANE_ORDER];
  const deferredOrdered = LANE_ORDER.filter((p) => raw.includes(p));
  const rest = LANE_ORDER.filter((p) => !raw.includes(p));
  return [...deferredOrdered, ...rest];
}

export type CollectorCycleStatus =
  | "idle"
  | "collecting"
  | "complete"
  | "aborted_budget"
  | "aborted_429"
  | "partial";

export type RedditCollectorState = {
  schemaVersion: typeof COLLECTOR_SCHEMA_VERSION;
  /** Human note for health / debugging. */
  budgetMode: "adaptive";

  currentRequestBudget: number;
  previousRequestBudget: number;
  minRequestBudget: number;
  maxRequestBudget: number;
  budgetChangeReason: string;

  globalBackoffUntil: string | null;
  /** Optional pause: skip Reddit fetch until this instant (UTC ISO). */
  nextEligibleCollectAt: string | null;

  lastAttemptAt: string | null;
  lastSuccessfulCollectAt: string | null;
  /** When ingest snapshot was last written after a full run. */
  lastPublishAt: string | null;
  /** Last run that did not qualify to publish a new snapshot (empty / no-op ingest). */
  lastSkippedPublishAt: string | null;
  lastSkippedPublishReason: string | null;

  laneLastCollectedAt: Record<RedditSourcePool, string | null>;
  laneNextEligibleAt: Record<RedditSourcePool, string | null>;
  /** 0–1 penalty per lane (reduces effective batch size). */
  lanePenalty: Record<RedditSourcePool, number>;

  currentCycleId: string;
  currentCycleStartedAt: string;
  /** Bucket time (UTC ISO) for the in-progress cycle — aligns with `getIngestBucketTime` in ingest. */
  pendingBucketTimeIso: string | null;

  completedLanes: RedditSourcePool[];
  /** Lanes that hit HTTP/429-style failure (not budget exhaustion). */
  failedLanes: RedditSourcePool[];
  /** Lanes not finished this run because budget ran out or we have not reached them yet — not "failed". */
  deferredLanes: RedditSourcePool[];
  /** Lane we were working when collection stopped (if partial). */
  currentLane: RedditSourcePool | null;

  cursors: Record<RedditSourcePool, number>;

  currentCycleStatus: CollectorCycleStatus;
  /** Wall-clock when state was last merged (UTC ISO). */
  refreshedAt: string | null;

  /** Monotonic-ish id for correlating health. */
  lastCycleSequence: number;
};

const EMPTY_LANE_TIME: Record<RedditSourcePool, string | null> = {
  technology: null,
  economy: null,
  geopolitics: null,
  general: null,
};

const EMPTY_PENALTY: Record<RedditSourcePool, number> = {
  technology: 0,
  economy: 0,
  geopolitics: 0,
  general: 0,
};

/**
 * Explicit adaptive bounds + starting budget (env-tunable). Used for new state and budget-only resets.
 * `REDDIT_ADAPTIVE_INITIAL_BUDGET` default 40 — testing-friendly; clamped to [min, max].
 */
export function getAdaptiveBudgetDefaults(): { min: number; max: number; initial: number } {
  const minB = Math.max(5, parseInt(process.env.REDDIT_ADAPTIVE_MIN_BUDGET ?? "15", 10) || 15);
  const maxB = Math.max(minB, parseInt(process.env.REDDIT_ADAPTIVE_MAX_BUDGET ?? "120", 10) || 120);
  const initB = Math.min(maxB, Math.max(minB, parseInt(process.env.REDDIT_ADAPTIVE_INITIAL_BUDGET ?? "40", 10) || 40));
  return { min: minB, max: maxB, initial: initB };
}

function defaultState(now: Date): RedditCollectorState {
  const iso = now.toISOString();
  const { min: minB, max: maxB, initial: initB } = getAdaptiveBudgetDefaults();

  return {
    schemaVersion: COLLECTOR_SCHEMA_VERSION,
    budgetMode: "adaptive",
    currentRequestBudget: initB,
    previousRequestBudget: initB,
    minRequestBudget: minB,
    maxRequestBudget: maxB,
    budgetChangeReason: "initial_defaults",
    globalBackoffUntil: null,
    nextEligibleCollectAt: null,
    lastAttemptAt: null,
    lastSuccessfulCollectAt: null,
    lastPublishAt: null,
    lastSkippedPublishAt: null,
    lastSkippedPublishReason: null,
    laneLastCollectedAt: { ...EMPTY_LANE_TIME },
    laneNextEligibleAt: { ...EMPTY_LANE_TIME },
    lanePenalty: { ...EMPTY_PENALTY },
    currentCycleId: `cycle-${Date.now()}`,
    currentCycleStartedAt: iso,
    pendingBucketTimeIso: null,
    completedLanes: [],
    failedLanes: [],
    deferredLanes: [],
    currentLane: null,
    cursors: { technology: 0, economy: 0, geopolitics: 0, general: 0 },
    currentCycleStatus: "idle",
    refreshedAt: iso,
    lastCycleSequence: 0,
  };
}

function mergeLegacyCursors(
  state: RedditCollectorState,
  legacyCursorJson: string | null | undefined,
): RedditCollectorState {
  if (!legacyCursorJson) return state;
  try {
    const v = JSON.parse(legacyCursorJson) as Partial<Record<RedditSourcePool, number>>;
    for (const p of LANE_ORDER) {
      if (typeof v[p] === "number" && Number.isFinite(v[p]!)) {
        state.cursors[p] = v[p]!;
      }
    }
  } catch {
    /* ignore */
  }
  return state;
}

export function parseCollectorState(raw: string | null | undefined, now: Date): RedditCollectorState {
  if (!raw) return defaultState(now);
  try {
    const v = JSON.parse(raw) as Partial<RedditCollectorState>;
    const base = defaultState(now);
    if (v.schemaVersion !== COLLECTOR_SCHEMA_VERSION) return base;
    const legacyFailed = Array.isArray(v.failedLanes) ? (v.failedLanes as RedditSourcePool[]) : [];
    const hasDeferredField = Array.isArray(v.deferredLanes);
    let migratedDeferred: RedditSourcePool[];
    let migratedFailed: RedditSourcePool[];
    if (hasDeferredField) {
      migratedDeferred = (v.deferredLanes ?? []) as RedditSourcePool[];
      migratedFailed = Array.isArray(v.failedLanes) ? (v.failedLanes as RedditSourcePool[]) : [];
    } else if (v.currentCycleStatus === "aborted_budget" || v.currentCycleStatus === "partial") {
      migratedDeferred = [...legacyFailed];
      migratedFailed = [];
    } else if (v.currentCycleStatus === "aborted_429") {
      migratedDeferred = [];
      migratedFailed = [...legacyFailed];
    } else {
      migratedDeferred = [];
      migratedFailed = [];
    }

    return {
      ...base,
      ...v,
      lastSkippedPublishAt:
        typeof v.lastSkippedPublishAt === "string" || v.lastSkippedPublishAt === null
          ? v.lastSkippedPublishAt
          : null,
      lastSkippedPublishReason:
        typeof v.lastSkippedPublishReason === "string" || v.lastSkippedPublishReason === null
          ? v.lastSkippedPublishReason
          : null,
      laneLastCollectedAt: { ...EMPTY_LANE_TIME, ...v.laneLastCollectedAt },
      laneNextEligibleAt: { ...EMPTY_LANE_TIME, ...v.laneNextEligibleAt },
      lanePenalty: { ...EMPTY_PENALTY, ...v.lanePenalty },
      cursors: { ...base.cursors, ...v.cursors },
      completedLanes: Array.isArray(v.completedLanes) ? (v.completedLanes as RedditSourcePool[]) : [],
      deferredLanes: migratedDeferred,
      failedLanes: migratedFailed,
    };
  } catch {
    return defaultState(now);
  }
}

export async function loadRedditCollectorState(now: Date): Promise<{
  state: RedditCollectorState;
  legacyCursorJson: string | null;
}> {
  try {
    const row = await db.redditIngestState.findUnique({ where: { id: 1 } });
    const legacy = row?.cursorJson ?? null;
    if (row?.collectorJson) {
      const state = parseCollectorState(row.collectorJson, now);
      mergeLegacyCursors(state, legacy);
      return { state, legacyCursorJson: legacy };
    }
    const state = defaultState(now);
    mergeLegacyCursors(state, legacy);
    return { state, legacyCursorJson: legacy };
  } catch {
    const state = defaultState(now);
    return { state, legacyCursorJson: null };
  }
}

/** When this run issued no Reddit HTTP calls, drop stale lane/abort labels from prior runs. */
export function neutralizeStaleLaneStateIfNoHttp(collector: RedditCollectorState): void {
  collector.currentCycleStatus = "idle";
  collector.completedLanes = [];
  collector.failedLanes = [];
  collector.deferredLanes = [];
  collector.currentLane = null;
}

export async function saveRedditCollectorState(
  state: RedditCollectorState,
  cursorJson: string,
): Promise<void> {
  state.refreshedAt = new Date().toISOString();
  try {
    await db.redditIngestState.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        cursorJson,
        collectorJson: JSON.stringify(state),
      },
      update: {
        cursorJson,
        collectorJson: JSON.stringify(state),
      },
    });
  } catch {
    /* migrations */
  }
}

/**
 * New cycle from `now`: clears lane cursors, scheduling gates, backoff, and in-progress cycle fields.
 * Preserves adaptive min/max/current budget (learned pacing) so a reset does not throw away HTTP tuning.
 * Does not touch `Post`, `TopicHit` history, or `IngestSnapshot` rows — only `RedditIngestState`.
 */
export function freshCycleCollectorState(now: Date, previous: RedditCollectorState | null): RedditCollectorState {
  const fresh = defaultState(now);
  if (!previous) return fresh;
  return {
    ...fresh,
    currentRequestBudget: previous.currentRequestBudget,
    previousRequestBudget: previous.previousRequestBudget,
    minRequestBudget: previous.minRequestBudget,
    maxRequestBudget: previous.maxRequestBudget,
    budgetChangeReason: "fresh_cycle_reset",
    lastCycleSequence: (previous.lastCycleSequence ?? 0) + 1,
  };
}

/** Persist a fresh cycle (see `freshCycleCollectorState`). Safe to call before `POST /api/ingest`. */
export async function resetRedditCollectorForFreshCycle(now = new Date()): Promise<RedditCollectorState> {
  const { state: previous } = await loadRedditCollectorState(now);
  const next = freshCycleCollectorState(now, previous);
  await saveRedditCollectorState(next, JSON.stringify(next.cursors));
  return next;
}

/**
 * Testing/debug: restores current/previous budget to `REDDIT_ADAPTIVE_INITIAL_BUDGET` (clamped),
 * re-reads min/max from env, clears global backoff, next-eligible gate, and lane penalties.
 * Does not reset lane cursors or cycle id — use `resetRedditCollectorForFreshCycle` for that.
 */
export async function resetRedditCollectorBudgetToInitial(now = new Date()): Promise<RedditCollectorState> {
  const { state } = await loadRedditCollectorState(now);
  const { min, max, initial } = getAdaptiveBudgetDefaults();
  state.minRequestBudget = min;
  state.maxRequestBudget = max;
  state.currentRequestBudget = initial;
  state.previousRequestBudget = initial;
  state.budgetChangeReason = "budget_reset_to_initial";
  state.globalBackoffUntil = null;
  state.nextEligibleCollectAt = null;
  state.lanePenalty = { ...EMPTY_PENALTY };
  await saveRedditCollectorState(state, JSON.stringify(state.cursors));
  return state;
}
