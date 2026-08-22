# Gather — Community design review surface

Gather is a production-minded responsive web concept for reviewing how `design-skills` handles a community product across desktop and mobile. It is intentionally a complete surface rather than a single hero shot: navigation, feed, discovery cues, social actions, composer, empty state, notification feedback, and a mobile drawer are all represented. The companion `board.html` is the Figma-equivalent design board: it exposes three visual directions, the screen set, state library, foundations, component variants, and handoff metadata in one reviewable surface.

## Brief

- Platform: responsive web
- Archetype: community / discussion
- Primary job: help people find a small circle worth returning to
- Viewports: 1440 × 1000, 1280 × 900, 1024 × 900, 390 × 844
- Native translation targets: iOS / SwiftUI 390 pt, Android / Jetpack Compose 360 dp
- Route concept: `/home`, with future `/discover`, `/circles/:slug`, `/post/:id`, and `/saved`

## Visual thesis

“A warm editorial town square.” The experience should feel human and collected, not optimized for endless scrolling. A paper-like background creates calm, forest ink gives the interface confidence, coral is reserved for invitation and action, and lilac/moss/blue identify different circles. Fraunces supplies a literary voice for moments of meaning; DM Sans keeps controls and metadata legible.

## Directions considered

| Direction | Structural difference | Best use | Decision |
| --- | --- | --- | --- |
| Quiet editorial | Paper canvas, serif-led hierarchy, generous whitespace, orbit motif | Rituals, reading, thoughtful prompts | Selected for the live prototype |
| Night studio | Dark command surface, sharper grid, denser live-room composition, mint/violet contrast | Events, makers, creator workflows | Preserved as an alternate |
| City bulletin | Modular publication blocks, graphic orange/blue contrast, public-square rhythm | Discovery, city guides, open networks | Preserved as an alternate |

The selected direction is the warm editorial one because Gather’s primary job is helping people return to a good conversation, not maximizing live activity. The other two remain visible in the board so future screens do not collapse into a single generic aesthetic.

| Layer | Decision |
| --- | --- |
| Color | `#F6F2EC` paper, `#1D2C27` forest, `#EF765E` coral, `#D8D2F2` lilac, `#CAD7B1` moss, `#CBDDE3` blue |
| Type | Fraunces for editorial headlines; DM Sans for UI, labels, and body copy |
| Shape | 10 px controls, 16 px cards, 24 px feature surfaces, pill filters |
| Rhythm | 4/8 px base rhythm, 20–32 px component padding, generous section breathing room |
| Motion | Small lift on cards, quick toast feedback, smooth mobile drawer; reduced-motion fallback included |

## Screen set

1. **Home / For you** — desktop dashboard with shell navigation, welcome moment, featured story, feed, circles rail, prompt, and activity.
2. **Discover / Circles** — an editorial directory for finding a new orbit by theme and intent.
3. **Your circles / Collection** — a personal orbit of joined circles with recent activity, quiet corners, and Circle handoff cards.
4. **Circle / City Makers** — circle identity, membership, tabs, and conversation list.
5. **Thread / Conversation** — reading hierarchy, replies, author context, and inline response composer.
6. **Profile / Mina Park** — identity, contribution history, trust signals, and saved context.
7. **Settings / Preferences** — account context, preference rhythm, accessible toggles, and saved feedback.
8. **Notifications / Stay close** — unread activity, follow-through links, and mark-all-read recovery.
9. **Workspace / Picker** — active space selection, context continuity, and keyboard focus recovery.
10. **Feed / Recovery** — offline/stale continuity, connection error, retry, and status/focus recovery.
11. **Mobile home** — stacked content with fixed bottom navigation, floating create action, and responsive recomposition.
12. **Home / Following + circle scoped** — the production surface adds filter and circle-selection states without changing the shell.
13. **Composer / modal** — the production surface adds circle selection, required title, optional context, validation, and success feedback.

The design board also shows the empty, loading, recovery, and success states that are easy to omit from a visual-only case study.

## Platform translations

The selected visual direction is translated instead of copied across platforms:

| Platform | Composition | Native behavior represented |
| --- | --- | --- |
| Responsive Web | Wide content-first canvas with persistent sidebar | Keyboard search, URL state, hover enhancement, toast feedback |
| iOS / SwiftUI | Large-title rhythm with thumb-safe tab bar | Sheet composer, swipe-back, safe area, Dynamic Type intent |
| Android / Jetpack Compose | Material task surface with compact filters and FAB | App bar elevation, system back, snackbar-style feedback |

