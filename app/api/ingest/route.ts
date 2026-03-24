import { NextResponse } from "next/server";
import { runIngest } from "@/src/lib/ingest";

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
