"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PROJECT_CATEGORIES } from "@/lib/utils/constants";
import { slugify } from "@/lib/utils/formatters";
import type { ProjectInsert } from "@/lib/types";

interface DownloadLink {
  label: string;
  url: string;
}

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
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

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

  function addLink() {
    if (linkLabel.trim() && linkUrl.trim()) {
      setForm((prev) => ({
        ...prev,
        download_links: [...prev.download_links, { label: linkLabel.trim(), url: linkUrl.trim() }],
      }));
      setLinkLabel("");
      setLinkUrl("");
    }
  }

  function removeLink(index: number) {
    setForm((prev) => ({
      ...prev,
      download_links: prev.download_links.filter((_, i) => i !== index),
    }));
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
        {/* Title + Slug */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">标题</label>
            <input type="text" value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="作品名称" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Slug</label>
            <input type="text" value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="url-friendly-slug" />
          </div>
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-sm text-muted mb-1">一句话介绍</label>
          <input type="text" value={form.tagline || ""}
            onChange={(e) => updateField("tagline", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="简短的一句话描述" />
        </div>

        {/* Cover Image + GitHub URL */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">封面图片 URL</label>
            <input type="text" value={form.cover_image_url || ""}
              onChange={(e) => updateField("cover_image_url", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="/images/game-cover.jpg" />
            {form.cover_image_url && (
              <img src={form.cover_image_url} alt="preview" className="mt-2 w-full h-32 object-cover rounded border border-border" />
            )}
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">GitHub 仓库 URL</label>
            <input type="text" value={form.github_url || ""}
              onChange={(e) => updateField("github_url", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="https://github.com/..." />
          </div>
        </div>

        {/* Category + Dev Duration + Team Size */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">分类</label>
            <select value={form.category}
              onChange={(e) => updateField("category", e.target.value as ProjectInsert["category"])}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary">
              {PROJECT_CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">开发时长</label>
            <input type="text" value={form.dev_duration || ""}
              onChange={(e) => updateField("dev_duration", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="如: 4 天" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">团队人数</label>
            <input type="number" value={form.team_size}
              onChange={(e) => updateField("team_size", parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
        </div>

        {/* My Role */}
        <div>
          <label className="block text-sm text-muted mb-1">我的职责</label>
          <input type="text" value={form.my_role || ""}
            onChange={(e) => updateField("my_role", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="如：开发者、程序、美术" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-muted mb-1">详细描述 (Markdown)</label>
          <textarea value={form.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            rows={6}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary font-mono resize-y" />
        </div>

        {/* Postmortem */}
        <div>
          <label className="block text-sm text-muted mb-1">项目复盘 (Markdown)</label>
          <textarea value={form.postmortem || ""}
            onChange={(e) => updateField("postmortem", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary font-mono resize-y" placeholder="项目结束后总结的经验教训..." />
        </div>

        {/* Tech Stack */}
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
            <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="输入技术栈后按回车" />
            <Button type="button" variant="outline" size="sm" onClick={addTech}>添加</Button>
          </div>
        </div>

        {/* Tags */}
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
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm" placeholder="输入标签后按回车" />
            <Button type="button" variant="outline" size="sm" onClick={addTag}>添加</Button>
          </div>
        </div>

        {/* Download Links */}
        <div>
          <label className="block text-sm text-muted mb-1">下载链接</label>
          {form.download_links.length > 0 && (
            <div className="mb-2 space-y-1">
              {form.download_links.map((link, i) => (
                <div key={i} className="flex items-center gap-2 text-sm px-3 py-1.5 bg-surface rounded border border-border">
                  <span className="font-medium">{link.label}</span>
                  <span className="text-muted truncate flex-1">{link.url}</span>
                  <button onClick={() => removeLink(i)} className="text-red-500 hover:text-red-700 text-xs">删除</button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input type="text" value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)}
              className="w-1/3 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="名称 (如 百度网盘)" />
            <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="URL" />
            <Button type="button" variant="outline" size="sm" onClick={addLink}>添加</Button>
          </div>
        </div>

        {/* Featured + Sort */}
        <div className="flex items-center gap-8">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.featured}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="w-4 h-4" />
            <span className="text-muted">精选作品</span>
          </label>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted">排序权重</label>
            <input type="number" value={form.sort_order}
              onChange={(e) => updateField("sort_order", parseInt(e.target.value) || 0)}
              className="w-20 px-2 py-1 bg-background border border-border rounded-lg text-sm" />
          </div>
        </div>

        {/* Actions */}
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