The board is a visual handoff, not a claim that these native screens are already shipped. The web surface is the runnable implementation; iOS and Android frames specify the platform-aware translation target. The concrete safe-area, back/dismissal, keyboard/focus, feedback, and accessibility contract is recorded in [`platform-parity.md`](../../references/platform-parity.md).

## Community archetypes

The board keeps three structurally different community jobs visible:

| Archetype | Information priority | Product shape |
| --- | --- | --- |
| Conversation lounge | Prompt → context → replies | Airy, editorial, return-oriented |
| Event house | Time → place → attendance | Structured, scannable, RSVP-oriented |
| Knowledge commons | Question → search → answer quality | Compact, inspectable, durable |

This prevents “community” from defaulting to one feed pattern. The selected Gather implementation is the conversation lounge; the other two are reusable starting points for future product briefs.

## Interaction contract

| Interaction | Expected result |
| --- | --- |
| For you / Following / Latest | Active chip changes and feed rerenders |
| Circle row | Circle scope applies, feed scrolls into view, toast confirms context |
| Search | Feed filters as the user types; clear recovery appears when empty |
| Discover and Your circles search empty | Zero-result queries keep the hero, selected filter, and URL context visible while showing a designed empty panel; Clear search restores the directory and returns focus to the global search field |
| Like / Save | Pressed state and count update immediately with feedback |
| Comment / post card | Opens the shareable Thread route with author context and replies |
| Start a conversation | Composer opens with focus placed in the title field |
| Publish | New post appears at top of feed and toast confirms success |
| Mobile menu | Drawer and scrim open; Escape and scrim close them |
| Cmd/Ctrl + K | Search receives focus |
| Filter, circle scope, or search query | State is restored from and reflected in the URL without losing other query parameters |
| Skip to main content | Keyboard users can bypass the navigation shell and focus the primary content landmark |
| Mobile interaction targets | Core mobile controls render with a minimum 44 × 44 px usable box at the 390 px target |
| Mobile safe area | Fixed bottom navigation and page reserve `env(safe-area-inset-bottom)` so the last content and controls remain visible above a home indicator |
| Composer or mobile drawer dismissal | Focus returns to the trigger after close, publish, or Escape recovery |
| Like / save action focus | Dynamic feed rerender preserves focus on the pressed action and exposes its updated `aria-pressed` state |
| Feed status announcement | Filter and search result counts use a dedicated polite status region; post-card actions do not re-announce the entire feed |
| Featured story CTA | The primary featured-story affordance opens the shareable City Makers Thread route and restores Home through browser back |
| Home circles rail discovery | `View all circles` and `See all circles` open the shareable `view=discover` route and preserve Discover browser-back recovery |
| Global Saved navigation | Desktop and mobile Saved open `view=profile&profile=mina&tab=saved`, select the Saved panel, and restore the previous route through browser back |
| Notifications route | Sidebar and topbar bell open `view=notifications`, render unread activity, mark all as read with a status announcement, and preserve browser-back recovery |
| Settings route | Sidebar Settings opens `view=settings`, exposes account context and accessible preference toggles, announces dirty/saved state, and preserves browser-back recovery |
| Workspace picker | Sidebar workspace switcher opens an accessible picker, focuses the active space, updates context on selection, preserves the current route/search context, and returns focus on close |
| Feed recovery | `feed=offline` keeps the last saved feed visible with a reconnect banner; `feed=error` renders an alert with retry, preserves filter/search state, and returns focus to the feed status on recovery |
| Notifications handoff | Notifications / Stay close is represented on the board with unread activity, follow-through, and recovery metadata aligned to `view=notifications` |
| Navigation current state | Sidebar and mobile navigation share named landmarks and expose the selected destination with `aria-current="page"` |
| Discover route | Discover opens as a shareable `view=discover` route, resets scroll instantly, filters circle cards, and restores Home through browser back |
| Your circles route | Sidebar and mobile Your circles open a shareable `view=circles` collection, preserve `circleFilter=recent|quiet`, expose active/quiet status, and hand cards through to Circle detail; Discover remains one action away |
| Circle route | A Discover card opens `view=circle&circle=City Makers`, selects Your circles, and restores Discover through browser back |
| Circle detail tabs | Conversations and About expose a selected tab, status copy, and a route-boundary action into Thread |
| Thread route | A Circle conversation opens `view=thread&circle=City Makers&thread=city-map` with reading hierarchy, replies, and browser-back recovery |
| Thread reply composer | A local deterministic reply validates, appends, clears its draft, updates the count, and announces success |
| Featured Thread route | Home opens `view=thread&circle=City Makers&thread=city-daylight` with the board’s “A little more daylight” content |
| Profile route | The account identity opens `view=profile&profile=mina` with contribution context and browser-back recovery |
| Profile tabs and follow | Conversations/Saved expose selected state; Follow updates `aria-pressed` and a polite status message |
| Settings handoff | Settings / Preferences is represented on the board with account, preference, and saved-state metadata aligned to `view=settings` |

