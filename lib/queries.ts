import { connectDB } from "./mongodb";
import { ArticleModel } from "./models/Article";

export async function getWorldArticles() {
  await connectDB();
  const articles = await ArticleModel.find({ tags: "world" }, null, {
    limit: 50,
    sort: { publishedAt: -1 }
  })
    .lean()
    .exec();

  return articles;
}
