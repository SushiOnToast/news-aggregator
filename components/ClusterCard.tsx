import { Article } from "@/lib/types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { cn, relativeTime } from "@/lib/utils";
import { Cluster } from "@/lib/cluster";
import { Clock, Flame } from "lucide-react";

interface ClusterCardProps {
  cluster: Cluster;
  top?: boolean; // featured styling for stories covered by 2+ outlets
}

const ClusterCard = ({ cluster, top = false }: ClusterCardProps) => {
  const article: Article = cluster.main;
  const seen = new Set([cluster.main.source]);
  const otherArticles = cluster.articles.slice(1).filter((a) => {
    if (seen.has(a.source)) return false;
    seen.add(a.source);
    return true;
  });

  return (
    <Card
      className={cn(
        "w-full transition-shadow hover:shadow-md",
        top && "border-l-4 border-l-primary bg-primary/5",
      )}
    >
      <CardHeader>
        <CardTitle
          className={cn(
            "leading-snug",
            top ? "text-xl font-bold" : "text-base font-semibold",
          )}
        >
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {article.title}
          </a>
        </CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {relativeTime(new Date(article.publishedAt))}
          </span>
        </CardDescription>
        <CardAction>
          <Badge variant="secondary">{article.source}</Badge>
        </CardAction>
      </CardHeader>

      <CardContent
        className={cn(
          "text-sm text-muted-foreground",
          top ? "line-clamp-4" : "line-clamp-3",
        )}
      >
        {article.summary}
      </CardContent>

      {otherArticles.length > 0 && (
        <CardFooter className="flex flex-col items-start gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Also covered by
          </p>
          <div className="flex flex-wrap gap-1.5">
            {otherArticles.map((a) => (
              <a
                key={a.url}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge variant="outline" className="hover:bg-accent">
                  {a.source}
                </Badge>
              </a>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ClusterCard;
