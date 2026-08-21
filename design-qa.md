# Design QA

Date: 2026-08-21  
Scope: Gather community example — `Home / For you`, `Discover / Circles`, `Thread / Conversation`, `Profile / Mina Park`, `Notifications`, `Settings`, and `Workspace / Picker`, desktop and mobile handoff

## Comparison inputs

The source and implementation were captured and reviewed together before judging fidelity.

| Surface | Source visual | Implementation visual | Viewport / pixels | Density |
| --- | --- | --- | --- | --- |
| Desktop home fold | [`home-source.jpg`](examples/community/evidence/qa/home-source.jpg) | [`home-implementation.jpg`](examples/community/evidence/qa/home-implementation.jpg) | 1280 × 720 CSS px / 1280 × 720 px | 1× |
| Desktop comparison | [`home-source-vs-implementation.png`](examples/community/evidence/qa/home-source-vs-implementation.png) | Same comparison input | 1280 × 720 CSS px per panel / 2584 × 768 composite px | 1× |
| Mobile responsive set | [`board-390.jpg`](examples/community/evidence/board-390.jpg) | [`prototype-390.jpg`](examples/community/evidence/prototype-390.jpg) | 390 × 844 CSS px / full-page evidence | 1× |
| Mobile comparison | [`mobile-source-vs-implementation.png`](examples/community/evidence/qa/mobile-source-vs-implementation.png) | Same comparison input | 390 × 844 CSS px viewport, full-page composite | 1× |
| Discover route review | [prototype-discover-1440.jpg](examples/community/evidence/prototype-discover-1440.jpg), [prototype-discover-390.jpg](examples/community/evidence/prototype-discover-390.jpg) | Same implementation route at desktop and mobile | 1440 × 1000 and 390 × 844 CSS px / full-page evidence | 1× |
| Circle route review | [prototype-circle-1440.jpg](examples/community/evidence/prototype-circle-1440.jpg), [prototype-circle-390.jpg](examples/community/evidence/prototype-circle-390.jpg) | Same implementation route at desktop and mobile | 1440 × 1000 and 390 × 844 CSS px / full-page evidence | 1× |
| Thread route review | [prototype-thread-1440.jpg](examples/community/evidence/prototype-thread-1440.jpg), [prototype-thread-390.jpg](examples/community/evidence/prototype-thread-390.jpg) | Same implementation route at desktop and mobile | 1440 × 1000 and 390 × 844 CSS px / full-page evidence | 1× |
| Profile route review | [prototype-profile-1440.jpg](examples/community/evidence/prototype-profile-1440.jpg), [prototype-profile-390.jpg](examples/community/evidence/prototype-profile-390.jpg) | Same implementation route at desktop and mobile | 1440 × 1000 and 390 × 844 CSS px / full-page evidence | 1× |
| Notifications route review | [prototype-notifications-1440.jpg](examples/community/evidence/prototype-notifications-1440.jpg), [prototype-notifications-390.jpg](examples/community/evidence/prototype-notifications-390.jpg) | Same implementation route at desktop and mobile | 1440 × 1000 and 390 × 844 CSS px / full-page evidence | 1× |
| Settings route review | [prototype-settings-1440.jpg](examples/community/evidence/prototype-settings-1440.jpg), [prototype-settings-390.jpg](examples/community/evidence/prototype-settings-390.jpg) | Same implementation route at desktop and mobile | 1440 × 1000 and 390 × 844 CSS px / full-page evidence | 1× |
| Workspace picker review | [prototype-workspace-1440.jpg](examples/community/evidence/prototype-workspace-1440.jpg), [prototype-workspace-390.jpg](examples/community/evidence/prototype-workspace-390.jpg) | Active-space dialog at desktop and drawer-plus-bottom-sheet at mobile | 1440 × 1000 and 390 × 844 CSS px / full-page evidence | 1× |

The desktop source is the refreshed `A / 01 · Home / For you` artboard with its screen content aligned to the viewport. The mobile source is the responsive design board containing `A / 08 · Mobile / Home`; the implementation is the runnable prototype at the same mobile viewport.

## Full-view comparison

The source and implementation share the same editorial hierarchy: forest navigation rail, warm paper surface, coral action, serif emphasis, orbit motif, featured image, and feed filter. The source preview is intentionally denser than the live surface, but its information architecture now matches the implementation at the fold: the featured story occupies the main column and `Circles you’re in` occupies the right rail.

## Focused comparison

