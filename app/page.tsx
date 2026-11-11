import { getWorldArticles } from "@/lib/queries";
import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import ArticleCard from "@/components/ArticleCard";

async function ArticleList() {
  const worldArticles = await getWorldArticles();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {worldArticles.map((article) => (
        <ArticleCard article={article} key={article.url} />
      ))}
    </div>
  );
}

export default async function Home() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1>World News</h1>
      <Suspense fallback={<Spinner />}>
        <ArticleList />
      </Suspense>
    </main>
  );
}
