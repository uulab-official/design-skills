const posts = [
  {
    id: 1,
    threadId: "quiet-inbox",
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
    image: "./assets/editorial/desk-ritual.jpg",
    alt: "Notebook, coffee, and a laptop on a desk"
  },
  {
    id: 2,
    threadId: "city-map",
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
    image: "./assets/editorial/collaborative-table.jpg",
    alt: "Small group collaborating around a table"
  },
  {
    id: 3,
    threadId: "film-door",
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
    image: "./assets/editorial/cinema-afterglow.jpg",
    alt: "Cinema seats facing a movie screen"
  }
];

const state = {
  view: "home",
  filter: "all",
  circle: "",
  query: "",
  discoverFilter: "all",
  circleTab: "conversations",
  circleJoined: false,
  thread: "",
  threadReplies: {},
  threadStatus: "",
  profile: "",
  profileTab: "conversations",
  profileFollowed: false,
  profileStatus: "",
  liked: new Set(),
  saved: new Set(),
  toastTimer: null,
  composerTrigger: null,
  sidebarTrigger: null
};

const feedList = document.querySelector("#feedList");
const feedStatus = document.querySelector("#feedStatus");
const searchInput = document.querySelector("#searchInput");
const homeView = document.querySelector("#homeView");
const discoverView = document.querySelector("#discoverView");
const discoverStatus = document.querySelector("#discoverStatus");
const circleView = document.querySelector("#circleView");
const threadView = document.querySelector("#threadView");
const profileView = document.querySelector("#profileView");
const composerDialog = document.querySelector("#composerDialog");
const composerForm = document.querySelector("#composerForm");
const composerTitleInput = document.querySelector("#composerTitleInput");
const composerTitleError = document.querySelector("#composerTitleError");
const toast = document.querySelector("#toast");
const sidebar = document.querySelector("#sidebar");
const sidebarScrim = document.querySelector("#sidebarScrim");
const sidebarTrigger = document.querySelector("#openSidebar");

const validFilters = new Set(["all", "following", "latest"]);
const validCircles = new Set(["City Makers", "Quiet Mornings", "Sunday Film Club", "Open Table", "Tiny Libraries", "Field Notes"]);
const validViews = new Set(["home", "discover", "circle", "thread", "profile"]);
const validDiscoverFilters = new Set(["all", "make", "slow", "notice"]);
const validProfileTabs = new Set(["conversations", "saved"]);
const circleProfiles = {
  "City Makers": {
    eyebrow: "City / making",
    initials: "CM",
    accent: "coral",
    description: "For people turning small observations into useful things for the places they live.",
    memberCount: 18,
    memberCopy: "18 people making useful things together.",
    fitTitle: "Notice the edges of a place.",
    fitCopy: "You like half-formed ideas, local details, and making something useful before it is perfect.",
    topics: ["Local rituals", "Making in public", "Small city"],
    members: ["MP", "HL", "JK", "+15"],
    conversations: [{ threadId: "city-map", author: "Hana Lee", initials: "HL", time: "38 min ago", title: "A neighborhood map made from borrowed stories.", excerpt: "What happens when a city is drawn by the people who notice its edges?" }, { threadId: "city-linger", author: "Mina Park", initials: "MP", time: "Today", title: "What would make your block easier to linger in?", excerpt: "A prompt for the overlooked corners we pass every day." }],
  },
  "Quiet Mornings": {
    eyebrow: "Ritual / focus",
    initials: "QM",
    accent: "lilac",
    description: "A soft place for protecting the first hour, and sharing what helps you begin.",
    memberCount: 6,
    memberCopy: "6 people protecting a slower start.",
    fitTitle: "Protect the first hour.",
    fitCopy: "You are interested in gentle systems, honest routines, and better ways to begin.",
    topics: ["Morning rituals", "Deep work", "Small resets"],
    members: ["JK", "SO", "+4"],
    conversations: [{ threadId: "quiet-inbox", author: "Jae Kim", initials: "JK", time: "14 min ago", title: "The best workday starts before the inbox.", excerpt: "A small, honest ritual for protecting the first hour of the day." }],
  },
  "Sunday Film Club": {
    eyebrow: "Film / afterglow",
    initials: "SF",
    accent: "moss",
    description: "Three films, one generous question, and the thoughts that stay after the credits.",
    memberCount: 2,
    memberCopy: "2 people watching closely this week.",
    fitTitle: "Stay for the last frame.",
    fitCopy: "You like quiet endings, unfinished interpretations, and stories that leave the door open.",
    topics: ["Quiet endings", "One good question", "Sunday ritual"],
    members: ["SP", "HN"],
    conversations: [{ threadId: "film-door", author: "Sol Park", initials: "SP", time: "1 hr ago", title: "Films that leave the door open.", excerpt: "Three quiet endings we kept thinking about long after the credits." }],
  },
  "Open Table": {
    eyebrow: "Questions / practice",
    initials: "OT",
    accent: "blue",
    description: "Bring the half-formed idea. Leave with a better question and a little more courage.",
    memberCount: 12,
    memberCopy: "12 people thinking out loud together.",
    fitTitle: "Keep the question open.",
    fitCopy: "You would rather make room for a useful question than rush toward a polished answer.",
    topics: ["Work in progress", "Good questions", "Shared practice"],
    members: ["AV", "MP", "HL", "+9"],
    conversations: [{ threadId: "open-room", author: "Ava Choi", initials: "AV", time: "2 hr ago", title: "What are you making room for?", excerpt: "A table for the ideas that need a little more time before they become plans." }],
  },
  "Tiny Libraries": {
    eyebrow: "Books / neighborhood",
    initials: "TL",
    accent: "sand",
    description: "Notes from the shelves, street corners, and little exchanges that make a city feel shared.",
    memberCount: 9,
    memberCopy: "9 people trading good finds.",
    fitTitle: "Follow a well-worn page.",
    fitCopy: "You notice what people leave behind, pass along, and quietly recommend.",
    topics: ["Books to pass on", "Street corners", "Small exchanges"],
    members: ["JM", "SO", "+7"],
    conversations: [{ threadId: "tiny-shelf", author: "Joon Min", initials: "JM", time: "Yesterday", title: "A shelf for books that changed your route.", excerpt: "Which book made you take the long way home?" }],
  },
  "Field Notes": {
    eyebrow: "Walk / attention",
    initials: "FN",
    accent: "ink",
    description: "A weekly pause to look closely, walk without a destination, and bring one detail back.",
    memberCount: 14,
    memberCopy: "14 people looking a little closer.",
    fitTitle: "Look twice at the ordinary.",
    fitCopy: "You collect details, take the long way home, and believe attention is a practice.",
    topics: ["Slow walks", "Daily details", "Outside time"],
    members: ["HL", "JK", "MP", "+11"],
    conversations: [{ threadId: "field-detail", author: "Hana Lee", initials: "HL", time: "Yesterday", title: "The detail I nearly walked past.", excerpt: "A small field note from a familiar route." }],
  },
};