The focused desktop pass inspected the hero baseline, orbit artwork, feed heading/filter group, featured card split, image crop, and right rail. The focused mobile pass inspected the top bar, hero wrap, primary action, orbit, featured card, bottom navigation, and touch-target geometry. The Discover pass inspected the dark directory hero, orbit art, topic filter row, six-card grid, route CTA, and mobile bottom navigation at both target sizes. The Circle pass inspected the identity hero, orbit artwork, tab bar, conversation cards, context rail, join CTA, and mobile recomposition. The Thread pass inspected the reading hierarchy, author context, reply rhythm, context rail, local reply composer, and mobile fixed navigation interaction. The Profile pass inspected the identity cover, contribution stats, tab state, profile cards, circle list, follow CTA, and mobile recomposition. The Notifications pass inspected the Stay close hero, orbit art, unread card rhythm, mark-all-read feedback, route follow-through, context rail, and mobile recomposition. The Settings pass inspected the lilac/forest hero split, account context card, preference toggle rhythm, dirty/saved feedback, defaults rail, and mobile recomposition. The Workspace pass inspected the backdrop hierarchy, selected-space state, option rhythm, desktop dialog, mobile bottom-sheet composition, and focus return. No overlap, clipping, broken wrapping, or hierarchy collapse was found in the reviewed states.

## Findings and comparison history

| ID | Severity | Surface | Initial finding | Resolution |
| --- | --- | --- | --- | --- |
| DQ-001 | P2 | Layout / handoff fidelity | The `Home / For you` board preview omitted the desktop circles rail and rendered the featured story full width, while the implementation used a main column plus `Circles you’re in` rail. This could cause contributors to reproduce a different desktop composition from the design board. | Resolved by adding the miniature rail to `examples/community/board.html` and matching the board grid in `examples/community/board.css`. Re-captured and re-reviewed after the change. |
| DQ-002 | P2 | Route / implementation coverage | The board defined Discover / Circles as a screen, but the runnable navigation stopped at a route-boundary toast. This made the board-to-prototype handoff incomplete for the first discovery task. | Resolved by adding a shareable Discover view with topic filters, global search feedback, instant scroll reset, browser-back recovery, responsive evidence, and a dedicated visual baseline. |
| DQ-003 | P2 | Route / implementation coverage | Discover cards still ended at a route-boundary toast, leaving Circle identity, membership, and conversation context absent from the runnable flow. | Resolved by adding a shareable City Makers Circle route with Conversations/About tabs, join state, conversation feedback, responsive evidence, and a dedicated visual baseline. |
| DQ-004 | P2 | Route / implementation coverage | Circle conversation CTAs stopped at a toast, leaving the board’s Thread / Conversation reading and reply screen absent from the runnable flow. | Resolved by adding a shareable Thread route with author context, deterministic replies, browser-back recovery, local reply creation, responsive evidence, and a dedicated visual baseline. |
| DQ-005 | P2 | Route / implementation coverage | The board defined Profile / Mina Park as the identity and contribution screen, but account controls stopped at a profile-menu toast. | Resolved by adding a shareable Profile route with identity cover, contribution stats, Conversations/Saved tabs, follow feedback, circle context, responsive evidence, and a dedicated visual baseline. |
| DQ-006 | P2 | Route / implementation coverage | Home’s featured story CTA stopped at a route-boundary toast, leaving the board’s featured Thread content unreachable from the main feed. | Resolved by mapping it to the `city-daylight` shareable Thread route, adding browser-back recovery, and aligning Thread evidence with the board’s featured reading content. |
| DQ-007 | P2 | Route / implementation coverage | Home’s circles rail exposed `View all circles` and `See all circles`, but both stopped at route-boundary toasts even though Discover was already implemented. | Resolved by routing both affordances to the shareable Discover view and covering the shared history boundary in browser QA. |
| DQ-008 | P2 | Route / implementation coverage | The global Saved navigation item stopped at a route-boundary toast even though Profile already exposed a Saved panel. | Resolved by mapping desktop and mobile Saved to the shareable Profile Saved route with selected navigation state and browser-back recovery. |
| DQ-009 | P2 | Route / implementation coverage | Sidebar Notifications and the topbar bell stopped at a toast, leaving the board’s Stay close activity state without a runnable destination or unread/read model. | Resolved by adding a responsive Notifications route with deterministic activity, Thread/Circle/Discover follow-through, mark-all-read status feedback, evidence captures, and a visual baseline. |
| DQ-010 | P2 | Route / implementation coverage | Sidebar Settings stopped at a route-boundary toast, leaving the board’s account and preference surface without a runnable destination or saved-state feedback. | Resolved by adding a responsive Settings route with account context, accessible preference toggles, dirty/saved status feedback, browser-back recovery, evidence captures, and a visual baseline. |
| DQ-011 | P2 | Handoff parity | Settings became a real route, but the public board still promised the older eight-screen set and had no inspectable Settings artboard or metadata. | Resolved by adding the ninth Settings / Preferences artboard, updating the board marker and inventory, adding responsive board styling, and testing Settings dialog metadata/focus recovery. |
| DQ-012 | P2 | Handoff parity | Notifications became a real route, but the public board still had no inspectable Stay close artboard or declared metadata for unread activity and follow-through. | Resolved by adding the tenth Notifications / Stay close artboard, updating the board marker and inventory, adding responsive board styling, and testing Notifications dialog metadata/focus recovery. |
| DQ-013 | P2 | Interaction / handoff coverage | The sidebar workspace switcher stopped at a “coming next” toast, leaving space context and the board’s shell state without a usable selection flow. | Resolved by adding the Workspace / Picker dialog, active-space selection, context continuity, focus recovery, desktop/mobile evidence, and the eleventh board artboard with handoff metadata. |

