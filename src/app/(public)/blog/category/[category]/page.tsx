import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/home/section-heading";
import { PostCard } from "@/components/blog/post-card";
import { generateSiteMetadata } from "@/lib/utils/metadata";
import { posts } from "#site/content";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  const categories = [...new Set(posts.filter((p) => !p.draft).map((p) => p.category))];
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return generateSiteMetadata({
    title: `分类: ${category}`,
    description: `浏览 ${category} 分类下的所有文章`,
  });
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category } = await params;
  const categoryPosts = posts
    .filter((p) => !p.draft && p.category === category)
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? 0).getTime() -
        new Date(a.publishedAt ?? 0).getTime()
    );

  return (
    <div className="pt-24 pb-16">
      <Container>
        <SectionHeading title={`分类: ${category}`} subtitle={`共 ${categoryPosts.length} 篇文章`} />

        {categoryPosts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryPosts.map((post) => (
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
            <p className="text-muted">该分类下暂无文章</p>
          </div>
        )}
      </Container>
    </div>
  );
}
