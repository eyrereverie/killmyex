import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import { createStaticServer, listen } from './static-server.mjs';

const port = 4173;
const server = createStaticServer({ port });

await listen(server, { port });

let browser;

try {
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
  const browserMessages = [];
  page.on('console', (message) => browserMessages.push(`${message.type()}: ${message.text()}`));
  page.on('pageerror', (error) => browserMessages.push(`pageerror: ${error.message}`));
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  const canvas = page.locator('canvas');
  await canvas.waitFor();
  await page.waitForTimeout(600);

  const size = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    return {
      width: canvas.width,
      height: canvas.height,
    };
  });

  if (size.width !== 390 || size.height !== 844) {
    throw new Error(`Expected a 390 x 844 canvas, got ${size.width} x ${size.height}.`);
  }

  const before = await canvas.screenshot();
  const uniqueBytes = new Set(before).size;
  if (before.length < 5000 || uniqueBytes < 50) {
    throw new Error(
      `Canvas rendered, but it looks unexpectedly blank. Screenshot bytes: ${before.length}, unique bytes: ${uniqueBytes}. Browser messages: ${browserMessages.join(' | ') || 'none'}`
    );
  }

  await page.keyboard.press('Enter');
  await page.waitForTimeout(350);

  const beforeHash = createHash('sha256').update(before).digest('hex');
  const afterHash = createHash('sha256').update(await canvas.screenshot()).digest('hex');
  if (afterHash === beforeHash) {
    throw new Error('Pressing Enter did not change the welcome screen.');
  }

  console.log('Welcome screen smoke test passed.');
} finally {
  if (browser) {
    await browser.close();
  }
  await new Promise((resolveClose) => server.close(resolveClose));
}
