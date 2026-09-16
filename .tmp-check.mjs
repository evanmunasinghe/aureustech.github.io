import { chromium } from 'playwright';
const base = '/private/tmp/claude-501/-Users-evanz-aureustech-github-io/25ebbb42-4457-4d48-8bde-42d91d874248/scratchpad';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3001/login/', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await page.screenshot({ path: `${base}/check-login.png` });
await browser.close();
console.log('done');
