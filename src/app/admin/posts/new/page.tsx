"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import remarkBreaks from "remark-breaks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BLOG_CATEGORIES } from "@/lib/utils/constants";
import { slugify } from "@/lib/utils/formatters";
import { preprocessMarkdown } from "@/lib/utils/markdown";
import type { PostInsert } from "@/lib/types";

// Dynamically import MDEditor to avoid SSR issues (it needs browser APIs)
import "@uiw/react-md-editor/markdown-editor.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

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
    visibility: "public",
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

    // Validate title is not empty
    if (!form.title.trim()) {
      alert("请输入文章标题");
      return;
    }

    // Auto-generate slug from title if empty
    const slug = form.slug || slugify(form.title);
    if (!slug) {
      alert("无法生成 URL slug，请手动输入");
      return;
    }

    setSaving(true);
    const body = { ...form, slug, status };
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
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-8">新建文章</h1>

      <form className="space-y-6">
        <div>
          <label className="block text-sm text-muted mb-1">标题</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-foreground/30 transition-colors"
            placeholder="文章标题"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => updateField("slug", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-foreground/30 transition-colors"
            placeholder="url-friendly-slug"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">摘要</label>
          <textarea
            value={form.excerpt || ""}
            onChange={(e) => updateField("excerpt", e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-foreground/30 transition-colors resize-none"
            placeholder="简短描述..."
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">分类</label>
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-foreground/30 transition-colors"
            >
              {BLOG_CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">可见性</label>
            <select
              value={form.visibility}
              onChange={(e) => updateField("visibility", e.target.value as "public" | "private")}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-foreground/30 transition-colors"
            >
              <option value="public">🌐 公开</option>
              <option value="private">🔒 私密</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">封面图片 URL</label>
            <input
              type="text"
              value={form.cover_image_url || ""}
              onChange={(e) => updateField("cover_image_url", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-foreground/30 transition-colors"
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
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-foreground/30 transition-colors"
              placeholder="输入标签后按回车"
            />
            <Button type="button" variant="outline" size="sm" onClick={addTag}>
              添加
            </Button>
          </div>
        </div>

        {/* Markdown Rich Editor */}
        <div>
          <label className="block text-sm text-muted mb-2">内容</label>
          <div data-color-mode="light">
            <MDEditor
              value={preprocessMarkdown(form.content)}
              onChange={(val) => updateField("content", val || "")}
              height={500}
              preview="live"
              visibleDragbar={true}
              hideToolbar={false}
              previewOptions={{
                remarkPlugins: [[remarkBreaks]],
              }}
              textareaProps={{
                placeholder: "在此编写文章内容...\n\n使用工具栏进行格式化：**加粗**、*斜体*、# 标题、代码块、列表等",
              }}
            />
          </div>
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
