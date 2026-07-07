"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function PathGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && pathname !== "/") {
      router.replace("/");
    }
  }, [mounted, pathname, router]);

  // 在客户端挂载之前不做任何拦截，避免 hydration 问题
  // 挂载后非首页路径渲染 null，等 router.replace 生效
  if (!mounted) {
    return <>{children}</>;
  }

  if (pathname !== "/") {
    return null;
  }

  return <>{children}</>;
}
