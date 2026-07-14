import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { ProjectLinks } from "@/components/projects/project-links";
import { getProjectBySlug, getProjects } from "@/lib/db/projects";
import { generateSiteMetadata } from "@/lib/utils/metadata";
import { formatDate } from "@/lib/utils/formatters";
import { assetPath } from "@/lib/utils/asset-path";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    if (projects.length === 0) return [{ slug: "placeholder" }];
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [{ slug: "placeholder" }];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let project;
  try {
    project = await getProjectBySlug(slug);
  } catch { /* ignore */ }

  if (!project) {
    return generateSiteMetadata({ title: "项目未找到" });
  }

  return generateSiteMetadata({
    title: project.title,
    description: project.tagline || project.title,
    image: project.cover_image_url || undefined,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  let project;
  try {
    project = await getProjectBySlug(slug);
  } catch {
    project = null;
  }

  if (!project) notFound();

  return (
    <div className="pt-24 pb-16">
      <Container>
        {/* Hero */}
        <div className="mb-12 max-w-3xl">
          <div className="aspect-video bg-surface rounded-lg border border-border flex items-center justify-center mb-8 overflow-hidden">
            {project.cover_image_url ? (
              <img
                src={assetPath(project.cover_image_url)}
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl">🎮</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="primary">{tag}</Badge>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{project.title}</h1>
          {project.tagline && (
            <p className="text-lg text-muted">{project.tagline}</p>
          )}
        </div>

        {/* Steam-style layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {project.description && (
              <section>
                <h2 className="text-xl font-bold mb-3">关于此游戏</h2>
                <div className="prose text-muted leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </div>
              </section>
            )}

            {/* Screenshots */}
            {project.screenshots.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">游戏截图</h2>
                <div className="grid grid-cols-2 gap-3">
                  {project.screenshots.map((shot, i) => (
                    <div
                      key={i}
                      className="aspect-video bg-surface rounded border border-border flex items-center justify-center overflow-hidden"
                    >
                      <img src={shot.url} alt={shot.caption || `Screenshot ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Postmortem */}
            {project.postmortem && (
              <section>
                <h2 className="text-xl font-bold mb-3">项目复盘</h2>
                <div className="prose text-muted whitespace-pre-wrap">
                  {project.postmortem}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
              <h3 className="font-bold text-lg">项目信息</h3>

              {project.dev_duration && (
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide">开发时长</p>
                  <p className="text-sm">{project.dev_duration}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-muted uppercase tracking-wide">团队人数</p>
                <p className="text-sm">{project.team_size} 人</p>
              </div>

              {project.my_role && (
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide">我的职责</p>
                  <p className="text-sm">{project.my_role}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-muted uppercase tracking-wide">技术栈</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {project.tech_stack.map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted uppercase tracking-wide">发布日期</p>
                <p className="text-sm">{formatDate(project.created_at)}</p>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-3">
              {project.webgl_game_slug && (
                <a
                  href={`/games/${project.webgl_game_slug}`}
                  className="block w-full text-center px-4 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors text-sm font-medium"
                >
                  在线试玩
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-3 border border-border rounded-lg hover:bg-surface transition-colors text-sm"
                >
                  GitHub 仓库
                </a>
              )}
              {project.download_links.length > 0 && (
                <ProjectLinks links={project.download_links} />
              )}
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
