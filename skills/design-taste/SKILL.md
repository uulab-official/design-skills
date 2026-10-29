---
name: design-taste
description: Use when designing, building, auditing or polishing distinctive, high-fidelity UI for a website, responsive web app, SaaS dashboard, iOS/Android/Expo app, Unity/Godot/Unreal game, or browser game; especially when output feels generic, inconsistent, unfinished, AI-templated, or visually weak. Works with Codex, Claude and other agents.
---

# Design Taste — Web · App · Game

A provider-neutral visual-craft specialist for UULAB products. Its job is **distinctive but usable** work: derive an art direction from this product, build the real UI, capture it, critique the rendered result, and correct it. It complements the parent design-skills product/platform contracts; it does not replace them.

The instructions and commands below are relative to this skill folder, shown as <skill>. It can be installed independently. Do not assume that a sibling repository or a special agent/plugin exists.

## Modes and boundaries

Choose **web**, **app**, or **game** from the actual primary user task, not just the framework:

- **web**: landing pages, marketing sites, storefronts, portals, portfolios, public web pages.
- **app**: Expo/React Native, SwiftUI, Jetpack Compose, Flutter, web SaaS, dashboard, ERP, editor, or task-oriented UI.
- **game**: Unity, Godot, Unreal, browser games; gameplay HUD, menu, pause, inventory, store, tutorial, results and progression UI. The game canvas and critical cues outrank chrome.
- A web-rendered dashboard is **app**; a WebGL game is **game**. A product website showing an app uses web for the page and app for its interface fragments.
- Preserve the existing stack, routing, localization, accessibility, brand and art pipeline. Do not turn a native app into a mobile website or impose dashboard conventions on games.
- If available, consult the parent design-skills platform/archetype contracts; for games also follow the installed game-skills genre, visual-direction and UX gates; for Expo follow expo-skills UI conventions.

Read [platform guides](references/platform-guides.md) and [visual critique](references/critique.md) for the chosen mode.

## The design-and-verify run

1. **Inspect what exists.** Read repo entry screens, navigation, theme/tokens, real assets, copy, target platform, game engine version and requested task. Identify the main action, audience, target device, input methods and baseline defects. For existing work, preserve successful information architecture. Do not invent a new brand system without need.
2. **Inventory product-specific material.** Write 6–12 real facts that could not be pasted into a competitor's product: actual content, work rituals, materials, screenshots, genre, audience, constraints, numbers and original assets. Mark unknown facts as unknown. Set one sentence: “This product looks and works like ___ because ___.”
3. **Map content and states before styling.** For each screen/section, state its claim or job and evidence/action, then map default/loading/empty/error/success/offline/permission/pause/result states as relevant. Remove ornamental sections without a job, not meaningful content.
4. **Generate three directions, then choose deliberately.** The included stdlib script surfaces options from independent starting recipes, not preapproved solutions. From the installed skill folder:

   ```bash
   python3 <skill>/scripts/draw.py --platform app --brief "Expo inventory management with barcode scan and stock alerts" --seed 29 --out .design-taste/options.json
   ```

   Compare the options on task fit, hierarchy, originality, feasibility and platform constraints. Record why one wins; reject all three and author a better direction if none fits. Do not claim an option is experimentally validated. Use brand colors and assets when supplied; never randomize a fixed client's identity.
5. **Produce the design contract.** Specify visual idea, focal point, composition, navigation, semantic colors, typography scale, spacing and density, icon/imagery style, motion, accessibility, and deliberate anti-patterns. Show at least two meaningful states or route compositions. App work additionally needs platform-correct navigation and non-default states; game work needs pause/retry and readable gameplay under pressure.
6. **Implement real content.** Use native platform components and project's conventions. Replace generic placeholders with actual or clearly labeled sample content. Use original, owned or license-checked images/assets with credits where required. Don't scrape arbitrary pictures or reproduce another game's copyrighted interface. Do not add dependencies, payments or server services without need and approval.
7. **Capture the real render.** For local browser-rendered web/app/web-game surfaces, run the optional Playwright capture:

   ```bash
   node <skill>/scripts/capture.mjs --url http://127.0.0.1:4173 --platform app --out .design-taste/evidence
   ```

   Requires **Node 22+, Playwright and Chromium** already installed in the project environment (for example, `npm install -D playwright` and `npx playwright install chromium`). The command installs nothing and never sends screenshots to an API. Only capture a site you own or are authorized to review. For Expo native, use real simulator/device captures; for Unity/Godot/Unreal, use engine play/run and device gameplay footage. Browser capture cannot validate native touch, GPU performance, gameplay feel or a commercial-quality render.
8. **Judge screenshots, not imagined intent.** Inspect each image at its actual size, including target states. The script only flags observable DOM issues (overflow, broken images, tiny targets); **it cannot judge taste**. Score the dimensions in [visual critique](references/critique.md), list concrete findings with evidence, and fix the top three by impact. Repeat screenshot + critique up to three review rounds or until goals are met. If inspection is unavailable, report the evidence gap explicitly.
9. **Handoff with measured status.** Include files changed, selected rationale, before/after evidence, dimensions and input method, exercised states, accessibility checks, test commands/results, defects and next owner. Do not say “verified” without real captures and functional tests.

## Mandatory quality boundaries

- Product specificity matters more than decorative novelty. A template with new colors is still a template.
- Visual hierarchy must support the task. Games require glanceable HUD, unobstructed telegraphs, clear pause/retry and measurable device performance.
- Verify responsive recomposition, not merely proportional shrinking; account for safe areas, long Korean/Japanese/English labels and text scaling.
- Content, images, color, motion and data must be genuine or explicitly representative. No fabricated testimonials, metrics or assets.
- Accessibility is not optional: legibility, contrast, focus/keyboard or controller navigation, touch targets, non-color cues and reduced motion as applicable.
- Never self-approve a release with a screenshot alone; preserve the host repository's tests, review gates and human visual judgment.

## Handoff record

```text
Platform / archetype / task:
Chosen visual thesis and rejected alternatives:
Actual source content and license provenance:
Tokens / screens / state matrix:
Rendered captures (viewports, device, state):
Measured DOM findings and manual 0–4 scores:
Rounds and three largest fixes:
Code/tests actually executed:
Remaining high-risk findings / verification blockers:
```
