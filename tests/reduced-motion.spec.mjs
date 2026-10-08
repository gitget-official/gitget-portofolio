import { test, expect } from '@playwright/test';
import { watchConsole, open, overlaps } from './helpers.mjs';

for (const width of [390, 1440]) {
  test(`prefers-reduced-motion ${width}px: robotić stoji miran`, async ({ page }) => {
    const problems = watchConsole(page);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);

    const s = await page.evaluate(() => window.gitgetBot.state());
    expect(s.reduced).toBe(true);
    expect(s.walking).toBe(false);

    /* bez petlje: transform se ne mijenja dok stoji */
    const read = () => page.locator('.bot').evaluate((b) => b.style.transform + '|' + b.querySelector('#rb-root').getAttribute('transform'));
    const a = await read();
    await page.waitForTimeout(800);
    expect(await read()).toBe(a);

    /* skrol: odmah je na novom mjestu, bez hodanja */
    await page.locator('#services').evaluate((el) => window.scrollTo({ top: el.offsetTop - 70, behavior: 'instant' }));
    await page.waitForTimeout(150);
    const s2 = await page.evaluate(() => window.gitgetBot.state());
    expect(s2.walking).toBe(false);
    const b1 = await read();
    await page.waitForTimeout(600);
    expect(await read()).toBe(b1);
    expect(await overlaps(page, '#rb-root')).toEqual([]);

    /* sadržaj je odmah vidljiv, čestice nema */
    const hidden = await page.evaluate(() => [...document.querySelectorAll('.reveal')].filter((e) => getComputedStyle(e).opacity !== '1').length);
    expect(hidden).toBe(0);
    await expect(page.locator('.particles i')).toHaveCount(0);

    /* klik i dalje otvara meni */
    await page.locator('.bot').click();
    await expect(page.locator('#bot-menu')).toBeVisible();
    expect(problems).toEqual([]);
  });
}
