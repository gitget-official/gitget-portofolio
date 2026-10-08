import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import crypto from 'node:crypto';

test('CSP hash odgovara inline skripti u index.html', () => {
  const html = fs.readFileSync('public/index.html', 'utf8');
  const inline = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const hash = crypto.createHash('sha256').update(inline).digest('base64');
  expect(fs.readFileSync('public/_headers', 'utf8')).toContain(`'sha256-${hash}'`);
});

test('zaglavlja: CSP, keširanje i kompresija', async ({ request }) => {
  const page = await request.get('/', { headers: { 'Accept-Encoding': 'br' } });
  expect(page.headers()['content-security-policy']).toContain("default-src 'self'");
  expect(page.headers()['cache-control']).toContain('must-revalidate');
  expect(page.headers()['content-encoding']).toBe('br');
  const font = await request.get('/fonts/manrope-latin.woff2');
  expect(font.headers()['cache-control']).toContain('immutable');
  const img = await request.get('/img/og.png');
  expect(img.status()).toBe(200);
  for (const p of ['/robots.txt', '/sitemap.xml', '/site.webmanifest', '/favicon.svg', '/apple-touch-icon.png']) {
    expect((await request.get(p)).status(), p).toBe(200);
  }
  expect((await request.get('/nema-ovoga')).status()).toBe(404);
});
