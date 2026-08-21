# Design Skills v0.21 Global Saved Route Roadmap

## Goal

Turn the global Saved navigation item into a real shareable destination by reusing Mina Park’s existing Saved profile state.

## Scope

- [x] Map desktop and mobile Saved navigation to `view=profile&profile=mina&tab=saved`.
- [x] Preserve selected Saved tab, current navigation state, instant scroll reset, and browser-back recovery.
- [x] Keep the existing Profile Saved content as the single source of truth.
- [x] Add a browser regression assertion and route evidence contract.
- [ ] Replace the static profile-backed Saved collection with authenticated user data when backend scope exists.

## Review note

The static responsive web surface remains review-ready, not release-ready: global Saved now has a real route destination, while authentication, persistence, native runtime, and deployment evidence remain integration work.
