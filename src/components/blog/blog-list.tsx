"use client";

import { useState, useMemo } from "react";
import { PostCard } from "@/components/blog/post-card";
import type { Post } from "@/lib/types";

interface BlogListProps {
  posts: Post[];
}

export function BlogList({ posts }: BlogListProps) {
  const [search, setSearch] = useState("");

  // Filter posts: search matches title or tags
  const filtered = useMemo(() => {
    if (!search.trim()) return posts;

    const q = search.trim().toLowerCase();
    return posts.filter((p) => {
      // Search title
      if (p.title.toLowerCase().includes(q)) return true;
      // Search tags
      if (p.tags.some((t) => t.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [posts, search]);

  return (
    <div>
      {/* Search bar */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索文章标题或标签..."
          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-foreground/30 transition-colors"
        />
      </div>

      {/* Post cards */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
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
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl text-muted mb-2">没有找到匹配的文章</p>
          <p className="text-sm text-muted">试试其他关键词</p>
        </div>
      )}
    </div>
  );
}
