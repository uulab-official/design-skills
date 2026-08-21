# Design Skills v0.15 Discover Route Roadmap

## Goal

Close the largest gap between the Figma-equivalent Gather board and the runnable responsive web surface by making Discover / Circles a real, shareable route.

## Scope

- [x] Add a responsive Discover route state at index.html?view=discover.
- [x] Preserve the selected destination across sidebar and mobile navigation with aria-current.
- [x] Reset the viewport to the top immediately when entering or restoring the route.
- [x] Restore Home content and current navigation after browser back.
- [x] Translate the board’s dark editorial directory direction into six responsive circle cards.
- [x] Add topic filters and global search feedback to the Discover route.
- [x] Capture Discover at desktop and mobile sizes.
- [x] Add a dedicated Discover visual regression baseline.
- [ ] Replace circle-card boundary toasts with persisted circle detail routes when circle data and backend scope are available.

## Review note

The responsive web surface remains review-ready, not release-ready: Discover now demonstrates a production-shaped route and responsive composition, while native runtime, backend persistence, authentication, and deployment evidence remain scope-dependent.
