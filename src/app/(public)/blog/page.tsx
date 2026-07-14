import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/home/section-heading";
import { BlogList } from "@/components/blog/blog-list";
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

        <BlogList posts={posts} />
      </Container>
    </div>
  );
}
