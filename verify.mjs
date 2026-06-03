import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const errors = [];
page.on('pageerror', err => errors.push(err.message));

await page.setViewportSize({ width: 1280, height: 800 });
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
// Wait for hydration — much longer for dev mode
await page.waitForTimeout(12000);

const mainExists = await page.evaluate(() => !!document.querySelector('main#main'));
const text = await page.evaluate(() => document.body.innerText.substring(0, 200).replace(/\n/g, ' '));
console.log('main exists:', mainExists);
console.log('content:', text.substring(0, 120));
console.log('JS errors:', errors.length > 0 ? errors.join('\n') : 'NONE');
await browser.close();
