"use client";

/**
 * Data sources (collection vs read-only polling):
 * - `GET /api/ingest/latest` — UI polls this; returns last published snapshot + live SQLite collector row only.
 * - `POST /api/ingest` — runs `runIngest()` (Reddit fetch, topics, snapshot write). Manual "Collect now" or dev auto-collect.
 * - Server cron (`src/lib/scheduler.ts`) may also call `runIngest` on a schedule — not tied to this page.
 */

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { IngestHealthSnapshot, LiveCollectorApiPayload } from "@/src/lib/ingest";
import { isDevAutoCollectEnabled } from "@/src/lib/devClientFlags";
import {
  formatIstanbulDateTime,
  formatRefreshedAtLabel,
  formatIstanbulDate,
} from "@/src/lib/formatIstanbul";
import styles from "./page.module.css";

type LatestPayload = {
  ok: true;
  serverTime: string;
  liveCollector: LiveCollectorApiPayload;
  snapshot: {
    id: number;
    createdAt: string;
    bucketTime: string;
    health: IngestHealthSnapshot;
  } | null;
};

type PollMetrics = {
  snapshotId: number | null;
  totalRequests: number;
  postsFetched: number;
  commentsFetched: number;
  snippetsStored: number;
  subCount: number;
  snapshotBudget: number | null;
  liveBudget: number;
  livePrevBudget: number;
  liveRefreshed: string | null;
  liveCycleId: string;
  currentLane: string | null;
  completedLanes: string;
  failedLanes: string;
  deferredLanes: string;
  missingLanes: string;
  lastCycleSequence: number;
  budgetReason: string;
};

function extractPollMetrics(p: LatestPayload): PollMetrics {
  const h = p.snapshot?.health;
  const l = p.liveCollector;
  const snippets =
    typeof h?.snippetsStored === "number"
      ? h.snippetsStored
      : typeof h?.commentsUsed === "number"
        ? h.commentsUsed
        : 0;
  return {
    snapshotId: p.snapshot?.id ?? null,
    totalRequests: h?.totalRedditRequests ?? 0,
    postsFetched: h?.redditPostsFetched ?? 0,
    commentsFetched: h?.commentsFetched ?? 0,
    snippetsStored: snippets,
    subCount: h?.redditSelectedSubreddits?.length ?? 0,
    snapshotBudget: h?.currentAdaptiveBudget ?? null,
    liveBudget: l.currentRequestBudget,
    livePrevBudget: l.previousRequestBudget,
    liveRefreshed: l.refreshedAt,
    liveCycleId: l.currentCycleId,
    currentLane: l.currentLane,
    completedLanes: l.completedLanes.join(","),
    failedLanes: l.failedLanes.join(","),
    deferredLanes: l.deferredLanes.join(","),
    missingLanes: l.missingLanes.join(","),
    lastCycleSequence: l.lastCycleSequence,
    budgetReason: l.budgetChangeReason,
  };
}

function formatDeltaLine(prev: PollMetrics | null, cur: PollMetrics): string {
  if (!prev) return "First successful poll — no prior comparison.";
  const parts: string[] = [];
  if (cur.snapshotId !== prev.snapshotId) {
    parts.push(`published snapshot #${prev.snapshotId ?? "—"} → #${cur.snapshotId ?? "—"}`);
  } else {
    parts.push(`published snapshot #${cur.snapshotId ?? "—"} unchanged (until next publish)`);
  }
  const dr = cur.totalRequests - prev.totalRequests;
  parts.push(dr === 0 ? "snapshot HTTP totals: no change" : `snapshot HTTP totals: ${dr >= 0 ? "+" : ""}${dr} requests`);
  const dp = cur.postsFetched - prev.postsFetched;
  parts.push(dp === 0 ? "posts fetched: no change" : `posts fetched: ${dp >= 0 ? "+" : ""}${dp}`);
  const dc = cur.commentsFetched - prev.commentsFetched;
  const dsn = cur.snippetsStored - prev.snippetsStored;
  parts.push(
    dc === 0 && dsn === 0
      ? "comments attempts / stored: no change"
      : `comments attempts ${dc >= 0 ? "+" : ""}${dc} · stored ${dsn >= 0 ? "+" : ""}${dsn}`,
  );
  const ds = cur.subCount - prev.subCount;
  parts.push(ds === 0 ? "selected subs (snapshot): no change" : `selected subs: ${ds >= 0 ? "+" : ""}${ds}`);
  const db = cur.liveBudget - prev.liveBudget;
  parts.push(db === 0 ? "live DB budget: no change" : `live DB budget: ${db >= 0 ? "+" : ""}${db}`);
  if (cur.budgetReason !== prev.budgetReason) {
    parts.push(`budget reason: ${prev.budgetReason} → ${cur.budgetReason}`);
  }
  if (cur.currentLane !== prev.currentLane) {
    parts.push(`lane: ${prev.currentLane ?? "—"} → ${cur.currentLane ?? "—"}`);
  }
  if (cur.completedLanes !== prev.completedLanes) {
    parts.push(`completed lanes changed`);
  }
  if (cur.failedLanes !== prev.failedLanes) {
    parts.push(`failed lanes (HTTP/429) changed`);
  }
  if (cur.deferredLanes !== prev.deferredLanes) {
    parts.push(`deferred lanes (budget / not reached) changed`);
  }
  if (cur.missingLanes !== prev.missingLanes) {
    parts.push(`missing lanes changed`);
  }
  if (cur.liveCycleId !== prev.liveCycleId) {
    parts.push(`live cycle id changed`);
  }
  if (cur.lastCycleSequence !== prev.lastCycleSequence) {
    parts.push(`cycle sequence ${prev.lastCycleSequence} → ${cur.lastCycleSequence}`);
  }
  if (cur.liveRefreshed !== prev.liveRefreshed) {
    parts.push("live collector DB row updated (refreshedAt)");
  } else {
    parts.push("live refreshedAt: unchanged (no collector save since last poll)");
  }
  return parts.join(" · ");
}

