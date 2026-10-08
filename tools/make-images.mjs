/*
 * Pretvara izvorne slike projekata u webp i avif, u više širina.
 *
 *   node tools/make-images.mjs <ulaz.png> <ime> <sirina1,sirina2,...>
 *
 * Primjer:
 *   node tools/make-images.mjs shisha-desk.png myshishapedia-home 480,800,1200
 *
 * Rezultat ide u public/img/projects/<ime>-<sirina>.webp i .avif
 */
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public/img/projects');

const [input, name, widthsArg] = process.argv.slice(2);
if (!input || !name || !widthsArg) {
  console.error('Upotreba: node tools/make-images.mjs <ulaz> <ime> <sirine>');
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });
const widths = widthsArg.split(',').map(Number);
const meta = await sharp(input).metadata();

for (const w of widths) {
  const width = Math.min(w, meta.width);
  const base = path.join(OUT, `${name}-${w}`);
  const img = sharp(input).resize({ width, withoutEnlargement: true });
  await img.clone().webp({ quality: 78, effort: 6 }).toFile(`${base}.webp`);
  await img.clone().avif({ quality: 55, effort: 6 }).toFile(`${base}.avif`);
  const h = Math.round((meta.height / meta.width) * width);
  console.log(`${name}-${w}: ${width}x${h}`);
}
