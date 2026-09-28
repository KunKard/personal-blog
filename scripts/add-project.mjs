/**
 * Adds one portfolio entry to data/projects.json from a payload written by an agent
 * working inside a game project.
 *
 *   node scripts/add-project.mjs "<path to project.json>"
 *
 * The payload only carries editorial content; everything mechanical (id, slug,
 * timestamps, sort_order, status) is derived here so agents can't get it wrong.
 *
 * `cover` is resolved relative to the payload file and copied into public/images/.
 * When it is missing or unreadable, placeholder-cover.png is used instead.
 */
import { readFile, writeFile, copyFile, access, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, resolve, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const PROJECTS_JSON = join(root, "data", "projects.json");
const IMAGES_DIR = join(root, "public", "images");
const PLACEHOLDER = "placeholder-cover.png";
const PLACEHOLDER_REF = `/images/${PLACEHOLDER}`;

const CATEGORIES = ["game", "jam", "tool", "demo", "remake", "other"];
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);
const MIN_COVER_WIDTH = 400; // covers render at up to ~50% of the viewport

// Card blurb: tagline if present, else the first line of the description.
const MAX_DERIVED_TAGLINE = 60;

const errors = [];
const fail = (msg) => errors.push(msg);

// ── payload ─────────────────────────────────────────────────────────────────

const payloadArg = process.argv[2];
if (!payloadArg) {
  console.error("usage: node scripts/add-project.mjs <path/to/project.json>");
  process.exit(1);
}

const payloadPath = resolve(process.cwd(), payloadArg);
if (!existsSync(payloadPath)) {
  console.error(`✗ payload not found: ${payloadPath}`);
  process.exit(1);
}

let payload;
try {
  payload = JSON.parse(await readFile(payloadPath, "utf-8"));
} catch (err) {
  console.error(`✗ payload is not valid JSON: ${err.message}`);
  process.exit(1);
}

const payloadDir = dirname(payloadPath);

// ── validation ──────────────────────────────────────────────────────────────

const str = (v) => typeof v === "string" && v.trim().length > 0;

if (!str(payload.title)) fail("title is required and must be a non-empty string");

