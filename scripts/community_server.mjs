import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

export const DEFAULT_BASE_URL = "http://127.0.0.1:4173";
const COMMUNITY_ROOT = resolve(new URL("../examples/community", import.meta.url).pathname);
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

export async function isReachable(baseUrl) {
  try {
    const response = await fetch(`${baseUrl}/board.html`);
    return response.ok;
  } catch {
    return false;
  }
}

export function startStaticServer(port) {
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

export async function waitForServer(baseUrl) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await isReachable(baseUrl)) return;
    await new Promise((resolveWait) => setTimeout(resolveWait, 100));
  }
  throw new Error(`The community server did not become ready at ${baseUrl}`);
}

export async function withCommunityServer(baseUrl, task) {
  const parsedBaseUrl = new URL(baseUrl);
  const ownsServer = parsedBaseUrl.hostname === "127.0.0.1" && parsedBaseUrl.port === "4173";
  let server;
  if (!(await isReachable(baseUrl))) {
    if (!ownsServer) throw new Error(`No server is reachable at ${baseUrl}`);
    server = await startStaticServer(4173);
  }

  await waitForServer(baseUrl);
  try {
    return await task(baseUrl);
  } finally {
    if (server) await new Promise((resolveClose) => server.close(resolveClose));
  }
}
