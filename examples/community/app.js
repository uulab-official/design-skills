const posts = [
  {
    id: 1,
    circle: "Quiet Mornings",
    dot: "dot-lilac",
    filter: "following",
    title: "The best workday starts before the inbox.",
    excerpt: "A small, honest ritual for protecting the first hour of the day.",
    author: "Jae Kim",
    initials: "JK",
    avatar: "avatar-jae",
    time: "14 min ago",
    likes: 84,
    comments: 18,
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=700&q=85",
    alt: "Notebook, coffee, and a laptop on a desk"
  },
  {
    id: 2,
    circle: "City Makers",
    dot: "dot-coral",
    filter: "latest",
    title: "A neighborhood map made from borrowed stories.",
    excerpt: "What happens when a city is drawn by the people who notice its edges?",
    author: "Hana Lee",
    initials: "HL",
    avatar: "avatar-hana",
    time: "38 min ago",
    likes: 61,
    comments: 12,
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=85",
    alt: "Small group collaborating around a table"
  },
  {
    id: 3,
    circle: "Sunday Film Club",
    dot: "dot-moss",
    filter: "following",
    title: "Films that leave the door open.",
    excerpt: "Three quiet endings we kept thinking about long after the credits.",
    author: "Sol Park",
    initials: "SP",
    avatar: "avatar-sol",
    time: "1 hr ago",
    likes: 42,
    comments: 9,
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=700&q=85",
    alt: "Cinema seats facing a movie screen"
  }
];

const state = {
  filter: "all",
  circle: "",
  query: "",
  liked: new Set(),
  saved: new Set(),
  toastTimer: null
};

const feedList = document.querySelector("#feedList");
const searchInput = document.querySelector("#searchInput");
const composerDialog = document.querySelector("#composerDialog");
const composerForm = document.querySelector("#composerForm");
const toast = document.querySelector("#toast");