const threadProfiles = {
  "city-daylight": {
    circle: "City Makers",
    kicker: "Conversation · 8 min read",
    readTime: "8 min read",
    author: "Mina Park",
    initials: "MP",
    avatar: "avatar-mina",
    time: "Today, 9:42 AM",
    title: "A little more daylight, a lot more making.",
    body: "The best projects I’ve worked on started with a small table, an unfinished idea, and someone willing to stay for one more question.",
    replies: [
      { author: "Jae Kim", initials: "JK", avatar: "avatar-jae", time: "14 min ago", body: "That one-more-question feeling is everything. I’m learning to leave more room for it." },
      { author: "Hana Lee", initials: "HL", avatar: "avatar-hana", time: "8 min ago", body: "Would love to hear what the unfinished idea was. The first version is often the most generous one." },
      { author: "Sol Park", initials: "SP", avatar: "avatar-sol", time: "Just now", body: "A small table is a good start. It gives the idea somewhere to become shared." },
    ],
  },
  "city-map": {
    circle: "City Makers",
    kicker: "Conversation · 8 min read",
    readTime: "8 min read",
    author: "Hana Lee",
    initials: "HL",
    avatar: "avatar-hana",
    time: "38 min ago",
    title: "A neighborhood map made from borrowed stories.",
    body: "What happens when a city is drawn by the people who notice its edges?",
    replies: [
      { author: "Mina Park", initials: "MP", avatar: "avatar-mina", time: "22 min ago", body: "I keep thinking about the places that invite us to stay a little longer. A bench, a low wall, a shopkeeper who remembers your order." },
      { author: "Jae Kim", initials: "JK", avatar: "avatar-jae", time: "14 min ago", body: "The map I want is less about landmarks and more about the small permissions a street gives you." },
      { author: "Sol Park", initials: "SP", avatar: "avatar-sol", time: "8 min ago", body: "Could we add the sounds, too? The corner where someone always tunes a guitar after sunset is part of the route." },
    ],
  },
  "city-linger": {
    circle: "City Makers",
    kicker: "Prompt · 3 min read",
    readTime: "3 min read",
    author: "Mina Park",
    initials: "MP",
    avatar: "avatar-mina",
    time: "Today",
    title: "What would make your block easier to linger in?",
    body: "A prompt for the overlooked corners we pass every day. What would you change, add, or simply notice?",
    replies: [
      { author: "Hana Lee", initials: "HL", avatar: "avatar-hana", time: "Yesterday", body: "More places to sit without needing to buy anything. A city feels different when rest is allowed in public." },
      { author: "Jae Kim", initials: "JK", avatar: "avatar-jae", time: "Yesterday", body: "A little shade and a place for a bottle of water would go a long way." },
    ],
  },
  "quiet-inbox": {
    circle: "Quiet Mornings",
    kicker: "Conversation · 4 min read",
    readTime: "4 min read",
    author: "Jae Kim",
    initials: "JK",
    avatar: "avatar-jae",
    time: "14 min ago",
    title: "The best workday starts before the inbox.",
    body: "A small, honest ritual for protecting the first hour of the day.",
    replies: [
      { author: "Mina Park", initials: "MP", avatar: "avatar-mina", time: "9 min ago", body: "I leave one page of my notebook blank on purpose. It makes the first thought feel less like a performance." },
      { author: "Soo Lee", initials: "SL", avatar: "avatar-soo", time: "5 min ago", body: "Tea, a window, and no decisions for twenty minutes. That is the whole system." },
    ],
  },
  "film-door": {
    circle: "Sunday Film Club",
    kicker: "Conversation · 5 min read",
    readTime: "5 min read",
    author: "Sol Park",
    initials: "SP",
    avatar: "avatar-sol",
    time: "1 hr ago",
    title: "Films that leave the door open.",
    body: "Three quiet endings we kept thinking about long after the credits.",
    replies: [
      { author: "Hana Lee", initials: "HL", avatar: "avatar-hana", time: "42 min ago", body: "I love an ending that trusts the audience enough to keep walking after the story stops." },
      { author: "Mina Park", initials: "MP", avatar: "avatar-mina", time: "31 min ago", body: "The silence after the last frame can be part of the film, too." },
    ],
  },
  "open-room": {
    circle: "Open Table",
    kicker: "Prompt · 6 min read",
    readTime: "6 min read",
    author: "Ava Choi",
    initials: "AV",
    avatar: "avatar-ava",
    time: "2 hr ago",
    title: "What are you making room for?",
    body: "A table for the ideas that need a little more time before they become plans.",
    replies: [
      { author: "Mina Park", initials: "MP", avatar: "avatar-mina", time: "1 hr ago", body: "A slower version of a project I keep trying to rush. The shape is getting clearer now." },
      { author: "Hana Lee", initials: "HL", avatar: "avatar-hana", time: "48 min ago", body: "Room for a question that does not need to become a task yet." },
    ],
  },
  "tiny-shelf": {
    circle: "Tiny Libraries",
    kicker: "Conversation · 3 min read",
    readTime: "3 min read",
    author: "Joon Min",
    initials: "JM",
    avatar: "avatar-jun",
    time: "Yesterday",
    title: "A shelf for books that changed your route.",
    body: "Which book made you take the long way home?",
    replies: [
      { author: "Soo Lee", initials: "SL", avatar: "avatar-soo", time: "Yesterday", body: "A slim book of essays I found in a station library. I missed my stop twice." },
    ],
  },
  "field-detail": {
    circle: "Field Notes",
    kicker: "Field note · 2 min read",
    readTime: "2 min read",
    author: "Hana Lee",
    initials: "HL",
    avatar: "avatar-hana",
    time: "Yesterday",
    title: "The detail I nearly walked past.",
    body: "A small field note from a familiar route.",
    replies: [
      { author: "Jae Kim", initials: "JK", avatar: "avatar-jae", time: "Yesterday", body: "The familiar routes are full of things waiting for a second look." },
    ],
  },
};

