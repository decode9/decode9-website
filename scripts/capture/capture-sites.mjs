/**
 * Captures desktop (1440×900) and mobile (390×844 @2x) screenshots of each
 * live case study into scripts/capture/.raw/<id>/{desktop,mobile}.png.
 * optimize-images.py then converts them to public/work/<id>/*.webp.
 * Per-site `click` (button labels) and `hideFixed` in sites.json clear banners and overlays.
 *
 *   npx playwright install chromium   (once)
 *   npm run capture:sites
 */
import { mkdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, devices } from 'playwright';

const here = dirname(fileURLToPath(import.meta.url));
const sites = JSON.parse(await readFile(join(here, 'sites.json'), 'utf8'));
const only = process.argv.slice(2);

const viewports = [
  { name: 'desktop', options: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
  { name: 'mobile', options: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } } },
];

/** Hides cookie banners and chat launchers that would cover the hero. */
const tidy = `
  [id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i],
  iframe[src*="chat" i], [class*="intercom" i], [id*="hubspot" i] { display: none !important; }
`;

const browser = await chromium.launch();
try {
  for (const site of sites.filter((entry) => only.length === 0 || only.includes(entry.id))) {
    for (const { name, options } of viewports) {
      const context = await browser.newContext({ ...options, locale: 'es-419', colorScheme: 'dark' });
      const page = await context.newPage();
      const target = join(here, '.raw', site.id, `${name}.png`);
      try {
        // Sites with live connections or ads never go idle: fall back to DOM ready + a settle delay.
        await page.goto(site.url, { waitUntil: 'networkidle', timeout: 25_000 }).catch(async () => {
          await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
          await page.waitForTimeout(5000);
        });
        await page.addStyleTag({ content: tidy });
        for (const text of site.click ?? []) {
          await page
            .getByRole('button', { name: text })
            .first()
            .click({ timeout: 3000 })
            .catch(() => undefined);
        }
        if (site.hideFixed) {
          // Overlays (bot challenges, banners) are fixed; the site header is sticky and stays.
          await page.evaluate(() =>
            document.querySelectorAll('body *').forEach((element) => {
              if (getComputedStyle(element).position === 'fixed')
                element.style.setProperty('display', 'none', 'important');
            }),
          );
        }
        await page.waitForTimeout(2500);
        await mkdir(dirname(target), { recursive: true });
        await page.screenshot({ path: target });
        console.log(`✓ ${site.id} ${name}`);
      } catch (error) {
        console.error(`✗ ${site.id} ${name}: ${error.message}`);
      } finally {
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}
