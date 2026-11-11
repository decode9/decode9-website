/**
 * End-to-end smoke test of the static export.
 *
 *   npm run build && npm start          (serves ./out on :4173)
 *   npm run verify
 *
 * Checks:
 *  - the four routes answer 200, have lang="es" and load without page/console errors
 *    (expected network errors of an unconfigured API, news feeds or GA are ignored);
 *  - the legacy /es/ redirects to /;
 *  - the four legal pages answer 200, show the legal name and CUIL and declare their language
 *    (English pages mark the document container with lang="en");
 *  - on an iPhone, the red side of the entry goes to /decode9/movil/ (and to /decode9/ with ?escritorio=1);
 *  - the transmitter contact form sends (API mocked with page.route) or, when the build has no API URL,
 *    shows the «not sent» message.
 *
 * Env: VERIFY_URL (default http://localhost:4173), CHROME (browser executable; falls back to the
 * Playwright headless shell in ~/.cache/ms-playwright, then to Playwright's default).
 */
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { chromium, devices } from 'playwright';

const BASE = process.env.VERIFY_URL ?? 'http://localhost:4173';
const ROUTES = ['/', '/decode9/', '/decode9/movil/', '/perfil/'];
const EXPECTED_NETWORK_NOISE =
  /Failed to load resource|net::ERR_|CORS|Access-Control|googletagmanager|google-analytics|noticias|hacker-news|hn\.algolia|firebaseio/i;
const MOCK_RECEIPT = 'SOS-4242';
const LEGAL_NAME = 'Jorge Bastidas Araujo';
const LEGAL_CUIL = '20964746193';
const LEGAL_ROUTES = [
  { path: '/privacy/', lang: 'en' },
  { path: '/terms/', lang: 'en' },
  { path: '/es/privacidad/', lang: 'es' },
  { path: '/es/terminos/', lang: 'es' },
];

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
};

/** CHROME env → newest cached Playwright headless shell → Playwright's own default (CI). */
const resolveExecutable = () => {
  if (process.env.CHROME) return process.env.CHROME;
  const cache = join(homedir(), '.cache', 'ms-playwright');
  if (!existsSync(cache)) return undefined;
  const shells = readdirSync(cache)
    .filter((dir) => dir.startsWith('chromium_headless_shell-'))
    .sort()
    .reverse();
  for (const dir of shells) {
    const exe = join(cache, dir, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(exe)) return exe;
  }
  return undefined;
};

const launch = async () => {
  try {
    return await chromium.launch();
  } catch {
    const executablePath = resolveExecutable();
    if (!executablePath) throw new Error('No Chromium found: set CHROME or run `npx playwright install chromium`.');
    return chromium.launch({ executablePath });
  }
};

const watchErrors = (page) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !EXPECTED_NETWORK_NOISE.test(message.text())) errors.push(message.text());
  });
  return errors;
};

const checkRoutes = async (browser) => {
  const context = await browser.newContext();
  for (const route of ROUTES) {
    const page = await context.newPage();
    const errors = watchErrors(page);
    const response = await page.goto(`${BASE}${route}`, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    check(`${route} responds 200`, response?.status() === 200, String(response?.status()));
    check(`${route} has lang="es"`, (await page.getAttribute('html', 'lang')) === 'es');
    check(`${route} without page errors`, errors.length === 0, errors.join(' | '));
    await page.close();
  }
  const legacy = await context.newPage();
  await legacy.goto(`${BASE}/es/`);
  await legacy.waitForURL(`${BASE}/`, { timeout: 5000 }).catch(() => {});
  check('/es/ redirects to /', new URL(legacy.url()).pathname === '/', legacy.url());
  await context.close();
};

const checkLegalPages = async (browser) => {
  const context = await browser.newContext();
  for (const { path, lang } of LEGAL_ROUTES) {
    const page = await context.newPage();
    const errors = watchErrors(page);
    const response = await page.goto(`${BASE}${path}`, { waitUntil: 'load' });
    check(`${path} responds 200`, response?.status() === 200, String(response?.status()));
    const name = page.locator('[data-legal="name"]');
    check(`${path} shows the legal name`, (await name.textContent())?.trim() === LEGAL_NAME);
    check(`${path} shows the CUIL`, (await page.locator('[data-legal="cuil"]').textContent())?.trim() === LEGAL_CUIL);
    const docLang = await name.evaluate((el) => el.closest('[lang]')?.getAttribute('lang'));
    check(`${path} is marked lang="${lang}"`, docLang === lang, String(docLang));
    check(`${path} without page errors`, errors.length === 0, errors.join(' | '));
    await page.close();
  }
  await context.close();
};

const chooseRed = async (browser, query) => {
  const context = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await context.newPage();
  await page.goto(`${BASE}/${query}`, { waitUntil: 'load' });
  const cta = page.locator('a[aria-label^="Entra a decode9"]');
  await cta.waitFor({ state: 'attached' });
  await cta.dispatchEvent('click');
  await page.waitForURL(/\/decode9\//, { timeout: 15000 }).catch(() => {});
  const path = new URL(page.url()).pathname;
  await context.close();
  return path;
};

const checkMobileEntry = async (browser) => {
  const phone = await chooseRed(browser, '');
  check('iPhone: red side → /decode9/movil/', phone === '/decode9/movil/', phone);
  const forced = await chooseRed(browser, '?escritorio=1');
  check('iPhone + ?escritorio=1: red side → /decode9/', forced === '/decode9/', forced);
};

const checkContactForm = async (browser) => {
  const context = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await context.newPage();
  let apiHit = false;
  await page.route('**/senal', (route) => {
    apiHit = true;
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, code: MOCK_RECEIPT }) });
  });
  await page.goto(`${BASE}/decode9/movil/`, { waitUntil: 'load' });
  // the incoming call can cover the main screen: skip it when it shows up
  const skip = page.getByRole('button', { name: /SALTAR/ });
  if (await skip.waitFor({ state: 'visible', timeout: 3000 }).then(() => true, () => false)) await skip.click();
  const form = page.locator('form').filter({ has: page.locator('input[name="regreso"]') });
  await form.locator('input[name="alias"]').fill('verificador');
  await form.locator('input[name="regreso"]').fill('verifica@example.com');
  await form.locator('input[name="msg"]').fill('prueba automática');
  await form.locator('button[type="submit"]').click();
  const receipt = page.getByText(MOCK_RECEIPT);
  const failed = page.getByText('LA SEÑAL NO SALIÓ');
  await receipt.or(failed).first().waitFor({ timeout: 15000 }).catch(() => {});
  if (apiHit) {
    check('transmitter contact: sends and shows the receipt (mocked API)', await receipt.isVisible());
  } else {
    check('transmitter contact: no API configured → «not sent» message', await failed.isVisible());
  }
  await context.close();
};

const browser = await launch();
try {
  await checkRoutes(browser);
  await checkLegalPages(browser);
  await checkMobileEntry(browser);
  await checkContactForm(browser);
} finally {
  await browser.close();
}

const failedChecks = results.filter((result) => !result.ok);
console.log(`\n${results.length - failedChecks.length}/${results.length} checks passed`);
process.exit(failedChecks.length ? 1 : 0);
