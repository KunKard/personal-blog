"use client";

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
  { label: "站点设置", href: "/admin/settings", icon: "⚙️" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-surface border-r border-border flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/admin" className="text-lg font-bold text-foreground tracking-tight">
          KWorld
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-foreground/10 text-foreground font-medium"
                  : "text-muted hover:bg-surface-hover hover:text-foreground"
              )}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted hover:bg-surface-hover hover:text-foreground transition-colors"
        >
          <span>🏠</span>
          返回网站
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 w-full transition-colors"
        >
          <span>🚪</span>
          退出登录
        </button>
      </div>
    </aside>
  );
}