const validThreads = new Set(Object.keys(threadProfiles));
const profileProfiles = {
  mina: {
    name: "Mina Park",
    handle: "@minapark",
    location: "Seoul, KR",
    bio: "Designing gentle systems for good questions, useful rituals, and the people who make them better.",
    circles: ["City Makers", "Quiet Mornings", "Open Table", "Sunday Film Club"],
    conversations: ["quiet-inbox", "city-map"],
    saved: ["film-door", "open-room"],
  },
};
const validProfiles = new Set(Object.keys(profileProfiles));

function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  const filter = params.get("filter");
  const circle = params.get("circle");
  const thread = params.get("thread");
  const profile = params.get("profile");
  const profileTab = params.get("tab");
  const discoverFilter = params.get("topic");
  state.view = validViews.has(view) ? view : "home";
  state.filter = validFilters.has(filter) ? filter : "all";
  state.circle = validCircles.has(circle) ? circle : "";
  state.thread = validThreads.has(thread) ? thread : "";
  state.profile = validProfiles.has(profile) ? profile : "";
  state.profileTab = validProfileTabs.has(profileTab) ? profileTab : "conversations";
  if (state.view === "circle" && !state.circle) state.view = "home";
  if (state.view === "thread" && !state.thread) state.view = "home";
  if (state.view === "profile" && !state.profile) state.view = "home";
  if (state.view === "thread") state.circle = threadProfiles[state.thread].circle;
  state.query = params.get("q")?.slice(0, 120) ?? "";
  state.discoverFilter = validDiscoverFilters.has(discoverFilter) ? discoverFilter : "all";
  if (state.circle) state.filter = "all";
  searchInput.value = state.query;
}

