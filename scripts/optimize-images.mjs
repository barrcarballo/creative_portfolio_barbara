// Converts the heavy design exports in assets-src/images/ into small WebP files
// in public/images/, sized for how each one is actually displayed.
//
// Run with `npm run optimize-images` after replacing any original.
// Originals stay in assets-src/ (not published); only the outputs are served.
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'assets-src/images';
const OUT = 'public/images';

const LETTERS = ['b', 'a-1', 'r-1', 'b-2', 'a-2', 'r-2', 'a-3'];

/** @type {{ input: string; output: string; resize: import('sharp').ResizeOptions; quality?: number; format?: 'webp' | 'png'; density?: number }[]} */
const jobs = [
  // The name's letters are shown stretched (CSS object-fit: fill) at about
  // 80 × 140 px; pre-stretch them to ~2× that so retina screens stay sharp.
  ...LETTERS.map((name) => ({
    input: `letter-${name}.png`,
    output: `letter-${name}.webp`,
    resize: { width: 200, height: 300, fit: 'fill' },
  })),

  // Leopard star: a small one for the hanging stars, project minis and CSS
  // masks (≤ 240 px on screen), a large one for the big section star.
  { input: 'star-leopard.png', output: 'star-leopard-sm.webp', resize: { width: 480 } },
  { input: 'star-leopard.png', output: 'star-leopard.webp', resize: { width: 1024 } },

  // Big section star: fur frame and the cream fill (a 1.9 MB vectorised SVG).
  { input: 'section-star-frame.png', output: 'section-star-frame.webp', resize: { width: 1024 } },
  // The fill comes from a 1.9 MB vectorised SVG made of thousands of adjacent
  // shapes. librsvg (used by sharp) leaves hairline seams between them, so it is
  // rasterised with Chrome first (section-star-fill.png, 1600 px) and compressed here.
  { input: 'section-star-fill.png', output: 'section-star-fill.webp', resize: { width: 1600 } },

  // Favicon.
  {
    input: 'star-leopard.png',
    output: 'favicon.png',
    resize: { width: 64, height: 64, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } },
    format: 'png',
  },
];

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

await mkdir(OUT, { recursive: true });

let before = 0;
let after = 0;

for (const job of jobs) {
  const input = path.join(SRC, job.input);
  const output = path.join(OUT, job.output);
  const pipeline = sharp(input, job.density ? { density: job.density } : {}).resize(job.resize);

  if (job.format === 'png') await pipeline.png({ compressionLevel: 9 }).toFile(output);
  else await pipeline.webp({ quality: job.quality ?? 80, alphaQuality: 90, effort: 6 }).toFile(output);

  const [inSize, outSize] = [(await stat(input)).size, (await stat(output)).size];
  before += inSize;
  after += outSize;
  console.log(`${job.output.padEnd(26)} ${kb(inSize).padStart(8)} → ${kb(outSize).padStart(7)}`);
}

console.log(`\nTotal (per job, originals counted once per output): ${kb(before)} → ${kb(after)}`);
