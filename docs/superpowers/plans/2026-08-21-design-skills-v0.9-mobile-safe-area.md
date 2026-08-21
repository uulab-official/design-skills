# Design Skills v0.9 Mobile Safe-Area Contract Roadmap

## Goal

Keep the web reference's fixed mobile navigation visually and functionally clear on devices with a home indicator, without changing the compact five-item composition.

## Scope

- [x] Include the bottom safe-area inset in the page's reserved content space.
- [x] Include the bottom safe-area inset in the fixed navigation surface height.
- [x] Preserve the existing 44 × 44 px minimum control geometry and visual icon scale.
- [x] Add a contract test for both safe-area calculations.
- [ ] Add device-level simulator evidence when native iOS/Android implementations enter scope.

## Review note

The responsive web surface remains `review-ready`, not `release-ready`: the safe-area contract is covered in CSS and static Chromium QA, while native simulator, backend, and deployment evidence remain scope-dependent.
