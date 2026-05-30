import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <Card className="h-full group">
        <div className="aspect-video bg-surface flex items-center justify-center overflow-hidden">
          {project.cover_image_url ? (
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <span className="text-4xl">🎮</span>
          )}
        </div>
        <CardContent className="pt-4">
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted line-clamp-2 mb-3">
            {project.tagline || project.description || "暂无简介"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="primary">{tag}</Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge>+{project.tags.length - 3}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
