import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const conn = await connectDB();
    const db = conn.connection.db;
    if (!db) throw new Error("No database handle after connecting");

    await db.command({ ping: 1 });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to connect to mongodb" },
      { status: 500 },
    );
  }
}
