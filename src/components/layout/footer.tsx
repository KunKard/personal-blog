import Link from "next/link";
import { SITE_CONFIG } from "@/lib/utils/constants";

export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <Link
            href="/admin/login"
            className="text-xs text-muted hover:text-foreground/40 transition-colors select-none"
            title="管理后台"
          >
            Built with Next.js &middot; Deployed on Vercel
          </Link>
        </div>
      </div>
    </footer>
  );
}
