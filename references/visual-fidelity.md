# Visual Fidelity and Design Completeness

## Contents

- [What complete means](#what-complete-means)
- [Visual direction contract](#visual-direction-contract)
- [Fidelity loop](#fidelity-loop)
- [High-fidelity acceptance checklist](#high-fidelity-acceptance-checklist)
- [Readiness levels](#readiness-levels)
- [Shortcuts that fake completeness](#shortcuts-that-fake-completeness)

Use this reference when the user asks for a polished, production-quality, pixel-conscious, premium, beautiful, or high-fidelity result, or when a static implementation looks plausible but unfinished. Visual fidelity means the implementation expresses the intended hierarchy, rhythm, content, interaction, and platform behavior consistently at the target sizes. It does not mean copying a screenshot without understanding the product.

## What complete means

A design is complete only when all six layers agree:

1. **Product structure** — the user can understand the job, scope, primary action, and next step.
2. **Visual system** — typography, color, spacing, shape, imagery, iconography, elevation, and motion form one intentional language.
3. **Content realism** — the UI works with real labels, long names, missing images, varied numbers, localization pressure, and meaningful empty states.
4. **Interaction states** — pressed, focused, selected, disabled, loading, empty, error, offline/permission, success, and recovery states are designed with the same care as default.
5. **Platform behavior** — safe areas, back/focus/keyboard, touch or pointer input, responsive recomposition, text scaling, and system appearance match the target.
6. **Evidence** — the rendered result has been inspected at declared target sizes and findings are recorded, fixed, and rechecked.

If a layer is unknown, label the work `implementation-ready` or `not verified`; do not call it `release-ready`.

## Visual direction contract

Before building a polished screen, write a compact direction contract:

```text
Visual thesis: <one sentence describing the experience>
Personality: <three to five adjectives>
Hierarchy: <what owns attention, what supports it, what recedes>
Typography voice: <role, weight, line-height, casing, number treatment>
Color behavior: <surface contrast, accent role, semantic status behavior>
Spatial rhythm: <container, grid, spacing scale, density>
Material behavior: <flat, bordered, elevated, translucent, or immersive; why>
Image/icon treatment: <crop, aspect ratio, icon family, fallback behavior>
Motion behavior: <what moves, why, duration family, reduced-motion fallback>
Deliberate exclusions: <visual trends or patterns rejected and why>
```

Use this contract to keep a multi-screen product from becoming a collection of attractive but unrelated shots. If the project has brand guidelines or an existing design system, map the contract to them instead of inventing a competing visual language.

## Fidelity loop

Run the loop for the primary flow and one representative edge state:

1. **Use real content.** Replace lorem ipsum, generic avatars, random icons, and placeholder imagery with supplied assets or explicit realistic fixtures. Preserve the longest important label and a meaningful short label.
2. **Lock the layout system.** Define container width, alignment edges, columns, spacing, typography roles, and responsive recomposition before polishing individual cards.
3. **Implement semantic primitives.** Build buttons, fields, navigation, cards, banners, overlays, and empty/loading/error primitives from the token contract. Do not tune each screen with one-off values.
4. **Render at target sizes.** Use the actual browser, simulator, device, or supported preview. Inspect the declared desktop/mobile/tablet sizes and both relevant input modes.
5. **Compare by hierarchy.** Check silhouette, alignment, rhythm, text wrapping, asset crop, control reachability, contrast, and state feedback. Fix structural drift before decorative polish.
6. **Check content stress.** Test long titles, missing images, large numbers, no results, slow data, failed actions, text scaling, zoom, and keyboard/safe-area changes.
7. **Re-render after fixes.** Record what changed and verify that the fix did not create a new inconsistency in another route or breakpoint.

When visual capture or runtime rendering is unavailable, inspect the implementation and state the missing evidence. Do not turn an unrendered implementation into a confident visual-quality claim.

## High-fidelity acceptance checklist

### Composition and hierarchy

- [ ] The first viewport communicates the primary job and action without explanation.
- [ ] Alignment edges, container widths, columns, and spacing repeat intentionally.
- [ ] Text hierarchy survives realistic content and does not depend on oversized headings.
- [ ] Primary, secondary, destructive, and quiet actions have distinct but consistent emphasis.
- [ ] Decorative treatments never compete with the primary surface, canvas, content, or data.

### Tokens and components

- [ ] Typography, spacing, color, radius, border, elevation, and motion come from semantic roles.
- [ ] The same semantic action uses the same component variant across routes.
- [ ] No arbitrary per-screen values remain without a documented reason.
- [ ] Focused, pressed, selected, disabled, loading, success, and destructive states are visually legible.
- [ ] Icons have a consistent family, optical weight, size, and accessible name.

### Content and assets

- [ ] No lorem ipsum, placeholder copy, placeholder icons, or random stock imagery remains in the reviewed flow.
- [ ] Image aspect ratios, crop positions, fallbacks, loading, broken-media, and alt/accessible labels are intentional.
- [ ] Long labels, empty content, missing metadata, large numbers, and localization expansion do not collapse layout.
- [ ] Copy uses one voice and gives controls, errors, permissions, and confirmations specific meaning.

### Platform and responsive behavior

- [ ] The target platform's navigation, back/focus, safe-area, keyboard, pointer/touch, and system appearance behavior is tested.
- [ ] Responsive layouts recompose information instead of only shrinking it.
- [ ] Target viewports and one intermediate failure width have been rendered and reviewed.
- [ ] Touch targets, keyboard focus, text scaling/zoom, contrast, reduced motion, and screen-reader semantics are covered.
- [ ] Permission, offline, interruption, orientation, and deep-link behavior are defined where relevant.

### Evidence and handoff

- [ ] The review records target sizes, route/state, evidence source, findings, and next actions.
- [ ] Structural and high-severity findings are fixed before polish is declared complete.
- [ ] The same change is checked in at least one neighboring screen or breakpoint.
- [ ] The handoff records what is rendered and verified versus what remains an assumption.

## Readiness levels

| Level | Meaning | Allowed claim |
|---|---|---|
| Concept | Direction and structure are proposed; implementation is incomplete | “Concept” or “direction” |
| Implementation-ready | Tokens, components, screens, and states are specified enough to build | “Ready to implement” |
| Review-ready | The primary flow renders, but findings or target coverage remain | “Review-ready; findings remain” |
| Release-ready | Target environments and states were rendered, reviewed, and no blocking/high issues remain | “Release-ready” |

Release-ready requires no unresolved `critical` or `high` finding, no in-scope rubric dimension below 3, and evidence for the declared target platform and representative states. A polished-looking default screen is not sufficient.

## Shortcuts that fake completeness

| Shortcut | Why it fails | Required correction |
|---|---|---|
| Add a gradient, glass, or glow to every surface | Decoration hides weak hierarchy and creates visual noise | Explain the material role or remove it |
| Use one screenshot as proof | A screenshot cannot prove states, responsive behavior, or accessibility | Render the target matrix and walk edge states |
| Tune each screen independently | Local polish creates drift in spacing, type, and component behavior | Fix the token or primitive once and propagate it |
| Keep placeholder content until the end | Real text and assets change wrapping, density, and hierarchy | Use realistic fixtures from the first polished pass |
| Shrink desktop UI for mobile | The information architecture remains wrong at the new input size | Recompose navigation, controls, and content hierarchy |
| Call missing states “backend work” | Users experience the state in the UI regardless of ownership | Design the state contract and hand off the data dependency |
