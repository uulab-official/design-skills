---
name: design-taste
description: Use when designing, building, auditing or polishing distinctive, high-fidelity UI for a website, responsive web app, SaaS dashboard, iOS/Android/Expo app, Unity/Godot/Unreal game, or browser game; especially when output feels generic, inconsistent, unfinished, AI-templated, or visually weak. Works with Codex, Claude and other agents.
---

# Design Taste — Web · App · Game

Original UULAB visual craft workflow: replace category-average layout decisions with **task-, content- and platform-derived decisions**, test them in real renders and preserve actual state/interaction quality. This skill can be installed independently. It complements parent `design-skills` product/platform contracts, `expo-skills` implementation and `game-skills` runtime/art quality gates; it does not replace them.

The term **AI-looking** describes a potentially anonymous or over-templated result, *not the method or identity of its author*. Our audit reports candidate patterns for review; it cannot diagnose AI authorship or score visual beauty.

Paths in commands below are relative to this skill folder, shown as `<skill>`. Node/browser/editor tools are optional and must already exist in the project.

## 0. Route by user job, not by programming language

- **web:** marketing pages, public sites, portfolios, product pages, storefronts, conversion flows and document/utility pages.
- **app:** Expo/React Native, SwiftUI/Android, Flutter, web SaaS, analytics dashboards, ERP, editors and task-oriented workspaces. A web-rendered dashboard is an *app*.
- **game:** Unity, Godot, Unreal, WebGL/browser games; in-play HUD, pause, inventory, menus, tutorial, rewards, world information and results. A WebGL game is a *game*, not a marketing site.
- A product site that embeds an app screenshot uses **web** for the site and **app** for its inner interface. Preserve platform-specific behavior.
- Read [platform-specific evidence rules](references/platform-guides.md), [visual critique rubric](references/critique.md) and [originality protocol](references/originality.md). For source research, use [the researched source index](references/research.md).

## 1. The inspect → research → decide → build → verify loop

### A. Inspect and inventory the real product

Inspect the existing repository, navigation, component primitives, theme, project architecture, real content and asset rights. For Unity/Godot/Unreal verify the pinned engine version and actual gameplay format; for mobile confirm safe areas and input modes. Preserve working project conventions, source components and brand rather than replatforming them.

Write a **6–12 fact inventory**: specific audiences, tasks, constraints, original media, measurements, quantities, story, real screens and failure conditions. Do not invent numbers, reviews, testimonials, device captures, assets or shipped features. Name the primary job and product promise in a plain sentence.

### B. Research with two different kinds of reference

Choose a gallery or existing shipped-product reference *plus* an implementation/accessibility reference from [the curated registry](library/reference-sources.json). Compare **why** the reference works: content organization, focal point, rhythm, density, key interaction, state/recovery and input modality. Write what you refuse to copy (brand, artwork, text, exact layout). Reference research may require the agent's normal browser tools; the included CLI **does not fetch or scrape external sites**.

Third-party screenshots are only for observation. Do not reuse external logos, licensed photos, icon families, proprietary games, fonts or code without a separate file-level license and attribution review. Study guides and open-source source code have different rights from proprietary products/screenshots.

### C. Deal 3 visibly different original directions

Run the offline, dependency-free selector from the target project root:

```bash
python3 <skill>/scripts/draw.py --platform web \
  --brief "UULAB original 52 mm photo magnets sold online" \
  --primary-job "Compare sizes, see finish, order" \
  --fact "The round aluminum frame is 52 mm in diameter" \
  --fact "Customer photo may not be stretched or altered" \
  --fact "The product has a reflective metal finish" \
  --brand "UULAB" --out .design-taste/directions.json
```

Use `--platform app` for Expo/native or dashboard; `--platform game` for Unity/WebGL. `--context <path.json>` accepts additional `facts`, `primary_job`, `brand`, `audience`, `constraints` and `avoid`. Explicit `--force` is required to overwrite an existing direction sheet.

The selector combines **15 baseline directions and 24 distinct original craft moves** to produce 3 different *structural* choices, not 3 random color palettes. Each choice includes an original composition, focal element, state stress tests, observed-fact inputs, exclusions and critique question. The 18-source index suggests where to study. These are **unverified direction prompts**; the agent must compare task fit, platform, originality and feasibility, then reject/revise unsuitable options. Preserve any existing brand tokens.

