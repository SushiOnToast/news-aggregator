export type FeedSource = {
  id: string;
  name: string;
  url: string;
  tags: string[];
  region?: string;
};

export const FEED_SOURCES: FeedSource[] = [
  {
    id: "bbc-world",
    name: "BBC News",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    tags: ["world"],
    region: "UK",
  },
  {
    id: "guardian-world",
    name: "The Guardian",
    url: "https://www.theguardian.com/world/rss",
    tags: ["world"],
    region: "UK",
  },
  {
    id: "aljazeera-all",
    name: "Al Jazeera",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    tags: ["world"],
    region: "Middle East",
  },
  {
    id: "npr-world",
    name: "NPR",
    url: "https://feeds.npr.org/1004/rss.xml",
    tags: ["world"],
    region: "US",
  },
  {
    id: "dw-all",
    name: "Deutsche Welle",
    url: "https://rss.dw.com/rdf/rss-en-all",
    tags: ["world"],
    region: "Europe",
  },
];

export function getFeedsByTag(tag: string): FeedSource[] {
  return FEED_SOURCES.filter((feed) => feed.tags.includes(tag));
}
