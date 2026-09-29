/**
 * End-to-end smoke test of the static export.
 *
 *   npm run build && npm start          (serves ./out on :4173)
 *   npm run verify                      (offline agent)
 *   SOLVO_MOCK=1 npm run verify         (needs a build with NEXT_PUBLIC_SOLVO_* set; Solvo is mocked)
 *
 * WebGL runs on SwiftShader in headless Chromium, so the stage is forced to its
 * low tier (?stage=low) — or off — to keep the run fast and deterministic.
 */
import { chromium, devices } from 'playwright';

const BASE = process.env.VERIFY_URL ?? 'http://localhost:4173';
const MOCK_SOLVO = process.env.SOLVO_MOCK === '1';
const CHAPTERS = ['handshake', 'origin', 'capabilities', 'lab', 'work', 'stack', 'process', 'handoff'];

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
};

const collectErrors = (page) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    // The browser logs the deliberately triggered 429 as a failed resource; that's the scenario under test.
    if (message.type() === 'error' && !/status of 429/.test(message.text())) errors.push(message.text());
  });
  return errors;
};

/** Minimal fake of Solvo's public web-chat channel (panel-ia-api, F12). */
const mockSolvo = async (page) => {
  let sent = 0;
  await page.route('**/api/publico/chat/**', async (route) => {
    const request = route.request();
    const cors = {
      'access-control-allow-origin': new URL(BASE).origin,
      'access-control-allow-headers': 'Content-Type, Authorization',
    };
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    const path = new URL(request.url()).pathname.split('/').pop();
    const json = (status, body) =>
      route.fulfill({ status, headers: { ...cors, 'content-type': 'application/json' }, body: JSON.stringify(body) });
    if (path === 'sesion') {
      return json(200, {
        pase: 'test-pass',
        apariencia: { color: '#01E3FD', saludo: 'Hola', posicion: 'derecha', nombreVisible: 'Nine' },
        mensajes: [],
      });
    }
    if (path === 'mensajes' && request.method() === 'POST') {
      sent += 1;
      if (sent > 1) return json(429, { error: 'TooManyRequests', message: 'Estás escribiendo muy rápido.' });
      const { texto } = JSON.parse(request.postData() ?? '{}');
      return json(200, {
        estado: 'respondido',
        mensajes: [
          { id: 'v1', autor: 'visitante', texto, enviadoAt: new Date().toISOString(), adjunto: null },
          {
            id: 'a1',
            autor: 'negocio',
            texto: 'Solvo es un *agente comercial* para WhatsApp.\n- 15 herramientas\n- guardarraíles en código',
            enviadoAt: new Date().toISOString(),
            adjunto: null,
          },
        ],
      });
    }
    if (path === 'mensajes') return json(200, { mensajes: [] });
    return json(404, { message: 'Este chat no está disponible.' });
  });
};

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

try {
  // 1. Exported HTML carries the content (SEO), before any JavaScript runs.
  const html = await (await fetch(`${BASE}/`)).text();
  check(
    'exported HTML contains the H1 and every chapter',
    html.includes('id="hero-title"') && CHAPTERS.every((id) => html.includes(`id="${id}"`)),
  );
  const esHtml = await (await fetch(`${BASE}/es/`)).text();
  check('/es/ is prerendered in Spanish', esHtml.includes('<html lang="es"') && esHtml.includes('Construyo software'));
  check('hreflang alternates are declared', html.includes('hrefLang="es"') || html.includes('hreflang="es"'));

  // 2. Desktop tour with the WebGL stage.
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US' });
  const page = await context.newPage();
  const errors = collectErrors(page);
  if (MOCK_SOLVO) await mockSolvo(page);
  await page.goto(`${BASE}/?stage=low`, { waitUntil: 'commit' });
  await page.waitForSelector('.d9-preloader[data-phase="loading"]', { timeout: 5000 });
  check('preloader shows while the mark assembles', (await page.locator('html[data-loading="on"]').count()) === 1);
  await page.waitForFunction(() => !document.documentElement.dataset.loading, null, { timeout: 15000 });
  await page.waitForTimeout(1500);
  check('preloader hands over to the tour', (await page.locator('.d9-preloader').count()) === 0);
  check('WebGL stage mounted', (await page.locator('.d9-stage canvas').count()) === 1);

  const trackX = () =>
    page.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('[data-track]')).transform).m41);
  await page.mouse.move(700, 450);
  await page.mouse.wheel(0, 1600);
  await page.waitForTimeout(1500);
  check('wheel travels the horizontal tour', (await trackX()) < -800, `track x ${Math.round(await trackX())}`);

  await page.getByRole('button', { name: /Talk to/ }).click();
  await page.getByRole('button', { name: 'Show me the work' }).click();
  await page.waitForTimeout(3500);
  const current = await page.locator('nav[aria-label="Chapters"] a[aria-current="step"]').getAttribute('href');
  check('quick reply navigates to the Work chapter', current === '#work', `rail at ${current}`);

  await page.locator('textarea').fill('What is Solvo?');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);
  const log = page.locator('[role="log"]');
  if (MOCK_SOLVO) {
    check(
      'live agent reply is rendered from markdown',
      (await log.locator('strong', { hasText: 'agente comercial' }).count()) === 1,
    );
    check('agent name comes from Solvo', (await page.locator('h2', { hasText: 'Nine' }).count()) > 0);
    await page.locator('textarea').fill('Another one');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);
    check(
      'rate limit is explained to the visitor',
      (await page
        .getByRole('alert')
        .filter({ hasText: /too fast|a bit fast/i })
        .count()) === 1,
    );
  } else {
    check('offline agent answers honestly', (await log.getByText(/offline mode/i).count()) > 0);
  }
  check('no console errors on desktop', errors.length === 0, errors.join(' | '));
  await context.close();

  // 3. Reduced motion: poster instead of WebGL, no pinned sections.
  const calm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const calmPage = await calm.newPage();
  await calmPage.goto(`${BASE}/`, { waitUntil: 'load' });
  await calmPage.waitForTimeout(2000);
  check('reduced motion skips the preloader', (await calmPage.locator('html[data-loading]').count()) === 0);
  check('reduced motion shows the poster, not WebGL', (await calmPage.locator('.d9-stage canvas').count()) === 0);
  check('reduced motion keeps a vertical page (no pins)', (await calmPage.locator('.pin-spacer').count()) === 0);
  await calm.close();

  // 4. Mobile + first-visit language redirect.
  const phone = await browser.newContext({ ...devices['iPhone 13'], locale: 'es-419' });
  const phonePage = await phone.newPage();
  const phoneErrors = collectErrors(phonePage);
  await phonePage.goto(`${BASE}/?stage=off`, { waitUntil: 'load' });
  await phonePage.waitForFunction(() => !document.documentElement.dataset.loading, null, { timeout: 15000 });
  await phonePage.waitForTimeout(1000);
  check('Spanish browsers land on /es/', new URL(phonePage.url()).pathname === '/es/');
  check('phones keep the vertical layout', (await phonePage.locator('.pin-spacer').count()) === 0);
  check('no console errors on mobile', phoneErrors.length === 0, phoneErrors.join(' | '));
  await phone.close();
} finally {
  await browser.close();
}

const failed = results.filter((result) => !result.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length > 0 ? 1 : 0);
