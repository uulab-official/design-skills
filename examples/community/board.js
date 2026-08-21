const boardMain = document.querySelector("#boardMain");
const boardDialog = document.querySelector("#boardDialog");
const boardToast = document.querySelector("#boardToast");
const dialogTitle = document.querySelector("#dialogTitle");
const dialogDescription = document.querySelector("#dialogDescription");
const dialogClose = document.querySelector("#closeBoardDialog");
let toastTimer;

const state = {
  view: "desktop",
  filter: "all",
  dialogTrigger: null,
};

const validViews = new Set(["desktop", "mobile"]);
const validFilters = new Set(["all", "directions", "archetypes", "platforms", "screens", "states", "system"]);

const artboardDescriptions = {
  "Home / For you": "Entry point · editorial priority",
  "Discover / Circles": "Explore · recommendation system",
  "Circle / City Makers": "Context · membership · belonging",
  "Thread / Conversation": "Reading · response · recovery",
  "Profile / Mina Park": "Identity · contribution · trust",
  "Settings / Preferences": "Account · rhythm · recovery",
  "Notifications / Stay close": "Unread · follow-through · recovery",
  "Workspace / Picker": "Space choice · focus · context",
  "Feed / Recovery": "Offline · stale · error · retry",
  "Mobile / Home": "Responsive recomposition · 390",
  "Home / Following": "Circle-scoped state · retained context",
  "Composer / Modal": "Creation · validation · success",
};

function showToast(message) {
  window.clearTimeout(toastTimer);
  boardToast.textContent = message;
  boardToast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => boardToast.classList.remove("is-visible"), 2400);
}

function restoreFocus(element) {
  if (element instanceof HTMLElement && element.isConnected && !element.hasAttribute("disabled")) element.focus();
}

function syncUrlState() {
  const url = new URL(window.location.href);
  if (state.view === "desktop") url.searchParams.delete("view");
  else url.searchParams.set("view", state.view);
  if (state.filter === "all") url.searchParams.delete("filter");
  else url.searchParams.set("filter", state.filter);
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function renderBoardState() {
  boardMain.dataset.view = state.view;
  document.querySelectorAll("[data-view-toggle]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewToggle === state.view);
    button.setAttribute("aria-pressed", String(button.dataset.viewToggle === state.view));
  });

  document.querySelectorAll("[data-board-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.boardFilter === state.filter);
    button.setAttribute("aria-pressed", String(button.dataset.boardFilter === state.filter));
  });

  document.querySelectorAll("[data-board-type]").forEach((item) => {
    item.hidden = state.filter !== "all" && item.dataset.boardType !== state.filter;
  });
}

function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  const filter = params.get("filter");
  state.view = validViews.has(view) ? view : "desktop";
  state.filter = validFilters.has(filter) ? filter : "all";
  renderBoardState();
  syncUrlState();
}

function setView(view) {
  if (!validViews.has(view)) return;
  state.view = view;
  renderBoardState();
  syncUrlState();
  showToast(`${view === "mobile" ? "Mobile" : "Desktop"} composition selected`);
}

function setFilter(filter) {
  if (!validFilters.has(filter)) return;
  state.filter = filter;
  renderBoardState();
  syncUrlState();
  showToast(filter === "all" ? "Showing the complete handoff" : `${filter[0].toUpperCase()}${filter.slice(1)} only`);
}

function openArtboard(title) {
  state.dialogTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  dialogTitle.textContent = title;
  dialogDescription.textContent = artboardDescriptions[title] || "Reusable screen surface · review handoff";
  if (typeof boardDialog.showModal === "function") boardDialog.showModal();
  else {
    boardDialog.setAttribute("open", "");
    boardDialog.setAttribute("class", `${boardDialog.getAttribute("class")} is-open`);
  }
  window.setTimeout(() => dialogClose?.focus(), 30);
}

function closeArtboard() {
  const isOpen = boardDialog.open || /\bis-open\b/.test(boardDialog.className);
  if (!isOpen) return;
  const trigger = state.dialogTrigger;
  state.dialogTrigger = null;
  if (typeof boardDialog.close === "function") boardDialog.close();
  else {
    boardDialog.removeAttribute("open");
    boardDialog.setAttribute("class", boardDialog.getAttribute("class").replace(/\bis-open\b/g, "").replace(/\s+/g, " ").trim());
  }
  restoreFocus(trigger);
}

document.querySelectorAll("[data-view-toggle]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.viewToggle));
});

document.querySelectorAll("[data-board-filter]").forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.boardFilter));
});

document.querySelectorAll("[data-open-artboard]").forEach((button) => {
  button.addEventListener("click", () => openArtboard(button.dataset.openArtboard));
});

dialogClose.addEventListener("click", closeArtboard);
boardDialog.addEventListener("click", (event) => {
  if (event.target === boardDialog) closeArtboard();
});
boardDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeArtboard();
});

document.querySelectorAll("[data-scroll-to]").forEach((button) => {
  button.addEventListener("click", () => document.querySelector(`#${button.dataset.scrollTo}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !boardDialog.open && /\bis-open\b/.test(boardDialog.className)) closeArtboard();
});

window.addEventListener("popstate", readUrlState);

readUrlState();
