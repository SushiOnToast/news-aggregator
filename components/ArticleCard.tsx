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
import { relativeTime } from "@/lib/utils";
import { Cluster } from "@/lib/cluster";

interface ArticleCardProps {
  cluster: Cluster;
}

const ArticleCard = ({ cluster }: ArticleCardProps) => {
  const article: Article = cluster.main;
  const otherArticles: Article[] = cluster.articles.slice(1);
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </CardTitle>
        <CardDescription>
          <span>{relativeTime(new Date(article.publishedAt))}</span>
          {/* <div>
            {article.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div> */}
        </CardDescription>
        <CardAction>
          <Badge variant="secondary">{article.source}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="line-clamp-3">{article.summary}</CardContent>

      {otherArticles.length > 0 && (
        <CardFooter className="flex flex-col">
          <p>See similar stories covered here:</p>
          <div>
            {otherArticles.map((a) => (
              <a key={a.url} href={a.url} target="_blank" rel="noopener noreference">
                <Badge>{a.source}</Badge>
              </a>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ArticleCard;
