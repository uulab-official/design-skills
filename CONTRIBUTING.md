# Contributing to design-skills

Thanks for improving the design system and its examples. This repository values product-specific decisions, rendered proof, accessible interaction states, and documentation that another contributor can execute without private context.

## Before you start

Use Node.js 22 or newer for the documented workflow, Python 3.9 or newer for the dependency-light validators, and a Chromium installation for rendered evidence.

```bash
npm ci
npx playwright install chromium
```

## Local quality loop

Run the contract suite and static validators first:

```bash
npm run ci:quality
```

When a change affects the community reference surface, regenerate the declared captures and inspect the output:

```bash
npm run capture:community
npm run test:browser
npm run validate:evidence
```

The capture tool reads [`examples/community/evidence/manifest.json`](examples/community/evidence/manifest.json). Add a manifest entry when a new route, target viewport, or state is important enough to review; do not maintain a second undocumented screenshot list. Browser assertions for important URL and focus behavior belong in `scripts/qa_community_runtime.mjs` and the manifest runtime checks.

## Design changes

Before changing a screen or reference:

1. State the target platform, device class, archetype, primary job, and navigation model.
2. Read the relevant platform profile and archetype entry in [`references/`](references).
3. Keep semantic tokens, component variants, and non-default states explicit.
4. For app work, update the board, production surface, route/state handoff, and platform parity notes together.
5. Use realistic content and inspect at least one neighboring breakpoint or input mode.

Do not call a static happy-path screenshot `release-ready`. Use the 0–4 review rubric, include evidence for the declared target environments, and leave a clear open finding when backend or native runtime work is outside scope.

## Pull requests

Keep changes focused and explain the product reason in the pull request description. Include:

- the user or product job being improved;
- the files and reference decisions changed;
- the commands run and their result;
- new screenshots or evidence manifest entries when applicable;
- remaining findings with severity, evidence, and next action.

Use clear, scoped commits such as `feat: add ...`, `fix: correct ...`, or `docs: clarify ...`. Never commit `node_modules`; it is ignored by the repository.

GitHub Actions runs `npm run ci:quality` and a separate Chromium evidence render on every push to `main` and pull request. Demo imagery is local to keep those renders stable; the rendered images are uploaded for review and are not treated as a pixel-perfect baseline until the repository has deterministic font loading and a stable cross-environment diff policy.