function icon(name) {
  return `<svg class="icon" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  window.clearTimeout(state.toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  state.toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function cardMarkup(post) {
  const liked = state.liked.has(post.id);
  const saved = state.saved.has(post.id);
  const likes = post.likes + (liked ? 1 : 0);

  return `<article class="post-card" data-post-id="${post.id}">
    <div class="post-copy">
      <div class="post-meta"><span class="circle-dot ${post.dot}"></span><span>${escapeHtml(post.circle)}</span><span class="meta-separator">·</span><span>${post.time}</span></div>
      <h3 class="post-title">${escapeHtml(post.title)}</h3>
      <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
      <div class="post-footer">
        <div class="author-line"><span class="avatar ${post.avatar}">${post.initials}</span><span><strong>${escapeHtml(post.author)}</strong><small>${post.time}</small></span></div>
        <div class="post-actions">
          <button class="post-action ${liked ? "is-active" : ""}" type="button" data-post-action="like" aria-label="${liked ? "Unlike" : "Like"} ${escapeHtml(post.title)}" aria-pressed="${liked}">${icon("heart")}<span>${likes}</span></button>
          <button class="post-action" type="button" data-post-action="comment" aria-label="Comment on ${escapeHtml(post.title)}">${icon("message")}<span>${post.comments}</span></button>
          <button class="post-action ${saved ? "is-active" : ""}" type="button" data-post-action="save" aria-label="${saved ? "Remove" : "Save"} ${escapeHtml(post.title)}" aria-pressed="${saved}">${icon("bookmark")}</button>
        </div>
      </div>
    </div>
    <div class="post-thumb"><img src="${post.image}" alt="${escapeHtml(post.alt)}" loading="lazy" /><span class="post-image-wash"></span></div>
  </article>`;
}

function renderFeed() {
  const query = state.query.trim().toLowerCase();
  const visiblePosts = posts.filter((post) => {
    const matchesFilter = state.filter === "all" || post.filter === state.filter;
    const matchesCircle = !state.circle || post.circle === state.circle;
    const haystack = `${post.title} ${post.excerpt} ${post.circle} ${post.author}`.toLowerCase();
    return matchesFilter && matchesCircle && (!query || haystack.includes(query));
  });

  feedList.innerHTML = visiblePosts.length
    ? visiblePosts.map(cardMarkup).join("")
    : `<div class="empty-state"><span class="empty-icon">${icon("spark")}</span><h3>No conversations here yet.</h3><p>Try another search or make the first thoughtful move.</p><button class="text-button" type="button" data-clear-feed>Clear filters ${icon("arrow-up")}</button></div>`;

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === state.filter && !state.circle);
  });
}

function openComposer() {
  if (typeof composerDialog.showModal === "function") {
    composerDialog.showModal();
    window.setTimeout(() => document.querySelector("#composerTitleInput")?.focus(), 30);
  } else {
    composerDialog.setAttribute("open", "");
  }
}

function closeComposer() {
  composerDialog.close();
}

function toggleSidebar(open) {
  document.querySelector("#sidebar").classList.toggle("is-open", open);
  document.querySelector("#sidebarScrim").classList.toggle("is-visible", open);
  document.querySelector("#openSidebar").setAttribute("aria-expanded", String(open));
}

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    state.circle = "";
    renderFeed();
  });
});

document.querySelectorAll("[data-filter-circle]").forEach((button) => {
  button.addEventListener("click", () => {
    state.circle = button.dataset.filterCircle;
    state.filter = "all";
    renderFeed();
    document.querySelector("#feedList")?.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast(`${state.circle} is now shaping your feed`);
  });
});

feedList.addEventListener("click", (event) => {
  const action = event.target.closest("[data-post-action]");
  if (action) {
    const postId = Number(action.closest("[data-post-id]").dataset.postId);
    const post = posts.find((item) => item.id === postId);
    if (action.dataset.postAction === "like") {
      state.liked.has(postId) ? state.liked.delete(postId) : state.liked.add(postId);
      showToast(state.liked.has(postId) ? "Added a little appreciation" : "Like removed");
      renderFeed();
    }
    if (action.dataset.postAction === "save") {
      state.saved.has(postId) ? state.saved.delete(postId) : state.saved.add(postId);
      showToast(state.saved.has(postId) ? "Saved to your quiet corner" : "Removed from saved");
      renderFeed();
    }
    if (action.dataset.postAction === "comment") showToast(`Opening the conversation by ${post.author}`);
    return;
  }
  if (event.target.closest(".post-card")) showToast("Post detail is ready for the next route");
  const clear = event.target.closest("[data-clear-feed]");
  if (clear) {
    state.filter = "all";
    state.circle = "";
    state.query = "";
    searchInput.value = "";
    renderFeed();
  }
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  state.circle = "";
  state.filter = "all";
  renderFeed();
});

document.querySelector("#openComposer").addEventListener("click", openComposer);
document.querySelector("#mobileCompose").addEventListener("click", openComposer);
document.querySelector("#promptButton").addEventListener("click", openComposer);
document.querySelector("#closeComposer").addEventListener("click", closeComposer);

composerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const titleInput = document.querySelector("#composerTitleInput");
  const bodyInput = document.querySelector("#composerBody");
  const circle = document.querySelector("#composerCircle").value;
  const title = titleInput.value.trim();
  if (!title) {
    titleInput.focus();
    showToast("Give your conversation a clear title first");
    return;
  }
  posts.unshift({
    id: Date.now(),
    circle,
    dot: circle === "City Makers" ? "dot-coral" : circle === "Quiet Mornings" ? "dot-lilac" : circle === "Sunday Film Club" ? "dot-moss" : "dot-blue",
    filter: "latest",
    title,
    excerpt: bodyInput.value.trim() || "A new thought, making a little more room for a good conversation.",
    author: "Mina Park",
    initials: "MP",
    avatar: "avatar-mina",
    time: "Just now",
    likes: 0,
    comments: 0,
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=700&q=85",
    alt: "Notebook and coffee on a desk"
  });
  state.filter = "all";
  state.circle = "";
  composerForm.reset();
  closeComposer();
  renderFeed();
  showToast("Conversation published to your circles");
});

document.querySelector("#openSidebar").addEventListener("click", () => toggleSidebar(true));
document.querySelector("#sidebarScrim").addEventListener("click", () => toggleSidebar(false));
document.querySelector("#scrollToCircles").addEventListener("click", () => document.querySelector("#circlesSection")?.scrollIntoView({ behavior: "smooth", block: "center" }));

document.querySelectorAll("[data-nav]").forEach((button) => {
  button.addEventListener("click", () => {
    const label = button.dataset.nav;
    document.querySelectorAll("[data-nav]").forEach((item) => item.classList.toggle("is-active", item.dataset.nav === label));
    toggleSidebar(false);
    if (label !== "Home") showToast(`${label} is mapped for the next route`);
  });
});

document.querySelectorAll("[data-toast]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.toast)));

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape") toggleSidebar(false);
});

renderFeed();
