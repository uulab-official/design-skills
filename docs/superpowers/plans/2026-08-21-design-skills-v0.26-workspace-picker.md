# Design Skills v0.26 Workspace Picker Roadmap

## Goal

Replace the last prominent sidebar dead-end with a production-shaped workspace picker that keeps context, selection, focus, evidence, and the Figma-equivalent board aligned.

## Scope

- [x] Add an accessible native workspace dialog with three designed spaces.
- [x] Focus the active option on open and return focus to the workspace trigger on selection, close, or Escape.
- [x] Update the sidebar workspace context and announce the selected space without changing the current route or search context.
- [x] Add desktop dialog and mobile drawer-plus-bottom-sheet evidence through manifest-defined capture actions.
- [x] Add a Workspace / Picker board artboard, handoff metadata, and responsive board styling.
- [x] Extend browser, contract, evidence, and capture-tool tests.
- [x] Update the design spec, QA history, README roadmap, and evidence manifest.

## Review note

The board and static responsive web surface remain review-ready, not release-ready: workspace selection is deterministic and local for handoff review, while authenticated membership, persistence, permissions, and cross-device synchronization remain integration work.
