# Design Skills v0.3 Contributor Automation Roadmap

> **Status:** In progress. The contributor quality loop and rendered evidence workflow are implemented; pixel-diff policy, backend integration, and native runtime remain scope-dependent follow-ups.

## Goal

Make the design-quality contract easy to run in a clean checkout and easy to review in an open-source pull request without overstating what a static reference surface proves.

## Roadmap

### 1. Reproducible quality commands

- [x] Add `npm run ci:quality` for tests, evidence validation, and skill validation.
- [x] Keep the browser capture command manifest-driven and write only to `examples/community/evidence/`.
- [x] Document Node, Python, and Chromium prerequisites.

### 2. Open-source contribution path

- [x] Add a repository README that explains the skill, example surface, quality contract, and readiness boundary.
- [x] Add contributor guidance for design changes, evidence updates, review findings, and pull requests.
- [x] Add contract tests for the package scripts, workflow, and public documentation.

### 3. CI-rendered visual review

- [x] Run contract checks on pushes to `main` and pull requests.
- [x] Render the declared community viewport matrix in a separate Chromium job.
- [x] Upload generated evidence as a short-retention artifact for human visual review.
- [ ] Establish a cross-environment pixel-diff baseline and threshold after font/image sources are deterministic.

### 4. Scope boundaries

- [x] Keep the example below `release-ready` while backend persistence, deployment, and native runtime are not implemented and evidenced.
- [ ] Add backend/runtime integration only when a real product target and data contract are in scope.
- [ ] Add iOS/Android simulator evidence only when native targets are in scope.

## Exit gate

The v0.3 contributor loop is complete when a clean checkout can run the documented quality commands, a pull request receives both contract results and rendered evidence, and every remaining product-scope limitation is visible in the readiness record.
