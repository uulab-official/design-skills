# Design Skills v0.29 Search Empty Recovery Roadmap

## Goal

Make directory search feel production-complete when a query returns no matches: preserve context, explain the state, and provide a fast, accessible recovery path in both Discover and Your circles.

## Scope

- [x] Add designed zero-result panels to Discover and Your circles without losing the active route or filter context.
- [x] Keep the query and filter reflected in the URL while the empty state is visible.
- [x] Add Clear search actions that restore visible cards and return focus to the global search field.
- [x] Ensure hidden directory cards are removed from visual layout as well as the accessibility tree.
- [x] Add desktop/mobile evidence captures for both route-level empty states.
- [x] Extend contract, browser, evidence, capture, and visual review coverage.
- [x] Update the design spec, QA history, README roadmap, and evidence manifest.
- [ ] Replace deterministic directory fixtures with backend-backed search and ranking when data scope exists.

## Review note

The responsive web surface is review-ready for deterministic search recovery, not release-ready: directory data, ranking, authenticated membership, native runtime behavior, analytics, and deployment evidence remain integration work.
