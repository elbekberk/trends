import { NextResponse } from "next/server";
import { recordHealthSnapshotAfterCollectorReset } from "@/src/lib/ingest";
import { getAdaptiveBudgetDefaults, resetRedditCollectorBudgetToInitial } from "@/src/lib/reddit/collectorState";

export const dynamic = "force-dynamic";

/**
 * Restores adaptive budget to env initial (REDDIT_ADAPTIVE_INITIAL_BUDGET), clears backoff + lane penalties.
 * Does not reset lane cursors or cycle id — use POST /api/ingest/reset-cycle for that.
 */
export async function POST() {
  try {
    const now = new Date();
    const state = await resetRedditCollectorBudgetToInitial(now);
    await recordHealthSnapshotAfterCollectorReset(now, "budget_reset");
    const defaults = getAdaptiveBudgetDefaults();
    return NextResponse.json({
      ok: true as const,
      budgetChangeReason: state.budgetChangeReason,
      currentRequestBudget: state.currentRequestBudget,
      previousRequestBudget: state.previousRequestBudget,
      minRequestBudget: defaults.min,
      maxRequestBudget: defaults.max,
      initialBudgetFromEnv: defaults.initial,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false as const,
        error: error instanceof Error ? error.message : "Budget reset failed",
      },
      { status: 500 },
    );
  }
}
