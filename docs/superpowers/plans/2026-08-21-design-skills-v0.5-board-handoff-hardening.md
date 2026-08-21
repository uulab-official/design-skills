# Design Skills v0.5 Board Handoff Hardening Roadmap

> **Status:** Complete for the community reference surface. Native implementation and product backend remain scope-dependent.

## Goal

Make the Figma-equivalent design board a reviewable handoff surface with shareable inspection state, accessible controls, and predictable dialog recovery.

## Roadmap

### 1. Addressable board state

- [x] Restore desktop/mobile composition from `view` URL state.
- [x] Restore directions, archetypes, platforms, screens, states, and system filters from `filter` URL state.
- [x] Preserve unknown query parameters while synchronizing board state with `history.replaceState`.
- [x] Expose `aria-pressed` state for view and filter controls.

### 2. Screen handoff dialog

- [x] Focus the close control when a screen detail dialog opens.
- [x] Return focus to the invoking artboard control after close or Escape dismissal.
- [x] Handle native dialog cancellation and the static fallback path consistently.

### 3. Evidence and review

- [x] Add browser assertions for board URL restoration and dialog focus return.
- [x] Record the new checks in the shared evidence manifest.
- [x] Keep the board route, viewport, and represented state explicit for contributors.

## Exit gate

The v0.5 board slice is complete when a shared board URL restores its inspection context and a keyboard user can open, inspect, and dismiss a screen detail without losing their place.