P0 findings: none.  
P1 findings: none.  
Remaining P2 findings: none.

## Follow-up polish after the previous pass

The v0.9 mobile safe-area pass preserves the same 390 × 844 composition while extending both the page's reserved bottom space and the fixed navigation surface with `env(safe-area-inset-bottom)`. Standard Chromium reports a zero safe-area inset, so the visual evidence remains pixel-stable; the CSS contract test covers the device-inset path that cannot be synthesized by the default desktop browser runner.

The v0.11 handoff-freshness pass refreshes the public board marker to `v0.11 · review` and aligns the evidence manifest with the current browser assertions. The refreshed board captures show the marker in the header without changing the composition, typography, or responsive layout. The combined source/implementation comparison was also recaptured at 1280 × 720 CSS px with `deviceScaleFactor: 1`, so the source panel no longer carries the superseded v0.8 marker.

The v0.12 feed-announcement pass is behavior-only: the visible feed composition and source/implementation comparison remain unchanged, while result-count messaging now uses a dedicated screen-reader status region instead of making the entire card list live.

The v0.13 route-feedback pass is also behavior-only: the featured story's visible arrow CTA now confirms the next-route boundary through the existing toast pattern, without changing layout, typography, imagery, or responsive composition.

The v0.14 navigation-state pass is behavior-only: the sidebar and mobile navigation now expose named landmarks and a synchronized `aria-current="page"` destination while preserving the same visual active treatment.

The v0.15 Discover-route pass closes the first screen-coverage gap: Discover now renders a real responsive directory from the board’s dark editorial direction, preserves its state in the URL, resets scroll on route entry/history restoration, and returns to Home through browser back. The new route is captured at desktop and mobile sizes and included in visual regression.

The v0.16 Circle-route pass continues the route flow into a real City Makers detail screen: its identity hero, member context, Conversations/About tabs, join state, and conversation CTA are rendered at desktop and mobile sizes, with browser-back recovery back to Discover.

The v0.17 Thread-route pass continues the flow into a real conversation detail screen: the board’s reading hierarchy, author context, replies, Circle context rail, and inline reply composer are rendered at desktop and mobile sizes. Reply data is deterministic and local by design; persistence remains an integration finding.

The v0.18 Profile-route pass closes the identity screen gap: Mina Park’s cover art, contribution stats, Conversations/Saved tabs, follow state, circle context, and Thread entry are rendered at desktop and mobile sizes, with browser-back recovery to Home.

The v0.19 Featured Thread-route pass closes the Home CTA gap: the featured “A little more daylight” card now opens the same shareable City Makers Thread surface used by Circle and Profile, restores Home through browser back, and is represented in the Thread evidence captures.

The v0.20 Home Discover-rail pass closes the remaining primary Home discovery dead ends: both `View all circles` and `See all circles` now open the existing shareable Discover route, keep the Discover current-navigation state, and preserve browser-back recovery to Home.

The v0.21 Global Saved-route pass closes the global Saved navigation gap: desktop and mobile Saved now open Mina Park’s existing Saved panel through a shareable URL, expose the selected navigation state, and restore Home through browser back.

The v0.22 Notifications-route pass closes the remaining high-signal Stay close gap: sidebar and topbar Notifications now open a responsive activity center with three unread items, mark-all-read recovery, follow-through into existing product routes, and dedicated desktop/mobile evidence.

The v0.23 Settings-route pass closes the remaining account-controls dead end: Sidebar Settings now opens a responsive preferences surface with Mina Park account context, weekly digest/replies/quiet-hours toggles, explicit dirty and saved status, browser-back recovery, and dedicated desktop/mobile evidence.

