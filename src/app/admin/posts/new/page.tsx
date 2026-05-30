"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BLOG_CATEGORIES } from "@/lib/utils/constants";
import { slugify } from "@/lib/utils/formatters";
import type { PostInsert } from "@/lib/types";

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PostInsert>({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    cover_image_url: "",
    category: "devlog",
    tags: [],
    status: "draft",
    reading_time: null,
    published_at: null,
  });
  const [tagInput, setTagInput] = useState("");

  function updateField<K extends keyof PostInsert>(key: K, value: PostInsert[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !prev.slug) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }

  async function handleSubmit(e: React.FormEvent, status: PostInsert["status"]) {
    e.preventDefault();
    setSaving(true);
    const body = { ...form, status };
    if (status === "published" && !form.published_at) {
      body.published_at = new Date().toISOString();
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/admin/posts");
      router.refresh();
    } else {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-8">新建文章</h1>

      <form className="space-y-6">
        <div>
          <label className="block text-sm text-muted mb-1">标题</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            placeholder="文章标题"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => updateField("slug", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            placeholder="url-friendly-slug"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">摘要</label>
          <textarea
            value={form.excerpt || ""}
            onChange={(e) => updateField("excerpt", e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
            placeholder="简短描述..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">分类</label>
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            >
              {BLOG_CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">封面图片 URL</label>
            <input
              type="text"
              value={form.cover_image_url || ""}
              onChange={(e) => updateField("cover_image_url", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">标签</label>
          <div className="flex gap-2 mb-2">
            {form.tags.map((tag) => (
              <Badge key={tag} variant="primary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                {tag} ×
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              placeholder="输入标签后按回车"
            />
            <Button type="button" variant="outline" size="sm" onClick={addTag}>
              添加
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">内容 (Markdown)</label>
          <textarea
            value={form.content}
            onChange={(e) => updateField("content", e.target.value)}
            rows={16}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary font-mono resize-y"
            placeholder="在此编写 Markdown 内容..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" onClick={(e) => handleSubmit(e, "draft")} variant="outline" disabled={saving}>
            保存草稿
          </Button>
          <Button type="button" onClick={(e) => handleSubmit(e, "published")} disabled={saving}>
            {saving ? "发布中..." : "发布"}
          </Button>
        </div>
      </form>
    </div>
  );
}
