import { readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

import { DEFAULT_BASE_URL, withCommunityServer } from "./community_server.mjs";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, "..");
const COMMUNITY_ROOT = resolve(ROOT, "examples/community");
const EVIDENCE_ROOT = resolve(COMMUNITY_ROOT, "evidence");
const MANIFEST_PATH = resolve(COMMUNITY_ROOT, "evidence/manifest.json");

function parseArgs(argv) {
  const args = { baseUrl: process.env.DESIGN_SKILLS_BASE_URL ?? DEFAULT_BASE_URL };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--base-url") {
      args.baseUrl = argv[index + 1];
      index += 1;
    }
  }
  return args;
}

async function capture() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  await withCommunityServer(baseUrl, async (resolvedBaseUrl) => {
    const browser = await chromium.launch({ headless: true });
    try {
      for (const captureSpec of manifest.captures) {
        const page = await browser.newPage({
          viewport: { width: captureSpec.viewport.width, height: captureSpec.viewport.height },
          deviceScaleFactor: 1,
        });
        const targetUrl = new URL(captureSpec.route, resolvedBaseUrl).toString();
        const outputPath = resolve(EVIDENCE_ROOT, captureSpec.file);
        await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
        await page.evaluate(() => document.fonts?.ready);
        await page.waitForTimeout(500);
        await page.screenshot({ path: outputPath, fullPage: true, type: "jpeg", quality: 88 });
        await page.close();
        const pathLabel = relative(ROOT, outputPath);
        console.log(`captured ${captureSpec.id} → ${pathLabel} (${captureSpec.viewport.width}×${captureSpec.viewport.height})`);
      }
    } finally {
      await browser.close();
    }
  });
}

capture().catch((error) => {
  console.error(`capture:community failed: ${error.message}`);
  console.error("Install the browser runner with: npm install && npx playwright install chromium");
  process.exitCode = 1;
});
