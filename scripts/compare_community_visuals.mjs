import { readFile, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import pixelmatch from "pixelmatch";
import pngjs from "pngjs";
import { chromium } from "playwright";

import { DEFAULT_BASE_URL, withCommunityServer } from "./community_server.mjs";

const { PNG } = pngjs;
const ROOT = resolve(new URL("..", import.meta.url).pathname);
const BASELINE_DIR = resolve(ROOT, "examples/community/evidence/visual-baseline");
const PIXEL_THRESHOLD = 0.2;
const MAX_MISMATCH_RATIO = 0.03;

const targets = [
  { id: "prototype-wide", route: "/index.html?evidence=visual", viewport: { width: 1440, height: 1000 } },
  { id: "prototype-mobile", route: "/index.html?evidence=visual", viewport: { width: 390, height: 844 } },
  { id: "prototype-discover-wide", route: "/index.html?evidence=visual&view=discover", viewport: { width: 1440, height: 1000 } },
  { id: "prototype-circle-wide", route: "/index.html?evidence=visual&view=circle&circle=City%20Makers", viewport: { width: 1440, height: 1000 } },
  { id: "prototype-thread-wide", route: "/index.html?evidence=visual&view=thread&circle=City%20Makers&thread=city-map", viewport: { width: 1440, height: 1000 } },
  { id: "board-wide", route: "/board.html?evidence=visual", viewport: { width: 1440, height: 1000 } },
];

function baselinePath(id) {
  return join(BASELINE_DIR, `${id}.png`);
}

function diffPath(id) {
  return join(tmpdir(), `design-skills-${id}-diff.png`);
}

async function capture(page, target) {
  await page.setViewportSize(target.viewport);
  await page.goto(`${DEFAULT_BASE_URL}${target.route}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts?.ready);
  await page.addStyleTag({
    content: "*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }",
  });
  return page.screenshot({ type: "png", animations: "disabled" });
}

function compareImages(expectedBuffer, actualBuffer, id) {
  const expected = PNG.sync.read(expectedBuffer);
  const actual = PNG.sync.read(actualBuffer);
  if (expected.width !== actual.width || expected.height !== actual.height) {
    throw new Error(`${id} dimensions changed from ${expected.width}×${expected.height} to ${actual.width}×${actual.height}`);
  }

  const diff = new PNG({ width: expected.width, height: expected.height });
  const mismatchedPixels = pixelmatch(
    expected.data,
    actual.data,
    diff.data,
    expected.width,
    expected.height,
    { threshold: PIXEL_THRESHOLD, includeAA: false },
  );
  return {
    mismatchedPixels,
    mismatchRatio: mismatchedPixels / (expected.width * expected.height),
    diff,
  };
}

async function run() {
  const update = process.argv.includes("--update");
  if (update && process.env.CI) throw new Error("Refusing to update visual baselines in CI");
  if (update) await mkdir(BASELINE_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  try {
    for (const target of targets) {
      const actualBuffer = await capture(page, target);
      const targetBaselinePath = baselinePath(target.id);

      if (update) {
        await writeFile(targetBaselinePath, actualBuffer);
        results.push({ id: target.id, status: "updated", baseline: targetBaselinePath });
        continue;
      }

      let expectedBuffer;
      try {
        expectedBuffer = await readFile(targetBaselinePath);
      } catch {
        throw new Error(`${target.id} baseline is missing; run npm run update:visual locally`);
      }

      const comparison = compareImages(expectedBuffer, actualBuffer, target.id);
      const ratio = Number(comparison.mismatchRatio.toFixed(4));
      if (comparison.mismatchRatio > MAX_MISMATCH_RATIO) {
        const output = diffPath(target.id);
        await writeFile(output, PNG.sync.write(comparison.diff));
        throw new Error(`${target.id} mismatch ratio ${ratio} exceeds ${MAX_MISMATCH_RATIO}; diff: ${output}`);
      }
      results.push({ id: target.id, status: "passed", mismatchRatio: ratio });
    }
  } finally {
    await browser.close();
  }

  return results;
}

withCommunityServer(DEFAULT_BASE_URL, run)
  .then((results) => console.log(JSON.stringify({ targets: results, maxMismatchRatio: MAX_MISMATCH_RATIO }, null, 2)))
  .catch((error) => {
    console.error(`test:visual failed: ${error.message}`);
    process.exitCode = 1;
  });
