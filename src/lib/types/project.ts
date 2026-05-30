export type ProjectCategory = "game" | "jam" | "tool" | "demo" | "other";
export type ProjectStatus = "draft" | "published" | "archived";

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  cover_image_url: string | null;
  screenshots: { url: string; caption?: string }[];
  video_url: string | null;
  webgl_game_slug: string | null;
  download_links: { label: string; url: string }[];
  tech_stack: string[];
  category: ProjectCategory;
  tags: string[];
  status: ProjectStatus;
  dev_duration: string | null;
  team_size: number;
  my_role: string | null;
  postmortem: string | null;
  github_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ProjectInsert = Omit<Project, "id" | "created_at" | "updated_at">;
export type ProjectUpdate = Partial<ProjectInsert>;
