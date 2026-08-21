import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, "..");
const COMMUNITY_ROOT = resolve(ROOT, "examples/community");
const EVIDENCE_ROOT = resolve(COMMUNITY_ROOT, "evidence");
const MANIFEST_PATH = resolve(COMMUNITY_ROOT, "evidence/manifest.json");
const DEFAULT_BASE_URL = "http://127.0.0.1:4173";
const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

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

async function isReachable(baseUrl) {
  try {
    const response = await fetch(`${baseUrl}/board.html`);
    return response.ok;
  } catch {
    return false;
  }
}

function startStaticServer(port) {
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
      const requestedPath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, "");
      let filePath = resolve(COMMUNITY_ROOT, requestedPath || "index.html");
      const isInsideRoot = filePath === COMMUNITY_ROOT || filePath.startsWith(`${COMMUNITY_ROOT}${sep}`);
      if (!isInsideRoot) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }

      const fileStats = await stat(filePath);
      if (fileStats.isDirectory()) filePath = resolve(filePath, "index.html");
      const body = await readFile(filePath);
      response.writeHead(200, {
        "cache-control": "no-store",
        "content-type": MIME_TYPES[extname(filePath).toLowerCase()] ?? "application/octet-stream",
      });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });

  return new Promise((resolveServer, rejectServer) => {
    server.once("error", rejectServer);
    server.listen(port, "127.0.0.1", () => resolveServer(server));
  });
}

async function waitForServer(baseUrl) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await isReachable(baseUrl)) return;
    await new Promise((resolveWait) => setTimeout(resolveWait, 100));
  }
  throw new Error(`The evidence server did not become ready at ${baseUrl}`);
}

async function capture() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  const parsedBaseUrl = new URL(baseUrl);
  const ownsServer = parsedBaseUrl.hostname === "127.0.0.1" && parsedBaseUrl.port === "4173";
  let server;

  if (!(await isReachable(baseUrl))) {
    if (!ownsServer) {
      throw new Error(`No server is reachable at ${baseUrl}. Start the community example or pass --base-url.`);
    }
    server = await startStaticServer(4173);
  }

  await waitForServer(baseUrl);
  const browser = await chromium.launch({ headless: true });

  try {
    for (const captureSpec of manifest.captures) {
      const page = await browser.newPage({
        viewport: { width: captureSpec.viewport.width, height: captureSpec.viewport.height },
        deviceScaleFactor: 1,
      });
      const targetUrl = new URL(captureSpec.route, baseUrl).toString();
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
    if (server) await new Promise((resolveClose) => server.close(resolveClose));
  }
}

capture().catch((error) => {
  console.error(`capture:community failed: ${error.message}`);
  console.error("Install the browser runner with: npm install && npx playwright install chromium");
  process.exitCode = 1;
});