type DevActionState =
  | { phase: "idle" }
  | { phase: "loading"; action: "collect" | "reset" | "clear" | "budget" }
  | { phase: "success"; message: string }
  | { phase: "error"; message: string };

function neutralHintTitle(hint: NonNullable<IngestHealthSnapshot["healthNeutralHint"]>): string {
  if (hint === "history_cleared") return "History cleared";
  if (hint === "budget_reset") return "Budget reset";
  return "Cycle reset";
}

function neutralBaselineBody(hint: NonNullable<IngestHealthSnapshot["healthNeutralHint"]>): string {
  if (hint === "history_cleared") {
    return "History cleared — no collection has run on this baseline yet. Use Collect when ready.";
  }
  if (hint === "budget_reset") {
    return "Budget restored to initial (env) — backoff and lane penalties cleared. Use Collect when ready.";
  }
  return "Cycle reset — no collection has run on this baseline yet. Use Collect when ready.";
}

type RefreshAfterOpts = { source?: "post-ingest" | "dev-action" };

/** Developer controls: ingest API routes; `onRefreshLatest` reloads health after success. */
function IngestDevControls({
  onRefreshLatest,
  externallyBusy,
}: {
  onRefreshLatest: (opts?: RefreshAfterOpts) => Promise<void>;
  externallyBusy?: boolean;
}) {
  const [state, setState] = useState<DevActionState>({ phase: "idle" });

  const busy = state.phase === "loading" || Boolean(externallyBusy);

  async function run(
    path: string,
    loadingAction: "collect" | "reset" | "clear" | "budget",
    successMsg: string,
    failPrefix: string,
  ) {
    setState({ phase: "loading", action: loadingAction });
    try {
      const res = await fetch(path, { method: "POST" });
      const j = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !j.ok) {
        throw new Error(j.error || res.statusText);
      }
      await onRefreshLatest(
        loadingAction === "collect" ? { source: "post-ingest" } : { source: "dev-action" },
      );
      setState({ phase: "success", message: successMsg });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Request failed";
      setState({ phase: "error", message: `${failPrefix}: ${msg}` });
    }
  }

  return (
    <div className={styles.healthDevControls} role="group" aria-label="Manual ingest controls">
      <span className={styles.healthDevLabel}>Manual</span>
      <button
        type="button"
        disabled={busy}
        className={styles.healthDevButton}
        onClick={() => run("/api/ingest", "collect", "Collect finished.", "Collect failed")}
      >
        {state.phase === "loading" && state.action === "collect" ? "Collecting…" : "Collect now"}
      </button>
      <button
        type="button"
        disabled={busy}
        className={styles.healthDevButton}
        onClick={() =>
          run("/api/ingest/reset-cycle", "reset", "Reset cycle finished.", "Reset cycle failed")
        }
      >
        {state.phase === "loading" && state.action === "reset" ? "Resetting…" : "Reset cycle"}
      </button>
      <button
        type="button"
        disabled={busy}
        className={styles.healthDevButton}
        onClick={() =>
          run("/api/ingest/reset-budget", "budget", "Budget reset finished.", "Budget reset failed")
        }
        title="Restores budget to REDDIT_ADAPTIVE_INITIAL_BUDGET; clears backoff and lane penalties."
      >
        {state.phase === "loading" && state.action === "budget" ? "Resetting budget…" : "Reset budget"}
      </button>
      <button
        type="button"
        disabled={busy}
        className={styles.healthDevButton}
        onClick={() =>
          run("/api/ingest/clear-history", "clear", "History cleared.", "Clear history failed")
        }
        title="Deletes all posts, topic hits, snapshots; resets collector. Destructive testing wipe."
      >
        {state.phase === "loading" && state.action === "clear" ? "Clearing…" : "Clear history"}
      </button>
      {state.phase === "success" ? (
        <span className={styles.healthDevStatusOk}>{state.message}</span>
      ) : state.phase === "error" ? (
        <span className={styles.healthDevStatusErr}>{state.message}</span>
      ) : null}
      <p className={styles.healthDevHint}>
        <strong>Reset cycle</strong> — new cycle/cursors/scheduling; keeps adaptive budget.{" "}
        <strong>Reset budget</strong> — initial budget from env + clear backoff/penalties.{" "}
        <strong>Clear history</strong> — full DB wipe (testing).
      </p>
    </div>
  );
}

