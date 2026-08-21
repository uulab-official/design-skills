# design-skills

`design-skills` is an open-source design orchestration skill for producing high-fidelity app and web work that fits its declared platform, product archetype, device class, and existing codebase.

It treats design as a product contract, not a single attractive screen:

- platform and archetype decisions happen before layout decisions;
- visual directions, tokens, component states, and responsive behavior stay explicit;
- app work includes a Figma-equivalent board, production surface, and route/state handoff;
- accessibility, loading, empty, error, offline, permission, success, and recovery states are part of the feature;
- rendered evidence is named by route, viewport, and represented state.

## Repository map

| Path | Purpose |
| --- | --- |
| [`SKILL.md`](SKILL.md) | Core orchestration skill and required workflow |
| [`references/`](references) | Platform profiles, archetypes, quality rubrics, parity notes, and benchmark fixtures |
| [`examples/community/`](examples/community) | Gather design board and runnable responsive web reference surface |
| [`scripts/`](scripts) | Dependency-light project inspection, repository validation, and evidence capture/validation |
| [`tests/`](tests) | Contract tests for the skill, reference surface, evidence, and open-source tooling |
| [`docs/superpowers/plans/`](docs/superpowers/plans) | Implementation roadmaps and design specifications |

## Run the reference surface

Install the local tooling, render the declared evidence matrix, then open the static prototype:

```bash
npm ci
npx playwright install chromium
npm run capture:community
```

Open `http://127.0.0.1:4173` after the capture command. It serves [`examples/community`](examples/community) automatically when no server is already running. The design board is [`/board.html`](examples/community/board.html); the runnable product surface is [`/index.html`](examples/community/index.html).

The capture command reads [`evidence/manifest.json`](examples/community/evidence/manifest.json), so contributor renders use the same route, viewport, and state declarations as the committed handoff. Validate the generated JPEG dimensions with:

```bash
npm run validate:evidence
npm run test:browser
npm run test:visual
```

`npm run test:browser` proves URL restoration, local font loading, search URL synchronization, composer focus return, mobile drawer focus return, and skip-link navigation in Chromium.

## Quality checks

Run the same checks used by the repository workflow:

```bash
npm run ci:quality
```

This runs the Python contract suite, evidence manifest validator, and dependency-light skill validator. Pull requests also run the browser interaction assertions, compare three representative PNG baselines with a 3% anti-alias-tolerant mismatch threshold, render the evidence matrix in GitHub Actions, and upload the generated images as an artifact for visual review. Demo imagery is checked into `examples/community/assets/editorial/` and prototype fonts are local, so the visual gate does not depend on remote assets. Update baselines only after intentional visual review with `npm run update:visual`.

The community reference surface also ships its DM Sans and Fraunces WOFF2 files in `examples/community/assets/fonts/`, with the applicable OFL text beside them. The pages load `assets/fonts.css` locally so typography remains reviewable offline and capture output is not dependent on Google Fonts availability.

## Design standard

For a new design or a structural redesign, record the platform, product archetype, primary job, navigation rationale, visual directions considered, semantic tokens, state coverage, target sizes, rendered evidence, readiness level, and open findings. For cross-platform work, use [`references/platform-parity.md`](references/platform-parity.md) to specify safe areas, system back, keyboard/focus, feedback, accessibility semantics, and native evidence requirements.

The community reference surface is intentionally `review-ready`, not `release-ready`: its responsive web implementation is rendered and tested, while native runtime, backend persistence, deployment, and analytics remain product-scope work.

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a change. The short version is: preserve the existing product decisions, add evidence for new states or viewports, run `npm run ci:quality`, and describe any remaining finding with severity, evidence, and next action.

The current roadmap is [`docs/superpowers/plans/2026-08-21-design-skills-v0.6-visual-regression-baseline.md`](docs/superpowers/plans/2026-08-21-design-skills-v0.6-visual-regression-baseline.md).
