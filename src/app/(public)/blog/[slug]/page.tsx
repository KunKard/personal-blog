import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { MDXRenderer } from "@/components/blog/mdx-renderer";
import { generateSiteMetadata } from "@/lib/utils/metadata";
import { formatDate } from "@/lib/utils/formatters";
import { posts } from "#site/content";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return posts
    .filter((p) => !p.draft)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug && !p.draft);

  if (!post) {
    return generateSiteMetadata({ title: "文章未找到" });
  }

  return generateSiteMetadata({
    title: post.title,
    description: post.excerpt || post.title,
    type: "article",
    publishedAt: post.publishedAt || undefined,
    tags: post.tags,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug && !p.draft);

  if (!post) notFound();

  return (
    <div className="pt-24 pb-16">
      <Container>
        <article className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted mb-4">
              {post.category && <Badge variant="primary">{post.category}</Badge>}
              {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
              {post.readingTime && (
                <>
                  <span>·</span>
                  <span>{post.readingTime} min read</span>
                </>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{post.title}</h1>
            {post.excerpt && (
              <p className="text-lg text-muted">{post.excerpt}</p>
            )}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            )}
          </header>

          {/* Content */}
          <div className="prose max-w-none">
            <MDXRenderer code={post.code} />
          </div>
        </article>
      </Container>
    </div>
  );
}
