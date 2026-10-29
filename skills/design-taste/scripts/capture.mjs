#!/usr/bin/env node
/**
 * Local browser evidence capture and limited DOM hygiene diagnostics.
 * It cannot score aesthetics, native UI or gameplay quality.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

function parse(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--allow-remote' || arg === '--force' || arg === '--help') {
      opts[arg.slice(2)] = true;
    } else if (['--url', '--platform', '--out'].includes(arg) && argv[i + 1]) {
      opts[arg.slice(2)] = argv[++i];
    } else {
      throw new Error('Unknown or incomplete option: ' + arg);
    }
  }
  return opts;
}

const sizes = {
  web: [[390, 844], [768, 1024], [1440, 900]],
  app: [[390, 844], [834, 1112], [1280, 800]],
  game: [[390, 844], [844, 390], [1280, 720]],
};

async function main() {
  const options = parse(process.argv.slice(2));
  if (options.help) {
    console.log('Usage: node capture.mjs --url http://127.0.0.1:4173 --platform web|app|game --out .design-taste/evidence [--force] [--allow-remote]');
    return;
  }
  const platform = options.platform;
  if (!options.url || !sizes[platform]) {
    throw new Error('Supply --url and --platform web|app|game');
  }
  const url = new URL(options.url);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Only http(s) URLs can be captured');
  }
  const allowed = new Set(['localhost', '127.0.0.1', '[::1]']);
  if (!allowed.has(url.hostname) && !options['allow-remote']) {
    throw new Error('Only local URLs by default. Review external destinations and pass --allow-remote explicitly.');
  }
  const output = path.resolve(options.out || '.design-taste/evidence');
  const reportPath = path.join(output, 'report.json');
  if (!options.force && await fs.stat(reportPath).then(() => true).catch(() => false)) {
    throw new Error('Evidence already exists. Use --force to recapture.');
  }

  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    throw new Error('Playwright missing. Install in your project with npm install -D playwright, then npx playwright install chromium.');
  }
  const browser = await chromium.launch({headless: true});
  const views = [];
  try {
    await fs.mkdir(output, {recursive: true});
    for (const [width, height] of sizes[platform]) {
      const page = await browser.newPage({viewport: {width, height}, deviceScaleFactor: 1});
      try {
        await page.goto(url.href, {waitUntil: 'domcontentloaded', timeout: 30000});
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(350);
        const observations = await page.evaluate(() => {
          const visible = (el) => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden'
              && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0
              && rect.bottom > 0 && rect.top < window.innerHeight;
          };
          const brokenImages = [...document.querySelectorAll('img')]
            .filter((el) => el.complete && el.naturalWidth === 0)
            .slice(0, 12).map((el) => ({alt: el.alt, src: el.getAttribute('src')}));
          const controls = [...document.querySelectorAll('button, a[href], input:not([type="hidden"]), select, textarea, [role="button"]')]
            .filter(visible).map((el) => {
              const r = el.getBoundingClientRect();
              return {tag: el.tagName.toLowerCase(), label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 50),
                width: Math.round(r.width), height: Math.round(r.height)};
            });
          const tinyControls = window.innerWidth <= 480
            ? controls.filter((el) => el.width < 44 || el.height < 44).slice(0, 20) : [];
          const namelessButtons = [...document.querySelectorAll('button, [role="button"]')]
            .filter(visible)
            .filter((el) => !(el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.textContent || '').trim())
            .length;
          return {
            viewportWidth: window.innerWidth,
            documentWidth: document.documentElement.scrollWidth,
            horizontalOverflowPx: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
            brokenImages, visibleControls: controls.length, tinyControls,
            namelessButtons, documentTitleMissing: !document.title.trim(),
          };
        });
        const filename = platform + '-' + width + 'x' + height + '.png';
        await page.screenshot({path: path.join(output, filename), fullPage: platform !== 'game'});
        views.push({width, height, screenshot: filename, observations});
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  const findings = [];
  for (const view of views) {
    const o = view.observations;
    const context = view.width + 'x' + view.height;
    if (o.horizontalOverflowPx > 1) findings.push({viewport: context, issue: 'horizontal-overflow', count: o.horizontalOverflowPx});
    if (o.brokenImages.length) findings.push({viewport: context, issue: 'broken-images', count: o.brokenImages.length});
    if (o.tinyControls.length) findings.push({viewport: context, issue: 'small-visible-touch-targets', count: o.tinyControls.length});
    if (o.namelessButtons) findings.push({viewport: context, issue: 'unlabeled-buttons', count: o.namelessButtons});
    if (o.documentTitleMissing) findings.push({viewport: context, issue: 'missing-document-title', count: 1});
  }
  const report = {
    schemaVersion: 1, platform, url: url.href, capturedAt: new Date().toISOString(),
    scope: 'DOM hygiene only. Human/agent screenshot critique and native runtime review required.',
    views, findings,
  };
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log('Captured ' + views.length + ' viewports in ' + output + ', warnings: ' + findings.length);
  console.log('Inspect screenshot PNG files and report.json; this is not a visual-quality pass.');
}

main().catch((error) => {
  console.error('ERROR: ' + error.message);
  process.exitCode = 2;
});
