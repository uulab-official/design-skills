# Design Skills v0.7 Audit And Screen Coverage Roadmap

## Goal

Turn the community reference surface's next visual review into an honest, production-minded handoff: every declared core screen is visible on the board, the handoff dialog is fully described to assistive technology, and URL-driven review state can rehydrate after browser history changes.

## Scope

- [x] Capture the current board, screen-detail dialog, prototype shell, composer, validation, and publish flow before editing.
- [x] Add the two declared production states as board artboards: `Home / Following` and `Composer / Modal`.
- [x] Connect the board dialog to its dynamic description with `aria-describedby`.
- [x] Rehydrate prototype and board state on `popstate` without dropping unknown query parameters.
- [x] Add contract coverage for the eight-artboard inventory and history listeners.
- [x] Refresh representative PNG baselines after the board surface changes.
- [x] Run the Python contract suite, browser runtime QA, visual regression gate, evidence validation, and repository quality checks.

## Review notes

The audit found no critical or high visual breakage in the captured surface. The main review risk was handoff honesty: the toolbar promised eight screens while only six screen artboards were rendered. The added variants make filtered-feed context and the creation flow inspectable without relying on prose in the design spec.

This slice remains `review-ready`, not `release-ready`: native runtime evidence, backend integration, and deployment checks are still intentionally outside the static example's scope.
