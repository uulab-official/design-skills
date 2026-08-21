# Design Skills v0.20 Home Discover Rail Roadmap

## Goal

Close the remaining Home circles-rail dead ends by routing both discovery affordances into the existing shareable Discover surface.

## Scope

- [x] Map `View all circles` and `See all circles` to `view=discover`.
- [x] Preserve the existing Discover hierarchy, URL state, instant scroll reset, and browser-back recovery.
- [x] Add a browser regression assertion covering both Home rail CTAs.
- [x] Update the interaction contract, evidence manifest, and design QA history.
- [ ] Replace remaining non-navigation toasts with product-scope routes when their destinations are defined.

## Review note

The static responsive web surface remains review-ready, not release-ready: Home discovery entry is now connected, while persistence, authentication, native runtime, and deployment evidence remain integration work.
