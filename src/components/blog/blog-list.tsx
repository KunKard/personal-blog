"use client";

import { useState, useMemo } from "react";
import { PostCard } from "@/components/blog/post-card";
import type { Post } from "@/lib/types";

interface BlogListProps {
  posts: Post[];
}

export function BlogList({ posts }: BlogListProps) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter posts by search text and tag
  const filtered = useMemo(() => {
    let result = posts;

    // Filter by tag
    if (activeTag) {
      result = result.filter((p) => p.tags.includes(activeTag));
    }

    // Filter by search (fuzzy match on title)
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }

    return result;
  }, [posts, search, activeTag]);

  return (
    <div>
      {/* Search bar */}
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索文章标题..."
          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-foreground/30 transition-colors"
        />
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTag("")}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              !activeTag
                ? "bg-foreground text-background border-foreground"
                : "border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            全部
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                activeTag === tag
                  ? "bg-foreground text-background border-foreground"
                  : "border-border bg-surface text-muted hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

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
          <p className="text-sm text-muted">
            试试其他搜索词或标签
          </p>
        </div>
      )}
    </div>
  );
}
