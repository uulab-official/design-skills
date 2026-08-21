---
name: design-skills
description: Use when designing, implementing, redesigning, or reviewing an app or website UI that must fit a declared platform, product type, device class, or existing project and reach a Figma-quality, high-fidelity, production-ready finish; especially when generic screens, inconsistent design systems, placeholder content, missing states, weak responsive behavior, or poor accessibility are risks.
---

# Design Skills

## Overview

Design and implement the product, not just a pretty screen. Select the platform and product archetype before choosing navigation or visual treatment, ground decisions in the existing repository, create a coherent token and state system, then review the result against the target environment.

## Operating rules

- Treat the requested platform as a product constraint: iOS/SwiftUI, Android/Jetpack Compose, React Native/Expo, responsive Web, tablet, or cross-platform.
- Treat the product archetype as a structural constraint: a camera, game, messaging flow, dashboard, landing page, or community app must not inherit generic app chrome without a task-based reason.
- Inspect an existing project before proposing a redesign. Use `python3 scripts/inspect_project.py --path <project> --json` when the target is a local repository; preserve working conventions unless evidence supports changing them.
- For new or structurally changed work, state the design brief, platform assumption, archetype, navigation decision, tokens, and state coverage before implementation.
- Use the repository's actual stack. If a matching platform/framework skill is available, load it for implementation details after this skill's product decisions are clear.
- Treat accessibility, responsive behavior, loading, empty, error, offline/permission, disabled, success, and recovery states as part of the feature, not polish.
- Treat visual fidelity as an acceptance requirement: real content, coherent rhythm, rendered target-size evidence at named rendered target sizes, and state-by-state inspection are required for a release-ready claim.
- For app work, treat [production-app-design.md](references/production-app-design.md) as required: produce a Figma-equivalent design board and a complete production-grade app surface, not a single showcase screen.
- Do not claim readiness from a static happy-path screenshot. Run the review rubric and record evidence for remaining findings.

## Workflow

### 1. Establish the brief

Extract or infer:

```text
Audience / job:
Primary action:
Target platform:
Device class / viewport:
Existing stack or repository:
Brand or content constraints:
Success signal:
```

If platform or device is absent, inspect the repository and state the assumption. Ask only when a wrong assumption would materially change architecture; otherwise proceed with a visible assumption and make the output easy to revise.

### 2. Inspect the project

For an existing repository:

1. Run the inspector from the repository root and read its JSON output.
2. Confirm the actual framework, platform hints, route/screen structure, components, assets, and manifest files.
3. Read the relevant entry screens, navigation shell, tokens/theme, and representative components.
4. Separate a visual correction from an information-architecture problem. Keep a stable flow intact when only visual quality is at issue.

For a new project, record the chosen stack and why it matches the target. Do not invent backend architecture or replace the user's framework merely to make the UI example convenient.

### 3. Select the platform profile and archetype

Read [platforms.md](references/platforms.md) for the selected target. Read the matching entry in [archetypes.yaml](references/archetypes.yaml) and use its `primary_job`, `navigation`, `primary_action`, `interaction_mode`, `density`, required states, and review questions. When pressure-testing product diversity or designing a benchmark fixture, also read [archetype-benchmarks.json](references/archetype-benchmarks.json) and preserve the benchmark's task-led primary surface, states, and anti-generic constraints.

Reject a generic pattern when it conflicts with the primary interaction:

- Camera: let the preview and capture controls own the composition.
- Game: let the canvas, HUD, controls, pause, and result flow own the interaction.
- Messaging: optimize conversation context and send/retry states.
- Dashboard/admin: optimize scope, filters, data density, and inspection rather than decorative cards.
- Landing/portfolio: optimize narrative, proof, and one clear conversion/contact action.
- Utility: minimize navigation and get to the focused task quickly.

When the brief is broad enough to support multiple valid product jobs—especially community, marketplace, or content products—show the archetype choices before committing to a screen pattern. Compare the information priority, density, navigation, and primary action; do not call a feed, calendar, or ranked list a “variant” unless the product job justifies it.

### 4. Define the design system before screens

Read [design-quality.md](references/design-quality.md). Write or map a small semantic system before implementing screens:

- color roles and appearance/contrast variants;
- typography roles and readable content limits;
- spacing scale and layout/container rules;
- radius, border, elevation, and motion roles;
- component variants and interaction states;
- icon, imagery, copy, and content-length constraints.

Use the existing design system when one exists. Add a token only when it expresses a real semantic distinction. Do not use gradient, glass, blur, glow, arbitrary rounded cards, or shadows as a substitute for hierarchy.

### 5. Lock visual direction and fidelity plan

Read [visual-fidelity.md](references/visual-fidelity.md) when the user asks for polished, premium, beautiful, pixel-conscious, production-ready, or high-fidelity work. For open-ended visual exploration or a request to make the result feel like a public Figma design, also read [visual-directions.md](references/visual-directions.md). For app work, also read [production-app-design.md](references/production-app-design.md). Before screen polish, write a visual direction contract covering visual thesis, personality, hierarchy, typography voice, color behavior, spatial rhythm, material behavior, imagery/icon treatment, motion, and deliberate exclusions.

For an open-ended brief, produce three meaningfully different visual directions before locking the production surface. Change structure, typography, density, material, contrast, imagery, or motion—not only color and radius. Show the directions on the design board, select one with a product/platform rationale, and keep the alternatives as explicit exploration rather than silently discarding them.

Also declare the fidelity evidence plan:

```text
Readiness target: concept / implementation-ready / review-ready / release-ready
Rendered environments:
Target sizes:
Representative states:
Real content/assets used:
Comparison evidence:
```

