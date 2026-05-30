"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PROJECT_CATEGORIES } from "@/lib/utils/constants";
import { slugify } from "@/lib/utils/formatters";
import type { ProjectInsert } from "@/lib/types";

export default function NewProjectPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProjectInsert>({
    slug: "",
    title: "",
    tagline: "",
    description: "",
    cover_image_url: "",
    screenshots: [],
    video_url: "",
    webgl_game_slug: "",
    download_links: [],
    tech_stack: [],
    category: "game",
    tags: [],
    status: "draft",
    dev_duration: "",
    team_size: 1,
    my_role: "",
    postmortem: "",
    github_url: "",
    featured: false,
    sort_order: 0,
  });
  const [tagInput, setTagInput] = useState("");
  const [techInput, setTechInput] = useState("");

  function updateField<K extends keyof ProjectInsert>(key: K, value: ProjectInsert[K]) {
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

  function addTech() {
    const tech = techInput.trim();
    if (tech && !form.tech_stack.includes(tech)) {
      setForm((prev) => ({ ...prev, tech_stack: [...prev.tech_stack, tech] }));
      setTechInput("");
    }
  }

  async function handleSubmit(e: React.FormEvent, status: ProjectInsert["status"]) {
    e.preventDefault();
    setSaving(true);
    const body = { ...form, status };

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/admin/projects");
      router.refresh();
    } else {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-8">新建作品</h1>

      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">标题</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              placeholder="作品名称"
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
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">一句话介绍</label>
          <input
            type="text"
            value={form.tagline || ""}
            onChange={(e) => updateField("tagline", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            placeholder="简短的一句话描述"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">详细描述 (Markdown)</label>
          <textarea
            value={form.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            rows={6}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary font-mono resize-y"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">分类</label>
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value as ProjectInsert["category"])}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            >
              {PROJECT_CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">开发时长</label>
            <input
              type="text"
              value={form.dev_duration || ""}
              onChange={(e) => updateField("dev_duration", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              placeholder="如: 3个月"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">技术栈</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {form.tech_stack.map((tech) => (
              <Badge key={tech} variant="primary" className="cursor-pointer" onClick={() => updateField("tech_stack", form.tech_stack.filter((t) => t !== tech))}>
                {tech} ×
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              placeholder="输入技术栈后按回车"
            />
            <Button type="button" variant="outline" size="sm" onClick={addTech}>添加</Button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">标签</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {form.tags.map((tag) => (
              <Badge key={tag} variant="accent" className="cursor-pointer" onClick={() => updateField("tags", form.tags.filter((t) => t !== tag))}>
                {tag} ×
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm" placeholder="输入标签"/>
            <Button type="button" variant="outline" size="sm" onClick={addTag}>添加</Button>
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
