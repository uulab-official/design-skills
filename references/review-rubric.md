# UI Review Rubric

Use this rubric after implementation or when auditing an existing product. Score only what has evidence in the repository, rendered UI, or a reproducible interaction. A score is not a substitute for findings.

## Dimensions

Score each dimension from 0 to 4:

| Score | Meaning |
|---:|---|
| 0 | Missing, broken, or creates a blocker |
| 1 | Present only in the happy path; major usability risk |
| 2 | Usable but inconsistent, incomplete, or platform-weak |
| 3 | Solid and coherent with minor gaps |
| 4 | Deliberate, tested, and robust across relevant states/platforms |

| Dimension | Inspect |
|---|---|
| Product structure | The primary job, information hierarchy, route depth, and content model are clear |
| Navigation | Entry points, back behavior, tabs/sidebar/sheets, deep links, and scope are predictable |
| Visual hierarchy | Typography, spacing, alignment, density, and primary action communicate priority |
| Consistency | Tokens, component variants, states, copy, icons, radius, and elevation are coherent |
| Platform fit | Input model, system behavior, native conventions, safe areas, and responsive composition fit the target |
| State completeness | Loading, empty, error, offline/stale, permission, disabled, success, and recovery paths exist |
| Accessibility | Semantics, focus, screen reader, keyboard/touch targets, contrast, scaling, and reduced motion are covered |
| Interaction quality | Feedback, validation, latency, interruption, undo, and error recovery are understandable |
| Implementation fidelity | The code follows the repository stack, keeps component boundaries coherent, and avoids visual drift |

## Severity

- `critical`: blocks the primary task, risks data/privacy/safety, or makes a platform interaction unusable.
- `high`: affects a common task, navigation model, state recovery, accessibility, or major visual hierarchy.
- `medium`: creates recurring confusion or inconsistency but has a workable path.
- `low`: polish or isolated inconsistency that does not change task success.

## Review procedure

1. Establish the target platform, device sizes, user job, and flows in scope.
2. Inspect the repository and identify the actual route/component/token implementation.
3. Walk the primary happy path once without stopping for polish.
4. Walk the highest-risk alternate paths: first use, empty data, slow network, error, permission denied, offline/stale, text scaling, keyboard, and back/interrupt behavior as applicable.
5. Score all dimensions and record evidence. Do not average away a `critical` or `high` issue.
6. Fix the smallest structural issue that removes multiple downstream inconsistencies, then re-check the affected flows.

## Report format

```text
Target: <platform + device/browser sizes>
Archetype: <selected archetype>
Flow: <reviewed user job>

Scores:
- Product structure: <0-4>
- Navigation: <0-4>
- Visual hierarchy: <0-4>
- Consistency: <0-4>
- Platform fit: <0-4>
- State completeness: <0-4>
- Accessibility: <0-4>
- Interaction quality: <0-4>
- Implementation fidelity: <0-4>

Findings:
- [critical|high|medium|low] <short title>
  Evidence: <screen, route, state, or reproducible action>
  Next action: <specific fix or follow-up>
```

## Ready threshold

Do not declare a design ready when any in-scope dimension scores 0 or 1, or when an unresolved `critical`/`high` finding affects the primary task. A score of 3 is a reasonable first release target; a 4 requires evidence across relevant states and target environments, not visual preference.
