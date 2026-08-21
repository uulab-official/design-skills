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

    const localFonts = await desktop.evaluate(async () => {
      await document.fonts.ready;
      return {
        status: document.fonts.status,
        sans: document.fonts.check('700 16px "DM Sans"'),
        serif: document.fonts.check('500 32px "Fraunces"'),
        remoteStylesheet: Boolean(document.querySelector('link[href*="fonts.googleapis.com"]')),
      };
    });
    assert(localFonts.status === "loaded", "Local font set did not finish loading");
    assert(localFonts.sans && localFonts.serif, "Local display and UI fonts were not available");
    assert(!localFonts.remoteStylesheet, "The prototype still depends on a remote font stylesheet");
    results.push({ id: "local-fonts", verified: true, viewport: "1440x1000" });

    await desktop.fill("#searchInput", "people");
    const syncedUrl = await desktop.evaluate(() => window.location.search);
    assert(syncedUrl.includes("source=qa") && syncedUrl.includes("q=people"), "Search state was not reflected in the URL");
    assert(!syncedUrl.includes("filter="), "Search recovery did not clear the old filter state");
    results.push({ id: "url-sync", verified: true, viewport: "1440x1000" });

    await desktop.evaluate(() => {
      const url = new URL(window.location.href);
      url.searchParams.set("filter", "latest");
      url.searchParams.delete("q");
      window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    const historyState = await desktop.evaluate(() => ({
      latestPressed: document.querySelector('[data-filter="latest"]').getAttribute("aria-pressed"),
      posts: document.querySelectorAll("#feedList .post-card").length,
    }));
    assert(historyState.latestPressed === "true" && historyState.posts === 1, "Prototype did not rehydrate after a history state change");
    results.push({ id: "prototype-history-state", verified: true, viewport: "1440x1000" });

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

    await desktop.goto(`${DEFAULT_BASE_URL}/index.html`, { waitUntil: "networkidle" });
    await desktop.locator('[data-post-id="1"] [data-post-action="like"]').click();
    const feedActionFocus = await desktop.evaluate(() => {
      const action = document.querySelector('[data-post-id="1"] [data-post-action="like"]');
      return { active: document.activeElement === action, pressed: action?.getAttribute("aria-pressed") };
    });
    assert(feedActionFocus.active && feedActionFocus.pressed === "true", "Feed action focus was lost after updating like state");
    results.push({ id: "feed-action-focus", verified: true, viewport: "1440x1000" });
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
    const touchTargets = await mobile.evaluate(() => Array.from(document.querySelectorAll("#openSidebar, .filter-chip, .post-action, .circle-row, .mobile-nav-item, .mobile-compose, .round-arrow")).map((element) => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }));
    assert(touchTargets.length > 0 && touchTargets.every(({ width, height }) => width >= 44 && height >= 44), "A mobile interaction target is smaller than 44px");
    results.push({ id: "mobile-touch-targets", verified: true, viewport: "390x844" });
    await mobile.close();

    const board = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await board.goto(`${DEFAULT_BASE_URL}/board.html?source=qa&view=mobile&filter=platforms`, { waitUntil: "networkidle" });
    const boardState = await board.evaluate(() => ({
      view: document.querySelector("#boardMain").dataset.view,
      filterPressed: document.querySelector('[data-board-filter="platforms"]').getAttribute("aria-pressed"),
      visiblePlatforms: document.querySelectorAll('article[data-board-type="platforms"]:not([hidden])').length,
      hiddenDirections: document.querySelector('[data-board-type="directions"]').hidden,
      url: window.location.search,
    }));
    assert(boardState.view === "mobile", "Board view was not restored from the URL");
    assert(boardState.filterPressed === "true", "Board filter was not restored from the URL");
    assert(boardState.visiblePlatforms === 3 && boardState.hiddenDirections, "Board filter rendered the wrong sections");
    assert(boardState.url.includes("source=qa"), "Board state did not preserve unknown URL parameters");
    results.push({ id: "board-url-state", verified: true, viewport: "1440x1000" });

    await board.evaluate(() => {
      const url = new URL(window.location.href);
      url.searchParams.set("view", "desktop");
      url.searchParams.set("filter", "screens");
      window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    const boardHistoryState = await board.evaluate(() => ({
      view: document.querySelector("#boardMain").dataset.view,
      filterPressed: document.querySelector('[data-board-filter="screens"]').getAttribute("aria-pressed"),
      visibleScreens: document.querySelectorAll('article[data-board-type="screens"]:not([hidden])').length,
    }));
    assert(boardHistoryState.view === "desktop" && boardHistoryState.filterPressed === "true" && boardHistoryState.visibleScreens === 8, "Board did not rehydrate after a history state change");
    results.push({ id: "board-history-state", verified: true, viewport: "1440x1000" });

    await board.goto(`${DEFAULT_BASE_URL}/board.html?source=qa&view=mobile&filter=all`, { waitUntil: "networkidle" });
    await board.locator('[data-open-artboard="Home / For you"]').click();
    await wait(80);
    const boardDialogOpen = await board.evaluate(() => ({
      active: document.activeElement.id,
      open: document.querySelector("#boardDialog").open,
    }));
    assert(boardDialogOpen.active === "closeBoardDialog" && boardDialogOpen.open, "Board dialog did not receive focus on open");
    await board.keyboard.press("Escape");
    const boardDialogClosed = await board.evaluate(() => ({
      activeLabel: document.activeElement.getAttribute("data-open-artboard"),
      open: document.querySelector("#boardDialog").open,
    }));
    assert(boardDialogClosed.activeLabel === "Home / For you" && !boardDialogClosed.open, "Board dialog focus did not return after Escape");
    results.push({ id: "board-dialog-focus-return", verified: true, viewport: "1440x1000" });
    await board.close();
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
