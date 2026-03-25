import { NextResponse } from "next/server";
import { wipeAllStoredIngestDataForTesting } from "@/src/lib/ingest";

export const dynamic = "force-dynamic";

/**
 * Destructive testing wipe: all TopicHit, Post, IngestSnapshot rows; full collector reset; new baseline snapshot.
 * Does not alter normal per-run ingest retention — only this manual route performs a full DB wipe.
 */
export async function POST() {
  try {
    const deleted = await wipeAllStoredIngestDataForTesting();
    return NextResponse.json({
      ok: true as const,
      ...deleted,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false as const,
        error: error instanceof Error ? error.message : "Clear history failed",
      },
      { status: 500 },
    );
  }
}
