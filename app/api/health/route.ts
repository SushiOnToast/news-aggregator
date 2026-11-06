import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("news-aggregator");
    // check health
    await db.command({
      ping: 1,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Unable to connect to mongodb" },
      { status: 500 },
    );
  }
}
