"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils/cn";

const adminLinks = [
  { label: "仪表盘", href: "/admin", icon: "📊" },
  { label: "文章管理", href: "/admin/posts", icon: "📝" },
  { label: "作品管理", href: "/admin/projects", icon: "🎮" },
  { label: "时间轴", href: "/admin/timeline", icon: "⏳" },
  { label: "媒体库", href: "/admin/media", icon: "🖼️" },
  { label: "未来项目", href: "/admin/settings", icon: "🔧" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "min-h-screen bg-surface border-r border-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header with toggle */}
      <div className="h-16 flex items-center px-4 border-b border-border justify-between">
        {!collapsed && (
          <Link href="/admin" className="text-lg font-bold text-foreground tracking-tight whitespace-nowrap">
            Kworld
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          title={collapsed ? "展开侧边栏" : "收起侧边栏"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {collapsed ? (
              <path d="M9 18l6-6-6-6" />
            ) : (
              <path d="M15 18l-6-6 6-6" />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? link.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                collapsed ? "justify-center px-2" : "",
                isActive
                  ? "bg-foreground/10 text-foreground font-medium"
                  : "text-muted hover:bg-surface-hover hover:text-foreground"
              )}
            >
              <span className="text-base">{link.icon}</span>
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-2 border-t border-border space-y-1">
        <Link
          href="/"
          title="返回网站"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted hover:bg-surface-hover hover:text-foreground transition-colors",
            collapsed ? "justify-center px-2" : ""
          )}
        >
          <span>🏠</span>
          {!collapsed && <span>返回网站</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          title="退出登录"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 w-full transition-colors",
            collapsed ? "justify-center px-2" : ""
          )}
        >
          <span>🚪</span>
          {!collapsed && <span>退出登录</span>}
        </button>
      </div>
    </aside>
  );
}
