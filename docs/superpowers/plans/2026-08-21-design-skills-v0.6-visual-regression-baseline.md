# Design Skills v0.6 Visual Regression Baseline Roadmap

> **Status:** Complete for the community reference surface. The gate is intentionally representative and anti-aliasing tolerant; full-page review remains human-led.

## Goal

Make visual drift observable in an open-source pull request without turning platform-specific text rasterization into false failures.

## Roadmap

### 1. Representative baseline

- [x] Capture prototype desktop, prototype mobile, and design-board desktop viewport PNGs.
- [x] Keep baselines local to the repository beside the committed full-page JPEG evidence.
- [x] Wait for local fonts and disable animation, transitions, and caret rendering before comparison.

### 2. Comparison policy

- [x] Compare PNGs with `pixelmatch` while ignoring anti-aliased edge pixels.
- [x] Fail when mismatch exceeds the documented 3% ratio or when dimensions change.
- [x] Refuse baseline updates in CI; require the explicit local `npm run update:visual` command.

### 3. Contributor workflow

- [x] Add `npm run test:visual` to the Chromium quality job.
- [x] Upload baselines with the rendered evidence artifact for review context.
- [x] Add contract coverage and document when a baseline update is justified.

## Exit gate

The v0.6 visual slice is complete when a clean checkout can compare the representative screens, report a useful mismatch ratio, and preserve human review for the full-page evidence matrix.
