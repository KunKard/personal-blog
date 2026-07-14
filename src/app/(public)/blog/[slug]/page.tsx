import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { getPostBySlug, getPublishedPosts } from "@/lib/db/posts";
import { generateSiteMetadata } from "@/lib/utils/metadata";
import { formatDate } from "@/lib/utils/formatters";
import { assetPath } from "@/lib/utils/asset-path";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts();
    if (posts.length === 0) return [{ slug: "placeholder" }];
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [{ slug: "placeholder" }];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let post;
  try {
    post = await getPostBySlug(slug);
  } catch { /* ignore */ }

  if (!post) {
    return generateSiteMetadata({ title: "文章未找到" });
  }

  return generateSiteMetadata({
    title: post.title,
    description: post.excerpt || post.title,
    image: post.cover_image_url || undefined,
    type: "article",
    publishedAt: post.published_at || undefined,
    updatedAt: post.updated_at,
    tags: post.tags,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    post = null;
  }

  if (!post) notFound();

  return (
    <div className="pt-24 pb-16">
      <Container className="max-w-none px-0">
        <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            {post.cover_image_url && (
              <div className="aspect-video bg-surface rounded-lg border border-border overflow-hidden mb-6">
                <img
                  src={assetPath(post.cover_image_url)}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted mb-4">
              {post.category && <Badge variant="primary">{post.category}</Badge>}
              {post.published_at && <span>{formatDate(post.published_at)}</span>}
              {post.reading_time && (
                <>
                  <span>·</span>
                  <span>{post.reading_time} min read</span>
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

          {/* Rendered Markdown Content */}
          <div className="prose max-w-none">
            <MarkdownContent content={post.content} />
          </div>
        </article>
      </Container>
    </div>
  );
}
