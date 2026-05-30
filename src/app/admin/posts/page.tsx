"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/formatters";
import type { Post } from "@/lib/types";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("确定要删除这篇文章吗？")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p.id !== id));
  }

  if (loading) return <div className="text-muted">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link href="/admin/posts/new">
          <Button>新建文章</Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p className="text-4xl mb-4">📝</p>
          <p>暂无文章，点击上方按钮创建第一篇</p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium text-muted">标题</th>
                <th className="text-left p-4 font-medium text-muted">状态</th>
                <th className="text-left p-4 font-medium text-muted">分类</th>
                <th className="text-left p-4 font-medium text-muted">日期</th>
                <th className="text-right p-4 font-medium text-muted">操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0">
                  <td className="p-4 font-medium">{post.title}</td>
                  <td className="p-4">
                    <Badge variant={post.status === "published" ? "primary" : "default"}>
                      {post.status === "published" ? "已发布" : "草稿"}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted">{post.category}</td>
                  <td className="p-4 text-muted">
                    {post.published_at ? formatDate(post.published_at) : "-"}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Button variant="ghost" size="sm">编辑</Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
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