function countWarnings(health: IngestHealthSnapshot): number {
  let n = 0;
  if (health.lowDataWarning) n += 1;
  if (health.highFailureRateWarning) n += 1;
  if (health.rateLimitWarning) n += 1;
  if (health.authIssueWarning) n += 1;
  if (health.redditOAuthWarning) n += 1;
  return n;
}

function Warnings({ health }: { health: IngestHealthSnapshot }) {
  const items: { key: string; text: string; tone: "low" | "fail" | "rate" | "auth" }[] = [];
  if (health.lowDataWarning) {
    items.push({
      key: "low",
      tone: "low",
      text: "Low data: few topic hits or Reddit posts in the last ingest.",
    });
  }
  if (health.highFailureRateWarning) {
    items.push({
      key: "fail",
      tone: "fail",
      text: "High Reddit failure rate: many HTTP errors vs successful requests.",
    });
  }
  if (health.rateLimitWarning) {
    items.push({
      key: "rate",
      tone: "rate",
      text: "Rate limit: HTTP 429 seen on Reddit requests.",
    });
  }
  if (health.authIssueWarning) {
    items.push({
      key: "auth",
      tone: "auth",
      text: "Auth issue: HTTP 401/403 seen on Reddit requests.",
    });
  }
  if (health.redditOAuthWarning) {
    items.push({
      key: "oauth",
      tone: "auth",
      text: "Reddit OAuth: set REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_REFRESH_TOKEN, and REDDIT_USER_AGENT.",
    });
  }
  if (items.length === 0) {
    return (
      <>
        {health.healthNeutralHint ? (
          <p className={styles.healthNeutralBaseline}>{neutralBaselineBody(health.healthNeutralHint)}</p>
        ) : null}
        <p className={styles.healthMutedOk}>
          {health.healthNeutralHint ? "No warnings from a collection run yet." : "No active warnings."}
        </p>
      </>
    );
  }
  return (
    <ul className={styles.healthWarnings}>
      {items.map((item) => (
        <li
          key={item.key}
          className={
            item.tone === "low"
              ? styles.healthWarningLow
              : item.tone === "fail"
                ? styles.healthWarningFail
                : item.tone === "rate"
                  ? styles.healthWarningRate
                  : styles.healthWarningAuth
          }
        >
          {item.text}
        </li>
      ))}
    </ul>
  );
}

