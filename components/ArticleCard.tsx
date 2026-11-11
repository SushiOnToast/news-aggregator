import { Article } from "@/lib/types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { relativeTime } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </CardTitle>
        <CardDescription className="flex flex-col">
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
    </Card>
  );
};

export default ArticleCard;
