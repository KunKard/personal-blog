"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PROJECT_CATEGORIES } from "@/lib/utils/constants";
import type { Project, ProjectUpdate } from "@/lib/types";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProjectUpdate>({});
  const [tagInput, setTagInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((data: Project) => {
        setForm(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  function updateField<K extends keyof ProjectUpdate>(key: K, value: ProjectUpdate[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag) {
      const current = (form as Project).tags || [];
      if (!current.includes(tag)) {
        updateField("tags", [...current, tag]);
      }
      setTagInput("");
    }
  }

  function addTech() {
    const tech = techInput.trim();
    if (tech) {
      const current = (form as Project).tech_stack || [];
      if (!current.includes(tech)) {
        updateField("tech_stack", [...current, tech]);
      }
      setTechInput("");
    }
  }

  function addLink() {
    if (linkLabel.trim() && linkUrl.trim()) {
      const current = (form as Project).download_links || [];
      updateField("download_links", [...current, { label: linkLabel.trim(), url: linkUrl.trim() }]);
      setLinkLabel("");
      setLinkUrl("");
    }
  }

  function removeLink(index: number) {
    const current = (form as Project).download_links || [];
    updateField("download_links", current.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent, status: ProjectUpdate["status"]) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, status }),
    });
    router.push("/admin/projects");
    router.refresh();
  }

  if (loading) return <div className="text-muted">Loading...</div>;

  const project = form as Project;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-8">编辑作品</h1>
      <form className="space-y-6">
        {/* Title + Slug */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">标题</label>
            <input type="text" value={project.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Slug</label>
            <input type="text" value={project.slug || ""}
              onChange={(e) => updateField("slug", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-sm text-muted mb-1">一句话介绍</label>
          <input type="text" value={project.tagline || ""}
            onChange={(e) => updateField("tagline", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
        </div>

        {/* Cover Image + GitHub URL */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">封面图片 URL</label>
            <input type="text" value={project.cover_image_url || ""}
              onChange={(e) => updateField("cover_image_url", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
            {project.cover_image_url && (
              <img src={project.cover_image_url} alt="preview" className="mt-2 w-full h-32 object-cover rounded border border-border" />
            )}
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">GitHub 仓库 URL</label>
            <input type="text" value={project.github_url || ""}
              onChange={(e) => updateField("github_url", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
        </div>

        {/* Category + Dev Duration + Team Size */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">分类</label>
            <select value={project.category || "game"}
              onChange={(e) => updateField("category", e.target.value as Project["category"])}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary">
              {PROJECT_CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">开发时长</label>
            <input type="text" value={project.dev_duration || ""}
              onChange={(e) => updateField("dev_duration", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">团队人数</label>
            <input type="number" value={project.team_size || 1}
              onChange={(e) => updateField("team_size", parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
        </div>

        {/* My Role */}
        <div>
          <label className="block text-sm text-muted mb-1">我的职责</label>
          <input type="text" value={project.my_role || ""}
            onChange={(e) => updateField("my_role", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-muted mb-1">详细描述 (Markdown)</label>
          <textarea value={project.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            rows={6}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary font-mono resize-y" />
        </div>

        {/* Postmortem */}
        <div>
          <label className="block text-sm text-muted mb-1">项目复盘 (Markdown)</label>
          <textarea value={project.postmortem || ""}
            onChange={(e) => updateField("postmortem", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary font-mono resize-y" />
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-sm text-muted mb-1">技术栈</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {(project.tech_stack || []).map((tech: string) => (
              <Badge key={tech} variant="primary" className="cursor-pointer"
                onClick={() => updateField("tech_stack", project.tech_stack.filter((t: string) => t !== tech))}>
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
            {(project.tags || []).map((tag: string) => (
              <Badge key={tag} variant="accent" className="cursor-pointer"
                onClick={() => updateField("tags", project.tags.filter((t: string) => t !== tag))}>
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
          {(project.download_links || []).length > 0 && (
            <div className="mb-2 space-y-1">
              {(project.download_links || []).map((link: { label: string; url: string }, i: number) => (
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
              className="w-1/3 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="名称" />
            <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="URL" />
            <Button type="button" variant="outline" size="sm" onClick={addLink}>添加</Button>
          </div>
        </div>

        {/* Featured + Sort */}
        <div className="flex items-center gap-8">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={project.featured || false}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="w-4 h-4" />
            <span className="text-muted">精选作品</span>
          </label>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted">排序权重</label>
            <input type="number" value={project.sort_order || 0}
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
            {saving ? "保存中..." : "更新并发布"}
          </Button>
        </div>
      </form>
    </div>
  );
}
