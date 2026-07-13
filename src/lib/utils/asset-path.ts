/** Prefix a path with the GitHub Pages base path (e.g. /personal-blog) when deployed */
export function assetPath(p: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!p.startsWith("/")) return p;
  return `${base}${p}`;
}
