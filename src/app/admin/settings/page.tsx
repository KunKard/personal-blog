"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [settings, setSettings] = useState({
    site_name: "Kworld",
    current_project_title: "",
    current_project_description: "",
    current_project_tags: "",
    current_project_icon: "🔧",
  });

  // Load existing settings on mount
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.current_project) {
          setSettings({
            site_name: "Kworld",
            current_project_title: data.current_project.title || "",
            current_project_description: data.current_project.description || "",
            current_project_tags: (data.current_project.tags || []).join(", "),
            current_project_icon: data.current_project.icon || "🔧",
          });
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  function handleSave() {
    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current_project: {
          title: settings.current_project_title,
          description: settings.current_project_description,
          tags: settings.current_project_tags.split(",").map((t) => t.trim()).filter(Boolean),
          icon: settings.current_project_icon,
        },
      }),
    }).catch(() => {
      // API may not be available in static export mode
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!loaded) return <div className="text-muted">加载中...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">未来项目</h1>

      <div className="space-y-8">
        {/* Current Project (首页「正在开发」) */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-bold text-muted uppercase tracking-wide">
            首页「正在开发」
          </legend>
          <div>
            <label className="block text-sm mb-1">图标 emoji</label>
            <input
              type="text"
              value={settings.current_project_icon}
              onChange={(e) => setSettings({ ...settings, current_project_icon: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">项目标题</label>
            <input
              type="text"
              value={settings.current_project_title}
              onChange={(e) => setSettings({ ...settings, current_project_title: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">项目描述</label>
            <textarea
              value={settings.current_project_description}
              onChange={(e) => setSettings({ ...settings, current_project_description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">
              标签（逗号分隔，如 Unity 6, URP, 2D）
            </label>
            <input
              type="text"
              value={settings.current_project_tags}
              onChange={(e) => setSettings({ ...settings, current_project_tags: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </fieldset>

        <Button onClick={handleSave}>
          {saved ? "已保存!" : "保存设置"}
        </Button>
      </div>

      <div className="mt-12 p-4 bg-surface border border-border rounded-lg">
        <p className="text-sm text-muted">
          提示：当前为静态导出模式。保存操作在开发模式（npm run dev）下生效，会将数据写入
          data/site-settings.json。
          部署后需配 Supabase 以实现在线保存。
        </p>
      </div>
    </div>
  );
}
