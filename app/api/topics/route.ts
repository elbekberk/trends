import { NextResponse } from "next/server";
import { getRisingTopics } from "@/src/lib/ingest";

export async function GET() {
  try {
    const radar = await getRisingTopics(40);
    return NextResponse.json({ ok: true, ...radar });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to load topics",
      },
      { status: 500 },
    );
  }
}
