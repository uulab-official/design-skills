# Design Skills v0.28 Your Circles Roadmap

## Goal

Close the remaining shell-navigation gap in the Gather reference surface by turning `Your circles` from a direct City Makers shortcut into a shareable collection route with clear activity states and a complete Circle handoff.

## Scope

- [x] Add deterministic `view=circles` route state without dropping the existing workspace, search, or evidence parameters.
- [x] Add `all`, `recent`, and `quiet` collection filters with `circleFilter` URL synchronization and dedicated status announcements.
- [x] Add collection cards that open the shareable Circle detail route, plus a Discover return path.
- [x] Add a responsive desktop/mobile collection composition with a distinct editorial hero, orbit motif, activity toolbar, and card hierarchy.
- [x] Add the thirteenth board screen (`Your circles / Collection`) with handoff metadata and responsive styling.
- [x] Extend contract, browser, capture, evidence, and visual validation for the collection route.
- [x] Update the design spec, QA history, README roadmap, and evidence manifest.
- [x] Run the full quality, runtime, evidence, visual, and console/link checks before pushing `main`.
- [ ] Replace deterministic local membership/activity fixtures with authenticated backend data when persistence scope exists.

## Review note

The responsive web surface and design board are review-ready for this route slice, not release-ready: membership and activity are deterministic so the open-source handoff can be inspected and captured reliably. Authenticated persistence, native iOS/Android runtime behavior, analytics, and deployment evidence remain integration work.
