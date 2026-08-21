# Design Skills v0.22 Notifications Route Roadmap

## Goal

Turn the global Notifications entry points into a production-shaped “Stay close” surface with deterministic unread feedback and route-aware recovery.

## Scope

- [x] Map sidebar Notifications and the topbar bell to `view=notifications`.
- [x] Render three meaningful notification types with Thread, Circle, and Discover follow-through.
- [x] Add mark-all-as-read state with a polite status announcement and disabled recovery state.
- [x] Capture desktop/mobile evidence and protect the route with a visual baseline.
- [x] Update the interaction contract, evidence manifest, and design QA history.
- [ ] Replace deterministic notifications with authenticated, persisted activity when backend scope exists.

## Review note

The static responsive web surface remains review-ready, not release-ready: Notifications now has a complete responsive route and state model, while authentication, persistence, native runtime, and deployment evidence remain integration work.
