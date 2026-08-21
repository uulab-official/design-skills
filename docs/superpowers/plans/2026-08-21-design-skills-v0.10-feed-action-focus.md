# Design Skills v0.10 Feed Action Focus Roadmap

## Goal

Keep keyboard users anchored to the action they activated when a dynamic feed rerenders after Like or Save.

## Scope

- [x] Preserve focus on the matching Like or Save action after its post card is rebuilt.
- [x] Keep the updated `aria-pressed` state visible to assistive technology after rerender.
- [x] Add a Chromium regression check for focus retention and pressed state.
- [x] Record the interaction contract in the community design specification and QA handoff.
- [ ] Add native accessibility evidence when iOS/Android implementations enter scope.

## Review note

The responsive web surface remains `review-ready`, not `release-ready`: the browser contract now covers this dynamic focus path, while native runtime, backend, and deployment evidence remain scope-dependent.
