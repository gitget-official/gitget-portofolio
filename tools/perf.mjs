/*
 * Mjerenje brzine: Lighthouse na usporenom mobitelu (Moto G Power, spori 4G,
 * 4x sporiji procesor), 3 mjerenja, prikazuje medijan.
 *
 *   node tools/perf.mjs [url]
 *
 * Bez argumenta pokreće lokalni server (tools/serve.mjs) koji radi kao Cloudflare.
 * Izvještaj se snima u reports/.
 */
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let url = process.argv[2];
let server;
if (!url) {
  server = spawn(process.execPath, [path.join(ROOT, 'tools/serve.mjs'), '8282'], { stdio: 'ignore' });
  url = 'http://localhost:8282/';
  await new Promise((r) => setTimeout(r, 800));
}

const chromePath = process.env.CHROME_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const runs = [];
for (let i = 0; i < 3; i++) {
  const chrome = await chromeLauncher.launch({ chromePath, chromeFlags: ['--headless=new', '--no-sandbox'] });
  const res = await lighthouse(url, { port: chrome.port, output: 'html', logLevel: 'error' });
  await chrome.kill();
  const a = res.lhr.audits;
  runs.push({
    perf: Math.round(res.lhr.categories.performance.score * 100),
    a11y: Math.round(res.lhr.categories.accessibility.score * 100),
    bp: Math.round(res.lhr.categories['best-practices'].score * 100),
    seo: Math.round(res.lhr.categories.seo.score * 100),
    fcp: a['first-contentful-paint'].numericValue,
    lcp: a['largest-contentful-paint'].numericValue,
    tbt: a['total-blocking-time'].numericValue,
    cls: a['cumulative-layout-shift'].numericValue,
    si: a['speed-index'].numericValue,
    report: res.report
  });
}
server?.kill();

runs.sort((x, y) => x.perf - y.perf);
const med = runs[1];
fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'reports/lighthouse-mobile.html'), med.report);

const ms = (v) => (v / 1000).toFixed(2) + ' s';
console.log('Lighthouse, mobitel (medijan od 3 mjerenja)');
console.log(`  Performance     ${med.perf}`);
console.log(`  Accessibility   ${med.a11y}`);
console.log(`  Best practices  ${med.bp}`);
console.log(`  SEO             ${med.seo}`);
console.log(`  FCP             ${ms(med.fcp)}`);
console.log(`  LCP             ${ms(med.lcp)}`);
console.log(`  Speed Index     ${ms(med.si)}`);
console.log(`  TBT             ${Math.round(med.tbt)} ms`);
console.log(`  CLS             ${med.cls.toFixed(3)}`);
console.log('  Sva mjerenja (performance): ' + runs.map((r) => r.perf).join(', '));
