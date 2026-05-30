import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/formatters";

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string | null;
    category: string;
    tags?: string[];
    publishedAt?: string | null;
    readingTime?: number | null;
    coverImage?: string | null;
  };
}

export function PostCard({ post }: PostCardProps) {
  const displayDate = post.publishedAt ?? null;

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="h-full group">
        {post.coverImage && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <CardContent className={post.coverImage ? "pt-4" : "pt-6"}>
          <div className="flex items-center gap-2 text-xs text-muted mb-2">
            {displayDate && <span>{formatDate(displayDate)}</span>}
            {post.readingTime && (
              <>
                <span>·</span>
                <span>{post.readingTime} min read</span>
              </>
            )}
          </div>
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm text-muted line-clamp-2 mb-3">{post.excerpt}</p>
          )}
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="primary">{post.category}</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
