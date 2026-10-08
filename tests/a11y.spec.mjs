import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { open } from './helpers.mjs';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

async function scan(page) {
  const res = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  return res.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
}

for (const width of [390, 1440]) {
  for (const lang of ['en', 'bs']) {
    test(`axe ${width}px ${lang}: stranica`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page, lang);
      expect(await scan(page)).toEqual([]);
    });
  }

  test(`axe ${width}px: otvoreni detalji projekta i meni robotića`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await page.locator('[data-open="myshishapedia"]').click();
    await page.waitForTimeout(300);
    expect(await scan(page)).toEqual([]);
    await page.keyboard.press('Escape');
    await page.locator('.bot').click();
    await expect(page.locator('#bot-menu')).toBeVisible();
    expect(await scan(page)).toEqual([]);
  });

  if (width === 390) {
    test('axe 390px: otvoren mobilni meni', async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page);
      await page.locator('.menu-btn').click();
      expect(await scan(page)).toEqual([]);
    });
  }
}

test('404 stranica', async ({ page }) => {
  const r = await page.goto('/404.html');
  expect(r.status()).toBeLessThan(500);
  expect(await scan(page)).toEqual([]);
});
