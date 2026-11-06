import Parser from "rss-parser";
import { NextResponse } from "next/server";
import { getFeedsByTag } from "@/lib/feedSources";
import { normaliseItem } from "@/lib/normaliseFeed";

let parser = new Parser();

export async function GET() {
  try {
    for (const f of getFeedsByTag("world")) {
      const feed = await parser.parseURL(f.url);
      console.log("FEED:", feed.title, "| items:", feed.items.length);
    
      // whole first item
      console.log(normaliseItem(feed.items[0], f.name, f.tags));
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "RSS fetch failed" }, { status: 500 });
  }
}
