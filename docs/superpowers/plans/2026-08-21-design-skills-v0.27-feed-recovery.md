# Design Skills v0.27 Feed Recovery Roadmap

## Goal

Close the remaining high-signal state-coverage gap in the Gather reference surface by making offline continuity, connection failure, retry, and recovery behavior visible in the runnable prototype and the Figma-equivalent design board.

## Scope

- [x] Add deterministic `feed=offline` and `feed=error` URL states without dropping existing filter or search parameters.
- [x] Keep the last saved feed visible in the offline state and expose a reconnect action with an accessible live status.
- [x] Render a recoverable feed error panel with an alert role and explicit retry action.
- [x] Return focus to the feed status after successful recovery and remove the transient URL state.
- [x] Add desktop and mobile evidence captures for offline/stale and error/retry states.
- [x] Add a `Feed / Recovery` board artboard, handoff description, and responsive styling.
- [x] Extend browser, contract, evidence, and capture validation for the new state contract.
- [x] Update the design spec, QA history, README roadmap, and evidence manifest.
- [x] Run the full quality, runtime, evidence, visual, and console/link checks before pushing `main`.
- [ ] Replace deterministic local recovery with real network/cache persistence when backend and service-worker scope exists.

## Review note

The responsive web surface and design board are review-ready for this state slice, not release-ready: offline and error behavior is deterministic so the open-source handoff can be inspected and captured reliably. Authenticated data persistence, service-worker cache policy, native iOS/Android runtime behavior, analytics, and deployment evidence remain integration work.
