"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-7xl font-bold mb-4 text-muted">500</p>
        <h1 className="text-2xl font-bold mb-3 tracking-tight">
          出错了
        </h1>
        <p className="text-muted mb-8 max-w-sm mx-auto">
          出了点问题...别担心，这不是你的错！
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 text-sm font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
          >
            再试一次
          </button>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 text-sm font-medium border border-border rounded-lg hover:bg-surface transition-colors"
          >
            返回主页
          </Link>
        </div>
      </div>
    </div>
  );
}
