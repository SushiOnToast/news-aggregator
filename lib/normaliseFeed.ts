import Parser from "rss-parser";
import { Article } from "./types";

// no of milliseconds in 48 hrs, will be used for TTL management with daily refresh cycle
const TTL_MS = 48 * 60 * 60 * 1000; 

function cleanUrl(link: string): string | null {
  try {
    const url = new URL(link);

    // remove tracking parameters and url fragments
    url.search = "";
    url.hash = "";

    return url.toString();
  } catch {
    return null;
  }
}

export function normaliseItem(
  item: Parser.Item,
  source: string,
  tags: string[],
): Article | null {
  if (!item.link || !item.title) return null;

  const url = cleanUrl(item.link);
  if (!url) return null;

  // remove stuff like continue reading (all instances), newline characters and unecessary whitespace
  const summary = (item.contentSnippet ?? "")
    .replace(/Continue reading\.\.\./g, "")
    .replace(/\s+/g, " ")
    .trim();

    const rawDate = item.isoDate ?? item.pubDate;
    const parsed = rawDate ? new Date(rawDate) : new Date();
    const publishedAt = isNaN(parsed.getTime()) ? new Date() : parsed;

    const now = new Date();

    return {
        url,
        title: item.title.trim(),
        summary,
        source,
        author: item.creator,
        publishedAt,
        fetchedAt: now,
        expiresAt: new Date(now.getTime() + TTL_MS),
        tags
    }
}