The v0.24 Settings-board parity pass closes the handoff gap introduced by that route: the public board now carries a ninth Settings / Preferences artboard, its detail dialog exposes the declared account/rhythm/recovery metadata, the header marker is refreshed to `v0.24 · review`, and the board/prototype evidence is re-captured at desktop and mobile sizes.

The v0.25 Notifications-board parity pass closes the next handoff gap: the public board now carries a tenth Notifications / Stay close artboard, its detail dialog exposes the declared unread/follow-through/recovery metadata, the header marker is refreshed to `v0.25 · review`, and the board/prototype evidence is re-captured at desktop and mobile sizes.

The v0.26 Workspace-picker pass closes the last prominent shell dead-end: the workspace switcher now opens an accessible three-space picker, focuses the active space, updates the sidebar context without changing route/search state, recovers focus on close or Escape, and is represented by an eleventh Workspace / Picker artboard. Desktop/mobile state captures and manifest-defined interaction actions are included in the handoff.

## Rubric pass

- Typography: local fonts, weight hierarchy, serif display treatment, wrapping, and line-height remain coherent across source and implementation.
- Spacing and layout: the desktop rail/feature split now matches the handoff; Discover adds a balanced three-column directory and mobile composition stays single-column with bottom navigation.
- Viewport resilience: browser QA passed at 1440 × 1000 and 390 × 844; no overlap or unusable collapse was observed.
- Colors and tokens: forest, paper, coral, lilac, moss, borders, and surface treatments map consistently across the board and prototype.
- Image quality and assets: the featured story uses the same local editorial asset and preserves its crop; no placeholder image replaces a designed asset.
- Copy and content: source and implementation use the same product copy and state labels for the reviewed home surface.
- Icons: board symbols and implementation SVG sprite icons are present, aligned, and stylistically consistent.
- States and interactions: URL state, history restoration, Home circles rail → Discover → Circle → Thread → Profile, global Saved → Profile Saved, Notifications → Thread/Circle/Discover, Settings → account/preferences, and Home → Featured Thread route entry/back with instant scroll reset, topic filters, Circle tab/join state, Thread reply creation/status feedback, Profile Conversations/Saved tabs and follow feedback, Notifications unread/read status feedback, Settings dirty/saved preference feedback, dedicated feed-status announcement, synchronized navigation current state, composer focus return, drawer focus return, skip-link navigation, board state, and board dialog focus return passed runtime checks.
- Feed action focus: Like/Save rerendering preserves the focused action and its updated pressed state in browser QA.
- Accessibility: semantic controls, visible focus treatment, dedicated live status messaging, reduced-motion support, image alt text, and minimum 44 × 44 px mobile control geometry are covered by the example contract and runtime QA.
- AI shortcut artifacts: no generic placeholder card, fake product image, or mismatched decorative surface was found in the reviewed home surface; the orbit treatment is a deliberate shared motif.

## Verification

- `npm run capture:community` — refreshed 20 evidence captures, including Discover, City Makers Circle, the featured “A little more daylight” Thread, Mina Park Profile, Notifications, Settings, and Workspace picker states at desktop and mobile, with the 11-screen board inventory visible in the board captures.
- QA comparison capture — refreshed source and implementation panels at 1280 × 720 CSS px / 1× density.
- `npm run validate:evidence` — 20 captures and 33 documented runtime assertions passed.
- `npm run test:browser` — 26 / 26 runtime checks passed, including Home circles rail → Discover, global Saved → Profile Saved, Notifications unread/read state, Settings dirty/saved preference state, Workspace picker selection/focus recovery, Settings, Notifications, and Workspace board-artboard metadata/focus recovery, and Home → Featured Thread plus Discover → Circle → Thread → Profile route entry/back recovery, Circle tab/join state, Thread reply creation, Profile tab/follow feedback, instant scroll reset, navigation current state, dedicated feed-status announcements, and Like action focus retention after feed rerender.
- `npm run test:visual` — 9 / 9 targets passed with `mismatchRatio: 0`.
- `python3 -m unittest tests.test_community_example_contract.CommunityExampleContractTests.test_responsive_and_motion_contracts_are_present` — safe-area contract passed after the intentional RED → GREEN cycle.
- Browser console sweep — 0 console errors, 0 page errors, and 0 invalid links across Home, Featured Thread, Discover, City Makers Circle, City Makers Thread, Mina Park Profile, Notifications, Settings, Workspace picker, and board desktop/mobile states.

final result: passed
