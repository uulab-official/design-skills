# Design Skills v0.30 Route Handoff Metadata Roadmap

## Goal

Make shareable routes preserve the context from which a user arrived and make every public route legible in browser history, previews, and social shares.

## Scope

- [x] Preserve Circle origin with validated `from=discover|circles|profile|notifications` URL state.
- [x] Render an origin-aware Circle back action and restore the source route/navigation state.
- [x] Publish route-specific browser title, description, Open Graph title/description, and Twitter title/description.
- [x] Extend contract tests, browser checks, and the evidence manifest for the new handoff guarantees.
- [x] Update the README, design spec, and design QA history.
- [ ] Connect metadata to server-rendered or framework-level head management when the surface moves beyond the static prototype.
- [ ] Replace deterministic route fixtures with authenticated, backend-backed destinations when product data scope exists.

## Review note

The responsive web surface is review-ready for deterministic route handoff and client-side metadata, not release-ready: native runtime, backend persistence, server-rendered previews, analytics, and deployment evidence remain integration work.
