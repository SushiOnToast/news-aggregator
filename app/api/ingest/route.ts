import { NextResponse } from "next/server";
import { ingestAll } from "@/lib/ingest";

export async function GET() {
  try {
    const results = await ingestAll();
    return NextResponse.json({ ok: true, results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ingestion failed" }, { status: 500 });
  }
}
