/** Unified blog post interface used across Velite and Supabase sources */
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  tags: string[];
  publishedAt: string | null;
  readingTime: number | null;
  coverImage?: string | null;
}
