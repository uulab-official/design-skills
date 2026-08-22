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

    await desktop.goto(`${DEFAULT_BASE_URL}/index.html?source=qa`, { waitUntil: "networkidle" });
    await desktop.click("#workspaceSwitcher");
    await wait(80);
    const workspaceDialogOpen = await desktop.evaluate(() => ({
      active: document.activeElement.dataset.workspaceId,
      expanded: document.querySelector("#workspaceSwitcher").getAttribute("aria-expanded"),
      open: document.querySelector("#workspaceDialog").open,
      selected: document.querySelector('[data-workspace-id="seoul"]').getAttribute("aria-selected"),
    }));
    assert(workspaceDialogOpen.active === "seoul" && workspaceDialogOpen.expanded === "true" && workspaceDialogOpen.open && workspaceDialogOpen.selected === "true", "Workspace picker did not open with the active option focused");
    await desktop.click('[data-workspace-id="quiet"]');
    await wait(80);
    const workspaceSelected = await desktop.evaluate(() => ({
      active: document.activeElement.id,
      name: document.querySelector("#workspaceName").textContent,
      type: document.querySelector("#workspaceType").textContent,
      open: document.querySelector("#workspaceDialog").open,
      expanded: document.querySelector("#workspaceSwitcher").getAttribute("aria-expanded"),
    }));
    assert(workspaceSelected.active === "workspaceSwitcher" && workspaceSelected.name === "Quiet Mornings" && workspaceSelected.type === "Shared circle" && !workspaceSelected.open && workspaceSelected.expanded === "false", "Workspace selection did not update context or return focus to the trigger");
    await desktop.click("#workspaceSwitcher");
    await desktop.keyboard.press("Escape");
    const workspaceDialogClosed = await desktop.evaluate(() => ({
      active: document.activeElement.id,
      open: document.querySelector("#workspaceDialog").open,
    }));
    assert(workspaceDialogClosed.active === "workspaceSwitcher" && !workspaceDialogClosed.open, "Workspace picker Escape did not close and restore focus");
    results.push({ id: "workspace-switcher-focus-return", verified: true, viewport: "1440x1000" });

    await desktop.fill("#searchInput", "people");
    const syncedUrl = await desktop.evaluate(() => window.location.search);
    assert(syncedUrl.includes("source=qa") && syncedUrl.includes("q=people"), "Search state was not reflected in the URL");
    assert(!syncedUrl.includes("filter="), "Search recovery did not clear the old filter state");
    results.push({ id: "url-sync", verified: true, viewport: "1440x1000" });

    await desktop.goto(`${DEFAULT_BASE_URL}/index.html`, { waitUntil: "networkidle" });
    const feedAnnouncement = await desktop.evaluate(() => ({
      feedLive: document.querySelector("#feedList").getAttribute("aria-live"),
      statusLive: document.querySelector("#feedStatus")?.getAttribute("aria-live"),
      statusText: document.querySelector("#feedStatus")?.textContent,
    }));
    assert(feedAnnouncement.feedLive === null && feedAnnouncement.statusLive === "polite" && feedAnnouncement.statusText.includes("3 conversations"), "Feed updates did not use a dedicated status announcement");
    results.push({ id: "feed-status-announcement", verified: true, viewport: "1440x1000" });

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

    await desktop.goto(`${DEFAULT_BASE_URL}/index.html`, { waitUntil: "networkidle" });
    await desktop.locator(".round-arrow").click();
    const featuredFeedback = await desktop.evaluate(() => ({
      url: window.location.search,
      homeHidden: document.querySelector("#homeView")?.hidden,
      threadHidden: document.querySelector("#threadView")?.hidden,
    }));
    assert(featuredFeedback.url.includes("view=thread") && featuredFeedback.url.includes("thread=city-daylight") && featuredFeedback.homeHidden === true && featuredFeedback.threadHidden === false, "Featured story CTA did not open its Thread route");
    results.push({ id: "featured-story-feedback", verified: true, viewport: "1440x1000" });

    await desktop.goto(`${DEFAULT_BASE_URL}/index.html`, { waitUntil: "networkidle" });
    await desktop.locator(".round-arrow").click();
    const featuredThread = await desktop.evaluate(() => ({
      url: window.location.search,
      homeHidden: document.querySelector("#homeView")?.hidden,
      threadHidden: document.querySelector("#threadView")?.hidden,
      title: document.querySelector("#threadTitle")?.textContent,
    }));
    assert(featuredThread.url.includes("view=thread") && featuredThread.url.includes("thread=city-daylight") && featuredThread.homeHidden === true && featuredThread.threadHidden === false && featuredThread.title === "A little more daylight, a lot more making.", "Featured story CTA did not open the featured Thread route");
    await desktop.goBack();
    await wait(80);
    const featuredBack = await desktop.evaluate(() => ({
      url: window.location.search,
      homeHidden: document.querySelector("#homeView")?.hidden,
      threadHidden: document.querySelector("#threadView")?.hidden,
    }));
    assert(!featuredBack.url.includes("view=thread") && featuredBack.homeHidden === false && featuredBack.threadHidden === true, "Browser back did not restore Home after leaving the featured Thread");
    results.push({ id: "featured-thread-route", verified: true, viewport: "1440x1000" });

    await desktop.goto(`${DEFAULT_BASE_URL}/index.html`, { waitUntil: "networkidle" });
    const discoveryCtas = desktop.locator(".circles-card [data-discover-route]");
    assert(await discoveryCtas.count() === 2, "Home circles rail did not expose both Discover route CTAs");
    await discoveryCtas.first().click();
    const railDiscovery = await desktop.evaluate(() => ({
      url: window.location.search,
      homeHidden: document.querySelector("#homeView")?.hidden,
      discoverHidden: document.querySelector("#discoverView")?.hidden,
    }));
    assert(railDiscovery.url.includes("view=discover") && railDiscovery.homeHidden === true && railDiscovery.discoverHidden === false, "Home circles rail CTA did not open Discover");
    await desktop.goBack();
    await wait(80);
    await desktop.locator(".circles-card [data-discover-route]").last().click();
    const railLinkDiscovery = await desktop.evaluate(() => ({
      url: window.location.search,
      homeHidden: document.querySelector("#homeView")?.hidden,
      discoverHidden: document.querySelector("#discoverView")?.hidden,
    }));
    assert(railLinkDiscovery.url.includes("view=discover") && railLinkDiscovery.homeHidden === true && railLinkDiscovery.discoverHidden === false, "Home circles rail link did not open Discover");
    results.push({ id: "home-discover-route", verified: true, viewport: "1440x1000" });

    await desktop.goto(`${DEFAULT_BASE_URL}/index.html`, { waitUntil: "networkidle" });
    await desktop.locator('.nav-item[data-nav="Your circles"]').first().click();
    const circlesRoute = await desktop.evaluate(() => ({
      url: window.location.search,
      homeHidden: document.querySelector("#homeView")?.hidden,
      circlesHidden: document.querySelector("#circlesView")?.hidden,
      current: Array.from(document.querySelectorAll('[data-nav][aria-current="page"]')).map((item) => item.dataset.nav),
      cards: Array.from(document.querySelectorAll("[data-your-circle-card]")).filter((card) => !card.hidden).length,
      title: document.querySelector("#circlesTitle")?.textContent,
    }));
    assert(circlesRoute.url.includes("view=circles") && circlesRoute.homeHidden === true && circlesRoute.circlesHidden === false && circlesRoute.current.length === 2 && circlesRoute.current.every((label) => label === "Your circles") && circlesRoute.cards === 4 && circlesRoute.title === "Places worth returning to.", "Your circles did not open the collection route");
    await desktop.locator('[data-circles-filter="recent"]').click();
    const circlesFiltered = await desktop.evaluate(() => ({
      url: window.location.search,
      cards: Array.from(document.querySelectorAll("[data-your-circle-card]")).filter((card) => !card.hidden).length,
      status: document.querySelector("#circlesStatus")?.textContent,
    }));
    assert(circlesFiltered.url.includes("circleFilter=recent") && circlesFiltered.cards === 2 && circlesFiltered.status.includes("active this week"), "Your circles filter did not preserve the collection state");
    await desktop.locator('[data-your-circle-route="City Makers"]').click();
    const circlesCardRoute = await desktop.evaluate(() => ({
      url: window.location.search,
      circlesHidden: document.querySelector("#circlesView")?.hidden,
      circleHidden: document.querySelector("#circleView")?.hidden,
      title: document.querySelector("#circleTitle")?.textContent,
    }));
    assert(circlesCardRoute.url.includes("view=circle") && circlesCardRoute.url.includes("circle=City+Makers") && circlesCardRoute.circlesHidden === true && circlesCardRoute.circleHidden === false && circlesCardRoute.title === "City Makers", "Your circles card did not open its Circle route");
    results.push({ id: "circles-route", verified: true, viewport: "1440x1000" });

    await desktop.goto(`${DEFAULT_BASE_URL}/index.html`, { waitUntil: "networkidle" });
    const initialNavState = await desktop.evaluate(() => ({
      labels: Array.from(document.querySelectorAll("nav")).map((nav) => nav.getAttribute("aria-label")),
      current: Array.from(document.querySelectorAll('[data-nav][aria-current="page"]')).map((item) => item.dataset.nav),
      pressed: Array.from(document.querySelectorAll('[data-nav][aria-pressed="true"]')).map((item) => item.dataset.nav),
    }));
    assert(initialNavState.labels.includes("Your space") && initialNavState.labels.includes("Stay close") && initialNavState.current.length === 2 && initialNavState.current.every((label) => label === "Home") && initialNavState.pressed.length === 2, "Navigation landmarks or initial current state are not exposed");
    await desktop.locator('.nav-item[data-nav="Discover"]').first().click();
    const updatedNavState = await desktop.evaluate(() => Array.from(document.querySelectorAll('[data-nav][aria-current="page"]')).map((item) => item.dataset.nav));
    assert(updatedNavState.length === 2 && updatedNavState.every((label) => label === "Discover"), "Navigation current state did not move to the selected destination");
    results.push({ id: "navigation-current-state", verified: true, viewport: "1440x1000" });

    await desktop.goto(`${DEFAULT_BASE_URL}/index.html`, { waitUntil: "networkidle" });
    await desktop.evaluate(() => window.scrollTo({ top: 700, left: 0 }));
    await desktop.locator('.nav-item[data-nav="Discover"]').first().click();
    const discoverRoute = await desktop.evaluate(() => ({
      url: window.location.search,
      homeHidden: document.querySelector("#homeView")?.hidden,
      discoverHidden: document.querySelector("#discoverView")?.hidden,
      current: Array.from(document.querySelectorAll('[data-nav][aria-current="page"]')).map((item) => item.dataset.nav),
      scrollY: window.scrollY,
      heading: document.querySelector("#discoverTitle")?.textContent,
    }));
    assert(discoverRoute.url.includes("view=discover") && discoverRoute.homeHidden === true && discoverRoute.discoverHidden === false && discoverRoute.current.length === 2 && discoverRoute.current.every((label) => label === "Discover") && discoverRoute.scrollY === 0 && discoverRoute.heading === "Find your next circle.", "Discover route did not render as a real view with a top reset");
    await desktop.goBack();
    await wait(80);
    const homeRoute = await desktop.evaluate(() => ({
      url: window.location.search,
      homeHidden: document.querySelector("#homeView")?.hidden,
      discoverHidden: document.querySelector("#discoverView")?.hidden,
      current: Array.from(document.querySelectorAll('[data-nav][aria-current="page"]')).map((item) => item.dataset.nav),
      scrollY: window.scrollY,
    }));
    assert(!homeRoute.url.includes("view=discover") && homeRoute.homeHidden === false && homeRoute.discoverHidden === true && homeRoute.current.length === 2 && homeRoute.current.every((label) => label === "Home") && homeRoute.scrollY === 0, "Browser back did not restore the Home route and top position");
    results.push({ id: "discover-route-and-scroll-reset", verified: true, viewport: "1440x1000" });

    await desktop.goto(`${DEFAULT_BASE_URL}/index.html?view=discover`, { waitUntil: "networkidle" });
    await desktop.fill("#searchInput", "lunar attic");
    const discoverEmpty = await desktop.evaluate(() => ({
      url: window.location.search,
      emptyHidden: document.querySelector("#discoverEmpty")?.hidden,
      cards: Array.from(document.querySelectorAll("[data-discover-card]")).filter((card) => !card.hidden).length,
      status: document.querySelector("#discoverStatus")?.textContent,
    }));
    assert(discoverEmpty.url.includes("q=lunar+attic") && discoverEmpty.emptyHidden === false && discoverEmpty.cards === 0 && discoverEmpty.status.includes("0 circles"), "Discover did not expose a recoverable empty search state");
    await desktop.locator('[data-clear-route-search="discover"]').click();
    const discoverRecovered = await desktop.evaluate(() => ({
      url: window.location.search,
      emptyHidden: document.querySelector("#discoverEmpty")?.hidden,
      cards: Array.from(document.querySelectorAll("[data-discover-card]")).filter((card) => !card.hidden).length,
      active: document.activeElement?.id,
    }));
    assert(!discoverRecovered.url.includes("q=") && discoverRecovered.emptyHidden === true && discoverRecovered.cards === 6 && discoverRecovered.active === "searchInput", "Discover empty search did not clear and restore the directory");
    await desktop.goto(`${DEFAULT_BASE_URL}/index.html?view=circles&circleFilter=quiet`, { waitUntil: "networkidle" });
    await desktop.fill("#searchInput", "lunar attic");
    const circlesEmpty = await desktop.evaluate(() => ({
      emptyHidden: document.querySelector("#circlesEmpty")?.hidden,
      cards: Array.from(document.querySelectorAll("[data-your-circle-card]")).filter((card) => !card.hidden).length,
      status: document.querySelector("#circlesStatus")?.textContent,
    }));
    assert(circlesEmpty.emptyHidden === false && circlesEmpty.cards === 0 && circlesEmpty.status.includes("0 circles"), "Your circles did not expose a recoverable empty search state");
    results.push({ id: "route-search-empty-recovery", verified: true, viewport: "1440x1000" });

    await desktop.goto(DEFAULT_BASE_URL + "/index.html?view=discover", { waitUntil: "networkidle" });
    await desktop.locator(".discover-card-action").first().click();
    const circleRoute = await desktop.evaluate(() => ({
      url: window.location.search,
      homeHidden: document.querySelector("#homeView")?.hidden,
      discoverHidden: document.querySelector("#discoverView")?.hidden,
      circleHidden: document.querySelector("#circleView")?.hidden,
      current: Array.from(document.querySelectorAll('[data-nav][aria-current="page"]')).map((item) => item.dataset.nav),
      title: document.querySelector("#circleTitle")?.textContent,
      tab: document.querySelector('[data-circle-tab][aria-selected="true"]')?.dataset.circleTab,
    }));
    assert(circleRoute.url.includes("view=circle") && circleRoute.url.includes("circle=City+Makers") && circleRoute.homeHidden === true && circleRoute.discoverHidden === true && circleRoute.circleHidden === false && circleRoute.current.length === 2 && circleRoute.current.every((label) => label === "Your circles") && circleRoute.title === "City Makers" && circleRoute.tab === "conversations", "Circle detail route did not render from the Discover card");
    await desktop.locator('[data-circle-tab="about"]').click();
    const circleAbout = await desktop.evaluate(() => ({
      selected: document.querySelector('[data-circle-tab="about"]').getAttribute("aria-selected"),
      panel: document.querySelector("#circlePanel > :first-child")?.className,
      status: document.querySelector("#circleStatus")?.textContent,
    }));
    assert(circleAbout.selected === "true" && circleAbout.panel === "circle-about-panel" && circleAbout.status.includes("About City Makers"), "Circle About tab did not render its selected panel");
    await desktop.locator('[data-circle-tab="conversations"]').click();
    await desktop.locator("[data-circle-conversation]").first().click();
    const circleConversationRoute = await desktop.evaluate(() => ({
      url: window.location.search,
      circleHidden: document.querySelector("#circleView")?.hidden,
      threadHidden: document.querySelector("#threadView")?.hidden,
    }));
    assert(circleConversationRoute.url.includes("view=thread") && circleConversationRoute.url.includes("thread=city-map") && circleConversationRoute.circleHidden === true && circleConversationRoute.threadHidden === false, "Circle conversation CTA did not open the Thread route");
    await desktop.goBack();
    await wait(80);
    await desktop.goBack();
    await wait(80);
    const discoverBack = await desktop.evaluate(() => ({
      url: window.location.search,
      discoverHidden: document.querySelector("#discoverView")?.hidden,
      circleHidden: document.querySelector("#circleView")?.hidden,
      current: Array.from(document.querySelectorAll('[data-nav][aria-current="page"]')).map((item) => item.dataset.nav),
      scrollY: window.scrollY,
    }));
    assert(discoverBack.url.includes("view=discover") && discoverBack.discoverHidden === false && discoverBack.circleHidden === true && discoverBack.current.length === 2 && discoverBack.current.every((label) => label === "Discover") && discoverBack.scrollY === 0, "Browser back did not restore Discover after leaving a Circle");
    results.push({ id: "circle-route-and-back", verified: true, viewport: "1440x1000" });

    await desktop.goto(DEFAULT_BASE_URL + "/index.html?view=circle&circle=City%20Makers", { waitUntil: "networkidle" });
    await desktop.locator("[data-circle-conversation]").first().click();
    const threadRoute = await desktop.evaluate(() => ({
      url: window.location.search,
      circleHidden: document.querySelector("#circleView")?.hidden,
      threadHidden: document.querySelector("#threadView")?.hidden,
      current: Array.from(document.querySelectorAll('[data-nav][aria-current="page"]')).map((item) => item.dataset.nav),
      title: document.querySelector("#threadTitle")?.textContent,
      circle: document.querySelector("#threadCircleName")?.textContent,
    }));
    assert(threadRoute.url.includes("view=thread") && threadRoute.url.includes("circle=City+Makers") && threadRoute.url.includes("thread=city-map") && threadRoute.circleHidden === true && threadRoute.threadHidden === false && threadRoute.current.length === 2 && threadRoute.current.every((label) => label === "Your circles") && threadRoute.title === "A neighborhood map made from borrowed stories." && threadRoute.circle === "City Makers", "Thread detail route did not render from the Circle conversation");
    await desktop.goBack();
    await wait(80);
    const circleBack = await desktop.evaluate(() => ({
      url: window.location.search,
      circleHidden: document.querySelector("#circleView")?.hidden,
      threadHidden: document.querySelector("#threadView")?.hidden,
      title: document.querySelector("#circleTitle")?.textContent,
    }));
    assert(circleBack.url.includes("view=circle") && circleBack.circleHidden === false && circleBack.threadHidden === true && circleBack.title === "City Makers", "Browser back did not restore the Circle after leaving a Thread");
    results.push({ id: "thread-route-and-back", verified: true, viewport: "1440x1000" });

    await desktop.goto(DEFAULT_BASE_URL + "/index.html?view=thread&circle=City%20Makers&thread=city-map", { waitUntil: "networkidle" });
    await desktop.locator("#threadReplyInput").fill("I keep thinking about the places that invite us to stay a little longer.");
    await desktop.locator("#threadReplyForm button[type=submit]").click();
    const replyState = await desktop.evaluate(() => ({
      count: document.querySelectorAll(".thread-reply").length,
      status: document.querySelector("#threadReplyStatus")?.textContent,
      input: document.querySelector("#threadReplyInput")?.value,
      lastReply: document.querySelector(".thread-reply:last-child .thread-reply-body")?.textContent,
    }));
    assert(replyState.count === 4 && replyState.status === "Your reply was added to the conversation." && replyState.input === "" && replyState.lastReply === "I keep thinking about the places that invite us to stay a little longer.", "Thread reply composer did not add a local reply and clear its draft");
    results.push({ id: "thread-reply-flow", verified: true, viewport: "1440x1000" });

    await desktop.goto(DEFAULT_BASE_URL + "/index.html", { waitUntil: "networkidle" });
    await desktop.locator("[data-profile-route]").first().click();
    const profileRoute = await desktop.evaluate(() => ({
      url: window.location.search,
      homeHidden: document.querySelector("#homeView")?.hidden,
      profileHidden: document.querySelector("#profileView")?.hidden,
      title: document.querySelector("#profileTitle")?.textContent,
      tab: document.querySelector('[data-profile-tab][aria-selected="true"]')?.dataset.profileTab,
    }));
    assert(profileRoute.url.includes("view=profile") && profileRoute.url.includes("profile=mina") && profileRoute.homeHidden === true && profileRoute.profileHidden === false && profileRoute.title === "Mina Park" && profileRoute.tab === "conversations", "Profile route did not render from the account identity control");
    await desktop.locator('[data-profile-tab="saved"]').click();
    const profileSaved = await desktop.evaluate(() => ({
      selected: document.querySelector('[data-profile-tab="saved"]').getAttribute("aria-selected"),
      panel: document.querySelector("#profilePanel > :first-child")?.className,
      status: document.querySelector("#profileStatus")?.textContent,
    }));
    assert(profileSaved.selected === "true" && profileSaved.panel === "profile-saved-panel" && profileSaved.status.includes("Saved by Mina Park"), "Profile Saved tab did not render its selected panel");
    await desktop.locator('[data-profile-tab="conversations"]').click();
    await desktop.locator("#followProfile").click();
    const profileFollow = await desktop.evaluate(() => ({
      pressed: document.querySelector("#followProfile").getAttribute("aria-pressed"),
      label: document.querySelector("#followProfile").textContent.trim(),
      status: document.querySelector("#profileStatus")?.textContent,
    }));
    assert(profileFollow.pressed === "true" && profileFollow.label === "Following" && profileFollow.status === "You are now following Mina Park.", "Profile follow state did not update with accessible feedback");
    await desktop.goBack();
    await wait(80);
    const profileBack = await desktop.evaluate(() => ({
      url: window.location.search,
      homeHidden: document.querySelector("#homeView")?.hidden,
      profileHidden: document.querySelector("#profileView")?.hidden,
    }));
    assert(!profileBack.url.includes("view=profile") && profileBack.homeHidden === false && profileBack.profileHidden === true, "Browser back did not restore Home after leaving Profile");
    results.push({ id: "profile-route-and-tabs", verified: true, viewport: "1440x1000" });

    await desktop.locator('.nav-item[data-nav="Saved"]').click();
    const savedRoute = await desktop.evaluate(() => ({
      url: window.location.search,
      homeHidden: document.querySelector("#homeView")?.hidden,
      profileHidden: document.querySelector("#profileView")?.hidden,
      tab: document.querySelector('[data-profile-tab][aria-selected="true"]')?.dataset.profileTab,
      current: Array.from(document.querySelectorAll('[data-nav][aria-current="page"]')).map((item) => item.dataset.nav),
    }));
    assert(savedRoute.url.includes("view=profile") && savedRoute.url.includes("profile=mina") && savedRoute.url.includes("tab=saved") && savedRoute.homeHidden === true && savedRoute.profileHidden === false && savedRoute.tab === "saved" && savedRoute.current.length === 2 && savedRoute.current.every((label) => label === "Saved"), "Global Saved navigation did not open the shareable Profile Saved route");
    await desktop.goBack();
    await wait(80);
    const savedBack = await desktop.evaluate(() => ({
      url: window.location.search,
      homeHidden: document.querySelector("#homeView")?.hidden,
      profileHidden: document.querySelector("#profileView")?.hidden,
    }));
    assert(!savedBack.url.includes("view=profile") && savedBack.homeHidden === false && savedBack.profileHidden === true, "Browser back did not restore Home after leaving Global Saved");
    results.push({ id: "global-saved-route", verified: true, viewport: "1440x1000" });

    await desktop.locator('.nav-item[data-nav="Notifications"]').click();
    const notificationRoute = await desktop.evaluate(() => ({
      url: window.location.search,
      homeHidden: document.querySelector("#homeView")?.hidden,
      notificationsHidden: document.querySelector("#notificationsView")?.hidden,
      current: Array.from(document.querySelectorAll('[data-nav][aria-current="page"]')).map((item) => item.dataset.nav),
      title: document.querySelector("#notificationsTitle")?.textContent,
      unread: document.querySelectorAll(".notification-card.is-unread").length,
    }));
    assert(notificationRoute.url.includes("view=notifications") && notificationRoute.homeHidden === true && notificationRoute.notificationsHidden === false && notificationRoute.current.length === 1 && notificationRoute.current.every((label) => label === "Notifications") && notificationRoute.title === "Good things found you." && notificationRoute.unread === 3, "Sidebar Notifications did not open the shareable notification route");
    await desktop.locator("#markNotificationsRead").click();
    const notificationReadState = await desktop.evaluate(() => ({
      unread: document.querySelectorAll(".notification-card.is-unread").length,
      status: document.querySelector("#notificationsStatus")?.textContent,
      buttonDisabled: document.querySelector("#markNotificationsRead")?.disabled,
      sidebarDotHidden: document.querySelector('.nav-item[data-nav="Notifications"] .notification-dot')?.hidden,
      topbarDotHidden: document.querySelector(".topbar-actions .has-notification .notification-dot")?.hidden,
    }));
    assert(notificationReadState.unread === 0 && notificationReadState.status === "You’re all caught up." && notificationReadState.buttonDisabled === true && notificationReadState.sidebarDotHidden === true && notificationReadState.topbarDotHidden === true, "Notifications did not expose an accessible mark-all-read state");
    await desktop.goBack();
    await wait(80);
    await desktop.locator(".topbar-actions .has-notification").click();
    const topbarNotificationRoute = await desktop.evaluate(() => ({
      url: window.location.search,
      homeHidden: document.querySelector("#homeView")?.hidden,
      notificationsHidden: document.querySelector("#notificationsView")?.hidden,
    }));
    assert(topbarNotificationRoute.url.includes("view=notifications") && topbarNotificationRoute.homeHidden === true && topbarNotificationRoute.notificationsHidden === false, "Topbar Notifications did not open the shareable notification route");
    await desktop.goBack();
    await wait(80);
    results.push({ id: "notifications-route", verified: true, viewport: "1440x1000" });

    await desktop.locator('.nav-item[data-nav="Settings"]').click();
    const settingsRoute = await desktop.evaluate(() => ({
      url: window.location.search,
      homeHidden: document.querySelector("#homeView")?.hidden,
      settingsHidden: document.querySelector("#settingsView")?.hidden,
      current: Array.from(document.querySelectorAll('[data-nav][aria-current="page"]')).map((item) => item.dataset.nav),
      title: document.querySelector("#settingsTitle")?.textContent,
      digestChecked: document.querySelector("#settingDigest")?.checked,
    }));
    assert(settingsRoute.url.includes("view=settings") && settingsRoute.homeHidden === true && settingsRoute.settingsHidden === false && settingsRoute.current.length === 1 && settingsRoute.current[0] === "Settings" && settingsRoute.title === "Make the room yours." && settingsRoute.digestChecked === true, "Settings did not open as a shareable preferences route");
    await desktop.locator("#settingDigest").uncheck();
    const settingsDirty = await desktop.evaluate(() => ({
      status: document.querySelector("#settingsStatus")?.textContent,
      saveDisabled: document.querySelector("#saveSettings")?.disabled,
    }));
    assert(settingsDirty.status === "You have unsaved preference changes." && settingsDirty.saveDisabled === false, "Settings did not expose a clear dirty state after a preference change");
    await desktop.locator("#saveSettings").click();
    const settingsSaved = await desktop.evaluate(() => ({
      status: document.querySelector("#settingsStatus")?.textContent,
      saveDisabled: document.querySelector("#saveSettings")?.disabled,
      digestChecked: document.querySelector("#settingDigest")?.checked,
    }));
    assert(settingsSaved.status === "Your preferences are saved." && settingsSaved.saveDisabled === true && settingsSaved.digestChecked === false, "Settings did not confirm and retain saved preference state");
    await desktop.goBack();
    await wait(80);
    results.push({ id: "settings-route", verified: true, viewport: "1440x1000" });
    await desktop.goto(`${DEFAULT_BASE_URL}/index.html?source=qa&feed=offline&filter=following&q=work`, { waitUntil: "networkidle" });
    const offlineState = await desktop.evaluate(() => ({
      bannerHidden: document.querySelector("#feedRecoveryBanner")?.hidden,
      bannerState: document.querySelector("#feedRecoveryBanner")?.dataset.state,
      filterPressed: document.querySelector('[data-filter="following"]')?.getAttribute("aria-pressed"),
      cards: document.querySelectorAll("#feedList .post-card").length,
      url: window.location.search,
    }));
    assert(!offlineState.bannerHidden && offlineState.bannerState === "offline" && offlineState.filterPressed === "true" && offlineState.cards === 1 && offlineState.url.includes("source=qa"), "Offline feed state did not preserve stale content and filter context");
    await desktop.locator("#retryFeed").click();
    await wait(80);
    const offlineRecovered = await desktop.evaluate(() => ({
      bannerHidden: document.querySelector("#feedRecoveryBanner")?.hidden,
      feedState: document.querySelector("#feedList")?.dataset.feedState,
      active: document.activeElement.id,
      url: window.location.search,
      status: document.querySelector("#feedStatus")?.textContent,
    }));
    assert(offlineRecovered.bannerHidden && offlineRecovered.active === "feedStatus" && !offlineRecovered.url.includes("feed=offline") && offlineRecovered.status.includes("connection is back"), "Offline feed retry did not restore the ready state with an announcement");
    results.push({ id: "feed-offline-recovery", verified: true, viewport: "1440x1000" });
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
    await mobile.goto(`${DEFAULT_BASE_URL}/index.html?source=qa&feed=error&filter=following`, { waitUntil: "networkidle" });
    const feedError = await mobile.evaluate(() => ({
      role: document.querySelector('[data-feed-state="error"]')?.getAttribute("role"),
      retry: Boolean(document.querySelector('[data-retry-feed]')),
      bannerHidden: document.querySelector("#feedRecoveryBanner")?.hidden,
      filterPressed: document.querySelector('[data-filter="following"]')?.getAttribute("aria-pressed"),
      url: window.location.search,
    }));
    assert(feedError.role === "alert" && feedError.retry && feedError.bannerHidden && feedError.filterPressed === "true" && feedError.url.includes("feed=error"), "Feed error state did not expose an alert, retry action, and retained filter");
    await mobile.locator('[data-retry-feed]').click();
    await wait(80);
    const feedErrorRecovered = await mobile.evaluate(() => ({
      error: Boolean(document.querySelector('[data-feed-state="error"]')),
      cards: document.querySelectorAll("#feedList .post-card").length,
      filterPressed: document.querySelector('[data-filter="following"]')?.getAttribute("aria-pressed"),
      active: document.activeElement.id,
      url: window.location.search,
    }));
    assert(!feedErrorRecovered.error && feedErrorRecovered.cards === 2 && feedErrorRecovered.filterPressed === "true" && feedErrorRecovered.active === "feedStatus" && !feedErrorRecovered.url.includes("feed=error"), "Feed error retry did not restore the retained filtered feed");
    results.push({ id: "feed-error-recovery", verified: true, viewport: "390x844" });
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
    assert(boardHistoryState.view === "desktop" && boardHistoryState.filterPressed === "true" && boardHistoryState.visibleScreens === 13, "Board did not rehydrate after a history state change");
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
    await board.locator('[data-open-artboard="Settings / Preferences"]').click();
    const settingsDialogOpen = await board.evaluate(() => ({
      active: document.activeElement.id,
      title: document.querySelector("#dialogTitle")?.textContent,
      description: document.querySelector("#dialogDescription")?.textContent,
      open: document.querySelector("#boardDialog").open,
    }));
    assert(settingsDialogOpen.active === "closeBoardDialog" && settingsDialogOpen.title === "Settings / Preferences" && settingsDialogOpen.description === "Account · rhythm · recovery" && settingsDialogOpen.open, "Settings artboard handoff did not open with its declared metadata");
    await board.keyboard.press("Escape");
    const settingsDialogClosed = await board.evaluate(() => ({
      activeLabel: document.activeElement.getAttribute("data-open-artboard"),
      open: document.querySelector("#boardDialog").open,
    }));
    assert(settingsDialogClosed.activeLabel === "Settings / Preferences" && !settingsDialogClosed.open, "Settings artboard dialog focus did not return after Escape");
    await board.locator('[data-open-artboard="Notifications / Stay close"]').click();
    const notificationsDialogOpen = await board.evaluate(() => ({
      active: document.activeElement.id,
      title: document.querySelector("#dialogTitle")?.textContent,
      description: document.querySelector("#dialogDescription")?.textContent,
      open: document.querySelector("#boardDialog").open,
    }));
    assert(notificationsDialogOpen.active === "closeBoardDialog" && notificationsDialogOpen.title === "Notifications / Stay close" && notificationsDialogOpen.description === "Unread · follow-through · recovery" && notificationsDialogOpen.open, "Notifications artboard handoff did not open with its declared metadata");
    await board.keyboard.press("Escape");
    const notificationsDialogClosed = await board.evaluate(() => ({
      activeLabel: document.activeElement.getAttribute("data-open-artboard"),
      open: document.querySelector("#boardDialog").open,
    }));
    assert(notificationsDialogClosed.activeLabel === "Notifications / Stay close" && !notificationsDialogClosed.open, "Notifications artboard dialog focus did not return after Escape");
    await board.locator('[data-open-artboard="Workspace / Picker"]').click();
    const workspaceBoardDialogOpen = await board.evaluate(() => ({
      active: document.activeElement.id,
      title: document.querySelector("#dialogTitle")?.textContent,
      description: document.querySelector("#dialogDescription")?.textContent,
      open: document.querySelector("#boardDialog").open,
    }));
    assert(workspaceBoardDialogOpen.active === "closeBoardDialog" && workspaceBoardDialogOpen.title === "Workspace / Picker" && workspaceBoardDialogOpen.description === "Space choice · focus · context" && workspaceBoardDialogOpen.open, "Workspace artboard handoff did not open with its declared metadata");
    await board.keyboard.press("Escape");
    const workspaceBoardDialogClosed = await board.evaluate(() => ({
      activeLabel: document.activeElement.getAttribute("data-open-artboard"),
      open: document.querySelector("#boardDialog").open,
    }));
    assert(workspaceBoardDialogClosed.activeLabel === "Workspace / Picker" && !workspaceBoardDialogClosed.open, "Workspace artboard dialog focus did not return after Escape");
    await board.locator('[data-open-artboard="Your circles / Collection"]').click();
    const circlesBoardDialogOpen = await board.evaluate(() => ({
      active: document.activeElement?.id,
      title: document.querySelector("#dialogTitle")?.textContent,
      description: document.querySelector("#dialogDescription")?.textContent,
      open: document.querySelector("#boardDialog")?.open,
    }));
    assert(circlesBoardDialogOpen.active === "closeBoardDialog" && circlesBoardDialogOpen.title === "Your circles / Collection" && circlesBoardDialogOpen.description === "Collection · activity · belonging" && circlesBoardDialogOpen.open, "Your circles artboard handoff did not open with its declared metadata");
    await board.keyboard.press("Escape");
    const circlesBoardDialogClosed = await board.evaluate(() => ({
      activeLabel: document.activeElement?.dataset.openArtboard,
      open: document.querySelector("#boardDialog")?.open,
    }));
    assert(circlesBoardDialogClosed.activeLabel === "Your circles / Collection" && !circlesBoardDialogClosed.open, "Your circles artboard dialog focus did not return after Escape");
    await board.locator('[data-open-artboard="Feed / Recovery"]').click();
    const recoveryBoardDialogOpen = await board.evaluate(() => ({
      active: document.activeElement.id,
      title: document.querySelector("#dialogTitle")?.textContent,
      description: document.querySelector("#dialogDescription")?.textContent,
      open: document.querySelector("#boardDialog").open,
    }));
    assert(recoveryBoardDialogOpen.active === "closeBoardDialog" && recoveryBoardDialogOpen.title === "Feed / Recovery" && recoveryBoardDialogOpen.description === "Offline · stale · error · retry" && recoveryBoardDialogOpen.open, "Feed recovery artboard handoff did not open with its declared metadata");
    await board.keyboard.press("Escape");
    const recoveryBoardDialogClosed = await board.evaluate(() => ({
      activeLabel: document.activeElement.getAttribute("data-open-artboard"),
      open: document.querySelector("#boardDialog").open,
    }));
    assert(recoveryBoardDialogClosed.activeLabel === "Feed / Recovery" && !recoveryBoardDialogClosed.open, "Feed recovery artboard dialog focus did not return after Escape");
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
