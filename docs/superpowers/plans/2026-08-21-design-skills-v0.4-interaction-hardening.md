# Design Skills v0.4 Interaction Hardening Roadmap

> **Status:** In progress. URL state and keyboard/focus handoff are implemented for the community web reference surface; backend and native interaction evidence remain scope-dependent.

## Goal

Make the polished web prototype behave like a production handoff at the moments that affect orientation, recovery, and assistive technology—not only at the visual happy path.

## Roadmap

### 1. Addressable web state

- [x] Restore feed filter, circle scope, and search query from URL parameters.
- [x] Keep meaningful state changes shareable through `history.replaceState` without disrupting unknown query parameters.
- [x] Preserve empty-state recovery while clearing both UI and URL state.

### 2. Keyboard and focus handoff

- [x] Add a visible skip link to the primary content landmark.
- [x] Return focus to the composer trigger after publish, close, or Escape dismissal.
- [x] Move focus into the mobile drawer when opened and return it to the menu trigger when closed.
- [x] Keep the dialog description, required-field error, alert semantics, and visible focus styling explicit.

### 3. Evidence and review

- [x] Add contract coverage for URL state and focus handoff.
- [x] Add browser assertions for URL restoration, focus return, and skip-link navigation to the runtime evidence manifest.
- [ ] Add deterministic local font/image assets before enforcing pixel-diff thresholds in CI.

### 4. Scope boundaries

- [x] Keep backend persistence and offline synchronization outside this static example until a real data contract is selected.
- [x] Keep native runtime evidence conditional on an actual iOS/Android implementation target.

## Exit gate

The v0.4 web interaction slice is complete when representative browser checks prove URL restoration, modal/drawer focus return, and skip-link navigation at desktop and mobile sizes, while the readiness record still distinguishes static evidence from shipped product infrastructure.
