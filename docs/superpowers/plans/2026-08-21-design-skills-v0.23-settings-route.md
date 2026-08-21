# Design Skills v0.23 Settings Route Roadmap

## Goal

Turn the global Settings entry point into a production-shaped Preferences surface with explicit account context, accessible controls, and recoverable save feedback.

## Scope

- [x] Map Sidebar Settings to `view=settings` with browser-back recovery.
- [x] Render account context and a responsive preference hierarchy.
- [x] Add accessible Weekly digest, Replies and mentions, and Quiet hours toggles.
- [x] Expose dirty state, saved confirmation, disabled recovery state, and local state retention.
- [x] Capture desktop/mobile evidence and protect the route with a visual baseline.
- [x] Update the interaction contract, evidence manifest, design QA history, and README roadmap.
- [ ] Replace deterministic local preferences with authenticated, persisted settings when backend scope exists.

## Review note

The static responsive web surface remains review-ready, not release-ready: Settings now has a complete responsive route and state model, while authenticated persistence, native runtime, and deployment evidence remain integration work.
