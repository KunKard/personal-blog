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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">标题</label>
            <input type="text" value={project.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">分类</label>
            <select value={project.category || "game"}
              onChange={(e) => updateField("category", e.target.value as Project["category"])}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm">
              {PROJECT_CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">详细描述</label>
          <textarea value={project.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            rows={6}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono resize-y" />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">标签</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {(project.tags || []).map((tag: string) => (
              <Badge key={tag} variant="primary" className="cursor-pointer"
                onClick={() => updateField("tags", project.tags.filter((t: string) => t !== tag))}>
                {tag} ×
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm" />
            <Button type="button" variant="outline" size="sm" onClick={addTag}>添加</Button>
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
