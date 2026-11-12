import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ArticleModel } from "@/lib/models/Article";
import { clusterArticles } from "@/lib/cluster";
import { Article } from "@/lib/types";

export async function GET(req: Request) {
  const t = Number(new URL(req.url).searchParams.get("t") ?? 0.25);

  await connectDB();
  const articles = (await ArticleModel.find({ tags: "world" })
    .sort({ publishedAt: -1 })
    .limit(200)
    .lean()) as unknown as Article[];

  const clusters = clusterArticles(articles, t);
  const multi = clusters.filter((c) => c.sources.size >= 2);

  return NextResponse.json({
    threshold: t,
    totalClusters: clusters.length,
    multiSourceClusters: multi.length,
    biggestCluster: Math.max(...clusters.map((c) => c.articles.length)),
    groups: multi.map((c) => c.articles.map((a) => `${a.source}: ${a.title}`)),
  });
}