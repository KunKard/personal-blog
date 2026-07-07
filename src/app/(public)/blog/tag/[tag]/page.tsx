import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/home/section-heading";
import { PostCard } from "@/components/blog/post-card";
import { getPublishedPosts } from "@/lib/db/posts";
import { generateSiteMetadata } from "@/lib/utils/metadata";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts();
    const allTags = [...new Set(posts.flatMap((p) => p.tags))];
    if (allTags.length === 0) return [{ tag: "placeholder" }];
    return allTags.map((tag) => ({ tag }));
  } catch {
    return [{ tag: "placeholder" }];
  }
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

  let allPosts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  try {
    allPosts = await getPublishedPosts();
  } catch {
    // Data not available
  }

  const tagPosts = allPosts.filter((p) => p.tags.includes(tag));

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
            <p className="text-5xl mb-4">🏷️</p>
            <p className="text-muted">该标签下暂无文章</p>
          </div>
        )}
      </Container>
    </div>
  );
}
