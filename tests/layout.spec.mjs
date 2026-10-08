import { test, expect } from '@playwright/test';
import { WIDTHS, LANGS, watchConsole, open, overlaps, waitBotSettled } from './helpers.mjs';

for (const width of WIDTHS) {
  for (const lang of LANGS) {
    test(`raspored ${width}px ${lang}: bez grešaka i bez horizontalnog skrola`, async ({ page }) => {
      const problems = watchConsole(page);
      await page.setViewportSize({ width, height: width < 800 ? 800 : 900 });
      await open(page, lang);

      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('#projects-title')).toHaveText(lang === 'bs' ? 'Projekti' : 'Projects');

      /* skrolanje kroz cijelu stranicu, sekciju po sekciju */
      const sections = await page.locator('[data-bot-section]').evaluateAll((s) => s.map((x) => x.id));
      for (const id of sections) {
        await page.locator('#' + id).evaluate((el) => window.scrollTo({ top: el.offsetTop - 70, behavior: 'instant' }));
        await page.waitForTimeout(120);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `horizontalni skrol u sekciji ${id}`).toBeLessThanOrEqual(0);
      }
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
      await page.waitForTimeout(300);

      /* sve slike učitane */
      const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
      expect(broken).toEqual([]);

      expect(problems).toEqual([]);
    });
  }

  test(`robotić ${width}px: kad stoji, ne prekriva tekst ni dugmad`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 800 ? 800 : 900 });
    await open(page);
    const sections = await page.locator('[data-bot-section]').evaluateAll((s) => s.map((x) => x.id));
    for (const id of sections) {
      await page.locator('#' + id).evaluate((el) => window.scrollTo({ top: Math.max(0, el.offsetTop - 70), behavior: 'instant' }));
      await waitBotSettled(page);
      const hits = await overlaps(page, '#rb-root');
      expect(hits, `robotić prekriva sadržaj u sekciji ${id}`).toEqual([]);
      const bubbleShown = await page.locator('.bot-bubble.show').count();
      if (bubbleShown) {
        const bh = await overlaps(page, '.bot-bubble.show');
        expect(bh, `oblačić prekriva sadržaj u sekciji ${id}`).toEqual([]);
      }
    }
  });
}