Use real or realistic content from the first polished pass. Define the layout system and semantic primitives before tuning individual screens. If rendering is unavailable, label the work `not verified` and do not call it `release-ready`.

### 6. Design information architecture and states

For each route or screen, record:

```text
Screen / route:
Purpose:
Entry points:
Primary action:
Back / dismissal behavior:
Content hierarchy:
Default state:
Loading / empty / error:
Offline / permission / disabled:
Success / confirmation / recovery:
Accessibility and input notes:
```

Specify deep links, URL state, system back, sheets/modals, keyboard movement, safe areas, orientation, and interruption behavior when the platform requires them. Design permission explanations and denied states for every native capability.

### 7. Build the Figma-equivalent board and production app surface

For app work, produce these deliverables before calling the implementation complete:

1. **Design board:** intent/art direction, visual directions considered and selected, foundations, component anatomy and variants, patterns, screen set, prototype transitions, and handoff notes.
2. **Production surface:** token/theme mapping, semantic primitives, app shell, navigation and native behavior, complete primary flow, state matrix, and runtime evidence.
3. **Figma-to-code parity:** map visual decisions to tokens/components and map prototype transitions to real routes, sheets, gestures, back behavior, loading, and recovery. If a Figma file exists, inspect it when the Figma capability is available; if not, produce the equivalent structured handoff.

The minimum app slice is the app shell plus an end-to-end primary journey with at least three meaningful screens for a multi-screen product, reusable component variants, realistic content/assets, and the non-default states that alter user decisions. A single polished screen is a concept, not a production app design.

For cross-platform briefs, show a side-by-side platform translation board. Keep the product language and semantic tokens shared, but explicitly change navigation, safe-area behavior, input model, typography rhythm, surface/elevation, feedback, and back/dismissal behavior for Web, iOS, Android, or the declared targets. A phone-shaped web screenshot is not a native app design.

For a concrete implementation contract, read [platform-parity.md](references/platform-parity.md). Use it to document safe-area and inset behavior, keyboard/focus movement, system back and dismissal, transient feedback, accessibility announcements, and the native evidence required for each declared target.

### 8. Implement in vertical slices

Build the smallest complete user journey first: entry → primary task → feedback/result → recovery or next step. Keep component boundaries aligned to semantic behavior, not screenshot rectangles. Reuse the token system and component states across screens. Validate with realistic content, long labels, no data, slow data, failed actions, text scaling, and at least one neighboring route or breakpoint while implementing. Re-render after structural changes and fix hierarchy drift before decorative polish.

### 9. Review and iterate

Read [review-rubric.md](references/review-rubric.md) and [visual-fidelity.md](references/visual-fidelity.md). Review the actual rendered UI at representative target sizes and input modes whenever runtime or browser tooling is available. If it is not available, review the implementation and state the missing evidence:

1. Confirm the primary task and navigation without explaining it verbally.
2. Walk first use, happy path, empty, loading, error, offline/stale, permission denied, interruption/back, and destructive/recovery paths as applicable.
3. Check visual hierarchy, spacing, typography wrapping, asset crop, token consistency, component states, platform conventions, accessibility, and responsive recomposition.
4. Report 0–4 scores for every in-scope dimension and findings with severity, evidence, and next action.
5. Fix structural issues before cosmetic polish, then repeat the affected checks at the same target size and one neighboring screen or breakpoint.
6. Use the readiness levels from `visual-fidelity.md`; call work `release-ready` only when no in-scope dimension is below 3, no critical/high finding remains, and rendered evidence covers the declared platform and representative states.

## Required handoff shape

For a new or structurally changed design, finish with this compact record:

```text
Platform / device:
Platform-specific translation:
Archetype / primary job:
Navigation decision:
Figma-equivalent design board:
Design-system source:
Production app surface:
Prototype / route flow:
State coverage:
Visual direction:
Directions considered / selected / rationale:
Rendered evidence / target sizes:
Readiness level:
Implementation files:
Review scores:
Open findings:
```

For a small existing-flow change, preserve the same decisions when discoverable and include only the affected state and review evidence.

## Red flags

Stop and correct course when any of these appear:

- coding starts before platform, archetype, and primary task are known;
- bottom navigation, sidebar, cards, or a visual trend is selected without a product reason;
- camera preview, game canvas, reading surface, or primary data is visually subordinate to chrome;
- each screen invents its own typography, spacing, radius, or button hierarchy;
- only the default state is implemented;
- placeholder copy, random assets, or fake data remain in the reviewed flow;
- a default screen is called release-ready without rendered target-size evidence;
- a single showcase screen is presented as a complete app design;
- a Figma component has no implementation variant, state contract, or platform behavior;
- “Variants” differ only by color, radius, or shadow and do not change visual structure or product fit;
- prototype transitions are not mapped to real routes, sheets, gestures, or recovery;
- typography wrapping, image crop, or spacing rhythm is only checked at one viewport;
- a permission, network, keyboard, back, focus, or text-scaling path is left to framework defaults;
- responsive Web is handled by shrinking desktop controls until they are unusable;
- accessibility is described as a future pass with no current semantics or focus plan;
- a redesign ignores the existing repository structure or introduces a second design system for convenience.

## Example decision

For “Build a camera game for iPhone and Android,” select `React Native / Expo` only if a shared app is intended, then combine the `camera` and `game` archetype constraints. Make the live preview/canvas the primary surface, keep capture/play controls thumb-reachable, define permission → ready → capturing/playing → reviewing/result → retry/reward states, and test interruption, orientation, denied camera access, and recognition failure. A generic five-tab shell is not the starting point; add contextual navigation only if the surrounding collection or progression flow proves it is needed.