/** Detailed metrics (snapshot, pools, HTTP, etc.) — inside the collapsible panel. */
function HealthDetailSections({
  health,
  snapshotMeta,
}: {
  health: IngestHealthSnapshot;
  snapshotMeta: { id: number; createdAt: string; bucketTime: string };
}) {
  const statusLines = Object.entries(health.statusCounts)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([code, n]) => `${code}: ${n}`)
    .join(" · ");

  return (
    <>
      <div className={styles.healthSection}>
        <h3 className={styles.healthSectionTitle}>Snapshot</h3>
        <p className={styles.healthMuted}>
          <span className={styles.healthLabel}>ID</span>{" "}
          <span className={styles.healthValueNum}>#{snapshotMeta.id}</span>
        </p>
        <p className={styles.healthMuted}>
          <span className={styles.healthLabel}>Saved at (Istanbul)</span>{" "}
          <code className={styles.healthInlineCode}>
            {formatIstanbulDateTime(snapshotMeta.createdAt)}
          </code>
          <span className={styles.healthLabel}> UTC raw</span>{" "}
          <code className={styles.healthInlineCode}>{snapshotMeta.createdAt}</code>
        </p>
        <p className={styles.healthMuted}>
          <span className={styles.healthLabel}>Bucket (Istanbul)</span>{" "}
          <code className={styles.healthInlineCode}>{formatIstanbulDateTime(snapshotMeta.bucketTime)}</code>
          <span className={styles.healthLabel}> UTC raw</span>{" "}
          <code className={styles.healthInlineCode}>{snapshotMeta.bucketTime}</code>
        </p>
        {health.healthSnapshotReason ? (
          <p className={styles.healthMuted}>
            <span className={styles.healthLabel}>Snapshot kind</span>{" "}
            {health.healthSnapshotReason === "collector_reset"
              ? "Cycle reset (no Reddit HTTP in this write)"
              : health.healthSnapshotReason === "budget_reset"
                ? "Budget reset (no Reddit HTTP in this write)"
                : "Full testing wipe baseline (no Reddit HTTP in this write)"}
          </p>
        ) : null}
      </div>

      <div className={styles.healthSection}>
        <h3 className={styles.healthSectionTitle}>Mode / config</h3>
        <dl className={styles.healthGrid}>
          <dt>Last ingest (Istanbul)</dt>
          <dd>
            {formatIstanbulDateTime(health.lastIngestAt)}
            <span className={styles.healthLabel}> · UTC </span>
            <code className={styles.healthInlineCode}>{health.lastIngestAt}</code>
          </dd>
          <dt>Bucket time (Istanbul)</dt>
          <dd>
            {formatIstanbulDateTime(health.bucketTime)}
            <span className={styles.healthLabel}> · UTC </span>
            <code className={styles.healthInlineCode}>{health.bucketTime}</code>
          </dd>
          <dt>Modes</dt>
          <dd>
            redditOnly={String(health.redditOnlyMode)} · filter={health.candidateFilterMode} · merge=
            {health.canonicalMergeMode}
          </dd>
          <dt>Listing attempts (config)</dt>
          <dd>
            <span className={styles.healthValueNum}>{health.redditListingRequestAttempts}</span>
          </dd>
          <dt>HN fetched (not merged into topics)</dt>
          <dd>
            <span className={styles.healthValueNum}>{health.hnPostCountFetched}</span>
          </dd>
        </dl>
      </div>

      <div className={styles.healthSection}>
        <h3 className={styles.healthSectionTitle}>Adaptive Reddit collector</h3>
        <p className={styles.healthMuted}>
          Interim bounded budget until fuller OAuth/API access — see code notes in{" "}
          <code className={styles.healthInlineCode}>collectorState.ts</code>.
        </p>
        <dl className={styles.healthGrid}>
          <dt>Budget mode</dt>
          <dd>{health.budgetMode ?? "—"}</dd>
          <dt>Public JSON fallback</dt>
          <dd>
            {health.redditPublicFallbackUsed
              ? "yes — www.reddit.com (no OAuth token)"
              : "no — OAuth or token path"}
          </dd>
          <dt>Current / previous / min / max</dt>
          <dd>
            <span className={styles.healthValueNum}>{health.currentAdaptiveBudget ?? "—"}</span>
            {" / "}
            <span className={styles.healthValueNum}>{health.previousAdaptiveBudget ?? "—"}</span>
            {" / "}
            <span className={styles.healthValueNum}>{health.minRequestBudget ?? "—"}</span>
            {" / "}
            <span className={styles.healthValueNum}>{health.maxRequestBudget ?? "—"}</span>
          </dd>
          <dt>Success / failure rate</dt>
          <dd>
            {health.successRate !== undefined ? `${(health.successRate * 100).toFixed(1)}%` : "—"} ·{" "}
            {health.failureRate !== undefined ? `${(health.failureRate * 100).toFixed(1)}%` : "—"}
          </dd>
          <dt>HTTP 429 / auth / empty</dt>
          <dd>
            <span className={styles.healthValueWarn}>{health.http429Count ?? 0}</span> ·{" "}
            <span className={styles.healthValueWarn}>{health.authErrorCount ?? 0}</span> ·{" "}
            <span className={styles.healthValueNum}>{health.emptyResponseCount ?? 0}</span>
          </dd>
          <dt>Budget change reason</dt>
          <dd>
            <code className={styles.healthInlineCode}>{health.budgetChangeReason ?? "—"}</code>
          </dd>
          <dt>Global backoff</dt>
          <dd>{health.globalBackoffActive ? "active (at ingest time)" : "not active"}</dd>
          <dt>Comment HTTP (sub-budget)</dt>
          <dd>
            <span className={styles.healthValueNum}>{health.commentHttpBudgetUsed ?? 0}</span>
          </dd>
          <dt>Paused (budget / 429)</dt>
          <dd>
            {String(health.pausedDueToBudget ?? false)} / {String(health.pausedDueTo429 ?? false)}
          </dd>
          <dt>Last publish (Istanbul)</dt>
          <dd>
            {health.lastPublishAt ? (
              <>
                {formatIstanbulDateTime(health.lastPublishAt)}
                <span className={styles.healthLabel}> · UTC </span>
                <code className={styles.healthInlineCode}>{health.lastPublishAt}</code>
              </>
            ) : (
              "—"
            )}
          </dd>
          <dt>Cycle status / publish eligibility</dt>
          <dd>
            <code className={styles.healthInlineCode}>{health.currentCycleStatus ?? "—"}</code>
            {" · "}
            <code className={styles.healthInlineCode}>{health.nextPublishEligibility ?? "—"}</code>
            {" · cycle "}
            <code className={styles.healthInlineCode}>{health.collectorCycleId ?? "—"}</code>
          </dd>
          <dt>Completed lanes</dt>
          <dd>
            <code className={styles.healthInlineCode}>
              {(health.completedLanes ?? []).join(", ") || "—"}
            </code>
          </dd>
          <dt>Deferred / incomplete (budget or not reached)</dt>
          <dd>
            <code className={styles.healthInlineCode}>
              {(health.deferredLanes ?? []).join(", ") || "—"}
            </code>
          </dd>
          <dt>Failed lanes (HTTP / 429 on lane)</dt>
          <dd>
            <code className={styles.healthInlineCode}>
              {(health.failedLanes ?? []).join(", ") || "—"}
            </code>
          </dd>
          <dt>Missing lanes (not completed this cycle)</dt>
          <dd>
            <code className={styles.healthInlineCode}>
              {(health.missingLanes ?? []).join(", ") || "—"}
            </code>
          </dd>
          <dt>Lane penalty</dt>
          <dd>
            <pre className={styles.healthPre}>{JSON.stringify(health.lanePenalty ?? {}, null, 2)}</pre>
          </dd>
          <dt>Collector state refreshed</dt>
          <dd>
            {health.refreshedAt ? (
              <>
                {formatRefreshedAtLabel(health.refreshedAt)} · {formatIstanbulDate(health.refreshedAt)}
                <span className={styles.healthLabel}> · UTC </span>
                <code className={styles.healthInlineCode}>{health.refreshedAt}</code>
              </>
            ) : (
              "—"
            )}
          </dd>
        </dl>
      </div>

      <div className={styles.healthSection}>
        <h3 className={styles.healthSectionTitle}>Reddit HTTP</h3>
        <dl className={styles.healthGrid}>
          <dt>Totals</dt>
          <dd>
            total <span className={styles.healthValueNum}>{health.totalRedditRequests}</span> · ok{" "}
            <span className={styles.healthValueNum}>{health.successfulRedditRequests}</span> · fail{" "}
            <span className={styles.healthValueWarn}>{health.failedRedditRequests}</span> · empty payloads{" "}
            <span className={styles.healthValueNum}>{health.emptyResponses}</span>
          </dd>
          <dt>OAuth / rate budget</dt>
          <dd>
            configured{" "}
            <span className={styles.healthValueNum}>{String(health.redditOAuthConfigured ?? false)}</span> · in
            use <span className={styles.healthValueNum}>{String(health.redditOAuthInUse ?? false)}</span> ·
            target QPM <span className={styles.healthValueNum}>{health.redditTargetQpm ?? "—"}</span> · window{" "}
            <span className={styles.healthValueNum}>{health.redditWindowMinutes ?? "—"}</span>m · backoff{" "}
            <span className={styles.healthValueWarn}>{String(health.redditBackoffTriggered ?? false)}</span>
          </dd>
          <dt>Subreddits (this ingest)</dt>
          <dd>
            selected <span className={styles.healthValueNum}>{health.redditSelectedSubreddits?.length ?? 0}</span> ·
            deferred <span className={styles.healthValueNum}>{health.redditSkippedSubreddits?.length ?? 0}</span>
          </dd>
        </dl>
        <p className={styles.healthPreLabel}>Rate-limit headers (last seen)</p>
        <pre className={styles.healthPre}>
          {JSON.stringify(health.rateLimitHeadersSeen ?? {}, null, 2)}
        </pre>
        <p className={styles.healthPreLabel}>Selected subreddits</p>
        <pre className={styles.healthPre}>{JSON.stringify(health.redditSelectedSubreddits ?? [], null, 2)}</pre>
      </div>

      <div className={styles.healthSection}>
        <h3 className={styles.healthSectionTitle}>Status counts</h3>
        <p className={styles.healthMonoLine}>{statusLines || "—"}</p>
      </div>

      <div className={styles.healthSection}>
        <h3 className={styles.healthSectionTitle}>Posts / hits</h3>
        <dl className={styles.healthGrid}>
          <dt>Reddit / topic / posts / dedupe</dt>
          <dd>
            reddit fetched <span className={styles.healthValueNum}>{health.redditPostsFetched}</span> · topic hits
            saved <span className={styles.healthValueNum}>{health.topicHitsSaved}</span> · posts saved{" "}
            <span className={styles.healthValueNum}>{health.savedPosts}</span> · title dedupe skipped{" "}
            <span className={styles.healthValueNum}>{health.dedupedByTitle}</span>
          </dd>
        </dl>
      </div>

      <div className={styles.healthSection}>
        <h3 className={styles.healthSectionTitle}>Comments</h3>
        <dl className={styles.healthGrid}>
          <dt>Attempts / snippets / failures</dt>
          <dd>
            <span className={styles.healthValueNum}>{health.commentsFetched}</span> · stored{" "}
            <span className={styles.healthValueNum}>
              {health.snippetsStored ?? health.commentsUsed}
            </span>
            {typeof health.commentSnippetFetchFailures === "number" ? (
              <>
                {" "}
                · fail{" "}
                <span className={styles.healthValueWarn}>{health.commentSnippetFetchFailures}</span>
              </>
            ) : null}
          </dd>
        </dl>
      </div>

      <div className={styles.healthSection}>
        <h3 className={styles.healthSectionTitle}>Pool summaries</h3>
        <p className={styles.healthPreLabel}>By pool — fetch attempts (config)</p>
        <pre className={styles.healthPre}>{JSON.stringify(health.fetchAttemptsByPool, null, 2)}</pre>
        <p className={styles.healthPreLabel}>By pool — unique Reddit posts (after dedupe)</p>
        <pre className={styles.healthPre}>{JSON.stringify(health.redditUniquePostsByPool, null, 2)}</pre>
      </div>
    </>
  );
}

