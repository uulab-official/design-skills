# Design Skills v0.13 Featured Story Route Feedback Roadmap

## Goal

Make the featured story's primary action feel trustworthy before its future conversation route exists.

## Scope

- [x] Connect the visible featured-story CTA to the existing route-boundary toast pattern.
- [x] Add a Chromium regression assertion for the CTA feedback message.
- [x] Record the interaction in the design specification and evidence manifest.
- [x] Keep the visual composition unchanged while the next route remains out of scope.
- [ ] Replace the boundary toast with the real conversation route when `/post/:id` enters implementation scope.

## Review note

The responsive web surface remains `review-ready`, not `release-ready`: the CTA now communicates its boundary honestly, while the conversation route, backend, native runtime, and deployment evidence remain scope-dependent.
