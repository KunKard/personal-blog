/**
 * Regenerates public/images/placeholder-cover.png — the fallback cover for portfolio
 * entries that have no screenshot of their own. Kept as a script so the asset stays
 * reproducible if the theme colours change. No image dependencies, no network.
 *
 *   node scripts/make-placeholder-cover.mjs
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// ── PNG encoding ────────────────────────────────────────────────────────────

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let crc = -1;
  for (const b of buf) crc = CRC_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgb) {
  const stride = width * 3;
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0; // filter type: none
    rgb.copy(raw, rowStart + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── canvas ──────────────────────────────────────────────────────────────────

const W = 640;
const H = 360; // 16:9, matching the card / hero aspect-video boxes

const BG = [245, 245, 245]; // --surface
const FRAME = [224, 224, 224]; // --border
const ICON = [178, 178, 178];

const px = Buffer.alloc(W * H * 3);

function setPx(x, y, colour) {
  const o = (y * W + x) * 3;
  px[o] = colour[0];
  px[o + 1] = colour[1];
  px[o + 2] = colour[2];
}

function paint(predicate, colour) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (predicate(x + 0.5, y + 0.5)) setPx(x, y, colour);
    }
  }
}

for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) setPx(x, y, BG);

// ── gamepad mark ────────────────────────────────────────────────────────────
// Built from ellipses rather than a polygon so the silhouette cannot self-intersect.

const cx = W / 2;
const cy = H / 2;

const bodyRx = W * 0.235;
const bodyRy = H * 0.145;
const gripR = H * 0.125;
const gripDx = W * 0.155;
const gripCy = cy + bodyRy * 0.62;

const silhouette = [
  [cx, cy, bodyRx, bodyRy],
  [cx - gripDx, gripCy, gripR, gripR],
  [cx + gripDx, gripCy, gripR, gripR],
];

paint(
  (x, y) => silhouette.some(([ox, oy, a, b]) => ((x - ox) / a) ** 2 + ((y - oy) / b) ** 2 <= 1),
  ICON
);

// d-pad: a plus shape stamped back to the background colour
const dpadX = cx - bodyRx * 0.52;
const dpadY = cy + bodyRy * 0.05;
const armHalf = H * 0.028;
const armLen = H * 0.082;

paint((x, y) => {
  const dx = Math.abs(x - dpadX);
  const dy = Math.abs(y - dpadY);
  return (dx <= armLen && dy <= armHalf) || (dx <= armHalf && dy <= armLen);
}, BG);

// two round buttons
const buttonR = H * 0.042;
const buttons = [
  [cx + bodyRx * 0.40, cy - bodyRy * 0.18],
  [cx + bodyRx * 0.68, cy + bodyRy * 0.22],
];

paint((x, y) => buttons.some(([bx, by]) => (x - bx) ** 2 + (y - by) ** 2 <= buttonR ** 2), BG);

// hairline frame, so the card edge looks deliberate rather than cropped
for (let x = 0; x < W; x++) {
  setPx(x, 0, FRAME);
  setPx(x, H - 1, FRAME);
}
for (let y = 0; y < H; y++) {
  setPx(0, y, FRAME);
  setPx(W - 1, y, FRAME);
}

const out = join(root, "public", "images", "placeholder-cover.png");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, encodePng(W, H, px));
console.log(`✓ wrote public/images/placeholder-cover.png (${W}x${H})`);
