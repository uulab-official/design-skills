---
name: design-skills
description: Use when designing, implementing, redesigning, or reviewing an app or website UI that must fit a declared platform, product type, device class, or existing project and reach a high-fidelity, production-ready finish; especially when generic screens, inconsistent design systems, placeholder content, missing states, weak responsive behavior, or poor accessibility are risks.
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
- Treat visual fidelity as an acceptance requirement: real content, coherent rhythm, rendered target-size evidence, and state-by-state inspection are required for a release-ready claim.
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

Read [platforms.md](references/platforms.md) for the selected target. Read the matching entry in [archetypes.yaml](references/archetypes.yaml) and use its `primary_job`, `navigation`, `primary_action`, `interaction_mode`, `density`, required states, and review questions.

Reject a generic pattern when it conflicts with the primary interaction:

- Camera: let the preview and capture controls own the composition.
- Game: let the canvas, HUD, controls, pause, and result flow own the interaction.
- Messaging: optimize conversation context and send/retry states.
- Dashboard/admin: optimize scope, filters, data density, and inspection rather than decorative cards.
- Landing/portfolio: optimize narrative, proof, and one clear conversion/contact action.
- Utility: minimize navigation and get to the focused task quickly.

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

Read [visual-fidelity.md](references/visual-fidelity.md) when the user asks for polished, premium, beautiful, pixel-conscious, production-ready, or high-fidelity work. Before screen polish, write a visual direction contract covering visual thesis, personality, hierarchy, typography voice, color behavior, spatial rhythm, material behavior, imagery/icon treatment, motion, and deliberate exclusions.

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

### 7. Implement in vertical slices

Build the smallest complete user journey first: entry → primary task → feedback/result → recovery or next step. Keep component boundaries aligned to semantic behavior, not screenshot rectangles. Reuse the token system and component states across screens. Validate with realistic content, long labels, no data, slow data, failed actions, text scaling, and at least one neighboring route or breakpoint while implementing. Re-render after structural changes and fix hierarchy drift before decorative polish.

### 8. Review and iterate

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
Archetype / primary job:
Navigation decision:
Design-system source:
State coverage:
Visual direction:
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
- typography wrapping, image crop, or spacing rhythm is only checked at one viewport;
- a permission, network, keyboard, back, focus, or text-scaling path is left to framework defaults;
- responsive Web is handled by shrinking desktop controls until they are unusable;
- accessibility is described as a future pass with no current semantics or focus plan;
- a redesign ignores the existing repository structure or introduces a second design system for convenience.

## Example decision

For “Build a camera game for iPhone and Android,” select `React Native / Expo` only if a shared app is intended, then combine the `camera` and `game` archetype constraints. Make the live preview/canvas the primary surface, keep capture/play controls thumb-reachable, define permission → ready → capturing/playing → reviewing/result → retry/reward states, and test interruption, orientation, denied camera access, and recognition failure. A generic five-tab shell is not the starting point; add contextual navigation only if the surrounding collection or progression flow proves it is needed.