function updateUrlState(historyMethod = "replaceState") {
  const url = new URL(window.location.href);
  if (state.view === "discover" || state.view === "circle" || state.view === "thread" || state.view === "profile") url.searchParams.set("view", state.view);
  else url.searchParams.delete("view");
  if (state.filter !== "all" && !state.circle) url.searchParams.set("filter", state.filter);
  else url.searchParams.delete("filter");
  if (state.circle) url.searchParams.set("circle", state.circle);
  else url.searchParams.delete("circle");
  if (state.view === "thread" && state.thread) url.searchParams.set("thread", state.thread);
  else url.searchParams.delete("thread");
  if (state.view === "profile" && state.profile) url.searchParams.set("profile", state.profile);
  else url.searchParams.delete("profile");
  if (state.view === "profile" && state.profileTab !== "conversations") url.searchParams.set("tab", state.profileTab);
  else url.searchParams.delete("tab");
  if (state.query.trim()) url.searchParams.set("q", state.query.trim().slice(0, 120));
  else url.searchParams.delete("q");
  if (state.view === "discover" && state.discoverFilter !== "all") url.searchParams.set("topic", state.discoverFilter);
  else url.searchParams.delete("topic");
  const nextUrl = url.pathname + url.search + url.hash;
  if (historyMethod === "pushState") window.history.pushState({}, "", nextUrl);
  else window.history.replaceState({}, "", nextUrl);
}

function syncUrlState() {
  updateUrlState();
}

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

function setComposerError(hasError) {
  if (hasError) {
    composerTitleInput.setAttribute("aria-invalid", "true");
    composerTitleError.removeAttribute("hidden");
  } else {
    composerTitleInput.removeAttribute("aria-invalid");
    composerTitleError.setAttribute("hidden", "");
  }
}

function renderFeed({ focusPostId = null, focusAction = "", syncUrl = true } = {}) {
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

  if (feedStatus && focusPostId === null) {
    const scope = state.circle || (state.filter === "all" ? "For you" : `${state.filter[0].toUpperCase()}${state.filter.slice(1)}`);
    const queryCopy = query ? ` matching “${state.query.trim()}”` : "";
    feedStatus.textContent = visiblePosts.length
      ? `${visiblePosts.length} conversation${visiblePosts.length === 1 ? "" : "s"} in ${scope}${queryCopy}.`
      : `No conversations found in ${scope}${queryCopy}.`;
  }

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === state.filter && !state.circle);
    button.setAttribute("aria-pressed", String(button.dataset.filter === state.filter && !state.circle));
  });
  document.querySelectorAll("[data-filter-circle]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filterCircle === state.circle));
  });
  if (syncUrl) syncUrlState();
  if (focusPostId !== null && focusAction) {
    feedList.querySelector(`[data-post-id="${focusPostId}"] [data-post-action="${focusAction}"]`)?.focus();
  }
}

