import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/home/section-heading";
import { PostCard } from "@/components/blog/post-card";
import { getPostsByCategory, getPublishedPosts } from "@/lib/db/posts";
import { generateSiteMetadata } from "@/lib/utils/metadata";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts();
    const categories = [...new Set(posts.map((p) => p.category))];
    if (categories.length === 0) return [{ category: "placeholder" }];
    return categories.map((category) => ({ category }));
  } catch {
    return [{ category: "placeholder" }];
  }
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
  let posts: Awaited<ReturnType<typeof getPostsByCategory>> = [];

  try {
    posts = await getPostsByCategory(category);
  } catch {
    // Data not available
  }

  return (
    <div className="pt-24 pb-16">
      <Container>
        <SectionHeading title={`分类: ${category}`} subtitle={`共 ${posts.length} 篇文章`} />

        {posts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.slug}
                post={{
                  slug: post.slug,
                  title: post.title,
                  excerpt: post.excerpt,
                  category: post.category,
                  tags: post.tags,
                  publishedAt: post.published_at,
                  readingTime: post.reading_time,
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
