# Originality and anti-template protocol

“AI-looking” is not a machine-detectable property. It is a **review question** about unjustified defaults, lack of a product idea, fabricated content and poor fit. The provided linter reports *candidate patterns*, never a definitive AI origin or design-quality score.

## The five non-negotiable design decisions

| Decision | Evidence needed | Weak substitute |
| --- | --- | --- |
| Product idea | At least 6 real facts: users, jobs, content, constraints, materials, original assets | A generic "modern and premium" mood |
| Composition | A section/screen shape derived from content order and target input | Every project starts with centered hero and three equal cards |
| Type | Role-based type scale that works in Korean/English/Japanese, long labels and numbers | Arbitrary large headline with random monospace captions |
| Surface | Semantic rationale for boundaries, elevation, color and motion | Gradient/glass/glow on every card |
| Proof | Real product screens, measured values, owned or rights-reviewed assets | Fake dashboard, filler avatars, generic stock collage |

## The visual originality challenge

Before implementation, answer all six questions:

1. If the name/logo were hidden, what would identify this product and not just its category?
2. Which **real** thing from the brief becomes the design motif (not an arbitrary geometric blob)?
3. What is the first job the user must finish? What composition makes it fastest or most understandable?
4. What does one competitor do, and what would be genuinely better for this user's constraints?
5. What would the layout look like with text expanded 30%, no photos, empty data or a slow network?
6. What would remain coherent if background blur, gradient, shadows and unnecessary icons were removed?

If the answer to (1) or (2) is empty, do another brief/product inventory pass **before styling**.

## Context-sensitive anti-patterns

- **Uniform card walls** are suspect on landing pages, not inherently wrong for dense admin grids, inventory or game collection screens.
- **Gradient/purple/glass** is suspect as decoration, not forbidden when brand, state or world art genuinely requires it.
- **Stock illustrations/emoji icons** are suspect when unrelated to the product, not when purposefully used for accessible cues.
- **Large blank hero space** is suspect when it hides the task; photographic editorial layouts can use substantial space intentionally.
- **Polish-only redesign** is suspect when it breaks an existing task or obscures game cues. Protect core flows.
- **Model-produced fake evidence** is always unacceptable as actual results. Label demo fixtures; never fabricate customers, ratings, reviews, orders or gameplay captures.

## Do an independent critic pass

Evaluate the **screenshot or running game** without seeing its source code first. Record:

- A one-sentence first-glance description of the hierarchy.
- A competitor-swapped/logo-hidden test with one concrete way this product differs.
- Three strongest content-specific decisions and three weak/default decisions.
- A before/after crop for each changed issue, plus how keyboard/touch/controller and localization respond.
- A 0–4 score for product character, hierarchy, information, asset craft, platform behavior and proof integrity, with named evidence and blockers.
- Only then use the static [anti-pattern candidate linter](../scripts/audit.py) for search assistance. Flags require human review; a clean report is **not** an approval.

## Three review rounds

Round 1: fix critical task, threat visibility, overflow and false information. Round 2: fix hierarchy, content density, typography, crop and inconsistent style. Round 3: refine original visual rhythm and revisit edge states. Stop when required quality gates pass and the reviewer agrees the output belongs to *this* product. Never continue indefinitely for novelty.

## Specific examples

**Web product page:** the user's real photo magnet dimensions, material reflections and before/after use-cases should drive crop and comparison. A generic "beautiful memories" headline and floating emoji icons cannot replace those facts.

**Expo inventory app:** prioritize scan/add, actual quantity with units, reserved quantity, low-stock threshold, movement history and corrective actions. A huge hero total and nine rainbow KPI cards are worse than an accurate compact worklist.

**Unity roguelike:** prioritize enemies, incoming hits and player health while moving. A complex gold-bordered HUD that hides projectiles is a failure even if its screenshot resembles premium game art.
