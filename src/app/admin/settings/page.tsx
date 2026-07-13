"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    site_name: "Kworld",
    current_project_title: "新项目开发中",
    current_project_description: "一个全新的独立游戏正在酝酿中...\n敬请期待！",
    current_project_tags: "Unity 6, URP, 2D",
    current_project_icon: "🔧",
  });

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
      // In development, the API route handles saving
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">站点设置</h1>

      <div className="space-y-8">
        {/* General */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-bold text-muted uppercase tracking-wide">基本</legend>
          <div>
            <label className="block text-sm mb-1">网站名称</label>
            <input
              type="text"
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </fieldset>

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
