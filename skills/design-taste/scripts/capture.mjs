#!/usr/bin/env node
/**
 * Capture user-authorized local web app/game surfaces at a state/viewport matrix.
 * DOM checks find objective defects only; subjective visual quality requires review.
 *
 * Node >=22, installed Playwright + Chromium. No API keys or auto dependency installs.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_SIZES = {
  web: [[390, 844], [768, 1024], [1440, 900]],
  app: [[390, 844], [834, 1112], [1280, 800]],
  game: [[390, 844], [844, 390], [1280, 720]],
};
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);
const SLUG = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,62}$/;

function parse(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (['--force', '--allow-remote', '--help'].includes(arg)) {
      options[arg.slice(2)] = true;
    } else if (['--url', '--platform', '--out', '--manifest'].includes(arg) && argv[i + 1]) {
      options[arg.slice(2)] = argv[++i];
    } else {
      throw new Error('Unknown or incomplete option: ' + arg);
    }
  }
  return options;
}

function checkedUrl(input, options) {
  const url = new URL(input);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('Use an http(s) URL without embedded credentials');
  }
  if (!LOCAL_HOSTS.has(url.hostname) && !options['allow-remote']) {
    throw new Error('Localhost only by default; --allow-remote requires authorized target review');
  }
  return url;
}

function checkedSize(v) {
  if (!v || !Number.isInteger(v.width) || !Number.isInteger(v.height) ||
      v.width < 280 || v.width > 2560 || v.height < 240 || v.height > 1800) {
    throw new Error('Viewport must have integer width [280,2560], height [240,1800]');
  }
  return {width: v.width, height: v.height};
}

function checkedScreen(screen, baseUrl, defaults) {
  if (!screen || !SLUG.test(screen.name) || !SLUG.test(screen.state || 'default')) {
    throw new Error('Screen name and state must be short safe slugs');
  }
  const relative = screen.path || '/';
  if (typeof relative !== 'string' || !relative.startsWith('/') || relative.startsWith('//')) {
    throw new Error('Screen path must be a same-origin absolute route beginning with /');
  }
  const href = new URL(relative, baseUrl);
  if (href.origin !== baseUrl.origin || href.username || href.password) {
    throw new Error('Screens must stay on the authorized site origin');
  }
  const viewports = screen.viewports ?? defaults;
  if (!Array.isArray(viewports) || viewports.length < 1 || viewports.length > 6) {
    throw new Error('Each screen requires 1–6 target viewports');
  }
  if (screen.expectText != null && (!Array.isArray(screen.expectText) ||
      screen.expectText.some(x => typeof x !== 'string' || !x.trim() || x.length > 200))) {
    throw new Error('expectText must be an array of short nonempty strings');
  }
  return {
    name: screen.name, state: screen.state || 'default',
    url: href.href, viewports: viewports.map(checkedSize),
    expectText: screen.expectText || [],
    fullPage: screen.fullPage == null ? null : Boolean(screen.fullPage),
  };
}

async function loadPlan(options, baseUrl, platform) {
  if (!options.manifest) {
    const screen = {
      name: 'current', state: 'default', path: baseUrl.pathname + baseUrl.search,
      viewports: DEFAULT_SIZES[platform].map(([width, height]) => ({width, height})),
    };
    return [checkedScreen(screen, baseUrl, DEFAULT_SIZES[platform])];
  }
  const raw = JSON.parse(await fs.readFile(path.resolve(options.manifest), 'utf8'));
  if (raw.schema_version !== 1 || !Array.isArray(raw.screens) ||
      raw.screens.length < 1 || raw.screens.length > 20) {
    throw new Error('Capture manifest requires schema_version=1 and 1–20 screens');
  }
  const defaults = DEFAULT_SIZES[platform].map(([width, height]) => ({width, height}));
  const screens = raw.screens.map(s => checkedScreen(s, baseUrl, defaults));
  const seen = new Set();
  for (const screen of screens) {
    for (const size of screen.viewports) {
      const key = [screen.name, screen.state, size.width, size.height].join(':');
      if (seen.has(key)) throw new Error('Duplicate screen/state/viewport: ' + key);
      seen.add(key);
    }
  }
  return screens;
}

function issue(view, code, count, nextAction) {
  return {
    screen: view.screen, state: view.state,
    viewport: view.width + 'x' + view.height,
    code, count, confidence: 'DOM-only', nextAction,
  };
}

async function capturePlan(options, baseUrl, platform, screens, out) {
  let chromium;
  try { ({chromium} = await import('playwright')); }
  catch { throw new Error('Playwright missing. In the host project run npm install -D playwright and npx playwright install chromium.'); }

  const browser = await chromium.launch({headless: true});
  const views = [];
  try {
    await fs.mkdir(out, {recursive: true});
    for (const screen of screens) {
      for (const {width, height} of screen.viewports) {
        const page = await browser.newPage({viewport: {width, height}, deviceScaleFactor: 1});
        const pageErrors = [];
        page.on('pageerror', e => pageErrors.push(e.message.slice(0, 300)));
        try {
          await page.goto(screen.url, {waitUntil: 'load', timeout: 30000});
          const actual = new URL(page.url());
          if (actual.origin !== baseUrl.origin) {
            throw new Error('Redirected away from authorized origin: ' + actual.origin);
          }
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(400);
          const observations = await page.evaluate(() => {
            const visible = (el) => {
              const r = el.getBoundingClientRect();
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden' &&
                Number(style.opacity) !== 0 && r.width > 0 && r.height > 0 &&
                r.bottom > 0 && r.top < window.innerHeight &&
                r.right > 0 && r.left < window.innerWidth;
            };
            const brokenImages = [...document.querySelectorAll('img')]
              .filter(img => img.complete && img.naturalWidth === 0).slice(0, 20)
              .map(img => ({alt: img.alt, src: img.getAttribute('src')}));
            const buttons = [...document.querySelectorAll('button, a[href], input:not([type="hidden"]), select, textarea, [role="button"]')]
              .filter(visible);
            const tinyTargets = window.innerWidth <= 480 ? buttons
              .map(el => { const r = el.getBoundingClientRect(); return {
                tag: el.tagName.toLowerCase(), width: Math.round(r.width),
                height: Math.round(r.height),
              }; }).filter(b => b.width < 44 || b.height < 44).slice(0, 20) : [];
            const namelessButtons = [...document.querySelectorAll('button, [role="button"]')]
              .filter(visible)
              .filter(el => !(el.getAttribute('aria-label') ||
                el.getAttribute('aria-labelledby') || el.textContent || '').trim()).length;
            return {
              documentTitleMissing: !document.title.trim(),
              viewportWidth: window.innerWidth,
              documentWidth: document.documentElement.scrollWidth,
              horizontalOverflowPx: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
              brokenImages, visibleControls: buttons.length, tinyTargets, namelessButtons,
              headingCount: document.querySelectorAll('h1').length,
              mainLandmarks: document.querySelectorAll('main, [role="main"]').length,
              visibleText: (document.body?.innerText || '').replace(/\s+/g, ' ').slice(0, 50000),
            };
          });
          const missingText = screen.expectText.filter(t => !observations.visibleText.includes(t));
          delete observations.visibleText; // no user/business data stored in audit JSON
          const filename = [platform, screen.name, screen.state, width + 'x' + height].join('-') + '.png';
          await page.screenshot({
            path: path.join(out, filename),
            fullPage: screen.fullPage ?? platform !== 'game',
          });
          views.push({
            screen: screen.name, state: screen.state, width, height,
            screenshot: filename, observations, missingText, pageErrors,
          });
        } finally {
          await page.close();
        }
      }
    }
  } finally { await browser.close(); }

  const findings = [];
  for (const view of views) {
    const o = view.observations;
    if (o.horizontalOverflowPx > 1) findings.push(issue(view, 'horizontal-overflow', o.horizontalOverflowPx, 'Recompose content at this width; inspect clip/crop.'));
    if (o.brokenImages.length) findings.push(issue(view, 'broken-images', o.brokenImages.length, 'Verify asset paths, provenance and fallback.'));
    if (o.tinyTargets.length) findings.push(issue(view, 'small-touch-targets', o.tinyTargets.length, 'Check reachable mobile interactive target geometry.'));
    if (o.namelessButtons) findings.push(issue(view, 'unlabeled-buttons', o.namelessButtons, 'Give actionable controls a perceivable/accessible label.'));
    if (o.documentTitleMissing) findings.push(issue(view, 'missing-document-title', 1, 'Name each route/document meaningfully.'));
    if (view.missingText.length) findings.push(issue(view, 'missing-expected-text', view.missingText.length, 'Inspect requested state and content; loading may be incomplete.'));
    if (view.pageErrors.length) findings.push(issue(view, 'page-errors', view.pageErrors.length, 'Inspect browser runtime and reproduce failure.'));
  }
  const report = {
    schema_version: 2, platform, base_origin: baseUrl.origin,
    captured_at: new Date().toISOString(),
    disclaimer: 'DOM-only signals. Not AI detection, visual-taste certification, accessible-by-default proof, or native/game-performance verification.',
    views, findings,
  };
  await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  return report;
}

async function main() {
  const options = parse(process.argv.slice(2));
  if (options.help) {
    console.log('Usage: node capture.mjs --url http://127.0.0.1:4173 --platform web|app|game --out .design-taste/evidence [--manifest capture.json] [--force] [--allow-remote]');
    return;
  }
  if (!options.url || !DEFAULT_SIZES[options.platform]) {
    throw new Error('Supply --url and --platform web|app|game');
  }
  const baseUrl = checkedUrl(options.url, options);
  const plan = await loadPlan(options, baseUrl, options.platform);
  const out = path.resolve(options.out || '.design-taste/evidence');
  const reportPath = path.join(out, 'report.json');
  if (!options.force && await fs.stat(reportPath).then(() => true).catch(() => false)) {
    throw new Error('Existing report.json; specify --force to recapture intentionally');
  }
  const report = await capturePlan(options, baseUrl, options.platform, plan, out);
  console.log('Captured ' + report.views.length + ' state/viewport(s) in ' + out);
  console.log(report.findings.length + ' DOM finding(s) — review screenshots and actual user flows manually.');
}

main().catch(err => {
  console.error('ERROR: ' + err.message);
  process.exitCode = 2;
});
