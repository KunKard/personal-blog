"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import remarkBreaks from "remark-breaks";
import { BLOG_CATEGORIES } from "@/lib/utils/constants";
import { preprocessMarkdown } from "@/lib/utils/markdown";
import type { Post, PostUpdate } from "@/lib/types";

import "@uiw/react-md-editor/markdown-editor.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PostUpdate>({});
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((res) => res.json())
      .then((data: Post) => {
        setForm(data);
        setTags(data.tags || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  function updateField<K extends keyof PostUpdate>(key: K, value: PostUpdate[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
      setTagInput("");
    }
  }
  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent, status: PostUpdate["status"]) {
    e.preventDefault();
    setSaving(true);
    const body: PostUpdate = { ...form, tags, status };
    await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.push("/admin/posts");
    router.refresh();
  }

  if (loading) return <div className="text-muted">Loading...</div>;

  const post = form as Post;

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-8">编辑文章</h1>

      <form className="space-y-6">
        <div>
          <label className="block text-sm text-muted mb-1">标题</label>
          <input
            type="text"
            value={post.title || ""}
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-foreground/30 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">摘要</label>
          <textarea
            value={post.excerpt || ""}
            onChange={(e) => updateField("excerpt", e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-foreground/30 transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">分类</label>
            <select
              value={post.category}
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
              value={post.visibility || "public"}
              onChange={(e) => updateField("visibility", e.target.value as "public" | "private")}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-foreground/30 transition-colors"
            >
              <option value="public">🌐 公开</option>
              <option value="private">🔒 私密</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">标签</label>
          <div className="flex gap-2 mb-2">
            {tags.map((tag) => (
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
            <Button type="button" variant="outline" size="sm" onClick={addTag}>添加</Button>
          </div>
        </div>

        {/* Markdown Rich Editor */}
        <div>
          <label className="block text-sm text-muted mb-2">内容</label>
          <div data-color-mode="light">
            <MDEditor
              value={preprocessMarkdown(post.content || "")}
              onChange={(val) => updateField("content", val || "")}
              height={500}
              preview="live"
              visibleDragbar={true}
              hideToolbar={false}
              previewOptions={{
                remarkPlugins: [[remarkBreaks]],
              }}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" onClick={(e) => handleSubmit(e, "draft")} variant="outline" disabled={saving}>
            保存草稿
          </Button>
          <Button type="button" onClick={(e) => handleSubmit(e, "published")} disabled={saving}>
            {saving ? "保存中..." : "更新并发布"}
          </Button>
        </div>
      </form>
    </div>
  );
}
