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
3. **Circle / City Makers** — circle identity, membership, tabs, and conversation list.
4. **Thread / Conversation** — reading hierarchy, replies, author context, and inline response composer.
5. **Profile / Mina Park** — identity, contribution history, trust signals, and saved context.
6. **Mobile home** — stacked content with fixed bottom navigation, floating create action, and responsive recomposition.
7. **Home / Following + circle scoped** — the production surface adds filter and circle-selection states without changing the shell.
8. **Composer / modal** — the production surface adds circle selection, required title, optional context, validation, and success feedback.

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
| Like / Save | Pressed state and count update immediately with feedback |
| Comment / post card | Feedback communicates the next route boundary |
| Start a conversation | Composer opens with focus placed in the title field |
| Publish | New post appears at top of feed and toast confirms success |
| Mobile menu | Drawer and scrim open; Escape and scrim close them |
| Cmd/Ctrl + K | Search receives focus |
| Filter, circle scope, or search query | State is restored from and reflected in the URL without losing other query parameters |
| Skip to main content | Keyboard users can bypass the navigation shell and focus the primary content landmark |
| Composer or mobile drawer dismissal | Focus returns to the trigger after close, publish, or Escape recovery |

## Prototype map

```text
board.html
  ├─ Home / For you ───────┐
  ├─ Conversation / Events  ├─ archetype exploration board
  ├─ Knowledge commons ────┘
  ├─ Web / iOS / Android    ├─ platform translation board
  ├─ Discover / Circles     ├─ open live prototype → index.html
  ├─ Circle / City Makers  │
  ├─ Thread / Conversation  │
  ├─ Profile / Mina Park    │
  └─ Mobile / Home ─────────┘
       ├─ Empty
       ├─ Loading
       ├─ Recovery
       └─ Success
```

## Quality review checklist

- [x] Responsive shell changes from sidebar to drawer and bottom navigation.
- [x] Core states are visible without relying on hover: default, filtered, empty, composer, validation, success, and saved/liked.
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
| Desktop 1280 × 900 | [`board-1280.jpg`](evidence/board-1280.jpg) | Directions, archetypes, platform translations, home, discover, circle, thread, profile |
| Desktop 1024 × 900 | [`board-1024.jpg`](evidence/board-1024.jpg) | Sidebar-to-drawer boundary and content reflow |
| Mobile 390 × 844 | [`board-390.jpg`](evidence/board-390.jpg), [`prototype-390.jpg`](evidence/prototype-390.jpg) | One-column cards, horizontal filters, bottom navigation, composer, empty/loading/recovery/success states |
| Native intent: iOS 390 pt / Android 360 dp | Platform translation artboards | Large-title/tab-bar and app-bar/FAB behavior are specified; native runtime remains a target, not a shipped surface |

The live surface was checked after the direction, platform, and archetype boards were added. Runtime QA also exercised composer validation → recovery → publish success, feed filter state, mobile drawer open → Escape recovery, URL restoration, prototype and board history-state rehydration, local font loading, search URL synchronization, composer focus return, drawer focus return, board dialog focus return, and skip-link navigation. The [evidence manifest](evidence/manifest.json) binds each capture and runtime assertion to its route, viewport, and represented state; run `npm run test:browser` and `npm run validate:evidence` to verify the interaction contract and JPEG dimensions. Evidence captures are committed under `examples/community/evidence/`; they are full-page JPEG screenshots produced from the local server at the viewport sizes named above. Reproduce the surface with the command in [Run locally](#run-locally), then open `/board.html` and `/index.html` at the declared sizes. The static example has no backend or network dependency; loading, empty, recovery, validation, and success are represented as deterministic prototype states. Contributors can regenerate the capture matrix with `npm install`, `npx playwright install chromium`, and `npm run capture:community`; the command reads the manifest instead of maintaining a second list of viewports.

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
- **low — visual regression review:** capture automation, three representative PNG baselines, and CI artifact review are available through `npm run capture:community` and `npm run test:visual`; the 3% threshold tolerates anti-aliasing variation, while full-page evidence remains a human visual review responsibility.

These findings intentionally prevent a `release-ready` claim. The next implementation slice should close the native/runtime evidence only when those targets are in scope.

## Run locally

From the repository root:

```bash
npm install
npx playwright install chromium
npm run capture:community
```

Open `http://127.0.0.1:4173`. The capture command starts a local static server when one is not already running; the demo itself remains static HTML/CSS with no build step. To use an existing server, pass `--base-url http://127.0.0.1:4173`.
