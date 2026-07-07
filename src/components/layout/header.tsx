import Link from "next/link";
import { SITE_CONFIG } from "@/lib/utils/constants";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-bold text-foreground hover:text-primary transition-colors tracking-tight"
          >
            {SITE_CONFIG.name}
          </Link>
        </div>
      </div>
    </header>
  );
}
