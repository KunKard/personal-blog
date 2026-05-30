"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface MobileNavProps {
  items: readonly NavItem[];
  pathname: string;
  onClose: () => void;
}

export function MobileNav({ items, pathname, onClose }: MobileNavProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="md:hidden border-t border-border bg-background/95 backdrop-blur"
    >
      <nav className="flex flex-col p-4 gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "px-4 py-3 rounded text-sm flex items-center gap-2 transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted hover:bg-surface hover:text-foreground"
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </motion.div>
  );
}