if (!str(payload.tagline)) {
  const firstLine = str(payload.description)
    ? String(payload.description).split("\n")[0].replace(/[*_`#]/g, "").trim()
    : "";
  if (firstLine) {
    payload.tagline =
      firstLine.length > MAX_DERIVED_TAGLINE
        ? `${firstLine.slice(0, MAX_DERIVED_TAGLINE - 1)}…`
        : firstLine;
  } else {
    fail("tagline is required (or supply a description to derive one from)");
  }
} else if (payload.tagline.length > MAX_DERIVED_TAGLINE * 2) {
  fail(`tagline is ${payload.tagline.length} chars — the card shows at most two short lines, keep it under ${MAX_DERIVED_TAGLINE * 2}`);
}

if (!str(payload.category)) {
  fail(`category is required — one of: ${CATEGORIES.join(", ")}`);
} else if (!CATEGORIES.includes(payload.category)) {
  fail(`category "${payload.category}" is not one of: ${CATEGORIES.join(", ")}`);
}

if (payload.team_size !== undefined) {
  if (!Number.isInteger(payload.team_size) || payload.team_size < 1) {
    fail("team_size must be a positive integer (omit it to default to 1)");
  }
}

const arrayField = (name, max) => {
  const v = payload[name];
  if (v === undefined) return [];
  if (!Array.isArray(v) || !v.every(str)) {
    fail(`${name} must be an array of non-empty strings`);
    return [];
  }
  if (max && v.length > max) fail(`${name} has ${v.length} entries — the UI shows at most ${max}`);
  return v;
};

const tags = arrayField("tags", 5);
const techStack = arrayField("tech_stack", 8);

if (payload.download_links !== undefined) {
  if (
    !Array.isArray(payload.download_links) ||
    !payload.download_links.every((l) => l && str(l.label) && str(l.url))
  ) {
    fail('download_links must be an array of { "label": "...", "url": "..." }');
  }
}

if (payload.github_url !== undefined && !str(payload.github_url)) {
  fail("github_url must be a non-empty string when present (omit the field instead of passing null)");
}

// ── slug ────────────────────────────────────────────────────────────────────

function slugify(input) {
  return String(input)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

let slug = str(payload.slug) ? slugify(payload.slug) : slugify(payload.title);
if (!slug) {
  fail(
    `cannot derive a slug from title "${payload.title}" — add a "slug" field using lowercase latin letters and hyphens, e.g. "my-game-name"`
  );
}

// ── cover image ─────────────────────────────────────────────────────────────

function imageSize(buf, ext) {
  if (ext === ".png" && buf.length > 24 && buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if ((ext === ".jpg" || ext === ".jpeg") && buf[0] === 0xff && buf[1] === 0xd8) {
    let o = 2;
    while (o + 9 < buf.length) {
      if (buf[o] !== 0xff) {
        o++;
        continue;
      }
      const marker = buf[o + 1];
      const len = buf.readUInt16BE(o + 2);
      // SOF0-SOF15, excluding the non-frame markers
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buf.readUInt16BE(o + 5), width: buf.readUInt16BE(o + 7) };
      }
      o += 2 + len;
    }
  }
  return null;
}

let coverFilename = PLACEHOLDER;
let coverNote = "no cover supplied — using the placeholder";

if (str(payload.cover)) {
  const source = resolve(payloadDir, payload.cover);
  if (!existsSync(source)) {
    coverNote = `cover "${payload.cover}" not found next to the payload — using the placeholder`;
  } else if (!IMAGE_EXTENSIONS.has(extname(source).toLowerCase())) {
    fail(`cover must be one of ${[...IMAGE_EXTENSIONS].join(", ")} — got "${extname(source)}"`);
  } else if (!slug) {
    // slug already reported; skip the copy so we don't write a badly named file
  } else {
    const ext = extname(source).toLowerCase();
    const bytes = await readFile(source);
    const size = imageSize(bytes, ext);

    if (!size) {
      coverNote = `cover "${payload.cover}" is not a readable PNG/JPEG — using the placeholder`;
    } else if (size.width < MIN_COVER_WIDTH) {
      fail(
        `cover is ${size.width}x${size.height} — too small for the card, use at least ${MIN_COVER_WIDTH}px wide (16:9 recommended)`
      );
    } else {
      coverFilename = `${slug}-cover${ext}`;
      await copyFile(source, join(IMAGES_DIR, coverFilename));
      coverNote = `copied cover -> public/images/${coverFilename} (${size.width}x${size.height})`;
      if (Math.abs(size.width / size.height - 16 / 9) > 0.35) {
        coverNote += "  ⚠ not close to 16:9, the card will crop it";
      }
    }
  }
}

// ── stop before touching anything if the payload is broken ──────────────────

if (errors.length) {
  console.error("✗ payload rejected — nothing was written:\n");
  for (const e of errors) console.error(`  • ${e}`);
  console.error("\nFix the payload and run the command again.");
  process.exit(1);
}

// ── append ──────────────────────────────────────────────────────────────────

const existing = JSON.parse(await readFile(PROJECTS_JSON, "utf-8"));

if (existing.some((p) => p.slug === slug)) {
  const clash = existing.find((p) => p.slug === slug);
  console.error(`✗ slug "${slug}" is already used by "${clash.title}" (id: ${clash.id}).`);
  console.error("  Pick a different slug, or edit that entry instead of adding a new one.");
  process.exit(1);
}

const now = new Date().toISOString();
const maxSort = existing.reduce((max, p) => Math.max(max, p.sort_order ?? 0), 0);

const project = {
  id: `project-${slug}`,
  slug,
  title: payload.title,
  tagline: payload.tagline,
  description: str(payload.description) ? payload.description : null,
  cover_image_url: `/images/${coverFilename}`,
  screenshots: [],
  video_url: null,
  webgl_game_slug: null,
  download_links: payload.download_links ?? [],
  tech_stack: techStack,
  category: payload.category,
  tags,
  status: "published",
  dev_duration: str(payload.dev_duration) ? payload.dev_duration : null,
  team_size: payload.team_size ?? 1,
  my_role: str(payload.my_role) ? payload.my_role : "开发者",
  postmortem: str(payload.postmortem) ? payload.postmortem : null,
  github_url: str(payload.github_url) ? payload.github_url : null,
  featured: false, // featured entries are curated by hand, not by the agent
  sort_order: maxSort + 1,
  created_at: now,
  updated_at: now,
};

existing.push(project);

// Keep CJK literal rather than \uXXXX escapes so the git diff stays readable.
const serialised = JSON.stringify(existing, null, 2).replace(
  /[\u007f-￿]/g,
  (ch) => ch
);

await writeFile(PROJECTS_JSON, `${serialised}\n`, "utf-8");

// ── report ──────────────────────────────────────────────────────────────────

const placeholderExisted = existsSync(join(IMAGES_DIR, PLACEHOLDER));

console.log(`✓ added "${project.title}"`);
console.log(`  slug      ${project.slug}`);
console.log(`  id        ${project.id}`);
console.log(`  category  ${project.category}`);
console.log(`  cover     ${project.cover_image_url}`);
console.log(`  ${coverNote}`);

if (!placeholderExisted && coverFilename === PLACEHOLDER) {
  console.warn(
    `\n⚠ public/images/${PLACEHOLDER} is missing — run: node scripts/make-placeholder-cover.mjs`
  );
}

console.log(`
Next:
  1. npm run build        (or npm run dev, then open /projects and /projects/${project.slug})
  2. confirm the card shows the cover and the detail page renders the description
  3. the entry is created with featured: false and the highest sort_order;
     tweak those by hand in data/projects.json if you want it on the home page

Not done for you: nothing was committed or pushed. Commit and push to master when
you are happy with the preview — that is what triggers the GitHub Pages deploy.`);
