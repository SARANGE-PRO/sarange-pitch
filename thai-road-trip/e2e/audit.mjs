// Audit visuel + offline (exécuté manuellement : node e2e/audit.mjs)
import { chromium } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';
const OUT = process.env.SHOT_DIR ?? './shots';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

const viewports = [
  { name: 'iphone-375', width: 375, height: 812 },
  { name: 'iphone-390', width: 390, height: 844 },
  { name: 'iphone-430', width: 430, height: 932 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'desktop', width: 1280, height: 800 },
];

const routes = ['/', '/parcours', '/jour/d4', '/carte', '/budget', '/depart/d4', '/plus'];

for (const vp of viewports.slice(0, 2)) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    if (overflow) console.log(`⚠️ overflow horizontal ${vp.name} ${route}`);
    await page.screenshot({
      path: `${OUT}/${vp.name}${route.replaceAll('/', '_') || '_home'}.png`,
      fullPage: false,
    });
  }
  await ctx.close();
}

// Autres viewports : check overflow uniquement
for (const vp of viewports.slice(2)) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    if (overflow) console.log(`⚠️ overflow horizontal ${vp.name} ${route}`);
  }
  await ctx.close();
}

// Dark mode
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
  });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${OUT}/dark-home.png` });
  await page.goto(BASE + '/parcours', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${OUT}/dark-parcours.png` });
  await ctx.close();
}

// Offline : SW enregistré puis rechargement sans réseau
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => navigator.serviceWorker?.controller != null, null, { timeout: 15000 })
    .catch(() => console.log('⚠️ SW pas encore contrôleur, retry avec reload'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await ctx.setOffline(true);
  await page.goto(BASE + '/parcours', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  const heading = await page.textContent('h1').catch(() => null);
  console.log('offline /parcours h1 =', heading);
  const banner = await page.getByText('Hors connexion').first().isVisible().catch(() => false);
  console.log('bandeau hors connexion visible =', banner);
  await page.screenshot({ path: `${OUT}/offline-parcours.png` });
  await ctx.close();
}

await browser.close();
console.log('Audit terminé');
