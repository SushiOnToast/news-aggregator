import { Article } from "./types";

// list of common filler words that may be found in article titles
const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "at",
  "in",
  "on",
  "of",
  "to",
  "for",
  "from",
  "by",
  "with",
  "and",
  "or",
  "but",
  "nor",
  "so",
  "yet",
  "is",
  "am",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "has",
  "have",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "shall",
  "should",
  "can",
  "could",
  "may",
  "might",
  "must",
  "this",
  "that",
  "these",
  "those",
  "it",
  "its",
  "he",
  "she",
  "they",
  "them",
  "their",
  "we",
  "us",
  "our",
  "i",
  "you",
  "your",
  "me",
  "my",
  "as",
  "if",
  "then",
  "than",
  "because",
  "while",
  "although",
  "about",
  "into",
  "over",
  "under",
  "between",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "up",
  "down",
  "out",
  "off",
  "not",
  "no",
  "yes",
  "very",
  "just",
  "also",
  "only",
  "even",
  "there",
  "here",
  "where",
  "when",
  "what",
  "which",
  "who",
  "whom",
  "how",
  "why",
  "all",
  "any",
  "some",
  "many",
  "much",
  "more",
  "most",
  "other",
  "another",
  "each",
  "every",
  "both",
  "few",
  "such",
  "own",
  "same",
  "again",
  "once",
  "often",
  "however",
  "therefore",
  "thus",
  "further",
  "still",
  "already",
  "perhaps",
  "rather",
]);
const JACCARD_THRESHOLD = 0.2;

export type Cluster = {
  main: Article;
  tokens: Set<string>;
  articles: Article[];
  sources: Set<string>;
};

function tokenise(article: Article): Set<string> {
  const words = article.title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ") // anything that isn't a letter, number or space becomes a space
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
  return new Set(words);
}

function jaccard(a: Set<string>, b: Set<string>): number {
  let shared = 0;
  for (const w of a) if (b.has(w)) shared++;
  const union = a.size + b.size - shared;
  return union === 0 ? 0 : shared / union; // guard: a title of only stop words
}

export function clusterArticles(
  articles: Article[],
  threshold = JACCARD_THRESHOLD,
): Cluster[] {
  const clusters: Cluster[] = [];

  for (const article of articles) {
    const tokens = tokenise(article);
    const match = clusters.find((c) => jaccard(tokens, c.tokens) >= threshold);

    if (match) {
      match.articles.push(article);
      match.sources.add(article.source);
    } else {
      clusters.push({
        main: article,
        tokens,
        articles: [article],
        sources: new Set([article.source]),
      });
    }
  }

  return clusters;
}

function compareClusters(a: Cluster, b: Cluster) {
  const result = b.sources.size - a.sources.size;

  if (result === 0) {
    const latestA = Math.max(
      ...a.articles.map((article) => new Date(article.publishedAt).getTime()),
    );

    const latestB = Math.max(
      ...b.articles.map((article) => new Date(article.publishedAt).getTime()),
    );

    return latestB - latestA;
  }

  return result;
}

export function rankArticles(clusters: Cluster[]) {
  const ranked: Cluster[] = clusters.sort(compareClusters);

  return ranked;
}
