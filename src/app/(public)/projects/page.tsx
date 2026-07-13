import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/home/section-heading";
import { ProjectCard } from "@/components/projects/project-card";
import { getProjects } from "@/lib/db/projects";
import { generateSiteMetadata } from "@/lib/utils/metadata";

export const metadata = generateSiteMetadata({
  title: "作品集",
  description: "我的游戏作品和项目展示",
});

export default async function ProjectsPage() {
  let projects: Awaited<ReturnType<typeof getProjects>> = [];

  try {
    projects = await getProjects();
  } catch {
    // Supabase not configured yet
  }

  return (
    <div className="pt-24 pb-16">
      <Container>
        <SectionHeading title="作品集" />

        {projects.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🎮</p>
            <p className="text-xl text-muted mb-2">暂无作品</p>
            <p className="text-sm text-muted">
              正在努力开发中，敬请期待！
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
