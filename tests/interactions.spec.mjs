import { test, expect } from '@playwright/test';
import { watchConsole, open } from './helpers.mjs';

test('mobilni meni se otvara, zatvara i vodi na sekciju', async ({ page }) => {
  const problems = watchConsole(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  const btn = page.locator('.menu-btn');
  await expect(page.locator('#site-nav')).not.toBeVisible();
  await btn.click();
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#site-nav')).toBeVisible();
  await page.locator('#site-nav a[href="#services"]').click();
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#services-title')).toBeInViewport();
  await btn.click();
  await page.keyboard.press('Escape');
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  await expect(btn).toBeFocused();
  expect(problems).toEqual([]);
});

test('prekidač jezika mijenja tekst i pamti izbor', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  await expect(page.locator('.lang-btn[data-lang="en"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.lang-btn[data-lang="bs"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'bs');
  await expect(page.locator('#services-title')).toHaveText('Usluge');
  await expect(page.locator('.btn-primary[href="#projects"]')).toHaveText('Pogledaj projekte');
  await expect(page.locator('.btn-ghost[href="#contact"]').first()).toHaveText('Javi nam se');
  await expect(page).toHaveTitle(/gitget/);
  await page.reload();
  await page.waitForFunction(() => window.gitgetBot);
  await expect(page.locator('html')).toHaveAttribute('lang', 'bs');
  await expect(page.locator('#services-title')).toHaveText('Usluge');
  await page.locator('.lang-btn[data-lang="en"]').click();
  await expect(page.locator('#services-title')).toHaveText('Services');
});

for (const width of [390, 1440]) {
  test(`robotić ${width}px: klik pokaže trik i meni, meni vodi na kontakt`, async ({ page }) => {
    const problems = watchConsole(page);
    await page.setViewportSize({ width, height: 860 });
    await open(page);
    await page.waitForTimeout(1500);
    const bot = page.locator('.bot');
    await bot.click();
    await expect(page.locator('.bot-bubble.show')).toBeVisible();
    const menu = page.locator('#bot-menu');
    await expect(menu).toBeVisible();
    await expect(bot).toHaveAttribute('aria-expanded', 'true');
    await expect(menu.locator('[role="menuitem"]')).toHaveText(['Show projects', 'Services', 'Contact us']);
    await menu.getByRole('menuitem', { name: 'Contact us' }).click();
    await expect(menu).toBeHidden();
    await expect(page.locator('#contact-title')).toBeInViewport();
    expect(problems).toEqual([]);
  });
}

test('robotić radi tastaturom: Enter, strelice i Escape', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page, 'bs');
  await page.locator('.bot').focus();
  await page.keyboard.press('Enter');
  const items = page.locator('#bot-menu [role="menuitem"]');
  await expect(items).toHaveText(['Pokaži projekte', 'Usluge', 'Kontaktiraj nas']);
  await expect(items.first()).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(items.nth(1)).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await expect(items.nth(2)).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#bot-menu')).toBeHidden();
  await expect(page.locator('.bot')).toBeFocused();
});

const PROJECTS = ['myshishapedia', 'grabpoints', 'skipass', 'clinicnow', 'vetnow'];
for (const width of [390, 1440]) {
  test(`kartice projekata ${width}px otvaraju i zatvaraju detalje`, async ({ page }) => {
    const problems = watchConsole(page);
    await page.setViewportSize({ width, height: 860 });
    await open(page);
    const dialog = page.locator('#project-dialog');
    for (const id of PROJECTS) {
      const opener = page.locator(`[data-open="${id}"]`);
      await opener.scrollIntoViewIfNeeded();
      /* klik na sliku kartice (cijela kartica je klikabilna) */
      const media = await page.locator(`[data-project="${id}"] .project-media`).boundingBox();
      await page.mouse.click(media.x + media.width / 2, media.y + 30);
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('#pd-title')).toHaveText(await opener.textContent());
      await expect(dialog.locator('.pd-features li')).toHaveCount(5);
      await expect(dialog.locator('a[href^="https://github.com/"]')).toHaveCount(1);
      if (id === 'myshishapedia') await expect(dialog.locator('a[href="https://myshishapedia.com"]')).toHaveCount(1);
      else await expect(dialog.locator('.pd-note')).toBeVisible();
      const overflow = await dialog.evaluate((d) => d.scrollWidth - d.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      if (id === 'grabpoints') await dialog.locator('.pd-close').click();
      else await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(opener).toBeFocused();
    }
    /* tastatura: Enter na kartici */
    await page.locator('[data-open="skipass"]').focus();
    await page.keyboard.press('Enter');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    expect(problems).toEqual([]);
  });
}

test('detalji projekta se prevode kad se promijeni jezik', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page, 'bs');
  await page.locator('[data-open="vetnow"]').click();
  await expect(page.locator('#project-dialog h3').first()).toHaveText('Glavne funkcije');
  await expect(page.locator('#project-dialog .pd-links a')).toContainText('Izvorni kod');
});

test('dugme kopira email', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  await page.locator('#copy-email').scrollIntoViewIfNeeded();
  await page.locator('#copy-email').click();
  await expect(page.locator('#copy-status')).toHaveText('Email copied to clipboard.');
  await expect(page.locator('#copy-email')).toContainText('Copied!');
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  expect(clip).toBe('gitget.official@gmail.com');
  await expect(page.locator('a[href="mailto:gitget.official@gmail.com"]')).toHaveCount(1);
  await expect(page.locator('a[href="https://github.com/gitget-official"]')).toHaveCount(1);
});

test('animacije staju kad tab nije vidljiv', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('html')).toHaveClass(/paused/);
  const t1 = await page.locator('.bot').evaluate((b) => b.style.transform + b.innerHTML.length + document.querySelector('#rb-antGlow').getAttribute('opacity'));
  await page.waitForTimeout(700);
  const t2 = await page.locator('.bot').evaluate((b) => b.style.transform + b.innerHTML.length + document.querySelector('#rb-antGlow').getAttribute('opacity'));
  expect(t2).toBe(t1);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('html')).not.toHaveClass(/paused/);
});
