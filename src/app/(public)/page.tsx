import { HeroSection } from "@/components/home/hero-section";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/home/section-heading";
import { ProjectCard } from "@/components/projects/project-card";
import { PostCard } from "@/components/blog/post-card";
import { getFeaturedProjects } from "@/lib/db/projects";
import { getPublishedPosts } from "@/lib/db/posts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/storage/site-settings";

export default async function HomePage() {
  let featuredProjects: Awaited<ReturnType<typeof getFeaturedProjects>> = [];
  let latestPosts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  let siteSettings;

  try {
    [featuredProjects, latestPosts] = await Promise.all([
      getFeaturedProjects(),
      getPublishedPosts(),
    ]);
    siteSettings = getSiteSettings();
  } catch {
    // Data not available yet
  }

  const recentPosts = latestPosts.slice(0, 3);
  const currentProject = siteSettings?.current_project;

  return (
    <>
      <HeroSection />

      {/* Featured Projects */}
      <section className="py-24">
        <Container>
          <SectionHeading
            title="游戏作品"
            subtitle="每一个作品都是一段旅程"
          />
          {featuredProjects.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface rounded-lg border border-border">
              <p className="text-4xl mb-4">🎮</p>
              <p className="text-muted mb-4">作品集正在搭建中...</p>
              <p className="text-sm text-muted">
                连接 Supabase 数据库后将在此展示游戏作品
              </p>
            </div>
          )}
          {featuredProjects.length > 0 && (
            <div className="text-center mt-8">
              <Link href="/projects">
                <Button variant="outline">查看全部作品</Button>
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* Latest Posts */}
      <section className="py-24 bg-surface/30">
        <Container>
          <SectionHeading
            title="最新博客"
            subtitle="分享游戏开发中的思考与经验"
          />
          {recentPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
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
            <div className="text-center py-16 bg-surface rounded-lg border border-border">
              <p className="text-4xl mb-4">📝</p>
              <p className="text-muted mb-4">博客文章即将上线...</p>
              <p className="text-sm text-muted">
                我会在这里分享游戏开发的技术心得和创作故事
              </p>
            </div>
          )}
          {recentPosts.length > 0 && (
            <div className="text-center mt-8">
              <Link href="/blog">
                <Button variant="outline">阅读更多文章</Button>
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* Current Project */}
      {currentProject && (
        <section className="py-24">
          <Container>
            <SectionHeading
              title="正在开发"
              subtitle="目前正在全力开发中的项目"
            />
            <div className="max-w-2xl mx-auto text-center">
              <div className="border-2 border-border rounded-lg p-8 bg-surface">
                <div className="text-5xl mb-4">{currentProject.icon}</div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">
                  {currentProject.title}
                </h3>
                <p className="text-muted mb-4 whitespace-pre-line">
                  {currentProject.description}
                </p>
                {currentProject.tags.length > 0 && (
                  <div className="flex justify-center gap-2">
                    {currentProject.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-surface-hover text-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
