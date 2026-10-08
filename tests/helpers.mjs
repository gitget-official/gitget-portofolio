/* Zajedničke pomoćne funkcije za testove */

export const WIDTHS = [360, 390, 768, 1024, 1440];
export const LANGS = ['en', 'bs'];

/* Prati greške i upozorenja u konzoli */
export function watchConsole(page) {
  const problems = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') problems.push(`${m.type()}: ${m.text()}`);
  });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => problems.push(`requestfailed: ${r.url()}`));
  return problems;
}

export async function open(page, lang = 'en') {
  await page.goto(lang === 'bs' ? '/?lang=bs' : '/');
  await page.waitForFunction(() => window.gitgetBot && document.querySelector('.bot.ready'));
}

/* Vidljivi tekst i dugmad koje robotić (ili njegov oblačić) prekriva */
export async function overlaps(page, selector) {
  return page.evaluate((sel) => {
    const target = document.querySelector(sel);
    if (!target) return [];
    const box = target.getBoundingClientRect();
    if (box.width === 0) return [];
    /* gledamo samo vidljivi dio ekrana: ispod headera i iznad donje trake */
    const top = document.querySelector('.site-header').getBoundingClientRect().bottom;
    const dock = document.querySelector('.bot-dock');
    const bottom = dock && getComputedStyle(dock).display !== 'none' ? dock.getBoundingClientRect().top : innerHeight;
    const vis = { left: box.left, right: box.right, top: Math.max(box.top, top), bottom: Math.min(box.bottom, bottom) };
    if (vis.bottom - vis.top <= 2) return [];
    const els = document.querySelectorAll('main h1, main h2, main h3, main p, main a, main button, main li, .site-footer a, .site-footer p, .site-header a, .site-header button');
    const hits = [];
    els.forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('[hidden]')) return;
      for (const r of el.getClientRects()) {
        const w = Math.min(r.right, vis.right) - Math.max(r.left, vis.left);
        const h = Math.min(r.bottom, vis.bottom) - Math.max(r.top, vis.top);
        if (w > 2 && h > 2) {
          hits.push(`${el.tagName.toLowerCase()} "${(el.textContent || '').trim().slice(0, 30)}"`);
          break;
        }
      }
    });
    return hits;
  }, selector);
}

/* Sačeka da robotić stigne na svoje mjesto i stane */
export async function waitBotSettled(page) {
  await page.waitForTimeout(300);
  await page.waitForFunction(() => {
    const s = window.gitgetBot.state();
    return !s.walking && Math.abs(s.x - s.tx) < 1 && Math.abs(s.y - s.ty) < 1 && Math.abs(s.s - s.ts) < 0.01;
  }, null, { polling: 100, timeout: 15000 });
  await page.waitForTimeout(400);
}
