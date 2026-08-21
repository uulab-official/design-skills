# Design Skills v0.8 Mobile Touch Contract Roadmap

## Goal

Make the responsive web reference feel production-ready at the first mobile breakpoint by treating touch target geometry as part of the visual system, not as an accessibility note added after the layout.

## Scope

- [x] Inspect the committed 390px prototype evidence and the mobile CSS breakpoint.
- [x] Give mobile menu, filter, post action, circle row, navigation, primary link, and featured-story controls a minimum 44px interaction box.
- [x] Preserve the visual scale of compact icons while expanding their usable hit area.
- [x] Add Chromium QA that measures the rendered interaction boxes at 390 × 844.
- [x] Keep safe-area padding, reduced motion, and existing focus styling intact.
- [ ] Add native simulator evidence when iOS/Android implementation enters scope.

## Review note

The responsive web surface remains `review-ready`, not `release-ready`: touch geometry is now verified for the web target, while native target evidence, backend persistence, and deployment integration remain intentionally open.
