/**
 * Pre-renders the hero's drifting cloud bands to WebP.
 *
 * The bands are fractal noise — the same look the reference landing gets from
 * feTurbulence. Running that filter live in CSS renders correctly in Chromium,
 * but Safari rasterises filter output into a limited buffer, so a repeated tile
 * shows hard rectangular seams. Baking the noise to an image keeps the look and
 * leaves no filter at runtime.
 *
 * The noise is generated here rather than rendered from SVG because librsvg
 * ignores stitchTiles: its output does not wrap (measured ~130/255 alpha jump
 * across the seam), which is exactly the artefact we are removing. This lattice
 * wraps by construction — every octave's grid divides the tile a whole number
 * of times, so column 0 and column W-1 are neighbours and the band can scroll
 * forever without showing an edge.
 *
 * Each band is fbm shaped by a second, much coarser fbm used as a clump mask.
 * Without it the noise covers the whole tile evenly and reads as flat haze; the
 * mask punches open sky between cloud masses so individual shapes are legible.
 *
 * Run with: node scripts/generate-cloud-textures.mjs
 */
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

/* Width is 1:1 with the CSS background-size, so it stays at 1600. Height is
   half that: every band is scaled down to a few hundred pixels tall anyway, so
   rendering 800 rows only doubled the file size. */
const TILE_W = 1600;
const TILE_H = 400;

/**
 * 
 * cx/cy       cells across/down at the base octave — lower means bigger shapes
 * octaves     detail steps; persistence is how much each one contributes
 * contrast    alpha ramp applied to the noise (slope/bias of the old filter)
 * clumpCells  grid of the coarse mask — this is what breaks up the coverage
 * clumpLow/High  mask ramp; a wider gap means softer edges to each cloud mass
 */
const BANDS = [
  {
    name: 'sky-high',
    cx: 5, cy: 3, octaves: 5, persistence: 0.5,
    seed: 41, contrast: 2.15, bias: -0.8,
    clumpCells: 2, clumpLow: 0.4, clumpHigh: 0.72,
  },
  {
    name: 'sky-far',
    cx: 4, cy: 2, octaves: 5, persistence: 0.55,
    seed: 8, contrast: 2.25, bias: -0.84,
    clumpCells: 2, clumpLow: 0.38, clumpHigh: 0.7,
  },
  {
    name: 'sky-mid',
    cx: 6, cy: 3, octaves: 6, persistence: 0.58,
    seed: 17, contrast: 2.72, bias: -1.0,
    clumpCells: 3, clumpLow: 0.34, clumpHigh: 0.64,
  },
  {
    name: 'sky-near',
    cx: 8, cy: 4, octaves: 6, persistence: 0.6,
    seed: 29, contrast: 2.96, bias: -1.12,
    clumpCells: 3, clumpLow: 0.3, clumpHigh: 0.6,
  },
];

/* Deterministic per-lattice-point value, hashed from the wrapped coordinates so
   the same grid point always yields the same number. */
function hash(ix, iy, seed) {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(seed, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

const smooth = (t) => t * t * (3 - 2 * t);

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return smooth(t);
}

/* Value noise on a grid that wraps at (px, py). */
function noise(x, y, px, py, seed) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = smooth(x - x0);
  const fy = smooth(y - y0);
  const xa = ((x0 % px) + px) % px;
  const ya = ((y0 % py) + py) % py;
  const xb = (xa + 1) % px;
  const yb = (ya + 1) % py;

  const v00 = hash(xa, ya, seed);
  const v10 = hash(xb, ya, seed);
  const v01 = hash(xa, yb, seed);
  const v11 = hash(xb, yb, seed);

  const top = v00 + (v10 - v00) * fx;
  const bottom = v01 + (v11 - v01) * fx;
  return top + (bottom - top) * fy;
}

/* Fractal sum: each octave doubles the grid, and the period doubles with it. */
function fbm(u, v, cx, cy, seed, octaves, persistence) {
  let sum = 0;
  let norm = 0;
  let amp = 1;
  let freq = 1;

  for (let o = 0; o < octaves; o++) {
    sum += amp * noise(u * cx * freq, v * cy * freq, cx * freq, cy * freq, seed + o * 101);
    norm += amp;
    amp *= persistence;
    freq *= 2;
  }

  return sum / norm;
}

function render(band) {
  const { cx, cy, seed, contrast, bias, octaves, persistence, clumpCells, clumpLow, clumpHigh } = band;
  const buf = Buffer.alloc(TILE_W * TILE_H * 4);

  for (let y = 0; y < TILE_H; y++) {
    for (let x = 0; x < TILE_W; x++) {
      const u = x / TILE_W;
      const v = y / TILE_H;

      const detail = fbm(u, v, cx, cy, seed, octaves, persistence);
      const clump = fbm(u, v, clumpCells, Math.max(1, Math.round(clumpCells / 2)), seed + 7001, 3, 0.5);
      const mask = smoothstep(clumpLow, clumpHigh, clump);

      /* Vertical fade baked into the alpha. It used to be a CSS mask-image on
         the band, but a mask on an element whose transform changes every scroll
         frame cannot be composited — the layer was re-rasterised on each frame
         and dropped out mid-scroll, reappearing once scrolling stopped. */
      const fade = smoothstep(0, 0.24, v) * (1 - smoothstep(0.88, 1, v));

      const a = Math.max(0, Math.min(1, contrast * detail + bias)) * mask * fade;

      /* Shade from a lit top to a cool grey base. Flat white clouds vanish
         against the pale lower half of the sky gradient — there the underside
         has to read *darker* than the sky behind it, not lighter, which is what
         gives a cumulus its volume. */
      const shade = Math.pow(v, 0.8);
      const i = (y * TILE_W + x) * 4;
      buf[i] = Math.round(255 - 116 * shade);
      buf[i + 1] = Math.round(252 - 95 * shade);
      buf[i + 2] = Math.round(245 - 62 * shade);
      buf[i + 3] = Math.round(a * 255);
    }
  }

  return buf;
}

/* Confirms the tile loops: column 0 has to match column W-1. */
function seamError(buf) {
  let worst = 0;
  for (let y = 0; y < TILE_H; y++) {
    const left = buf[(y * TILE_W) * 4 + 3];
    const right = buf[(y * TILE_W + TILE_W - 1) * 4 + 3];
    worst = Math.max(worst, Math.abs(left - right));
  }
  return worst;
}

/* How much of the tile is open sky — a band that is opaque everywhere has no
   readable shape, which is the failure mode this mask exists to avoid. */
function coverage(buf) {
  let clear = 0;
  const px = TILE_W * TILE_H;
  for (let i = 3; i < buf.length; i += 4) if (buf[i] < 8) clear++;
  return Math.round((clear / px) * 100);
}

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'design-1', 'clouds');
await mkdir(outDir, { recursive: true });

for (const band of BANDS) {
  const raw = render(band);
  const out = join(outDir, `${band.name}.webp`);
  const info = await sharp(raw, { raw: { width: TILE_W, height: TILE_H, channels: 4 } })
    .webp({ quality: 88, alphaQuality: 100 })
    .toFile(out);

  console.log(
    `${band.name}.webp  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB` +
    `  seam Δalpha ${seamError(raw)}/255  open sky ${coverage(raw)}%`,
  );
}