function HealthMonitoringStrip({
  uiPollAt,
  pollCount,
  payload,
  deltaLine,
  lastRefreshKind,
  lastCollectTriggerAt,
  publishChangedAt,
  devAutoCollectOn,
}: {
  uiPollAt: string;
  pollCount: number;
  payload: LatestPayload;
  deltaLine: string;
  lastRefreshKind: "poll" | "post-ingest" | "dev-action";
  lastCollectTriggerAt: string | null;
  publishChangedAt: string | null;
  devAutoCollectOn: boolean;
}) {
  const live = payload.liveCollector;
  const snap = payload.snapshot;
  const h = snap?.health;
  const budgetMismatch =
    h != null && h.currentAdaptiveBudget !== live.currentRequestBudget
      ? `Published snapshot shows budget ${h.currentAdaptiveBudget}; live DB row has ${live.currentRequestBudget} (updates on each collector save; snapshot updates on publish).`
      : null;

  const refreshLabel =
    lastRefreshKind === "post-ingest"
      ? "collect finished → this GET refreshed panel"
      : lastRefreshKind === "dev-action"
        ? "after dev action → GET refreshed panel"
        : "poll only (GET /api/ingest/latest — no Reddit work)";

  return (
    <div className={styles.healthMonitor}>
      <h3 className={styles.healthMonitorTitle}>Monitoring & refresh</h3>
      <dl className={styles.healthMonitorGrid}>
        <dt>Latest refresh type</dt>
        <dd>
          <span className={styles.healthValueNum}>{refreshLabel}</span>
        </dd>
        <dt>Last POST /api/ingest (collect)</dt>
        <dd>
          {lastCollectTriggerAt ? (
            <>
              {formatIstanbulDateTime(lastCollectTriggerAt)} ·{" "}
              <code className={styles.healthInlineCode}>{lastCollectTriggerAt}</code>
            </>
          ) : (
            "none this session"
          )}
        </dd>
        <dt>Last publish time (snapshot health)</dt>
        <dd>
          {h?.lastPublishAt ? (
            <>
              {formatIstanbulDateTime(h.lastPublishAt)} ·{" "}
              <code className={styles.healthInlineCode}>{h.lastPublishAt}</code>
            </>
          ) : (
            "—"
          )}
        </dd>
        <dt>Publish row changed (vs prior poll)</dt>
        <dd>
          {publishChangedAt ? (
            <>
              detected {formatIstanbulDateTime(publishChangedAt)} — <strong>new snapshot published</strong>
            </>
          ) : (
            "no change since last poll"
          )}
        </dd>
        <dt>Live DB — last publish / attempt / success</dt>
        <dd>
          publish{" "}
          {live.lastPublishAt ? formatIstanbulDateTime(live.lastPublishAt) : "—"} · attempt{" "}
          {live.lastAttemptAt ? formatIstanbulDateTime(live.lastAttemptAt) : "—"} · last success{" "}
          {live.lastSuccessfulCollectAt ? formatIstanbulDateTime(live.lastSuccessfulCollectAt) : "—"}
        </dd>
        <dt>Collector mode (env)</dt>
        <dd>
          {live.redditPublicFallbackOnly ? (
            <span className={styles.healthMonitorWarn}>
              public fallback only (temporary) — OAuth token path not used for collection
            </span>
          ) : (
            "OAuth path enabled when credentials are complete"
          )}
        </dd>
        <dt>Last collect that did not write a new snapshot</dt>
        <dd>
          {live.lastSkippedPublishAt ? (
            <>
              {formatIstanbulDateTime(live.lastSkippedPublishAt)} ·{" "}
              <code className={styles.healthInlineCode}>{live.lastSkippedPublishReason ?? "—"}</code>
            </>
          ) : (
            "— (no recent no-op / skipped publish)"
          )}
        </dd>
        <dt>Snapshot safety</dt>
        <dd className={styles.healthMonitorNote}>
          Runs with zero Reddit requests, zero subs, zero posts, and zero topic hits do <strong>not</strong> replace the
          latest ingest snapshot — topic cards stay tied to the last good publish. Skips are recorded here on the live
          collector row only.
        </dd>
        <dt>Dev auto-collect</dt>
        <dd>
          {devAutoCollectOn ? (
            <span className={styles.healthMonitorWarn}>
              ON — POST /api/ingest every 60s (default in `next dev`, or NEXT_PUBLIC_DEV_AUTO_COLLECT=1)
            </span>
          ) : (
            "off — only manual Collect or cron runs ingestion"
          )}
        </dd>
        <dt>Last UI poll (client)</dt>
        <dd>
          {formatIstanbulDateTime(uiPollAt)} · <code className={styles.healthInlineCode}>{uiPollAt}</code>
        </dd>
        <dt>Poll #</dt>
        <dd>
          <span className={styles.healthValueNum}>{pollCount}</span> (increments every fetch, including auto 30s)
        </dd>
        <dt>API server time</dt>
        <dd>{formatIstanbulDateTime(payload.serverTime)}</dd>
        <dt>Latest published snapshot</dt>
        <dd>
          {snap ? (
            <>
              id <span className={styles.healthValueNum}>#{snap.id}</span> · saved{" "}
              {formatIstanbulDateTime(snap.createdAt)}
            </>
          ) : (
            "none yet"
          )}
        </dd>
        <dt>Live collector (SQLite, current)</dt>
        <dd>
          DB <code>refreshedAt</code>{" "}
          {live.refreshedAt ? formatIstanbulDateTime(live.refreshedAt) : "—"} · status{" "}
          <code>{live.currentCycleStatus}</code> · lane <code>{live.currentLane ?? "—"}</code> · completed{" "}
          <code>{live.completedLanes.join(", ") || "—"}</code> · deferred{" "}
          <code>{live.deferredLanes.join(", ") || "—"}</code> · failed (HTTP){" "}
          <code>{live.failedLanes.join(", ") || "—"}</code> · missing{" "}
          <code>{live.missingLanes.join(", ") || "—"}</code>
        </dd>
        <dt>Live budget / reason</dt>
        <dd>
          current <span className={styles.healthValueNum}>{live.currentRequestBudget}</span> · prev{" "}
          <span className={styles.healthValueNum}>{live.previousRequestBudget}</span> · min/max{" "}
          {live.minRequestBudget}/{live.maxRequestBudget} ·{" "}
          <code className={styles.healthInlineCode}>{live.budgetChangeReason}</code>
          {live.budgetChangeReason === "severe_rate_limit_or_abort" ? (
            <span className={styles.healthMonitorWarn}>
              {" "}
              — adaptive dropped budget after 429/abort; use Reset budget to raise for testing.
            </span>
          ) : null}
        </dd>
        <dt>Snapshot row (last publish) vs same metrics</dt>
        <dd>
          {h ? (
            <>
              requests <span className={styles.healthValueNum}>{h.totalRedditRequests}</span> · posts{" "}
              <span className={styles.healthValueNum}>{h.redditPostsFetched}</span> · comments{" "}
              <span className={styles.healthValueNum}>{h.commentsFetched}</span> · subs picked{" "}
              <span className={styles.healthValueNum}>{h.redditSelectedSubreddits?.length ?? 0}</span>
            </>
          ) : (
            "no snapshot"
          )}
        </dd>
        <dt>Δ vs previous poll</dt>
        <dd className={styles.healthMonitorDelta}>{deltaLine}</dd>
        {budgetMismatch ? (
          <>
            <dt>Budget mismatch tip</dt>
            <dd className={styles.healthMonitorNote}>{budgetMismatch}</dd>
          </>
        ) : null}
      </dl>
    </div>
  );
}