function renderDiscover({ syncUrl = true } = {}) {
  const query = state.query.trim().toLowerCase();
  const cards = Array.from(document.querySelectorAll("[data-discover-card]"));
  let visibleCount = 0;
  cards.forEach((card) => {
    const matchesFilter = state.discoverFilter === "all" || card.dataset.discoverCategory === state.discoverFilter;
    const matchesQuery = !query || card.dataset.discoverSearch.includes(query);
    const visible = matchesFilter && matchesQuery;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  document.querySelectorAll("[data-discover-filter]").forEach((button) => {
    const isActive = button.dataset.discoverFilter === state.discoverFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  if (discoverStatus) {
    const queryCopy = query ? " matching “" + state.query.trim() + "”" : "";
    discoverStatus.textContent = visibleCount + " circle" + (visibleCount === 1 ? "" : "s") + queryCopy;
  }
  if (syncUrl) syncUrlState();
}

function renderCircle({ syncUrl = true } = {}) {
  const profile = circleProfiles[state.circle] || circleProfiles["City Makers"];
  const circleTitle = document.querySelector("#circleTitle");
  const circleDescription = document.querySelector("#circleDescription");
  const circleHero = document.querySelector("#circleHero");
  const circleMemberStack = document.querySelector("#circleMemberStack");
  const circleMemberCopy = document.querySelector("#circleMemberCopy");
  const circleCoverInitials = document.querySelector("#circleCoverInitials");
  const circleFitTitle = document.querySelector("#circleFitTitle");
  const circleFitCopy = document.querySelector("#circleFitCopy");
  const circleTopicList = document.querySelector("#circleTopicList");
  const joinButton = document.querySelector("#joinCircle");
  const circlePanel = document.querySelector("#circlePanel");
  const circleStatus = document.querySelector("#circleStatus");
  circleHero.dataset.accent = profile.accent;
  document.querySelector("#circleEyebrow").textContent = profile.eyebrow;
  circleTitle.textContent = state.circle;
  circleDescription.textContent = profile.description;
  circleMemberStack.setAttribute("aria-label", profile.memberCount + " members");
  circleMemberStack.innerHTML = profile.members.map((member) => "<b>" + escapeHtml(member) + "</b>").join("");
  circleMemberCopy.textContent = profile.memberCopy;
  circleCoverInitials.textContent = profile.initials;
  circleFitTitle.textContent = profile.fitTitle;
  circleFitCopy.textContent = profile.fitCopy;
  circleTopicList.innerHTML = profile.topics.map((topic) => "<span>" + escapeHtml(topic) + "</span>").join("");
  joinButton.setAttribute("aria-pressed", String(state.circleJoined));
  joinButton.innerHTML = state.circleJoined ? "Joined circle " + icon("check") : "Join circle " + icon("arrow-up");
  document.querySelectorAll("[data-circle-tab]").forEach((button) => {
    button.setAttribute("aria-selected", String(button.dataset.circleTab === state.circleTab));
  });
  if (state.circleTab === "about") {
    circlePanel.innerHTML = "<div class=\"circle-about-panel\"><p class=\"section-kicker\">About this circle</p><h2>" + escapeHtml(profile.description) + "</h2><p>There is no correct pace here. Share a reference, a question, or a detail that made you look twice. The best threads leave room for someone else to add their own edge.</p><div class=\"circle-about-rule\"></div><p class=\"circle-about-meta\">" + profile.memberCount + " members · " + profile.topics.join(" · ") + "</p></div>";
    circleStatus.textContent = "About " + state.circle + ".";
  } else {
    circlePanel.innerHTML = "<div class=\"circle-conversation-list\">" + profile.conversations.map((conversation) => "<article class=\"circle-conversation\"><div class=\"circle-conversation-avatar\">" + escapeHtml(conversation.initials) + "</div><div class=\"circle-conversation-copy\"><div class=\"post-meta\"><strong>" + escapeHtml(conversation.author) + "</strong><span>·</span><span>" + escapeHtml(conversation.time) + "</span></div><h2>" + escapeHtml(conversation.title) + "</h2><p>" + escapeHtml(conversation.excerpt) + "</p><div class=\"circle-conversation-footer\"><span>" + (threadProfiles[conversation.threadId]?.replies.length || 0) + " replies</span><button class=\"text-button\" type=\"button\" data-circle-conversation data-thread-route=\"" + escapeHtml(conversation.threadId) + "\">Read conversation " + icon("arrow-up") + "</button></div></div></article>").join("") + "</div>";
    circleStatus.textContent = profile.conversations.length + " conversation" + (profile.conversations.length === 1 ? "" : "s") + " in " + state.circle + ".";
  }
  if (syncUrl) syncUrlState();
}

function renderThread({ syncUrl = true } = {}) {
  const profile = threadProfiles[state.thread];
  if (!profile) return;
  const circleProfile = circleProfiles[profile.circle];
  const replies = [...profile.replies, ...(state.threadReplies[state.thread] || [])];
  document.querySelector("#threadCircleName").textContent = profile.circle;
  document.querySelector("#threadBackCircle").textContent = profile.circle;
  document.querySelector("#threadReadTime").textContent = profile.readTime;
  document.querySelector("#threadKicker").textContent = profile.kicker;
  document.querySelector("#threadTitle").textContent = profile.title;
  document.querySelector("#threadBody").textContent = profile.body;
  const authorAvatar = document.querySelector("#threadAuthorAvatar");
  authorAvatar.className = "avatar " + profile.avatar;
  authorAvatar.textContent = profile.initials;
  document.querySelector("#threadAuthor").textContent = profile.author;
  document.querySelector("#threadAuthorMeta").textContent = profile.time + " · " + profile.circle;
  document.querySelector("#threadReplyCount").textContent = replies.length;
  document.querySelector("#threadContextTitle").textContent = profile.circle;
  document.querySelector("#threadContextCopy").textContent = circleProfile.description;
  document.querySelector("#threadTopicList").innerHTML = circleProfile.topics.map((topic) => "<span>" + escapeHtml(topic) + "</span>").join("");
  document.querySelector("#threadReplyStatus").textContent = state.threadStatus || `${replies.length} thoughtful replies in ${profile.circle}.`;
  document.querySelector("#threadReplies").innerHTML = replies.map((reply) => `<article class="thread-reply"><span class="avatar ${reply.avatar}">${escapeHtml(reply.initials)}</span><div><div class="thread-reply-meta"><strong>${escapeHtml(reply.author)}</strong><span>${escapeHtml(reply.time)}</span></div><p class="thread-reply-body">${escapeHtml(reply.body)}</p><span class="thread-reply-action">♡ Appreciate · Reply</span></div></article>`).join("");
  if (syncUrl) syncUrlState();
}

function renderProfile({ syncUrl = true } = {}) {
  const profile = profileProfiles[state.profile];
  if (!profile) return;
  document.querySelector("#profileTitle").textContent = profile.name;
  document.querySelector("#profileBio").textContent = profile.bio;
  const followButton = document.querySelector("#followProfile");
  followButton.setAttribute("aria-pressed", String(state.profileFollowed));
  followButton.textContent = state.profileFollowed ? "Following" : "Follow";
  document.querySelectorAll("[data-profile-tab]").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.profileTab === state.profileTab)));
  document.querySelector("#profileCircleList").innerHTML = profile.circles.map((circleName) => `<button class="profile-circle-row" type="button" data-profile-circle="${escapeHtml(circleName)}"><span class="circle-symbol symbol-coral">${escapeHtml(circleProfiles[circleName].initials)}</span><span><strong>${escapeHtml(circleName)}</strong><small>${circleProfiles[circleName].memberCount} people</small></span>${icon("chevron")}</button>`).join("");
  const threadIds = state.profileTab === "saved" ? profile.saved : profile.conversations;
  const panelClass = state.profileTab === "saved" ? "profile-saved-panel" : "profile-conversation-panel";
  const kicker = state.profileTab === "saved" ? "Saved for later" : "Recent conversations";
  document.querySelector("#profilePanel").innerHTML = `<div class="${panelClass}"><p class="section-kicker">${kicker}</p>${threadIds.map((threadId) => { const thread = threadProfiles[threadId]; const circle = circleProfiles[thread.circle]; return `<article class="profile-post-card"><div class="profile-post-meta"><span class="circle-dot dot-coral"></span><span>${escapeHtml(thread.circle)}</span><span>·</span><span>${escapeHtml(thread.time)}</span></div><h2>${escapeHtml(thread.title)}</h2><p>${escapeHtml(thread.body)}</p><div class="profile-post-footer"><span>${thread.replies.length} replies · ${circle.memberCount} members</span><button class="text-button" type="button" data-profile-thread="${escapeHtml(threadId)}">Read conversation ${icon("arrow-up")}</button></div></article>`; }).join("")}</div>`;
  const defaultStatus = state.profileTab === "saved" ? `Saved by ${profile.name}.` : `Conversations by ${profile.name}.`;
  document.querySelector("#profileStatus").textContent = state.profileStatus || defaultStatus;
  if (syncUrl) syncUrlState();
}

function renderRoute({ syncUrl = true, scroll = true } = {}) {
  const isDiscover = state.view === "discover";
  const isCircle = state.view === "circle";
  const isThread = state.view === "thread";
  const isProfile = state.view === "profile";
  homeView.hidden = isDiscover || isCircle || isThread || isProfile;
  discoverView.hidden = !isDiscover;
  circleView.hidden = !isCircle;
  threadView.hidden = !isThread;
  profileView.hidden = !isProfile;
  document.querySelector("#breadcrumbRoot").textContent = isCircle || isThread ? "Circles" : isProfile ? "Profile" : isDiscover ? "Discover" : "Home";
  document.querySelector("#breadcrumbCurrent").textContent = isThread ? threadProfiles[state.thread]?.title || "Conversation" : isCircle ? state.circle : isProfile ? profileProfiles[state.profile]?.name || "Mina Park" : isDiscover ? "Circles" : "For you";
  const activeNavigation = isCircle || isThread ? "Your circles" : isDiscover ? "Discover" : isProfile && state.profileTab === "saved" ? "Saved" : isProfile ? "" : "Home";
  setActiveNavigation(activeNavigation);
  if (isDiscover) renderDiscover({ syncUrl });
  else if (isCircle) renderCircle({ syncUrl });
  else if (isThread) renderThread({ syncUrl });
  else if (isProfile) renderProfile({ syncUrl });
  else renderFeed({ syncUrl });
  if (scroll) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function navigateToView(view) {
  state.view = validViews.has(view) ? view : "home";
  if (state.view !== "thread") state.thread = "";
  if (state.view !== "profile") state.profile = "";
  if (state.view === "home" || state.view === "discover") state.circle = "";
  state.threadStatus = "";
  state.profileStatus = "";
  updateUrlState("pushState");
  renderRoute({ syncUrl: false });
}

function navigateToCircle(circleName) {
  if (!validCircles.has(circleName)) return;
  state.view = "circle";
  state.circle = circleName;
  state.thread = "";
  state.profile = "";
  state.filter = "all";
  state.query = "";
  state.circleTab = "conversations";
  state.circleJoined = false;
  state.threadStatus = "";
  searchInput.value = "";
  updateUrlState("pushState");
  renderRoute({ syncUrl: false });
}

function navigateToThread(threadId) {
  const profile = threadProfiles[threadId];
  if (!profile) return;
  state.view = "thread";
  state.thread = threadId;
  state.circle = profile.circle;
  state.filter = "all";
  state.query = "";
  state.circleTab = "conversations";
  state.threadStatus = "";
  state.profile = "";
  searchInput.value = "";
  updateUrlState("pushState");
  renderRoute({ syncUrl: false });
}

function navigateToProfile(profileId) {
  if (!validProfiles.has(profileId)) return;
  state.view = "profile";
  state.profile = profileId;
  state.profileTab = "conversations";
  state.profileFollowed = false;
  state.profileStatus = "";
  state.circle = "";
  state.thread = "";
  state.query = "";
  state.filter = "all";
  searchInput.value = "";
  updateUrlState("pushState");
  renderRoute({ syncUrl: false });
}

function navigateToSaved() {
  state.view = "profile";
  state.profile = "mina";
  state.profileTab = "saved";
  state.profileFollowed = false;
  state.profileStatus = "";
  state.circle = "";
  state.thread = "";
  state.query = "";
  state.filter = "all";
  searchInput.value = "";
  updateUrlState("pushState");
  renderRoute({ syncUrl: false });
}

function openComposer() {
  if (composerDialog.open) return;
  state.composerTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  if (typeof composerDialog.showModal === "function") {
    composerDialog.showModal();
    window.setTimeout(() => document.querySelector("#composerTitleInput")?.focus(), 30);
  } else {
    composerDialog.setAttribute("open", "");
    composerDialog.setAttribute("class", `${composerDialog.getAttribute("class")} is-open`);
  }
}

function closeComposer() {
  if (typeof composerDialog.close === "function") composerDialog.close();
  else {
    composerDialog.removeAttribute("open");
    composerDialog.setAttribute("class", composerDialog.getAttribute("class").replace(/\bis-open\b/g, "").replace(/\s+/g, " ").trim());
    restoreFocus(state.composerTrigger);
    state.composerTrigger = null;
  }
}

function toggleSidebar(open) {
  if (open) state.sidebarTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : sidebarTrigger;
  sidebar.classList.toggle("is-open", open);
  sidebarScrim.classList.toggle("is-visible", open);
  sidebarTrigger.setAttribute("aria-expanded", String(open));
  if (open) window.setTimeout(() => sidebar.querySelector("a, button")?.focus(), 30);
  else {
    restoreFocus(state.sidebarTrigger);
    state.sidebarTrigger = null;
  }
}

function restoreFocus(element) {
  if (element instanceof HTMLElement && element.isConnected && !element.hasAttribute("disabled")) element.focus();
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
    const actionType = action.dataset.postAction;
    if (actionType === "like") {
      state.liked.has(postId) ? state.liked.delete(postId) : state.liked.add(postId);
      showToast(state.liked.has(postId) ? "Added a little appreciation" : "Like removed");
      renderFeed({ focusPostId: postId, focusAction: actionType });
    }
    if (actionType === "save") {
      state.saved.has(postId) ? state.saved.delete(postId) : state.saved.add(postId);
      showToast(state.saved.has(postId) ? "Saved to your quiet corner" : "Removed from saved");
      renderFeed({ focusPostId: postId, focusAction: actionType });
    }
    if (actionType === "comment") navigateToThread(post.threadId);
    return;
  }
  if (event.target.closest(".post-card")) navigateToThread(posts.find((post) => post.id === Number(event.target.closest("[data-post-id]")?.dataset.postId))?.threadId);
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
  if (state.view === "discover") {
    renderDiscover();
    return;
  }
  if (state.view === "circle") {
    state.circle = "";
    navigateToView("discover");
    return;
  }
  if (state.view === "profile") {
    navigateToView("discover");
    return;
  }
  state.circle = "";
  state.filter = "all";
  renderFeed();
});

