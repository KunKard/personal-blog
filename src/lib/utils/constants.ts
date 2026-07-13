export const SITE_CONFIG = {
  name: "Kworld",
  title: "独立游戏开发者",
  description: "Building indie games with Unity. Exploring the intersection of code and creativity.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com",
  author: "Kard",
  locale: "zh_CN",
} as const;

export const NAV_ITEMS = [
  { label: "首页", href: "/", icon: "🏠" },
  { label: "关于我", href: "/about", icon: "👤" },
  { label: "作品集", href: "/projects", icon: "🎮" },
  { label: "博客", href: "/blog", icon: "📝" },
] as const;

export const PROJECT_CATEGORIES = [
  { value: "all", label: "全部" },
  { value: "game", label: "游戏" },
  { value: "jam", label: "Game Jam" },
  { value: "tool", label: "工具" },
  { value: "demo", label: "Demo" },
  { value: "other", label: "其他" },
] as const;

export const BLOG_CATEGORIES = [
  { value: "all", label: "全部" },
  { value: "devlog", label: "开发日志" },
  { value: "tutorial", label: "教程" },
  { value: "design", label: "游戏设计" },
  { value: "tech", label: "技术" },
] as const;

export const TIMELINE_CATEGORIES = [
  { value: "all", label: "全部" },
  { value: "learning", label: "学习" },
  { value: "jam", label: "Game Jam" },
  { value: "project", label: "项目" },
  { value: "milestone", label: "里程碑" },
  { value: "demo", label: "Demo" },
] as const;

export const TECH_STACK = [
  "Unity",
  "UE",
  "C++",
  "C#",
  "GameDesign",
] as const;
