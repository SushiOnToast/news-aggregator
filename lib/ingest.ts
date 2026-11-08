import Parser from "rss-parser";
import { connectDB } from "./mongodb";
import { ArticleModel } from "./models/Article";
import { Article } from "./types";
import { normaliseItem } from "./normaliseFeed";
import { FeedSource, getFeedsByTag } from "./feedSources";

const FEED_PER_SOURCE_CAP = 30;

const parser = new Parser();

export async function ingestFeed(source: FeedSource) {
  // this function gets the feed and stores it in mongodb
  const feed = await parser.parseURL(source.url);

  // normalise items
  const articles = feed.items
    .slice(0, FEED_PER_SOURCE_CAP) // make sure it doesn't go past the cap so it doesn't domunate
    .map((item) => normaliseItem(item, source.name, source.tags))
    .filter((a): a is Article => a !== null);

  if (articles.length === 0) {
    return { source: source.name, processed: 0, inserted: 0 };
  }

  // upsert each article (update if there, else insert)
  const ops = articles.map((article) => {
    const { fetchedAt, expiresAt, tags, ...rest } = article;

    return {
      updateOne: {
        filter: { url: article.url }, // find article w url
        update: {
          $set: rest,
          $setOnInsert: { fetchedAt, expiresAt }, // only updated first time
          $addToSet: { tags: { $each: tags } }, // no duplicate tags
        },
        upsert: true,
      },
    };
  });

  const result = await ArticleModel.bulkWrite(ops, { ordered: false });

  return {
    source: source.name,
    processed: articles.length,
    inserted: result.upsertedCount,
  };
}

export async function ingestAll() {
  await connectDB();
  await ArticleModel.init(); // wait for indexes and all to be built

  const sources = getFeedsByTag("world");

  const results = await Promise.allSettled(sources.map(ingestFeed)); // run in parallel

  return results.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    console.error(`Failed: ${sources[i].name}`, r.reason);
    return { source: sources[i].name, error: "failed" };
  });
}
