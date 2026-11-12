import { getWorldArticles } from "@/lib/queries";
import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import ClusterCard from "@/components/ClusterCard";
import { Flame, Newspaper } from "lucide-react";

async function ArticleList() {
  const worldArticles = await getWorldArticles();
  const topArticles = worldArticles.filter((c) => c.sources.size >= 2);
  const otherArticles = worldArticles.filter((c) => c.sources.size < 2);

  return (
    <div className="space-y-12">
      {topArticles.length > 0 && (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <Flame className="size-5 text-primary" />
            Top Stories
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {topArticles.map((cluster) => (
              <ClusterCard cluster={cluster} key={cluster.main.url} top />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <Newspaper className="size-5 text-muted-foreground" />
          Read More News
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {otherArticles.map((cluster) => (
            <ClusterCard cluster={cluster} key={cluster.main.url} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default async function Home() {
  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">World News</h1>
        <p className="text-muted-foreground">
          The stories that matter, ranked by how many outlets are covering them.
        </p>
      </header>
      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        }
      >
        <ArticleList />
      </Suspense>
    </main>
  );
}
