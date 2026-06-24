import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const BASE = 'https://work-fusion2026-client-y2f9.vercel.app';
const OUT = join(process.cwd(), 'assets');
mkdirSync(OUT, { recursive: true });

async function login(page, email, password) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="email"], input[placeholder*="company"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button:has-text("Sign In")');
  await page.waitForURL(/dashboard/, { timeout: 30000 });
}

async function capture(page, name, url, opts = {}) {
  if (url) await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: join(OUT, name),
    fullPage: opts.fullPage ?? false,
  });
  console.log('Saved', name);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

await capture(page, 'homepage.png', BASE, { fullPage: true });

await login(page, 'employer1@workfusion.com', 'password123');
await capture(page, 'employer-dashboard.png', `${BASE}/dashboard/employer`);
await capture(page, 'employer-applicants.png', `${BASE}/dashboard/employer/applicants`);

await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
await login(page, 'seeker1@workfusion.com', 'password123');
await capture(page, 'seeker-dashboard.png', `${BASE}/dashboard/seeker`);
await page.click('button:has-text("Explore")').catch(() => {});
await capture(page, 'seeker-explore.png', null);

await browser.close();
console.log('Done');
