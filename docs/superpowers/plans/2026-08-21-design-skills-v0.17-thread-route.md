# Design Skills v0.17 Thread Route Roadmap

## Goal

Complete the Circle → Thread journey with a shareable conversation detail route that mirrors the board’s reading hierarchy, reply context, and inline response composer.

## Scope

- [x] Open a Thread from a Circle conversation and feed comment/post actions.
- [x] Preserve the Circle and Thread identity in a shareable URL.
- [x] Render author context, reading time, conversation body, replies, and Circle context.
- [x] Add browser-back recovery to the originating Circle.
- [x] Add a deterministic local reply composer with validation, count update, draft reset, and polite success status.
- [x] Capture Thread at desktop and mobile sizes.
- [x] Add a dedicated Thread visual regression baseline.
- [ ] Replace local reply fixtures with authenticated, persisted reply data when backend scope exists.
- [ ] Add native Thread implementations and simulator evidence for iOS and Android.

## Review note

The static responsive web surface remains review-ready, not release-ready: Thread now demonstrates the production-shaped reading and reply flow, while persistence, authentication, native runtime, and deployment evidence remain integration work.
