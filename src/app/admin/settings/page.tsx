"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    hero_title: "DevQuest",
    hero_subtitle: "探索代码与创造力的交汇点",
    about_bio: "一个热爱创造游戏世界的独立开发者",
    site_name: "DevQuest",
  });

  function handleSave() {
    // Would save to site_settings table via API
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">站点设置</h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-muted mb-1">网站名称</label>
          <input
            type="text"
            value={settings.site_name}
            onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">首页标题</label>
          <input
            type="text"
            value={settings.hero_title}
            onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">首页副标题</label>
          <textarea
            value={settings.hero_subtitle}
            onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">关于我简介</label>
          <textarea
            value={settings.about_bio}
            onChange={(e) => setSettings({ ...settings, about_bio: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <Button onClick={handleSave}>
          {saved ? "已保存!" : "保存设置"}
        </Button>
      </div>

      <div className="mt-12 p-4 bg-surface border border-border rounded-lg">
        <p className="text-sm text-muted">
          提示: 站点设置功能需要在 Supabase 中创建 site_settings 表后才能完全生效。
          当前为演示模式。
        </p>
      </div>
    </div>
  );
}
