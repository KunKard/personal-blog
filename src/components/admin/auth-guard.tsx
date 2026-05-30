"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [timedOut, setTimedOut] = useState(false);

  // If loading takes too long (> 3s), assume we're on static hosting
  useEffect(() => {
    if (status !== "loading") return;
    const timer = setTimeout(() => setTimedOut(true), 3000);
    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [status, router, pathname]);

  // Allow login page to render without auth
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // On static hosting (GitHub Pages), show unavailable message
  if (timedOut && status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <p className="text-4xl mb-4">🔒</p>
          <h2 className="text-xl font-bold mb-2">后台管理不可用</h2>
          <p className="text-sm text-muted mb-4">
            后台管理系统仅在本地开发环境可用。
            <br />
            请克隆项目到本地运行 <code className="text-xs bg-surface px-1.5 py-0.5 rounded">npm run dev</code> 来管理内容。
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 text-sm font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
          >
            返回首页
          </a>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted text-sm">Verifying...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
}
