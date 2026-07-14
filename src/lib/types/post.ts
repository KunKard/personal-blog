export type PostStatus = "draft" | "published";
export type PostVisibility = "public" | "private";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string;
  tags: string[];
  status: PostStatus;
  visibility: PostVisibility;
  reading_time: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type PostInsert = Omit<Post, "id" | "created_at" | "updated_at">;
export type PostUpdate = Partial<PostInsert>;