function HealthDropdown({
  health,
  snapshotMeta,
}: {
  health: IngestHealthSnapshot;
  snapshotMeta: { id: number; createdAt: string; bucketTime: string };
}) {
  const n = countWarnings(health);
  const shortTime = (() => {
    try {
      const d = new Date(snapshotMeta.createdAt);
      if (Number.isNaN(d.getTime())) return snapshotMeta.createdAt;
      return formatIstanbulDateTime(d);
    } catch {
      return snapshotMeta.createdAt;
    }
  })();

  return (
    <details className={styles.healthDetails}>
      <summary className={styles.healthSummary}>
        <span className={styles.healthSummaryTitle}>Ingest / system health</span>
        <span className={styles.healthSummaryMeta}>·</span>
        {n === 0 ? (
          <span className={styles.healthSummaryOk}>OK</span>
        ) : (
          <span className={styles.healthSummaryWarn}>
            {n} warning{n === 1 ? "" : "s"}
          </span>
        )}
        <span className={styles.healthSummaryMeta}>
          · snapshot #{snapshotMeta.id} · {shortTime}
        </span>
        {health.healthNeutralHint ? (
          <>
            <span className={styles.healthSummaryMeta}>·</span>
            <span className={styles.healthSummaryBaseline}>
              {neutralHintTitle(health.healthNeutralHint)}
            </span>
          </>
        ) : null}
      </summary>
      <div className={styles.healthDetailsInner}>
        <div className={styles.healthSection}>
          <h3 className={styles.healthSectionTitle}>Warnings</h3>
          <Warnings health={health} />
        </div>
        <HealthDetailSections health={health} snapshotMeta={snapshotMeta} />
      </div>
    </details>
  );
}

