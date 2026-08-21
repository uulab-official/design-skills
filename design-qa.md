# Design QA

Date: 2026-08-21  
Scope: Gather community example — `Home / For you`, `Discover / Circles`, and `Thread / Conversation`, desktop and mobile handoff

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

The desktop source is the refreshed `A / 01 · Home / For you` artboard with its screen content aligned to the viewport. The mobile source is the responsive design board containing `A / 06 · Mobile / Home`; the implementation is the runnable prototype at the same mobile viewport.

## Full-view comparison

The source and implementation share the same editorial hierarchy: forest navigation rail, warm paper surface, coral action, serif emphasis, orbit motif, featured image, and feed filter. The source preview is intentionally denser than the live surface, but its information architecture now matches the implementation at the fold: the featured story occupies the main column and `Circles you’re in` occupies the right rail.

## Focused comparison

The focused desktop pass inspected the hero baseline, orbit artwork, feed heading/filter group, featured card split, image crop, and right rail. The focused mobile pass inspected the top bar, hero wrap, primary action, orbit, featured card, bottom navigation, and touch-target geometry. The Discover pass inspected the dark directory hero, orbit art, topic filter row, six-card grid, route CTA, and mobile bottom navigation at both target sizes. The Circle pass inspected the identity hero, orbit artwork, tab bar, conversation cards, context rail, join CTA, and mobile recomposition. The Thread pass inspected the reading hierarchy, author context, reply rhythm, context rail, local reply composer, and mobile fixed navigation interaction. No overlap, clipping, broken wrapping, or hierarchy collapse was found in the reviewed states.

## Findings and comparison history

| ID | Severity | Surface | Initial finding | Resolution |
| --- | --- | --- | --- | --- |
| DQ-001 | P2 | Layout / handoff fidelity | The `Home / For you` board preview omitted the desktop circles rail and rendered the featured story full width, while the implementation used a main column plus `Circles you’re in` rail. This could cause contributors to reproduce a different desktop composition from the design board. | Resolved by adding the miniature rail to `examples/community/board.html` and matching the board grid in `examples/community/board.css`. Re-captured and re-reviewed after the change. |
| DQ-002 | P2 | Route / implementation coverage | The board defined Discover / Circles as a screen, but the runnable navigation stopped at a route-boundary toast. This made the board-to-prototype handoff incomplete for the first discovery task. | Resolved by adding a shareable Discover view with topic filters, global search feedback, instant scroll reset, browser-back recovery, responsive evidence, and a dedicated visual baseline. |
| DQ-003 | P2 | Route / implementation coverage | Discover cards still ended at a route-boundary toast, leaving Circle identity, membership, and conversation context absent from the runnable flow. | Resolved by adding a shareable City Makers Circle route with Conversations/About tabs, join state, conversation feedback, responsive evidence, and a dedicated visual baseline. |
| DQ-004 | P2 | Route / implementation coverage | Circle conversation CTAs stopped at a toast, leaving the board’s Thread / Conversation reading and reply screen absent from the runnable flow. | Resolved by adding a shareable Thread route with author context, deterministic replies, browser-back recovery, local reply creation, responsive evidence, and a dedicated visual baseline. |

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

## Rubric pass

- Typography: local fonts, weight hierarchy, serif display treatment, wrapping, and line-height remain coherent across source and implementation.
- Spacing and layout: the desktop rail/feature split now matches the handoff; Discover adds a balanced three-column directory and mobile composition stays single-column with bottom navigation.
- Viewport resilience: browser QA passed at 1440 × 1000 and 390 × 844; no overlap or unusable collapse was observed.
- Colors and tokens: forest, paper, coral, lilac, moss, borders, and surface treatments map consistently across the board and prototype.
- Image quality and assets: the featured story uses the same local editorial asset and preserves its crop; no placeholder image replaces a designed asset.
- Copy and content: source and implementation use the same product copy and state labels for the reviewed home surface.
- Icons: board symbols and implementation SVG sprite icons are present, aligned, and stylistically consistent.
- States and interactions: URL state, history restoration, Discover → Circle → Thread route entry/back with instant scroll reset, topic filters, Circle tab/join state, Thread reply creation and status feedback, dedicated feed-status announcement, Featured story route feedback, synchronized navigation current state, composer focus return, drawer focus return, skip-link navigation, board state, and board dialog focus return passed runtime checks.
- Feed action focus: Like/Save rerendering preserves the focused action and its updated pressed state in browser QA.
- Accessibility: semantic controls, visible focus treatment, dedicated live status messaging, reduced-motion support, image alt text, and minimum 44 × 44 px mobile control geometry are covered by the example contract and runtime QA.
- AI shortcut artifacts: no generic placeholder card, fake product image, or mismatched decorative surface was found in the reviewed home surface; the orbit treatment is a deliberate shared motif.

## Verification

- `npm run capture:community` — refreshed 12 evidence captures, including Discover, City Makers Circle, and City Makers Thread at desktop and mobile.
- QA comparison capture — refreshed source and implementation panels at 1280 × 720 CSS px / 1× density.
- `npm run validate:evidence` — 12 captures and 26 documented runtime assertions passed.
- `npm run test:browser` — 19 / 19 runtime checks passed, including Discover → Circle → Thread route entry/back recovery, Circle tab/join state, Thread reply creation, instant scroll reset, navigation current state, dedicated feed-status announcements, Featured story CTA feedback, and Like action focus retention after feed rerender.
- `npm run test:visual` — 6 / 6 targets passed with `mismatchRatio: 0`.
- `python3 -m unittest tests.test_community_example_contract.CommunityExampleContractTests.test_responsive_and_motion_contracts_are_present` — safe-area contract passed after the intentional RED → GREEN cycle.
- Browser console sweep — 0 console errors and 0 page errors across Home, Discover, City Makers Circle, City Makers Thread, and board desktop/mobile states.

final result: passed