document.querySelector("#openComposer").addEventListener("click", openComposer);
document.querySelector("#mobileCompose").addEventListener("click", openComposer);
document.querySelector("#promptButton").addEventListener("click", openComposer);
document.querySelector("#closeComposer").addEventListener("click", closeComposer);
composerDialog.addEventListener("close", () => {
  restoreFocus(state.composerTrigger);
  state.composerTrigger = null;
});

composerTitleInput.addEventListener("input", () => {
  if (composerTitleInput.value.trim()) setComposerError(false);
});

composerForm.addEventListener("invalid", (event) => {
  if (event.target === composerTitleInput) setComposerError(true);
}, true);

composerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const bodyInput = document.querySelector("#composerBody");
  const circle = document.querySelector("#composerCircle").value;
  const title = composerTitleInput.value.trim();
  if (!title) {
    setComposerError(true);
    composerTitleInput.focus();
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
    image: "./assets/editorial/desk-ritual.jpg",
    alt: "Notebook and coffee on a desk"
  });
  state.filter = "all";
  state.circle = "";
  state.view = "home";
  composerForm.reset();
  setComposerError(false);
  closeComposer();
  renderRoute({ syncUrl: true, scroll: false });
  showToast("Conversation published to your circles");
});

sidebarTrigger.addEventListener("click", () => toggleSidebar(true));
sidebarScrim.addEventListener("click", () => toggleSidebar(false));
document.querySelector("#scrollToCircles").addEventListener("click", () => document.querySelector("#circlesSection")?.scrollIntoView({ behavior: "smooth", block: "center" }));

