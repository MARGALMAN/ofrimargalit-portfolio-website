import puppeteer from 'puppeteer';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';
const dir = './temporary screenshots';

if (!existsSync(dir)) mkdirSync(dir);

const existing = readdirSync(dir).filter(f => f.startsWith('screenshot-')).length;
const filename = join(dir, `screenshot-${existing + 1}${label}.png`);

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1500));
// Scroll through page to trigger IntersectionObserver reveals
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 300) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 120));
  }
  // Force all reveals visible in case observer missed any
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('vis'));
  window.scrollTo(0, 0);
});
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: filename, fullPage: true });
await browser.close();
console.log(`Saved: ${filename}`);
