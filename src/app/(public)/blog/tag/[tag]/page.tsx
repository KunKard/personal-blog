import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/home/section-heading";
import { PostCard } from "@/components/blog/post-card";
import { generateSiteMetadata } from "@/lib/utils/metadata";
import { posts } from "#site/content";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  const allTags = [...new Set(posts.filter((p) => !p.draft).flatMap((p) => p.tags))];
  return allTags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return generateSiteMetadata({
    title: `标签: ${tag}`,
    description: `浏览标签为 "${tag}" 的所有文章`,
  });
}

export default async function BlogTagPage({ params }: Props) {
  const { tag } = await params;
  const tagPosts = posts
    .filter((p) => !p.draft && p.tags.includes(tag))
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? 0).getTime() -
        new Date(a.publishedAt ?? 0).getTime()
    );

  return (
    <div className="pt-24 pb-16">
      <Container>
        <SectionHeading title={`标签: ${tag}`} subtitle={`共 ${tagPosts.length} 篇文章`} />

        {tagPosts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tagPosts.map((post) => (
              <PostCard
                key={post.slug}
                post={{
                  slug: post.slug,
                  title: post.title,
                  excerpt: post.excerpt ?? null,
                  category: post.category,
                  tags: post.tags,
                  publishedAt: post.publishedAt ?? null,
                  readingTime: post.readingTime ?? null,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🏷️</p>
            <p className="text-muted">该标签下暂无文章</p>
          </div>
        )}
      </Container>
    </div>
  );
}