## Prototype map

```text
board.html
  ├─ Home / For you ───────┐
  ├─ Conversation / Events  ├─ archetype exploration board
  ├─ Knowledge commons ────┘
  ├─ Web / iOS / Android    ├─ platform translation board
  ├─ Discover / Circles     ├─ open live prototype → index.html?view=discover
  ├─ Your circles / Collection ├─ open live prototype → index.html?view=circles
  ├─ Circle / City Makers  ├─ open live prototype → index.html?view=circle&circle=City%20Makers
  ├─ Thread / Conversation  ├─ open live prototype → index.html?view=thread&circle=City%20Makers&thread=city-map
  ├─ Profile / Mina Park    ├─ open live prototype → index.html?view=profile&profile=mina
  ├─ Settings / Preferences ├─ open live prototype → index.html?view=settings
  ├─ Notifications / Stay close ├─ open live prototype → index.html?view=notifications
  ├─ Workspace / Picker ───┤ open live prototype → sidebar workspace switcher
  ├─ Feed / Recovery ──────┤ open live prototype → index.html?feed=offline or ?feed=error
  └─ Mobile / Home ─────────┘
       ├─ Empty
       ├─ Loading
       ├─ Recovery
       └─ Success
```

## Quality review checklist

- [x] Responsive shell changes from sidebar to drawer and bottom navigation.
- [x] Core states are visible without relying on hover: default, filtered, empty, loading, offline/stale, error/retry, composer, validation, success, and saved/liked.
- [x] Content hierarchy is readable at a glance: welcome → featured story → feed → community context.
- [x] Focus rings, labels, live regions, button names, and reduced-motion behavior are included.
- [x] Composer validation exposes a required-field error with `aria-invalid`, `aria-describedby`, and an alert message; filter and navigation selections expose `aria-pressed` state.
- [x] External imagery is treated as replaceable demo content; the layout does not depend on it for meaning.
- [x] A design-board surface exposes multiple compositions, reusable foundations, and screen handoff metadata.
- [x] Visual review at the target viewport set is recorded below; this example is review-ready, not release-ready.

## Handoff evidence

### Rendered evidence

