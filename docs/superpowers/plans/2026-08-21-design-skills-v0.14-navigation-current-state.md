# Design Skills v0.14 Navigation Current State Roadmap

## Goal

Make the responsive web shell understandable to assistive technology as well as visually clear, with one shared current destination across desktop and mobile navigation.

## Scope

- [x] Give the two sidebar navigation groups descriptive landmark names.
- [x] Expose the active destination with `aria-current="page"` in sidebar and mobile navigation.
- [x] Keep visual active styling and pressed state synchronized across both navigation surfaces.
- [x] Add Chromium coverage for initial Home state and destination changes.
- [ ] Replace the prototype destination toasts with real routes when Discover, Circles, Saved, and Notifications ship.

## Review note

The responsive web surface remains `review-ready`, not `release-ready`: the shell now communicates current destination semantics, while destination routes, native runtime, backend, and deployment evidence remain scope-dependent.
