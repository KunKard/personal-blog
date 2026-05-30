"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const menuItems = [
  { label: "作品集", href: "/projects" },
  { label: "关于我", href: "/about" },
  { label: "博客", href: "/blog" },
];

export function HomeMenu() {
  return (
    <nav className="flex flex-col sm:flex-row gap-4 items-center">
      {menuItems.map((item) => (
        <motion.div
          key={item.href}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            href={item.href}
            className="inline-flex items-center justify-center min-w-[160px] px-6 py-3 text-sm font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
          >
            {item.label}
          </Link>
        </motion.div>
      ))}
    </nav>
  );
}
