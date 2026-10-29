# Visual critique and anti-template review

Critique the **rendered screenshot or real gameplay footage**, not the JSX, CSS, prefab hierarchy or design notes. Good static checks can find defects; they cannot substitute for product, visual and player judgment.

## Nine visual passes

1. **One-second purpose:** Can an unfamiliar user tell what the screen is for and where to act? For games, what is the current state and immediate threat?
2. **Product specificity:** Hide the logo. Could this same layout and imagery belong to a rival product or a different genre? Name one distinctive product-derived decision.
3. **Hierarchy:** Squint to see large visual masses. Identify primary, secondary and tertiary emphasis; correct equal-weight card walls and sidebars.
4. **Rhythm and alignment:** Compare alignment, density, breathing room, edge gutters and screen-to-screen continuity. Check intentional asymmetry rather than mechanical centering.
5. **Typography and language:** Actual Korean, Japanese and English labels, size scaling, text overflow, long numbers, line breaks and contrast. Use a coherent semantic type scale.
6. **Imagery and asset craft:** Image source/credit, crop, silhouette, texture, lighting, icon family, replacement placeholders, source licensing. No mismatched stock collage.
7. **Interaction and state:** Is the active action obvious? Do loading, zero-data, offline, error, disabled, pause, interrupted and result states still look intentional?
8. **Device behavior:** Recomposition, pointer/touch/controller affordances, safe areas, focus order, reduced motion, accessibility, in-game telegraphs and HUD at full speed.
9. **Visual truth:** Are charts/units meaningful, screenshots from the actual product, photos licensed, gameplay effects possible on real hardware, and proof attributable?

## Scoring (0–4 on each dimension)

| Dimension | 0 — broken | 2 — adequate but weak | 4 — distinctive and proven |
| --- | --- | --- | --- |
| Product character | Generic/unrelated | Some meaningful product traits | Recognizably derived from real product content |
| Composition and hierarchy | Unclear action, clutter | Works but inconsistent | Intentional across screens and states |
| Type and information | Unreadable/misleading | Functional with weak rhythm | Legible, accurate, carefully composed |
| Asset and color craft | Broken/mismatched | Coherent but generic | Original/credited, purposeful and systematized |
| Platform UX and access | Broken input/recovery | Partial platform behavior | Tested focus, safe area, state and response |
| Responsive and runtime | Clipped/nonfunctional | One proven target | Representative target sizes and input modes tested |
| Evidence integrity | Claimed without proof | Some captures, gaps remain | Real captures, commands, limitations documented |

Use observed evidence and give the reason for each score, not a number alone. Never call **release-ready** if any in-scope dimension is below 3, any critical/high issue is open, or required native/game runtime review is missing. A high design score never overrides a failed gameplay or product gate.

## Fix order and stopping rule

- **P0 critical:** blocks primary action, data safety, basic navigation or game-critical cue. Fix before cosmetic issues.
- **P1 high:** confusing hierarchy, inaccessible controls, broken state/recovery, invisible critical HUD cues, broken mobile layout.
- **P2 medium:** spacing/typography inconsistency, generic imagery, weak alignment, excessive decoration.
- **P3 low:** isolated fine craft polish.

Fix at most three highest-impact issues per review round, re-render the changed state plus a neighbor viewport, compare before/after, and repeat up to three review rounds. Do not make a continuous polishing loop a substitute for shipping core functionality. Record unresolved findings.

## Automated versus subjective evidence

`scripts/capture.mjs` reports basic DOM failures and saves screenshots from **an authorized local browser session only**. It cannot certify visual beauty, real device performance, accessibility compliance or native game feel. An absent report is **not verified**, not a clean bill of health. Store evidence locally and redact sensitive user data before sharing.
