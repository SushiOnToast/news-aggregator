import { connectDB } from "./mongodb";
import { ArticleModel } from "./models/Article";
import { clusterArticles, rankArticles } from "./cluster";
import { Cluster } from "./cluster";
import { connection } from "next/server";

export async function getWorldArticles() {
  await connection();
  await connectDB();
  const articles = await ArticleModel.find({ tags: "world" }, null, {
    limit: 200,
    sort: { publishedAt: -1 }
  })
    .lean()
    .exec();

  const articleClusters: Cluster[] = clusterArticles(articles);
  const rankedClusters = rankArticles(articleClusters);

  return rankedClusters;
}
