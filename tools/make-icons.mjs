/*
 * Pravi PNG ikonice iz public/favicon.svg (robotićeva glava).
 *   node tools/make-icons.mjs
 */
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PUB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public');
const svg = path.join(PUB, 'favicon.svg');
const out = [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]];
for (const [name, size] of out) {
  await sharp(svg, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toFile(path.join(PUB, name));
  console.log(name);
}
