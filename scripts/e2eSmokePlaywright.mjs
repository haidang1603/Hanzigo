import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PREVIEW_PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PREVIEW_PORT}`;
const ROUTES = ['/', '/#home', '/#hsk', '/#community', '/#materials', '/#vocabulary', '/#classroom'];
const VIEWPORTS = [
  { name: 'mobile-360x800', width: 360, height: 800 },
  { name: 'desktop-1440x900', width: 1440, height: 900 },
];

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Preview server did not become ready within ${timeoutMs}ms`);
}

async function run() {
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const server = spawn(
    npmCmd,
    ['run', 'preview', '--', '--port', String(PREVIEW_PORT), '--host', '127.0.0.1'],
    { stdio: 'inherit' }
  );

  let browser;
  try {
    await waitForServer(BASE_URL);
    browser = await chromium.launch({ headless: true });

    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await context.newPage();

      const consoleErrors = [];
      const pageErrors = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          // Ignore expected network errors in offline/unconfigured CI preview
          if (!text.includes('ERR_NAME_NOT_RESOLVED') && !text.includes('Failed to load resource')) {
            consoleErrors.push(text);
          }
        }
      });
      page.on('pageerror', (err) => {
        pageErrors.push(err?.message || String(err));
      });

      for (const route of ROUTES) {
        await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(800);

        const metrics = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          bodyTextLen: (document.body?.innerText || '').trim().length,
          hasErrorShield: (document.body?.innerText || '').includes('Khu vực này vừa gặp sự cố kỹ thuật'),
        }));

        if (metrics.hasErrorShield) {
          throw new Error(`Error boundary triggered on ${route} (${vp.name})`);
        }
        if (metrics.bodyTextLen === 0) {
          throw new Error(`Empty render on ${route} (${vp.name})`);
        }
        if (metrics.scrollWidth > metrics.innerWidth + 1) {
          throw new Error(
            `Horizontal overflow on ${route} (${vp.name}): scrollWidth=${metrics.scrollWidth} > innerWidth=${metrics.innerWidth}`
          );
        }
      }

      if (consoleErrors.length > 0) {
        throw new Error(`Console errors (${vp.name}): ${consoleErrors.join(' | ')}`);
      }
      if (pageErrors.length > 0) {
        throw new Error(`Uncaught pageerrors (${vp.name}): ${pageErrors.join(' | ')}`);
      }

      await context.close();
      console.log(`✅ E2E Smoke PASS (${vp.name}) across ${ROUTES.join(', ')}`);
    }
  } finally {
    if (browser) await browser.close();
    server.kill('SIGTERM');
  }
}

run().catch((err) => {
  console.error('❌ E2E Smoke FAILED:', err);
  process.exit(1);
});
