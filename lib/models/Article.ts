import mongoose, { Schema, Model } from "mongoose";
import { Article } from "../types";

const articleSchema = new Schema<Article>({
  url: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  summary: { type: String, default: "" },
  source: { type: String, required: true },
  author: { type: String },
  publishedAt: { type: Date, required: true },
  fetchedAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
  tags: { type: [String], default: [] },
});

articleSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ArticleModel: Model<Article> =
  mongoose.models.Article || mongoose.model<Article>("Article", articleSchema);
