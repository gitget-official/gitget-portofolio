/*
 * Pravi Open Graph sliku (1200x630) u gitget stilu.
 *   node tools/make-og.mjs
 *
 * Robotić se uzima iz public/js/robot.js, da bude isti lik kao na stranici.
 */
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const robotJs = fs.readFileSync(path.join(ROOT, 'public/js/robot.js'), 'utf8');
const gSrc = robotJs.match(/var G = '[^']*';/)[0];
const svgSrc = robotJs.match(/var SVG =[\s\S]*?'<\/svg>';/)[0];
const ctx = {};
vm.runInNewContext(gSrc + svgSrc + ';this.SVG = SVG;', ctx);
const robot = ctx.SVG
  .replace('<g id="rb-armL">', '<g id="rb-armL" transform="rotate(14 948 210)">')
  .replace('<g id="rb-armR">', '<g id="rb-armR" transform="rotate(20 1072 212)">')
  .replace(/<ellipse class="bot-focus"[^>]*>/, '');

const font = (f) => 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'public/fonts', f)).toString('base64');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Manrope;src:url(${font('manrope-latin.woff2')}) format('woff2');font-weight:200 800}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;font-family:Manrope;color:#F1EEFF;
background:linear-gradient(90deg,#0F0B2C,#140F38 55%,#1D164A)}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.1) 1.4px,transparent 1.8px);background-size:28px 28px;
-webkit-mask-image:linear-gradient(90deg,rgba(0,0,0,.35),#000 50%,rgba(0,0,0,.6))}
.glow{position:absolute;width:820px;height:820px;right:-150px;top:-95px;background:radial-gradient(closest-side,rgba(46,35,120,.95),rgba(46,35,120,0))}
.copy{position:absolute;left:84px;top:118px}
h1{font-size:176px;font-weight:800;letter-spacing:-.055em;line-height:1}
.s{font-size:40px;font-weight:600;color:#C9C0FF;margin-top:18px;display:flex;align-items:center;gap:8px}
.s i{width:4px;height:42px;background:#A89DF9;border-radius:2px}
ul{display:flex;gap:12px;list-style:none;padding:0;margin-top:40px}
li{font-size:22px;padding:8px 20px;border-radius:999px;color:#DCD6FF;background:rgba(168,157,249,.14);border:1.5px solid rgba(168,157,249,.45);display:flex;align-items:center;gap:10px}
li:before{content:"";width:9px;height:9px;border-radius:50%;background:#A89DF9}
.bot{position:absolute;right:70px;top:46px;width:430px}
.star{position:absolute;width:18px;height:18px;background:#C9C0FF;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)}
.p{position:absolute;border-radius:50%;background:#C9C0FF}
.frame{position:absolute;inset:0;border:2px solid rgba(168,157,249,.2);border-radius:0}
</style></head><body>
<div class="dots"></div><div class="glow"></div>
<span class="star" style="left:700px;top:96px"></span><span class="star" style="left:1130px;top:80px;transform:scale(.7)"></span><span class="star" style="left:1120px;top:420px;transform:scale(.9)"></span>
<span class="p" style="left:720px;top:470px;width:6px;height:6px"></span><span class="p" style="left:1080px;top:520px;width:5px;height:5px;opacity:.7"></span><span class="p" style="left:760px;top:300px;width:4px;height:4px;opacity:.6"></span>
<div class="copy"><h1>gitget</h1><p class="s">AI-driven web &amp; mobile apps<i></i></p>
<ul><li>Web apps</li><li>Mobile apps</li><li>AI features</li></ul></div>
<div class="bot">${robot}</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const shot = await page.screenshot();
await sharp(shot).png({ palette: true, quality: 92, compressionLevel: 9 }).toFile(path.join(ROOT, 'public/img/og.png'));
await browser.close();
console.log('public/img/og.png');
