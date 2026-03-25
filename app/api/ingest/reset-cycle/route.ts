import { NextResponse } from "next/server";
import { recordHealthSnapshotAfterCollectorReset } from "@/src/lib/ingest";
import { resetRedditCollectorForFreshCycle } from "@/src/lib/reddit/collectorState";

export const dynamic = "force-dynamic";

/**
 * Clears interim Reddit collector cycle state (cursors, backoff, next-eligible, partial cycle flags)
 * so the next ingest starts a clean cycle from the current time. Does not delete posts or topic hits.
 * Also appends a new health snapshot so the UI reflects the reset immediately.
 */
export async function POST() {
  try {
    const now = new Date();
    const state = await resetRedditCollectorForFreshCycle(now);
    await recordHealthSnapshotAfterCollectorReset(now, "collector_reset");
    return NextResponse.json({
      ok: true as const,
      currentCycleId: state.currentCycleId,
      currentCycleStartedAt: state.currentCycleStartedAt,
      refreshedAt: state.refreshedAt,
      budgetChangeReason: state.budgetChangeReason,
      lastCycleSequence: state.lastCycleSequence,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false as const,
        error: error instanceof Error ? error.message : "Reset failed",
      },
      { status: 500 },
    );
  }
}
