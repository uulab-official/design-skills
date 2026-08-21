# Design Skills Architecture

## Goal

Create an open-source Codex skill that helps an agent design and implement high-quality product interfaces for the user's chosen platform, rather than generating a generic attractive screen.

## Problem

The same request can require radically different information architecture and interaction models. A community app, camera utility, immersive game, responsive SaaS dashboard, and marketing landing page should not inherit the same navigation, density, or component hierarchy. Baseline design attempts can produce plausible screen lists while skipping platform conventions, state coverage, accessibility, and a reviewable quality bar.

## Design decisions

1. Keep one discoverable root skill named `design-skills`.
2. Use progressive disclosure: keep the orchestration workflow in `SKILL.md` and move platform, archetype, quality, and review detail into `references/`.
3. Treat platform as a first-class input. Support iOS/SwiftUI, Android/Jetpack Compose, React Native/Expo, responsive Web, tablet, and cross-platform requests.
4. Treat product archetype as a first-class input. Include initial patterns for community, social, messaging, content, utility, camera, commerce, booking, productivity, health, game, SaaS, dashboard, admin, marketplace, landing, portfolio, and documentation.
5. Inspect an existing repository before proposing a redesign. Preserve working structure unless the brief or review identifies an architectural UX problem.
6. Produce a design brief and design tokens before screen implementation.
7. Require state completeness: default, loading, empty, error, offline/permission where relevant, disabled, and success/confirmation.
8. Review the result against structure, visual hierarchy, consistency, platform fit, accessibility, responsiveness, interaction states, and implementation fidelity.
9. Treat visual fidelity as a separate acceptance dimension: realistic content/assets, coherent rhythm, rendered target-size evidence, and neighboring viewport/state checks are required for a release-ready claim.
10. Keep repository inspection read-only and dependency-free by implementing a small Python standard-library script.

## Scope

### Included in v0.1

- Root skill with platform and archetype decision workflow.
- Platform profiles and selection rules.
- Archetype catalog expressed as readable YAML.
- Design quality and anti-pattern guidance.
- UI review rubric with severity levels and scoring.
- Visual fidelity reference with readiness levels and rendered-evidence gates.
- Read-only project inspection script with JSON output.
- Unit tests for the inspection script.
- OpenAI UI metadata and contributor-facing implementation/spec documentation.

### Deferred

- Separate `$mobile-app-design`, `$web-app-design`, and `$ui-review` skills.
- Screenshot generation or visual regression automation.
- Framework-specific component templates.
- Brand-specific assets, fonts, or tokens.

## Core workflow

```text
User brief
  -> target platform and device class
  -> existing project inspection (when a repo exists)
  -> product archetype and primary job
  -> information architecture and navigation
  -> design tokens and component contracts
  -> screen/state inventory
  -> implementation in the selected stack
  -> platform-specific visual, interaction, accessibility, and responsive review
```

The agent must expose the selected platform, archetype, navigation model, and key quality risks before implementation when the task is new or materially changes UX. For a small visual fix in an existing flow, it may use the existing decisions if they are discoverable and consistent.

## Output contract

For new or structurally changed work, the agent should produce:

- `Design brief`: audience, job, primary action, constraints, platform, device class, and success signal.
- `Archetype decision`: selected pattern, rejected generic patterns, and why the choice fits.
- `IA/navigation`: routes, entry points, back behavior, modal/sheet behavior, and deep-link implications where relevant.
- `Design tokens`: color roles, typography roles, spacing scale, radii, elevation/borders, motion, and semantic states.
- `Component contracts`: purpose, variants, states, content limits, interaction, accessibility label/focus behavior.
- `Screen/state inventory`: each screen's default, loading, empty, error, permission/offline, disabled, and success states as applicable.
- `Review`: findings with severity (`critical`, `high`, `medium`, `low`), evidence, and next action.
- `Visual fidelity evidence`: rendered target sizes, realistic content/assets, neighboring breakpoint/device check, and readiness level.

## Quality gates

The result is not ready when it only looks good in a static happy-path screenshot. It is ready when:

- The platform conventions and input method are visible in layout and interaction choices.
- The primary task is clear without decorative UI carrying meaning.
- The design uses one coherent token set and component language.
- Important non-default states are designed, not left to framework fallbacks.
- Keyboard, screen reader, contrast, text scaling, touch targets, focus, and reduced motion are considered for the target platform.
- Web layouts remain usable across the declared breakpoints; mobile layouts remain thumb-reachable and resilient to dynamic type.
- Implementation uses the repository's actual stack and existing conventions, or documents why a change is needed.
- Review findings are resolved or explicitly handed off with severity and evidence.
- Visual fidelity is reviewed with rendered evidence; a polished default screenshot alone never qualifies as release-ready.

## Baseline pressure findings

Three fresh agents were asked to plan a community mobile app, a SaaS web dashboard, and a camera game without this skill. Their plans were useful but tended to:

- default to familiar bottom tabs or sidebar patterns before proving the product's primary interaction;
- describe a style direction without a named token contract or component-state contract;
- mention accessibility and loading states as implementation details rather than acceptance criteria;
- suggest a framework and backend before inspecting the existing repository;
- omit a structured review score and evidence trail.

The skill addresses these failure modes with required decisions, references, and a read-only repository inspector.

## Constraints

- Do not invent a brand, assets, or data model when the brief does not provide one; use explicit assumptions.
- Do not force bottom navigation, a sidebar, cards, gradients, glass, or rounded containers without an archetype and task-based reason.
- Do not replace an existing navigation or design system solely for aesthetic preference.
- Keep `SKILL.md` under 500 lines and keep detailed variants in directly linked reference files.
- Keep the inspection script standard-library-only so contributors can run it in a fresh Python environment.
