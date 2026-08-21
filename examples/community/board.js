const boardMain = document.querySelector("#boardMain");
const boardDialog = document.querySelector("#boardDialog");
const boardToast = document.querySelector("#boardToast");
const dialogTitle = document.querySelector("#dialogTitle");
const dialogDescription = document.querySelector("#dialogDescription");
let toastTimer;

const artboardDescriptions = {
  "Home / For you": "Entry point · editorial priority",
  "Discover / Circles": "Explore · recommendation system",
  "Circle / City Makers": "Context · membership · belonging",
  "Thread / Conversation": "Reading · response · recovery",
  "Profile / Mina Park": "Identity · contribution · trust",
  "Mobile / Home": "Responsive recomposition · 390"
};

function showToast(message) {
  window.clearTimeout(toastTimer);
  boardToast.textContent = message;
  boardToast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => boardToast.classList.remove("is-visible"), 2400);
}

function openArtboard(title) {
  dialogTitle.textContent = title;
  dialogDescription.textContent = artboardDescriptions[title] || "Reusable screen surface · review handoff";
  if (typeof boardDialog.showModal === "function") boardDialog.showModal();
  else {
    boardDialog.setAttribute("open", "");
    boardDialog.setAttribute("class", `${boardDialog.getAttribute("class")} is-open`);
  }
}

function closeArtboard() {
  if (typeof boardDialog.close === "function") boardDialog.close();
  else {
    boardDialog.removeAttribute("open");
    boardDialog.setAttribute("class", boardDialog.getAttribute("class").replace(/\bis-open\b/g, "").replace(/\s+/g, " ").trim());
  }
}

document.querySelectorAll("[data-view-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.viewToggle;
    boardMain.dataset.view = view;
    document.querySelectorAll("[data-view-toggle]").forEach((item) => item.classList.toggle("is-active", item === button));
    showToast(`${view === "mobile" ? "Mobile" : "Desktop"} composition selected`);
  });
});

document.querySelectorAll("[data-board-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.boardFilter;
    document.querySelectorAll("[data-board-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
    document.querySelectorAll("[data-board-type]").forEach((item) => {
      item.hidden = filter !== "all" && item.dataset.boardType !== filter;
    });
    showToast(filter === "all" ? "Showing the complete handoff" : `${filter[0].toUpperCase()}${filter.slice(1)} only`);
  });
});

document.querySelectorAll("[data-open-artboard]").forEach((button) => {
  button.addEventListener("click", () => openArtboard(button.dataset.openArtboard));
});

document.querySelector("#closeBoardDialog").addEventListener("click", closeArtboard);
boardDialog.addEventListener("click", (event) => {
  if (event.target === boardDialog) closeArtboard();
});

document.querySelectorAll("[data-scroll-to]").forEach((button) => {
  button.addEventListener("click", () => document.querySelector(`#${button.dataset.scrollTo}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && (boardDialog.open || /\bis-open\b/.test(boardDialog.className))) closeArtboard();
});
