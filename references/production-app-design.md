# Production App Design Standard

## Contents

- [Benchmark](#benchmark)
- [Figma-equivalent design board](#figma-equivalent-design-board)
- [Production app surface](#production-app-surface)
- [Handoff contract](#handoff-contract)
- [Production readiness checklist](#production-readiness-checklist)
- [Common gaps between a mockup and an app](#common-gaps-between-a-mockup-and-an-app)

Use this reference for native or cross-platform app work when the target is comparable to a polished public design showcase and must still be safe to ship. The goal is not to copy a Figma file or produce one perfect hero screen; it is to make the visual system, prototype behavior, screen set, states, and implementation agree.

## Benchmark

Treat a strong public Figma case study as a craft benchmark for:

- clear visual thesis and art direction;
- intentional typography, spacing, color, imagery, iconography, and motion;
- complete component variants rather than isolated screenshots;
- coherent screen-to-screen rhythm and a convincing primary flow;
- realistic content, editorial composition, and polished empty/loading/error states;
- a prototype that explains how the product behaves;
- handoff detail that another engineer can implement without guessing.

Treat production readiness as a second, non-negotiable bar:

- native navigation and system behavior are correct;
- touch, keyboard, safe areas, permissions, offline, interruption, and back behavior are defined;
- accessibility, localization, data latency, privacy, and recovery are part of the design;
- the implementation is rendered and checked on the declared devices;
- the result is maintainable rather than a collection of one-off visual hacks.

## Figma-equivalent design board

For a new app or a material redesign, produce the following board-like handoff even when no Figma tool is available. If a Figma file or link is supplied and a Figma integration is available, inspect its nodes, styles, components, and prototype connections; use this contract to identify what the file does not specify.

### 1. Intent and art direction

Record:

```text
Product / audience / primary job:
Platform / device matrix:
Visual thesis:
Personality adjectives:
Hierarchy statement:
Brand and asset sources:
Deliberate exclusions:
```

Reject generic “modern, clean, premium” copy unless it is translated into observable choices for type, layout, materials, imagery, and motion.

### 2. Foundations

Show the semantic token set and examples for:

- color roles in light/dark and semantic status states;
- type scale, weights, line heights, casing, truncation, and numeric treatment;
- spacing, container, grid, safe-area, and density rules;
- radius, borders, elevation, blur/material, and surface grouping;
- icon family, optical size, stroke/fill behavior, and accessible naming;
- imagery ratios, crop/focal-point rules, fallbacks, and loading treatment;
- motion durations, easing intent, interruption behavior, and reduced-motion fallback.

### 3. Component and pattern library

For every reusable component, specify anatomy, variants, content limits, and states:

```text
Component:
Purpose:
Anatomy:
Variants:
Default / pressed / focused / selected / disabled:
Loading / empty / error / offline / success:
Content-length and asset rules:
Accessibility name, role, focus, and announcement:
Platform-specific behavior:
```

Cover the app shell, navigation, buttons, fields, lists, cards, tabs, sheets, dialogs, banners, toasts, images, avatars, and empty/loading/error primitives before building a screen-specific variation.

### 4. Screen set and prototype flow

Show a complete primary journey, not only a hero state:

`entry/onboarding → primary task → feedback/result → recovery or next step`

Include the app shell, at least three meaningful screens for a multi-screen product, and the state variants that change layout or user decisions. Define transitions, back/dismissal, modal/sheet behavior, keyboard movement, deep links, interruptions, and success/failure feedback.

### 5. Handoff notes

For each screen, expose route, platform/device, layout measurements or token references, content fixtures, asset requirements, state, interaction, accessibility, and implementation owner/next action. Mark every assumption. Do not hide behavior in a decorative mockup.

## Production app surface

Turn the board into maintainable product slices in this order:

1. **Foundations** — map tokens to the repository's theme system and define light/dark/contrast variants.
2. **Primitives** — implement semantic controls and state primitives with real content limits and accessible behavior.
3. **App shell** — implement navigation, safe areas, system back, deep links, session/permission boundaries, and global feedback.
4. **Primary flow** — build the end-to-end journey with realistic data and success/failure recovery.
5. **Secondary surfaces** — add discovery, profile/settings, history, collection, or admin surfaces only when they support the product job.
6. **State matrix** — implement loading, empty, error, offline/stale, permission denied, disabled, success, interruption, and destructive recovery where relevant.
7. **Runtime proof** — render, interact, inspect, fix, and re-render at the declared device matrix.

### App-specific quality requirements

- Use safe-area insets, keyboard avoidance, system back, orientation, and native permission flows rather than approximating them with static spacing.
- Define what happens when the app backgrounds, receives an interruption, loses network/camera/location, or resumes from a deep link.
- Keep list and image surfaces performant: stable keys, bounded re-rendering, progressive image loading, placeholders that preserve geometry, and no unbounded animation.
- Keep motion purposeful. Animate state change, focus, progress, or spatial relationship; do not animate every mount or block recovery with an animation.
- Support large text/font scaling, screen readers, reduced motion, contrast, touch targets, and localization expansion from the first complete slice.
- Keep sensitive content and permissions explicit. Do not save media, expose private content, or trigger notifications without a clear user action and recoverable setting.
- Keep domain/data boundaries separate from visual primitives so realistic fixtures can be replaced by real data without rewriting the design system.
- Validate on both platforms for React Native/Expo. Shared code does not prove shared behavior.

## Handoff contract

For app design, the final handoff must contain:

```text
Design board:
- Visual thesis and art direction
- Foundations and semantic tokens
- Component/pattern variants
- Screen set and prototype flow

Production surface:
- Route/navigation map
- Primary flow implementation slice
- State matrix and recovery paths
- Platform/device behavior
- Accessibility/localization/performance notes

Evidence:
- Rendered target devices and sizes
- Interacted states and edge paths
- Review scores and findings
- Readiness level
```

If only a single screen exists, label the result `concept` or `implementation-ready`; do not imply that the app design is production-grade.

## Production readiness checklist

### Design craft

- [ ] The art direction is visible in type, rhythm, materials, imagery, iconography, and motion—not only in adjectives.
- [ ] Foundations and components are reusable across the screen set.
- [ ] The primary flow has consistent composition, content density, and feedback from entry to recovery.
- [ ] Realistic content and assets survive long labels, missing media, large values, empty data, and localization expansion.
- [ ] Every screen has a deliberate hierarchy and does not rely on decorative chrome.

### Production behavior

- [ ] Navigation, safe areas, keyboard, back/dismissal, permissions, deep links, interruptions, and offline behavior are implemented for the target platform.
- [ ] State variants preserve layout, explain status, and provide retry, undo, or next action.
- [ ] Components expose accessible names, roles, focus order, announcements, and text scaling behavior.
- [ ] Lists, images, and motion have a performance plan that preserves visual stability.
- [ ] Platform-specific behavior is checked on each declared native target.

### Evidence

- [ ] The board/implementation is rendered at the primary device and boundary device sizes.
- [ ] The primary flow and at least one non-default state per key surface are interacted with.
- [ ] Visual fidelity, platform fit, accessibility, state completeness, and implementation fidelity are scored with evidence.
- [ ] High/critical findings are fixed and rechecked; unresolved gaps are clearly labeled.
- [ ] The readiness level is honest: concept, implementation-ready, review-ready, or release-ready.

## Common gaps between a mockup and an app

| Mockup shortcut | Production consequence | Design response |
|---|---|---|
| One perfect screen | Navigation and states feel unfinished | Deliver a complete primary flow and state matrix |
| Placeholder copy and stock imagery | Real content breaks hierarchy and crop | Use realistic fixtures and asset rules early |
| Static bottom tab or header | Native back, sheet, keyboard, and safe-area behavior fails | Specify platform shell and interruption behavior |
| Component drawn per screen | Small differences become a visibly inconsistent app | Build a semantic component/variant library |
| “Backend handles it” | Loading, stale, permission, and failure states become dead ends | Design and implement state primitives with data boundaries |
| Animation used as polish | Motion distracts, drains performance, or blocks recovery | Tie motion to meaning and provide reduced-motion behavior |
| Screenshot-based QA | Accessibility and responsive failures remain hidden | Render and interact across target devices, states, and settings |
