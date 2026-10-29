# Design reference research — Web · App · Game

Research date: **2026-10-29**. This is a deliberately *curated research index*, not a downloaded reference archive or a claim that we have reverse-engineered the visual content of each linked example. See [the machine-readable source registry](../library/reference-sources.json). Check current terms, screenshots and implementation details yourself before using a reference for a production project.

## How to use references without making a clone

1. Name the user task, device and information hierarchy before looking at examples.
2. Select **two distinct sources**: one for actual end-to-end product/user-flow evidence, one for interaction/implementation quality. Web editorial work may compare two site galleries instead.
3. Record **two decisions per reference** (why composition, hierarchy or feedback works), and **one decision not to copy** (brand identity, artwork, distinctive copy or layout).
4. Translate those decisions into an *original* product-specific composition. Ground every choice in the user's real content or assets.
5. Keep a source log in the design handoff: URL, date reviewed, what was learned, original implementation, attribution and rights status for any proposed imported material.
6. Compare the rendered output against the brief, not just against the reference screenshot. It should retain the task value but lose the source's recognizable identity.

## Web: distinctive composition without decorative filler

| Source | What to study | Never infer |
| --- | --- | --- |
| [Awwwards](https://www.awwwards.com/websites/) | Deliberate composition, interaction choreography, type rhythm | That award sites are always usable or fast |
| [SiteInspire](https://www.siteinspire.com/) | Editorial grids, material/color hierarchy, photography treatment | Permission to reuse images |
| [One Page Love](https://onepagelove.com/) | Focused conversion narrative, proof and action sequence | A mandatory hero → 3 cards → CTA structure |

Prefer a true product demo, measured material detail, living utility, real inventory or a genuinely useful decision table over decorative animated blobs. Do **not** ban gradients or cards wholesale; they are valid when they communicate meaning.

## Apps: reference *shipped flows*, not a single pretty screen

| Source | What to study | Important distinction |
| --- | --- | --- |
| [Mobbin](https://mobbin.com/) | Onboarding, settings, empty/error, navigation and mobile hierarchy | Third-party screenshots are reference-only |
| [Refero](https://refero.design/) | SaaS admin, search, tables, subscriptions and product behavior | Source UI is not an asset library |
| [Page Flows](https://pageflows.com/) | Full flows and error/recovery | Confirm screen currency before basing flows on it |
| [IBM Carbon](https://github.com/carbon-design-system/carbon) | Enterprise density, scale and semantic tokens | Apache-2.0 repo; inspect dependencies/assets |
| [Adobe React Aria](https://github.com/adobe/react-spectrum) | Robust keyboard, touch, accessible interactions and i18n | Interaction foundation, not a fixed art direction |
| [Radix Primitives](https://github.com/radix-ui/primitives) | Composable UI states and focus | A primitive is not a designed product |
| [shadcn/ui](https://github.com/shadcn-ui/ui) | Editable component ownership and consistent variants | Default component layout can become repetitive |
| [Fluent UI](https://github.com/microsoft/fluentui) | Accessible dense workflows and cohesive feedback | Fit platform context before choosing library |

Real software has believable data, state, navigation, undo, focus and error handling. Exposing those details is a stronger sign of craft than decorative complexity.

## Games: engine-verified, gameplay-first design

| Source | What to study | What not to claim |
| --- | --- | --- |
| [Game UI Database](https://www.gameuidatabase.com/) | Existing games' menu, HUD, inventory and results hierarchy | No rights to third-party screenshots/art |
| [Unity UI Toolkit code examples](https://github.com/Unity-Technologies/ui-toolkit-manual-code-examples) | UXML/USS, reusable runtime controls and lists | Example snippets are not complete playable projects |
| [Godot official demos](https://github.com/godotengine/godot-demo-projects) | Control nodes, input mapping and GUI patterns in real engine demos | Browser exports are not native performance proof |
| [Godot UI documentation](https://docs.godotengine.org/en/stable/tutorials/ui/index.html) | Layout, themes, scalable interfaces | Actual UI must be tested in its pinned engine |

Design the actual play condition: 15 enemies, projectiles, low health, inventory full, combo break, pause, controller focus. Review footage at speed and in reduced-motion and localization states. **Gameplay readability outranks illustration density**.

## Evidence and licensing

- [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines): useful implementation-review questions for semantics, keyboard, focus, images and animation.
- [Playwright visual comparison docs](https://playwright.dev/docs/test-snapshots): same-host/browser baselines and reproducible screenshot comparison; not a subjective design verdict.
- [axe-core](https://github.com/dequelabs/axe-core): automated accessibility engine (MPL-2.0); not a complete substitute for human/assistive-technology testing.
- External galleries and live product screenshots are **research-only**. MIT/Apache licenses for some code repositories do not mean their brands, product screenshots, samples and fonts are automatically reusable.
- No source code, third-party screenshot, logo, icon, font or image is copied into design-taste by this update. Existing Taste Skill code also remains separate; workflow concepts are independently implemented.
- Do not auto-scrape inspiration galleries or build downloadable corpora without explicit rights and site-terms review.
