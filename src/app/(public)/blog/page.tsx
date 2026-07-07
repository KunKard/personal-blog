import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/home/section-heading";
import { PostCard } from "@/components/blog/post-card";
import { getPublishedPosts } from "@/lib/db/posts";
import { generateSiteMetadata } from "@/lib/utils/metadata";
import type { Post } from "@/lib/types";

export const metadata = generateSiteMetadata({
  title: "博客",
  description: "分享游戏开发的技术心得与创作故事",
});

export default async function BlogPage() {
  let posts: Post[] = [];

  try {
    posts = await getPublishedPosts();
  } catch {
    // Data not available
  }

  return (
    <div className="pt-24 pb-16">
      <Container>
        <SectionHeading title="博客" subtitle="游戏开发中的思考、经验与故事" />

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
                  coverImage: post.cover_image_url,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📝</p>
            <p className="text-xl text-muted mb-2">暂无文章</p>
            <p className="text-sm text-muted">
              博客文章即将上线，敬请期待！
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