| Target | Evidence | Coverage |
| --- | --- | --- |
| Desktop 1440 × 1000 | [`board-1440.jpg`](evidence/board-1440.jpg), [`prototype-1440.jpg`](evidence/prototype-1440.jpg) | Primary wide review of the design board and runnable surface |
| Desktop 1280 × 900 | [`board-1280.jpg`](evidence/board-1280.jpg) | Directions, archetypes, platform translations, home, discover, your circles, circle, thread, profile, settings, notifications, workspace picker, feed recovery |
| Desktop 1024 × 900 | [`board-1024.jpg`](evidence/board-1024.jpg) | Sidebar-to-drawer boundary and content reflow |
| Mobile 390 × 844 | [`board-390.jpg`](evidence/board-390.jpg), [`prototype-390.jpg`](evidence/prototype-390.jpg), [`prototype-discover-390.jpg`](evidence/prototype-discover-390.jpg) | One-column cards, horizontal filters, bottom navigation, Discover directory, composer, empty/loading/recovery/success states |
| Discover desktop 1440 × 1000 | [`prototype-discover-1440.jpg`](evidence/prototype-discover-1440.jpg) | Dark editorial hero, circle directory cards, topic filters, route-boundary state |
| Discover search empty desktop/mobile | [`prototype-discover-empty-1440.jpg`](evidence/prototype-discover-empty-1440.jpg), [`prototype-discover-empty-390.jpg`](evidence/prototype-discover-empty-390.jpg) | Zero-result recovery panel, retained query/filter context, clear-search action, and responsive composition |
| Your circles desktop 1440 × 1000 | [`prototype-circles-1440.jpg`](evidence/prototype-circles-1440.jpg) | Collection hero, orbit summary, activity filters, four Circle handoff cards, and context rail |
| Your circles mobile 390 × 844 | [`prototype-circles-390.jpg`](evidence/prototype-circles-390.jpg) | Stacked collection hero, horizontal activity filters, one-column Circle cards, and bottom navigation |
| Your circles search empty desktop/mobile | [`prototype-circles-empty-1440.jpg`](evidence/prototype-circles-empty-1440.jpg), [`prototype-circles-empty-390.jpg`](evidence/prototype-circles-empty-390.jpg) | Zero-result recovery panel with Quiet corners retained and clear-search action |
| Circle desktop 1440 × 1000 | prototype-circle-1440.jpg | City Makers identity, conversation list, About tab, join CTA, responsive route state |
| Circle mobile 390 × 844 | prototype-circle-390.jpg | Stacked circle hero, tab bar, conversation cards, side context cards, bottom navigation |
| Thread desktop 1440 × 1000 | [`prototype-thread-1440.jpg`](evidence/prototype-thread-1440.jpg) | Board-matched “A little more daylight” reading hierarchy, author context, replies, Circle context rail, reply composer |
| Thread mobile 390 × 844 | [`prototype-thread-390.jpg`](evidence/prototype-thread-390.jpg) | Stacked featured Thread flow, reply list, fixed navigation, response composer and context cards |
| Profile desktop 1440 × 1000 | [`prototype-profile-1440.jpg`](evidence/prototype-profile-1440.jpg) | Mina Park identity, contribution stats, conversations, saved context, circle rail |
| Profile mobile 390 × 844 | [`prototype-profile-390.jpg`](evidence/prototype-profile-390.jpg) | Stacked identity cover, profile tabs, contribution cards, circle list and bottom navigation |
| Settings desktop 1440 × 1000 | [`prototype-settings-1440.jpg`](evidence/prototype-settings-1440.jpg), [`board-1440.jpg`](evidence/board-1440.jpg) | Preferences hero, account context, toggle states, saved feedback, and board handoff parity |
| Settings mobile 390 × 844 | [`prototype-settings-390.jpg`](evidence/prototype-settings-390.jpg), [`board-390.jpg`](evidence/board-390.jpg) | Stacked preferences flow, fixed navigation, responsive board artboard, and accessible controls |
| Notifications desktop/mobile | [`prototype-notifications-1440.jpg`](evidence/prototype-notifications-1440.jpg), [`prototype-notifications-390.jpg`](evidence/prototype-notifications-390.jpg), [`board-1440.jpg`](evidence/board-1440.jpg), [`board-390.jpg`](evidence/board-390.jpg) | Stay close hero, unread activity, follow-through, mark-all-read recovery, and responsive board handoff |
| Workspace picker desktop | [`prototype-workspace-1440.jpg`](evidence/prototype-workspace-1440.jpg), [`board-1440.jpg`](evidence/board-1440.jpg) | Active-space picker, context continuity, backdrop hierarchy, and board handoff |
| Workspace picker mobile | [`prototype-workspace-390.jpg`](evidence/prototype-workspace-390.jpg), [`board-390.jpg`](evidence/board-390.jpg) | Drawer + bottom-sheet composition, touch-safe options, and mobile focus surface |
| Feed recovery desktop | [`prototype-recovery-offline-1440.jpg`](evidence/prototype-recovery-offline-1440.jpg), [`prototype-recovery-error-1440.jpg`](evidence/prototype-recovery-error-1440.jpg), [`board-1440.jpg`](evidence/board-1440.jpg) | Offline/stale continuity, connection error, retry affordance, retained filter state, and board handoff parity |
| Feed recovery mobile | [`prototype-recovery-offline-390.jpg`](evidence/prototype-recovery-offline-390.jpg), [`prototype-recovery-error-390.jpg`](evidence/prototype-recovery-error-390.jpg), [`board-390.jpg`](evidence/board-390.jpg) | Wrapped recovery banner, stacked error panel, full-width retry, touch-safe focus surface, and responsive board handoff |
| Native intent: iOS 390 pt / Android 360 dp | Platform translation artboards | Large-title/tab-bar and app-bar/FAB behavior are specified; native runtime remains a target, not a shipped surface |

