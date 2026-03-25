import { NextResponse } from "next/server";
import { runIngest } from "@/src/lib/ingest";

/**
 * Triggers a full ingest run (Reddit listing + topic pipeline + snapshot publish).
 * This is the only HTTP route that performs collection — `GET /api/ingest/latest` only reads DB state.
 */
export async function POST() {
  try {
    const result = await runIngest();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Ingest failed",
      },
      { status: 500 },
    );
  }
}
