import { chromium } from "playwright";

import { DEFAULT_BASE_URL, withCommunityServer } from "./community_server.mjs";

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function runRuntimeChecks() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await desktop.goto(`${DEFAULT_BASE_URL}/index.html?source=qa&filter=following&q=work`, { waitUntil: "networkidle" });
    const restored = await desktop.evaluate(() => ({
      search: document.querySelector("#searchInput").value,
      followingPressed: document.querySelector('[data-filter="following"]').getAttribute("aria-pressed"),
      url: window.location.search,
      posts: document.querySelectorAll("#feedList .post-card").length,
    }));
    assert(restored.search === "work", "URL search query was not restored");
    assert(restored.followingPressed === "true", "URL filter was not restored");
    assert(restored.url.includes("source=qa"), "Unknown URL parameters were not preserved");
    assert(restored.posts === 1, "Restored URL state rendered the wrong feed");
    results.push({ id: "url-restoration", verified: true, viewport: "1440x1000" });

    await desktop.fill("#searchInput", "people");
    const syncedUrl = await desktop.evaluate(() => window.location.search);
    assert(syncedUrl.includes("source=qa") && syncedUrl.includes("q=people"), "Search state was not reflected in the URL");
    assert(!syncedUrl.includes("filter="), "Search recovery did not clear the old filter state");
    results.push({ id: "url-sync", verified: true, viewport: "1440x1000" });

    await desktop.goto(`${DEFAULT_BASE_URL}/index.html`, { waitUntil: "networkidle" });
    await desktop.click("#openComposer");
    await wait(80);
    const composerOpen = await desktop.evaluate(() => document.activeElement.id);
    assert(composerOpen === "composerTitleInput", "Composer did not move focus to the title field");
    await desktop.keyboard.press("Escape");
    const composerClosed = await desktop.evaluate(() => ({ active: document.activeElement.id, open: document.querySelector("#composerDialog").open }));
    assert(composerClosed.active === "openComposer" && !composerClosed.open, "Composer focus did not return to its trigger");
    results.push({ id: "composer-focus-return", verified: true, viewport: "1440x1000" });

    await desktop.reload({ waitUntil: "networkidle" });
    await desktop.keyboard.press("Tab");
    const skipFocused = await desktop.evaluate(() => document.activeElement.classList.contains("skip-link"));
    assert(skipFocused, "Skip link was not the first keyboard target");
    await desktop.keyboard.press("Enter");
    const skipMoved = await desktop.evaluate(() => document.activeElement.id);
    assert(skipMoved === "mainContent", "Skip link did not move focus to main content");
    results.push({ id: "skip-link", verified: true, viewport: "1440x1000" });
    await desktop.close();

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobile.goto(`${DEFAULT_BASE_URL}/index.html`, { waitUntil: "networkidle" });
    await mobile.click("#openSidebar");
    await wait(80);
    const drawerOpen = await mobile.evaluate(() => ({
      tag: document.activeElement.tagName,
      expanded: document.querySelector("#openSidebar").getAttribute("aria-expanded"),
    }));
    assert(drawerOpen.tag === "A" && drawerOpen.expanded === "true", "Drawer did not receive focus on open");
    await mobile.keyboard.press("Escape");
    const drawerClosed = await mobile.evaluate(() => ({
      active: document.activeElement.id,
      expanded: document.querySelector("#openSidebar").getAttribute("aria-expanded"),
    }));
    assert(drawerClosed.active === "openSidebar" && drawerClosed.expanded === "false", "Drawer focus did not return after Escape");
    results.push({ id: "drawer-focus-return", verified: true, viewport: "390x844" });
    await mobile.close();
  } finally {
    await browser.close();
  }

  return results;
}

withCommunityServer(DEFAULT_BASE_URL, runRuntimeChecks)
  .then((results) => {
    console.log(JSON.stringify({ checks: results, count: results.length }, null, 2));
  })
  .catch((error) => {
    console.error(`test:browser failed: ${error.message}`);
    process.exitCode = 1;
  });
