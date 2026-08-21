# Design Skills v0.2 Runtime Hardening Roadmap

> **Status:** In progress. The first slice is implemented in the community reference surface; the remaining items stay explicit until their evidence exists.

## Goal

Raise the example from a polished visual handoff to a reviewable product surface whose important states, responsive behavior, accessibility semantics, and visual evidence can be checked by contributors.

## Principles

- A visual board and a runnable surface must describe the same interaction contract.
- Non-default states need visible feedback and programmatic semantics, not only a screenshot.
- Browser evidence is useful only when the target viewport and state are named.
- Keep the readiness claim honest: `review-ready` is not `release-ready`.

## Roadmap

### 1. Runtime state hardening

- [x] Give the composer required-field errors an explicit `aria-invalid`, `aria-describedby`, and alert message.
- [x] Expose selected feed filters, circle scopes, and prototype navigation through `aria-pressed` state.
- [x] Add standard-library contract tests for error, responsive, reduced-motion, and live-region requirements.

### 2. Evidence-driven browser QA

- [x] Keep a repeatable capture matrix for desktop, boundary, and mobile viewports in `examples/community/evidence/manifest.json`.
- [x] Exercise the default, filtered, empty, composer validation, composer success, mobile drawer, and recovery states in browser QA and record them in the manifest.
- [ ] Add a contributor-friendly capture command when the repository can depend on a supported browser runner.

### 3. Archetype benchmark surface

- [x] Add one compact benchmark brief and handoff fixture each for camera, game, SaaS dashboard, and messaging in `references/archetype-benchmarks.json`.
- [x] Verify that each benchmark selects a task-led navigation model and does not inherit community chrome by default.
- [x] Link benchmark findings back to `references/archetypes.yaml`, `references/platforms.md`, `references/review-rubric.md`, and `references/production-app-design.md`.

### 4. Cross-platform production parity

- [ ] Turn the existing Web/iOS/Android board into implementation notes for safe areas, back behavior, keyboard/focus, and system feedback.
- [ ] Add native runtime evidence only when native targets are actually in scope.
- [ ] Keep the production-readiness score below release-ready until all declared target environments are rendered.

## Exit gate

The v0.2 example can move from `review-ready` toward `release-ready` only when the declared target environments and representative states have rendered evidence, no in-scope rubric dimension is below 3, and the remaining findings have severity, evidence, and next actions.
