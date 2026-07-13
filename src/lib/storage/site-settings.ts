import fs from "fs";
import path from "path";

export interface SiteSettings {
  current_project: {
    title: string;
    description: string;
    tags: string[];
    icon: string;
  };
}

let cached: SiteSettings | null = null;

export function getSiteSettings(): SiteSettings {
  if (cached) return cached;

  const filePath = path.join(process.cwd(), "data", "site-settings.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  cached = JSON.parse(raw);
  return cached!;
}

/** Only available at build time (server component / API route) */
export function updateSiteSettings(data: SiteSettings): void {
  const filePath = path.join(process.cwd(), "data", "site-settings.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  cached = data;
}
