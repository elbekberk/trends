import { NextResponse } from "next/server";
import {
  getLatestIngestSnapshot,
  liveCollectorStateToApiPayload,
} from "@/src/lib/ingest";
import { loadRedditCollectorState } from "@/src/lib/reddit/collectorState";

/**
 * Read-only: returns latest published ingest snapshot + live collector row from SQLite.
 * Does not run Reddit fetch or advance cursors — use `POST /api/ingest` for that.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const now = new Date();
    const [snapshot, { state: liveState }] = await Promise.all([
      getLatestIngestSnapshot(),
      loadRedditCollectorState(now),
    ]);

    const body = {
      ok: true as const,
      serverTime: now.toISOString(),
      liveCollector: liveCollectorStateToApiPayload(liveState),
      snapshot: snapshot
        ? {
            id: snapshot.id,
            createdAt: snapshot.createdAt.toISOString(),
            bucketTime: snapshot.bucketTime.toISOString(),
            health: snapshot.health,
          }
        : null,
    };

    return NextResponse.json(body, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false as const,
        error: error instanceof Error ? error.message : "Failed to load snapshot",
      },
      { status: 500 },
    );
  }
}