/** Loads persisted ingest health from `GET /api/ingest/latest` (not from page props). */
export function IngestHealthPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<LatestPayload | null>(null);
  const [pollReady, setPollReady] = useState(false);
  const [lastUiPollAt, setLastUiPollAt] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const [deltaLine, setDeltaLine] = useState("—");
  const [silentPollError, setSilentPollError] = useState<string | null>(null);
  const [lastRefreshKind, setLastRefreshKind] = useState<"poll" | "post-ingest" | "dev-action">("poll");
  const [lastCollectTriggerAt, setLastCollectTriggerAt] = useState<string | null>(null);
  const [publishChangedAt, setPublishChangedAt] = useState<string | null>(null);
  const [autoCollectRunning, setAutoCollectRunning] = useState(false);
  const prevMetricsRef = useRef<PollMetrics | null>(null);
  const prevPublishAtRef = useRef<string | null | undefined>(undefined);
  const autoCollectInFlightRef = useRef(false);
  const devAutoOn = isDevAutoCollectEnabled();

  const loadLatest = useCallback(async (opts?: {
    silent?: boolean;
    refreshSource?: "poll" | "post-ingest" | "dev-action";
  }) => {
    if (!opts?.silent) {
      setLoading(true);
    }
    setError(null);
    const bust = typeof window !== "undefined" ? `?t=${Date.now()}&r=${Math.random().toString(36).slice(2, 9)}` : "";
    const res = await fetch(`/api/ingest/latest${bust}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const json = (await res.json()) as LatestPayload | { ok: false; error?: string };
    if (!res.ok || !("ok" in json) || !json.ok) {
      throw new Error("ok" in json && !json.ok ? String(json.error) : res.statusText);
    }
    const next = json as LatestPayload;
    const cur = extractPollMetrics(next);
    const prev = prevMetricsRef.current;
    setDeltaLine(formatDeltaLine(prev, cur));
    prevMetricsRef.current = cur;
    const nowIso = new Date().toISOString();
    setLastUiPollAt(nowIso);
    setPollCount((c) => c + 1);
    setSilentPollError(null);
    setPayload(next);

    const src = opts?.refreshSource ?? "poll";
    setLastRefreshKind(src === "post-ingest" ? "post-ingest" : src === "dev-action" ? "dev-action" : "poll");

    const pub = next.snapshot?.health.lastPublishAt ?? null;
    if (prevPublishAtRef.current !== undefined && pub !== null && prevPublishAtRef.current !== pub) {
      setPublishChangedAt(nowIso);
    }
    prevPublishAtRef.current = pub;
  }, []);

  const loadLatestRef = useRef(loadLatest);
  loadLatestRef.current = loadLatest;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadLatest({ silent: false, refreshSource: "poll" });
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Request failed");
      } finally {
        if (!cancelled) {
          setLoading(false);
          setPollReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadLatest]);

  useEffect(() => {
    if (!pollReady) return;
    const tick = () => {
      loadLatestRef
        .current({ silent: true, refreshSource: "poll" })
        .catch((e: unknown) => {
          const msg = e instanceof Error ? e.message : "Request failed";
          setSilentPollError(msg);
        });
    };
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [pollReady]);

  useEffect(() => {
    if (!pollReady || !devAutoOn) return;
    const id = window.setInterval(async () => {
      if (autoCollectInFlightRef.current) return;
      autoCollectInFlightRef.current = true;
      setAutoCollectRunning(true);
      try {
        const res = await fetch(`/api/ingest?t=${Date.now()}`, {
          method: "POST",
          cache: "no-store",
        });
        const j = (await res.json()) as { ok?: boolean; error?: string };
        if (!res.ok || !j.ok) {
          throw new Error(j.error || res.statusText);
        }
        const finishedAt = new Date().toISOString();
        setLastCollectTriggerAt(finishedAt);
        await loadLatestRef.current({ silent: true, refreshSource: "post-ingest" });
        router.refresh();
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Auto-collect failed";
        setSilentPollError(msg);
      } finally {
        autoCollectInFlightRef.current = false;
        setAutoCollectRunning(false);
      }
    }, 60_000);
    return () => window.clearInterval(id);
  }, [pollReady, devAutoOn, router]);

  const refreshAfterAction = useCallback(async (opts?: RefreshAfterOpts) => {
    try {
      const src =
        opts?.source === "post-ingest" ? "post-ingest" : opts?.source === "dev-action" ? "dev-action" : "poll";
      if (opts?.source === "post-ingest") {
        setLastCollectTriggerAt(new Date().toISOString());
      }
      await loadLatest({ silent: true, refreshSource: src });
      /** Re-fetch server components (topic list) so Clear history / Reset / Collect update the page without a full reload. */
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Request failed");
      throw e;
    }
  }, [loadLatest, router]);

  return (
    <section className={styles.healthPanel} aria-label="Ingest health">
      <div className={styles.healthPanelHeader}>
        <h2 className={styles.healthHeading}>Ingest / system health</h2>
        <IngestDevControls onRefreshLatest={refreshAfterAction} externallyBusy={autoCollectRunning} />
      </div>
      <p className={styles.healthPollNote}>
        Read-only: GET <code className={styles.healthInlineCode}>/api/ingest/latest</code> every 30s. Collection only runs
        on POST <code className={styles.healthInlineCode}>/api/ingest</code> (manual, dev auto-collect, or server cron).{" "}
        {devAutoOn ? (
          <span className={styles.healthMonitorWarn}>
            Dev auto-collect is ON (60s POST /ingest).
          </span>
        ) : (
          <>
            Auto-collect off — use <strong>Collect now</strong>, or run{" "}
            <code className={styles.healthInlineCode}>next dev</code> with the var unset /{" "}
            <code className={styles.healthInlineCode}>NEXT_PUBLIC_DEV_AUTO_COLLECT=1</code> (disable with{" "}
            <code className={styles.healthInlineCode}>=0</code>).
          </>
        )}
      </p>
      {loading ? (
        <p className={styles.healthMuted}>Loading snapshot…</p>
      ) : error ? (
        <p className={styles.healthError} role="alert">
          {error}
        </p>
      ) : payload ? (
        <>
          <HealthMonitoringStrip
            uiPollAt={lastUiPollAt ?? payload.serverTime}
            pollCount={pollCount}
            payload={payload}
            deltaLine={deltaLine}
            lastRefreshKind={lastRefreshKind}
            lastCollectTriggerAt={lastCollectTriggerAt}
            publishChangedAt={publishChangedAt}
            devAutoCollectOn={devAutoOn}
          />
          {silentPollError ? (
            <p className={styles.healthMonitorErr} role="status">
              Last silent poll failed: {silentPollError}
            </p>
          ) : null}
          {!payload.snapshot ? (
            <p className={styles.healthMuted}>
              No published ingest snapshot yet — values in <strong>Live collector</strong> above still reflect the SQLite
              row (updates on collector save). Use <strong>Collect now</strong> or POST <code>/api/ingest</code> to
              produce a snapshot on publish.
            </p>
          ) : (
            <HealthDropdown
              health={payload.snapshot.health}
              snapshotMeta={{
                id: payload.snapshot.id,
                createdAt: payload.snapshot.createdAt,
                bucketTime: payload.snapshot.bucketTime,
              }}
            />
          )}
        </>
      ) : (
        <p className={styles.healthMuted}>No data.</p>
      )}
    </section>
  );
}
