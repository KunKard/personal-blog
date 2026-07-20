import { execSync } from "child_process";
import { existsSync, rmSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const nextDir = join(root, ".next");

// Kill any lingering Next.js dev server processes
try {
  if (process.platform === "win32") {
    execSync('taskkill /F /FI "WINDOWTITLE eq next*" 2>nul', { stdio: "ignore" });
  } else {
    execSync("pkill -f 'next dev' 2>/dev/null", { stdio: "ignore" });
  }
} catch {
  // No processes to kill — fine
}

// Clear stale .next cache
if (existsSync(nextDir)) {
  rmSync(nextDir, { recursive: true, force: true });
  console.log("✓ Cleared stale .next cache");
}

console.log("✓ Environment clean, starting dev server...");
