import { cp, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

async function restore() {
  // Restore API routes
  const apiDest = join(root, "src", "app", "api");
  const apiBackup = join(root, "src", "app-api-backup");

  if (!existsSync(apiDest) && existsSync(apiBackup)) {
    await cp(apiBackup, apiDest, { recursive: true });
    console.log("✓ API routes restored from backup");
  } else if (existsSync(apiDest)) {
    console.log("  API routes already present, skipping restore");
  } else {
    console.log("  No API backup found, skipping");
  }

  // Restore middleware
  const middlewareDest = join(root, "src", "middleware.ts");
  const middlewareBackup = join(root, "src", "middleware.bak");

  if (!existsSync(middlewareDest) && existsSync(middlewareBackup)) {
    const content = await readFile(middlewareBackup, "utf-8");
    await writeFile(middlewareDest, content, "utf-8");
    console.log("✓ Middleware restored from backup");
  } else if (existsSync(middlewareDest)) {
    console.log("  Middleware already present, skipping restore");
  } else {
    console.log("  No middleware backup found, skipping");
  }
}

restore().catch(console.error);
