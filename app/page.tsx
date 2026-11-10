import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { getWorldArticles } from "@/lib/queries";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { relativeTime } from "@/lib/utils";

async function ArticleList() {
  const worldArticles = await getWorldArticles();

  return (
    <>
      {worldArticles?.map((article, key) => (
        <Card className="max-w-sm" key={key}>
          <CardHeader>
            <CardTitle>
              <a href={article.url} target="_blank">
                {article.title}
              </a>
            </CardTitle>
            <CardDescription className="flex flex-col">
              <span>
                {relativeTime(new Date(article.publishedAt))}
              </span>
              <div>
                {article.tags.map((tag, key) => (
                  <Badge key={key}>{tag}</Badge>
                ))}
              </div>
            </CardDescription>
            <CardAction>
              <Badge variant="secondary">{article.source}</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="line-clamp-3">{article.summary}</CardContent>
        </Card>
      ))}
    </>
  );
}

export default async function Home() {

  return (
    <>
      <Suspense fallback={<Spinner/>}>
        <ArticleList/>
      </Suspense>
    </>
  );
}