The live surface was checked after the direction, platform, and archetype boards were added. Runtime QA also exercised composer validation → recovery → publish success, feed filter/search state, Discover and Your circles zero-result search → Clear search recovery, Your circles collection filters → Circle detail follow-through, offline/stale continuity, connection error → retry → focus recovery, mobile drawer open → Escape recovery, URL restoration, prototype and board history-state rehydration, local font loading, search URL synchronization, composer focus return, drawer focus return, 44 px mobile touch-target geometry, Home, Settings, Notifications, and Workspace board dialog metadata/focus recovery, workspace selection context continuity, and skip-link navigation. The [evidence manifest](evidence/manifest.json) binds each capture and runtime assertion to its route, viewport, represented state, and capture actions; run `npm run test:browser` and `npm run validate:evidence` to verify the interaction contract and JPEG dimensions. Evidence captures are committed under `examples/community/evidence/`; they are full-page JPEG screenshots produced from the local server at the viewport sizes named above. Reproduce the surface with the command in [Run locally](#run-locally), then open `/board.html` and `/index.html` at the declared sizes. The static example has no backend or network dependency; loading, empty, offline/stale, error/retry, validation, and success are represented as deterministic prototype states. Contributors can regenerate the capture matrix with `npm install`, `npx playwright install chromium`, and `npm run capture:community`; the command reads the manifest instead of maintaining a second list of viewports.

The live route flow now covers Home circles rail → Discover → Your circles → Circle / City Makers → Thread → Profile, global Saved → Profile Saved, Notifications → Thread/Circle/Discover follow-through, Settings → account/preferences, Workspace picker context selection, Feed / Recovery offline/error/retry states, and Home → Featured Thread with shareable URLs, selected Conversations/About and Conversations/Saved tabs, join/follow feedback, author/reply context, local reply creation, contribution history, unread/read feedback, dirty/saved preference feedback, retained filter/search state, designed zero-result search recovery with focus restoration, collection activity filters, feed status/focus recovery, workspace focus recovery, and browser-back restoration. Your circles, search-empty, Circle, featured Thread, Profile, Notifications, Settings, Workspace picker, and Feed recovery desktop/mobile captures are included in the evidence matrix alongside the Discover route.

### Review scores

Scores use the 0–4 rubric in `references/review-rubric.md` and only claim what this repository demonstrates.

| Dimension | Score | Evidence note |
| --- | ---: | --- |
| Structure and primary task | 4 | Conversation lounge hierarchy is visible from welcome → featured story → feed → circle context. |
| Visual hierarchy | 4 | Editorial type roles, paper/forest contrast, and intentional whitespace persist across the screen set. |
| Consistency | 4 | Shared tokens, cards, controls, states, and board foundations are reused. |
| Platform fit | 3 | Web behavior is implemented; iOS/Android differences are specified on the translation board. |
| Accessibility | 3 | Labels, focus rings, live regions, reduced motion, and target sizing are represented in the prototype. |
| Responsiveness | 4 | 1440, 1280, 1024, and 390 viewport targets are covered with structural recomposition. |
| Interaction states | 3 | Default, filtered, empty, loading, recovery, composer, validation, success, liked, and saved states are represented. |
| Implementation fidelity | 3 | The runnable web surface maps the board to maintainable static HTML/CSS/JS; native code is not included. |
| Visual fidelity | 4 | Rendered board and prototype reviews were completed at desktop and mobile target sizes. |
| Production readiness | 3 | The web concept is review-ready; backend, native runtime, and production deployment evidence remain open. |

### Readiness record

| Field | Record |
| --- | --- |
| Readiness level | `review-ready` for the static responsive web surface; not `release-ready` for native or backend claims |
| Production app surface | `index.html`, `styles.css`, `app.js` with reusable shell, feed, composer, responsive navigation, and state feedback |
| Figma-equivalent design board | `board.html`, `board.css`, `board.js` with directions, archetypes, platform translations, screens, states, foundations, and components |
| Prototype / route flow | Board → Home → Discover → Circle → Thread → Profile; composer and state paths are documented in the prototype map |
| Review status | No critical/high finding in the reviewed static surface; open findings are listed below |

### Open findings

- **medium — native runtime:** iOS/SwiftUI and Android/Jetpack Compose are platform-aware design targets, but no compiled native implementation or simulator evidence is included in this example.
- **medium — data/runtime integration:** authentication, backend persistence, network retry, offline caching, analytics, and deployment checks still require product integration.
- **low — visual regression review:** capture automation, nine representative PNG baselines, and CI artifact review are available through `npm run capture:community` and `npm run test:visual`; the 3% threshold tolerates anti-aliasing variation, while full-page evidence remains a human visual review responsibility.

These findings intentionally prevent a `release-ready` claim. The next implementation slice should close the native/runtime evidence only when those targets are in scope.

## Run locally

From the repository root:

```bash
npm install
npx playwright install chromium
npm run capture:community
```

Open `http://127.0.0.1:4173`. The capture command starts a local static server when one is not already running; the demo itself remains static HTML/CSS with no build step. To use an existing server, pass `--base-url http://127.0.0.1:4173`.
