"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/formatters";
import type { TimelineEntry, TimelineEntryInsert } from "@/lib/types";

const TIMELINE_CATEGORIES = [
  { value: "learning", label: "学习" },
  { value: "jam", label: "Game Jam" },
  { value: "project", label: "项目" },
  { value: "milestone", label: "里程碑" },
  { value: "demo", label: "Demo" },
];

export default function AdminTimelinePage() {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TimelineEntryInsert>({
    date: new Date().toISOString().slice(0, 10),
    title: "",
    description: "",
    category: "learning",
    icon: "",
    related_project_id: null,
    links: [],
    sort_order: 0,
  });

  useEffect(() => {
    fetch("/api/timeline")
      .then((res) => res.json())
      .then((data) => {
        setEntries(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/timeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const entry = await res.json();
      setEntries([entry, ...entries]);
      setShowForm(false);
      setForm({ date: "", title: "", description: "", category: "learning", icon: "", related_project_id: null, links: [], sort_order: 0 });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("确定删除？")) return;
    await fetch(`/api/timeline/${id}`, { method: "DELETE" });
    setEntries(entries.filter((e) => e.id !== id));
  }

  if (loading) return <div className="text-muted">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">时间轴管理</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "取消" : "新建条目"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-surface border border-border rounded-lg p-6 mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1">标题</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">日期</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">描述</label>
            <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">分类</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as TimelineEntryInsert["category"] })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm">
              {TIMELINE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <Button type="submit">创建</Button>
        </form>
      )}

      {entries.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p className="text-4xl mb-4">⏳</p>
          <p>暂无时间轴条目</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-4 bg-surface border border-border rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted">{formatDate(entry.date)}</span>
                <span className="font-medium">{entry.icon} {entry.title}</span>
                <Badge>{entry.category}</Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(entry.id)}>删除</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
