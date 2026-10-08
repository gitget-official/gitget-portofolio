/*
 * Snima GIF robotića u akciji: ulazak na scenu, hodanje kroz sekcije, trik i meni.
 *   node tools/make-gif.mjs
 * Treba ffmpeg. Rezultat: reports/robot.gif (+ reports/robot.mp4)
 *
 * Vrijeme na stranici kontroliše Playwright (page.clock), pa je svaka sličica
 * tačno 1/FPS sekunde animacije, bez obzira koliko traje snimanje.
 */
import { chromium } from '@playwright/test';
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'reports');
const FPS = 15;
const FRAME = 1000 / FPS;
const W = Number(process.env.GIF_W || 1280), H = Number(process.env.GIF_H || 720);
const NAME = process.env.GIF_NAME || 'robot';

const server = spawn(process.execPath, [path.join(ROOT, 'tools/serve.mjs'), '8383'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 700));

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gif-'));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.clock.install();
await page.goto('http://localhost:8383/' + (process.env.GIF_QUERY || ''));
await page.waitForFunction(() => window.gitgetBot);

let n = 0;
async function shoot(ms) {
  const frames = Math.round(ms / FRAME);
  for (let i = 0; i < frames; i++) {
    await page.clock.runFor(FRAME);
    await page.screenshot({ path: path.join(tmp, String(n++).padStart(4, '0') + '.png') });
  }
}
async function scrollTo(sel, ms) {
  const from = await page.evaluate(() => window.scrollY);
  const to = await page.locator(sel).evaluate((el) => el.offsetTop - 70);
  const frames = Math.round(ms / FRAME);
  for (let i = 1; i <= frames; i++) {
    const t = i / frames, e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), from + (to - from) * e);
    await page.clock.runFor(FRAME);
    await page.screenshot({ path: path.join(tmp, String(n++).padStart(4, '0') + '.png') });
  }
}

await shoot(3600);                    /* ulazi na scenu i pozdravlja */
await page.mouse.move(W * 0.25, H * 0.3);
await shoot(900);                     /* oči prate kursor */
await page.mouse.move(W * 0.9, H * 0.9);
await shoot(700);
await scrollTo('#projects', 900);
await shoot(3200);                    /* hoda lijevo i pokazuje projekte */
await scrollTo('#services', 900);
await shoot(3200);                    /* hoda desno */
await page.locator('.bot').click();   /* trik i meni */
await shoot(2200);
await browser.close();
server.kill();

fs.mkdirSync(OUT, { recursive: true });
const gif = path.join(OUT, NAME + '.gif');
const mp4 = path.join(OUT, NAME + '.mp4');
const scale = process.env.GIF_SCALE || '720';
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, '%04d.png'),
  '-vf', `scale=${scale}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=160:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`, gif]);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, '%04d.png'),
  '-vf', 'scale=1280:-2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', mp4]);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(gif, (fs.statSync(gif).size / 1e6).toFixed(1) + ' MB,', n, 'sličica');
