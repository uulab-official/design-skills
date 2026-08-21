# Design Quality Rules

## Contents

- [Token contract](#token-contract)
- [Hierarchy and layout](#hierarchy-and-layout)
- [Component state contract](#component-state-contract)
- [Accessibility and interaction](#accessibility-and-interaction)
- [Anti-patterns](#anti-patterns)
- [Quality gate](#quality-gate)

Use these rules as constraints, not as a visual theme. Pick a visual direction from the brief and brand context; keep the underlying roles and relationships stable.

## Token contract

Define semantic roles before writing screens. Values may vary by brand and platform, but role names must remain understandable.

```yaml
color:
  background: "app canvas"
  surface: "raised or grouped content"
  surface-muted: "secondary grouping"
  text: "primary readable content"
  text-muted: "supporting content"
  border: "separation and control boundaries"
  accent: "primary action and selected state"
  success: "completed or safe outcome"
  warning: "attention required"
  danger: "destructive or failed outcome"

type:
  display: "rare, high-level statement"
  heading: "section or screen title"
  body: "default readable content"
  label: "control and metadata label"
  caption: "secondary explanation"

space: [4, 8, 12, 16, 24, 32, 48, 64]
radius: [none, sm, md, lg, xl, full]
elevation: [none, subtle, floating]
motion: [none, quick, standard, expressive]
```

- Use one spacing scale and explain intentional exceptions.
- Give every color a role and explain whether it works in light, dark, high-contrast, or platform appearance variants.
- Keep typography roles distinct by purpose. Do not use a larger font merely to make a weak hierarchy feel designed.
- Use radius and elevation as grouping signals. Do not make every surface equally rounded or elevated.
- Define focus, selected, pressed, disabled, and destructive variants as semantic states.

## Hierarchy and layout

1. Identify the user's primary task and make its next action the clearest action.
2. Group content by decision or workflow, not by arbitrary component type.
3. Establish a readable container, alignment edge, and rhythm before adding decoration.
4. Keep controls near the content they affect. Put secondary actions behind contextual menus only when discoverability remains adequate.
5. Use whitespace to separate meaning. Add a card, border, or shadow only when it improves grouping or interaction affordance.
6. For dense layouts, provide progressive disclosure, filtering, sorting, or detail views instead of shrinking everything.
7. For immersive surfaces such as camera and game screens, let the primary canvas own the composition and keep chrome contextual.

## Component state contract

Every interactive component and screen must specify the states that apply:

| State | Required decision |
|---|---|
| Default | What can the user do and what is the primary action? |
| Loading | What remains stable, what is unavailable, and how long-running work is explained? |
| Empty | Why is there no content and what is the useful next action? |
| Error | What failed, what can be retried, and what information is safe to expose? |
| Offline / stale | What is cached, what is blocked, and when will sync resume? |
| Permission denied | Why is permission needed, how can it be granted later, and what still works? |
| Disabled | Why is the control unavailable and how can the user unblock it? |
| Success / confirmation | What changed, how is it verified, and what is the next action? |
| Destructive / undo | Is impact clear and is recovery possible? |

Do not show a spinner as the only loading design. Do not use an empty illustration without an explanation or action. Do not turn a recoverable error into a dead end.

## Accessibility and interaction

- Use semantic headings, labels, roles, and reading order appropriate to the platform.
- Keep visible focus and selected state perceivable without color alone.
- Meet the platform's touch-target guidance and preserve adequate spacing between adjacent actions.
- Support keyboard navigation on the web and screen-reader traversal on all platforms in scope.
- Check text scaling, Dynamic Type/font scaling, zoom, contrast, reduced motion, and orientation where relevant.
- Never make hover, color, animation, or an icon the only carrier of meaning.
- Return focus after dialogs, sheets, route changes, validation errors, and asynchronous completion.
- Use plain-language labels. Add accessible names to icon-only controls and announce important status changes.

## Anti-patterns

Stop and explain the reason if the design contains:

- gradients, glass, blur, or glow with no task or hierarchy purpose;
- a generic bottom navigation or sidebar selected before understanding the product job;
- a card inside a card inside a card without a clear grouping relationship;
- every button, tile, and container using a different radius, shadow, or spacing value;
- oversized headings that push the task below the fold;
- icon-only actions with no accessible name or discoverable tooltip/label;
- decoration that competes with camera preview, game canvas, reading surface, or primary data;
- separate component styles for the same semantic action;
- responsive behavior that only scales dimensions and does not recompose information;
- missing loading, empty, error, permission, offline, or confirmation states;
- low-contrast muted text used for essential instructions or status;
- destructive actions without scope, confirmation, undo, or recovery.

## Quality gate

Before handoff, confirm:

- The design brief and platform assumption are written down.
- The selected archetype explains the navigation and primary action.
- Tokens are implemented or mapped to the repository's existing system.
- Components expose the states that the workflow can reach.
- The target platform has been reviewed at representative sizes and input modes.
- Accessibility checks cover semantics, focus, text scaling, contrast, and reduced motion.
- The UI has at least one empty/loading/error path reviewed for every important data surface.
- Any remaining issue has severity, evidence, and a next action.
