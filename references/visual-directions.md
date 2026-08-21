# Visual Direction Exploration

Use this reference for open-ended high-fidelity requests, redesigns, or any brief that asks for a result “like a public Figma design.” The goal is to make visual exploration concrete without producing three cosmetic color swaps.

## Direction set contract

Create three directions before locking the production surface. One may be recommended, but all three should be credible enough to review.

Each direction must state:

```text
Name:
Visual thesis:
Personality:
Typography voice:
Color behavior:
Spatial rhythm / density:
Material and imagery treatment:
Navigation or composition change:
Best use case:
Deliberate exclusions:
```

At least four of these axes must change between directions:

- composition or navigation model;
- typography voice and scale;
- density and whitespace rhythm;
- surface/material treatment;
- imagery or icon treatment;
- contrast and color behavior;
- motion or interaction emphasis.

Changing only hue, border radius, shadow, or illustration is not a meaningful direction.

## Board format

The design board should show:

1. a compact visual preview for each direction;
2. the product job and invariant constraints shared by all directions;
3. direction-specific tags and best-use guidance;
4. the selected direction mapped to foundations, components, screen set, and states;
5. a route to the working production surface.

Keep the unselected directions in the board or handoff. They are useful design rationale and prevent later visual drift back to a generic default.

## Selection rule

Select the direction that best serves the product job and target platform, not the one with the most decoration. Score each option from 0–4 on:

| Dimension | Question |
| --- | --- |
| Product fit | Does the visual language reinforce the primary task and archetype? |
| Hierarchy | Can users see what matters and what to do next? |
| Distinctiveness | Is the option recognizably different from the other directions? |
| System potential | Can the direction support screens, components, and non-default states? |
| Platform fit | Does it recompose correctly for the declared viewport and input mode? |

Record the selected direction and the reason in the design spec. Do not let the board become a gallery disconnected from the implementation.

## Production parity

After selection, map the direction to semantic tokens and reusable primitives. The production surface must implement the selected direction across at least three meaningful screens and the states that change user decisions. The other directions remain exploratory references; they do not need separate production routes unless the brief explicitly asks for themes or personalization.
