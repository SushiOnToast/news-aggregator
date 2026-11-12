import { Article } from "./types";

// list of common filler words that may be found in article titles
const STOP_WORDS = new Set(
  `
  a an the at in on of to for from by with and or but nor so yet
  is am are was were be been being has have had do does did
  will would shall should can could may might must
  this that these those it its he she they them their we us our
  i you your me my as if then than because while although
  about into over under between through during before after
  above below up down out off not no yes very just also only even
  there here where when what which who whom how why
  all any some many much more most other another each every both few
  such own same again once often however therefore thus further
  still already perhaps rather
`
    .trim()
    .split(/\s+/),
);
const ALIASES: Record<string, string> = {
  defence: "defense",
  israeli: "israel",
  ukrainian: "ukraine",
  russian: "russia",
  iranian: "iran",
  british: "britain",
  polish: "poland",
  italian: "italy",
  spanish: "spain",
  chinese: "china",
  palestinian: "palestine",
  german: "germany",
  french: "france",
  indian: "india",
};
const SUFFIXES = ["ing", "ed", "es", "s"];
const JACCARD_THRESHOLD = 0.3;
const MIN_SHARED_WORDS = 2;

export type Cluster = {
  main: Article;
  tokens: Set<string>;
  articles: Article[];
  sources: Set<string>;
};

function stem(word: string): string {
  if (word.length <= 4) return word;

  for (const suffix of SUFFIXES) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 3) {
      word = word.slice(0, -suffix.length);
      break;
    }
  }

  if (word.length > 4 && word.endsWith("e")) word = word.slice(0, -1);

  return word;
}

function tokenise(article: Article): Set<string> {
  const words = article.title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ") // anything that isn't a letter, number or space becomes a space
    .split(/\s+/)
    .map((w) => ALIASES[w] ?? w)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w))
    .map(stem);
  return new Set(words);
}

function similarity(a: Set<string>, b: Set<string>) {
  let shared = 0;
  for (const w of a) if (b.has(w)) shared++;
  const union = a.size + b.size - shared;
  return { score: union === 0 ? 0 : shared / union, shared };
}

function isSimilar(a: Set<string>, b: Set<string>, threshold: number): boolean {
  const { score, shared } = similarity(a, b);
  return shared >= MIN_SHARED_WORDS && score >= threshold;
}

export function clusterArticles(
  articles: Article[],
  threshold = JACCARD_THRESHOLD,
): Cluster[] {
  const clusters: Cluster[] = [];

  for (const article of articles) {
    const tokens = tokenise(article);
    const match = clusters.find((c) => isSimilar(tokens, c.tokens, threshold));

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