function setActiveNavigation(label) {
  document.querySelectorAll("[data-nav]").forEach((item) => {
    const isActive = item.dataset.nav === label;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
    if (isActive) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });
}

document.querySelectorAll("[data-nav]").forEach((button) => {
  button.addEventListener("click", () => {
    const label = button.dataset.nav;
    toggleSidebar(false);
    if (label === "Home" || label === "Discover" || label === "Your circles") {
      if (label === "Your circles") {
        navigateToCircle("City Makers");
        return;
      }
      navigateToView(label === "Discover" ? "discover" : "home");
      return;
    }
    if (label === "Saved") {
      navigateToSaved();
      return;
    }
    setActiveNavigation(label);
    if (label !== "Home") showToast(`${label} is mapped for the next route`);
  });
});

document.querySelectorAll("[data-discover-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    state.discoverFilter = validDiscoverFilters.has(button.dataset.discoverFilter) ? button.dataset.discoverFilter : "all";
    renderDiscover();
  });
});

document.querySelectorAll("[data-circle-route]").forEach((button) => {
  button.addEventListener("click", () => navigateToCircle(button.dataset.circleRoute));
});
document.querySelectorAll("[data-thread-route]").forEach((button) => {
  button.addEventListener("click", () => navigateToThread(button.dataset.threadRoute));
});
document.querySelectorAll("[data-discover-route]").forEach((button) => {
  button.addEventListener("click", () => navigateToView("discover"));
});