### D. Write the direction contract before styling

Record the product-specific motif, one dominant task, primary/secondary information order, composition, number scale, semantic tokens, typography and multilingual expansion, actual imagery/art, motion rationale and accessibility. Explain the reason for every glow/blur/shadow/card pattern instead of adopting a blanket ban. Avoid anonymous "feature card walls" **only when** their repetition does not match content; a dense inventory grid, kanban, character collection or tactical screen can legitimately use repetition.

Provide content and state coverage: normal, empty, busy, failure, offline/permissions, back/undo and platform-specific interruption. For a game also document enemy threat, low-health, pause, death/retry, controller and locale-stress capture.

### E. Build the functional surface in the actual stack

Create a real vertical slice, not only a mockup. Reuse existing tokens and composable native controls. Web/app work must include valid input, action, result and recovery; game UI must not obscure the playfield or enemy telegraphs. Use owned/rights-cleared images and consistent actual copy. A polished screenshot with fake controls or fabricated business data is not production-ready.

### F. Audit *candidate patterns* in local UI files

```bash
python3 <skill>/scripts/audit.py --path . --platform web --json
# For release-blocking broken placeholder links/content, not subjective style:
python3 <skill>/scripts/audit.py --path src --platform app --strict
```

The offline auditor reports `file:line` for generic slogans, placeholder copy, empty click handlers, dead links, suspicious landing-page card rows and heavy decorative density. Dashboard card grids and game repetition are **not automatically condemned**. Findings are review candidates; subjective warnings never fail `--strict`. A clean linter result is not evidence of good design.

### G. Capture the *real* route/state/viewport matrix

For **authorized local** browser-rendered surfaces, use Playwright + installed Chromium and Node 22+ (installed in the **host project**, no key/API or cloud required):

```bash
node <skill>/scripts/capture.mjs --url http://127.0.0.1:4173 \
  --platform app --out .design-taste/evidence
# Multi-route and non-happy-path states; customize the example manifest first:
node <skill>/scripts/capture.mjs --url http://127.0.0.1:4173 \
  --platform app --manifest <skill>/examples/capture-matrix.example.json \
  --out .design-taste/evidence --force
```

The [example manifest](examples/capture-matrix.example.json) is a **schema example**, not a working route set for your product. Its `screens` define route, state label, explicit viewport sizes and optional expected text. Screenshots and JSON findings are written locally. DOM checks report horizontal overflow, broken images, missing screen content, unlabeled controls and small touch targets. Use `--force` only after reviewing existing evidence. External URLs are blocked unless authorized and explicitly passed with `--allow-remote`.

**Native Expo:** real simulator/device captures, back/keyboard/safe-area/gesture and accessibility tests. **Unity/Godot/Unreal:** pinned editor/target builds, game footage at speed, input and performance proof. Browser DOM capture cannot validate native or game canvas pixels, performance or subjective polish.

### H. Independent critique and at most 3 measured correction rounds

Open the actual screenshots and game footage **before reading the implementation intent**; follow [the 9-pass visual rubric](references/critique.md) and [the anti-template protocol](references/originality.md). Apply a logo-hidden/competitor-swapped test, compare content-specific hierarchy, check localization and reduced-motion. Score product character, hierarchy, information, art craft, platform interaction, responsiveness and evidence integrity on an observed 0–4 scale.

Fix the three highest-impact issues, recapture changed states *and a neighboring viewport*, and repeat up to three rounds. Fix real functionality and readability before decoration. A polished state is not a release gate without functional, device and human review.

## Required handoff

```text
Platform / native engine or browser / pinned version:
User job, factual product inventory and brand constraints:
Research URLs and lessons (what intentionally NOT copied):
Three structural options and chosen direction rationale:
Information hierarchy, token system, asset/license provenance:
Screens, routes, inputs and stress states:
Files implemented and actual tests run:
Before/after screenshot or gameplay evidence (target sizes and runtime):
DOM candidate findings / independent 0–4 critique results:
Three most important changes and regressions checked:
Blockers, unverified dimensions and next owner:
```

Do not claim automated aesthetic verification, real playable quality, accessibility certification, high-end visuals or release readiness from a static code check. Follow the host repository's release requirements and require real runtime evidence.
