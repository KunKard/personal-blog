import { cp, rm, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

async function remove() {
  // Backup and remove API routes
  const apiDir = join(root, "src", "app", "api");
  const apiBackup = join(root, "src", "app-api-backup");

  if (existsSync(apiDir)) {
    // Backup first
    await rm(apiBackup, { recursive: true, force: true });
    await cp(apiDir, apiBackup, { recursive: true });
    await rm(apiDir, { recursive: true, force: true });
    console.log("✓ API routes backed up and removed for static build");
  } else {
    console.log("  API routes already removed, skipping");
  }

  // Backup and remove middleware
  const middlewareFile = join(root, "src", "middleware.ts");
  const middlewareBackup = join(root, "src", "middleware.bak");

  if (existsSync(middlewareFile)) {
    const content = await readFile(middlewareFile, "utf-8");
    await writeFile(middlewareBackup, content, "utf-8");
    await rm(middlewareFile, { force: true });
    console.log("✓ Middleware backed up and removed for static build");
  } else {
    console.log("  Middleware already removed, skipping");
  }
}

remove().catch(console.error);
