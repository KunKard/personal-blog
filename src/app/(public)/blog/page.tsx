import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/home/section-heading";
import { PostCard } from "@/components/blog/post-card";
import { generateSiteMetadata } from "@/lib/utils/metadata";
import { posts } from "#site/content";

export const metadata = generateSiteMetadata({
  title: "博客",
  description: "分享游戏开发的技术心得与创作故事",
});

export default function BlogPage() {
  const publishedPosts = posts
    .filter((p) => !p.draft)
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? 0).getTime() -
        new Date(a.publishedAt ?? 0).getTime()
    );

  return (
    <div className="pt-24 pb-16">
      <Container>
        <SectionHeading title="博客" subtitle="游戏开发中的思考、经验与故事" />

        {publishedPosts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedPosts.map((post) => (
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
                  coverImage: null, // Velite uses coverImage
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