document.querySelectorAll("[data-circle-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    state.circleTab = button.dataset.circleTab;
    renderCircle();
  });
});

document.querySelector("#circleBack").addEventListener("click", () => navigateToView("discover"));
document.querySelector("#threadBack").addEventListener("click", () => navigateToView("circle"));
document.querySelector("#threadCircleLink").addEventListener("click", () => navigateToView("circle"));
document.querySelector("#circleStartConversation").addEventListener("click", openComposer);
document.querySelector("#circlePanel").addEventListener("click", (event) => {
  const route = event.target.closest("[data-thread-route]");
  if (route) navigateToThread(route.dataset.threadRoute);
});
document.querySelector("#joinCircle").addEventListener("click", () => {
  state.circleJoined = !state.circleJoined;
  renderCircle();
  showToast(state.circleJoined ? "You joined " + state.circle : "You left " + state.circle);
});
document.querySelector("#discoverStartConversation").addEventListener("click", openComposer);
document.querySelector("#threadReplyForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#threadReplyInput");
  const error = document.querySelector("#threadReplyError");
  const body = input.value.trim();
  if (!body) {
    input.setAttribute("aria-invalid", "true");
    error.removeAttribute("hidden");
    input.focus();
    return;
  }
  input.removeAttribute("aria-invalid");
  error.setAttribute("hidden", "");
  state.threadReplies[state.thread] ||= [];
  state.threadReplies[state.thread].push({ author: "Mina Park", initials: "MP", avatar: "avatar-user", time: "Just now", body });
  state.threadStatus = "Your reply was added to the conversation.";
  event.target.reset();
  renderThread({ syncUrl: false });
});
document.querySelectorAll("[data-profile-route]").forEach((button) => button.addEventListener("click", () => navigateToProfile(button.dataset.profileRoute)));
document.querySelectorAll("[data-profile-tab]").forEach((button) => button.addEventListener("click", () => {
  state.profileTab = button.dataset.profileTab;
  state.profileStatus = "";
  renderProfile();
}));
document.querySelector("#followProfile").addEventListener("click", () => {
  state.profileFollowed = !state.profileFollowed;
  state.profileStatus = state.profileFollowed ? "You are now following Mina Park." : "You unfollowed Mina Park.";
  renderProfile({ syncUrl: false });
});
document.querySelector("#profilePanel").addEventListener("click", (event) => {
  const threadRoute = event.target.closest("[data-profile-thread]");
  if (threadRoute) navigateToThread(threadRoute.dataset.profileThread);
});
document.querySelector("#profileCircleList").addEventListener("click", (event) => {
  const circleRoute = event.target.closest("[data-profile-circle]");
  if (circleRoute) navigateToCircle(circleRoute.dataset.profileCircle);
});
document.querySelectorAll("[data-toast]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.toast)));

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
    event.preventDefault();
    toggleSidebar(false);
  }
});

window.addEventListener("popstate", () => {
  readUrlState();
  renderRoute({ syncUrl: false });
});

readUrlState();
renderRoute({ syncUrl: false, scroll: false });
