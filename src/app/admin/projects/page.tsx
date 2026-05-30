"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/formatters";
import type { Project } from "@/lib/types";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("确定要删除这个作品吗？")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects(projects.filter((p) => p.id !== id));
  }

  if (loading) return <div className="text-muted">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">作品管理</h1>
        <Link href="/admin/projects/new">
          <Button>新建作品</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p className="text-4xl mb-4">🎮</p>
          <p>暂无作品，点击上方按钮添加</p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium text-muted">标题</th>
                <th className="text-left p-4 font-medium text-muted">状态</th>
                <th className="text-left p-4 font-medium text-muted">分类</th>
                <th className="text-left p-4 font-medium text-muted">精选</th>
                <th className="text-right p-4 font-medium text-muted">操作</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-border last:border-0">
                  <td className="p-4 font-medium">{project.title}</td>
                  <td className="p-4">
                    <Badge variant={project.status === "published" ? "primary" : "default"}>
                      {project.status === "published" ? "已发布" : project.status === "draft" ? "草稿" : "归档"}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted">{project.category}</td>
                  <td className="p-4">
                    {project.featured ? <Badge variant="accent">精选</Badge> : <span className="text-muted">-</span>}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <Button variant="ghost" size="sm">编辑</Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)}>
                      删除
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
