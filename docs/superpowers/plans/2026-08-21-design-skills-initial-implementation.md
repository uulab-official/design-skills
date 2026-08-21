# Design Skills Initial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and validate the first open-source `design-skills` Codex skill for platform-aware app and web product design.

**Architecture:** Use one root `SKILL.md` as the discoverable orchestrator and keep variant knowledge in directly linked reference files. Add one read-only, standard-library Python inspector plus unit tests so the skill can ground decisions in an existing repository without relying on a framework or external dependency.

**Tech Stack:** Markdown, YAML data, Python 3 standard library, `unittest`, Codex skill metadata.

**Spec:** `docs/superpowers/specs/2026-08-21-design-skills-design.md`

## Global Constraints

- The skill name is `design-skills` and all names use lowercase hyphen-case.
- `SKILL.md` contains orchestration and selection rules; detailed variant guidance lives in `references/`.
- Repository inspection is read-only and dependency-free.
- New work must declare platform, archetype, IA/navigation, tokens, and state coverage before implementation.
- Review findings use `critical`, `high`, `medium`, or `low` severity and include evidence plus a next action.
- Do not add README, changelog, or installation-guide files; the skill folder contains only runtime instructions, references, scripts, tests, and required project docs.

### Task 1: Define the inspector's failing behavior

**Files:**
- Create: `tests/test_inspect_project.py`
- Create: `tests/fixtures/sample-expo/package.json`
- Create: `tests/fixtures/sample-expo/app/(tabs)/index.tsx`
- Create: `tests/fixtures/sample-expo/src/components/Button.tsx`
- Create: `tests/fixtures/sample-expo/src/navigation/routes.ts`

**Interfaces:**
- Produces the contract for `scripts/inspect_project.py --path <directory> --json`.

- [ ] **Step 1: Write the failing test**

  Use `unittest` and a subprocess-free import of the future module. Assert that `inspect_project(path)` returns a dictionary with `path`, `project_type`, `platform_hints`, `package_managers`, `directories`, `screens_or_routes`, `components`, and `assets`. Assert that the sample Expo fixture is classified as `react-native-or-expo`, includes `expo` in `platform_hints`, detects `src/components`, and reports the tabs route.

- [ ] **Step 2: Run the test to verify it fails**

  Run `python3 -m unittest tests.test_inspect_project -v`.

  Expected: collection fails because `scripts/inspect_project.py` does not exist yet. This verifies the test is exercising the intended missing behavior rather than an existing implementation.

- [ ] **Step 3: Commit the failing test**

  Run `git add tests && git commit -m "test: define project inspection contract"`.

### Task 2: Implement the read-only project inspector

**Files:**
- Create: `scripts/inspect_project.py`
- Modify: `tests/test_inspect_project.py` only if the tested public contract needs a precise correction

**Interfaces:**
- Consumes: a filesystem path.
- Produces: `inspect_project(path: pathlib.Path) -> dict` and a CLI with `--path` and `--json`.

- [ ] **Step 1: Implement the minimal scanner**

  Detect `package.json`, `app.json`, `app.config.*`, `next.config.*`, `vite.config.*`, `pubspec.yaml`, `Package.swift`, `*.xcodeproj`, `build.gradle*`, and common source directories. Read only bounded text metadata; never modify files. Use sorted, relative POSIX paths and skip `.git`, `node_modules`, build outputs, caches, and hidden directories.

- [ ] **Step 2: Run the focused test**

  Run `python3 -m unittest tests.test_inspect_project -v`.

  Expected: PASS with deterministic output for the sample fixture.

- [ ] **Step 3: Add CLI smoke coverage**

  Run `python3 scripts/inspect_project.py --path tests/fixtures/sample-expo --json` and confirm it emits valid JSON with no writes to the fixture.

- [ ] **Step 4: Commit the implementation**

  Run `git add scripts tests && git commit -m "feat: add read-only project inspector"`.

### Task 3: Add platform and archetype reference data

**Files:**
- Create: `references/platforms.md`
- Create: `references/archetypes.yaml`
- Create: `references/design-quality.md`
- Create: `references/review-rubric.md`

**Interfaces:**
- Consumes: the selected platform, device class, and archetype from `SKILL.md`.
- Produces: concise references loaded conditionally by the orchestrator.

- [ ] **Step 1: Write platform guidance**

  Cover iOS/SwiftUI, Android/Jetpack Compose, React Native/Expo, responsive Web, tablet, and cross-platform selection. For each, document layout conventions, input/focus behavior, navigation, accessibility, and validation checks.

- [ ] **Step 2: Write archetype YAML**

  Add fields `category`, `primary_job`, `navigation`, `content_model`, `primary_action`, `interaction_mode`, `density`, `required_states`, `avoid`, and `review_questions` for the initial archetypes named in the spec.

- [ ] **Step 3: Write quality and review references**

  Define token roles and baseline scales without forcing a visual brand. Add the anti-pattern list and an actionable rubric with score bands and severity definitions.

- [ ] **Step 4: Commit references**

  Run `git add references && git commit -m "docs: add platform archetype and quality references"`.

### Task 4: Write the root skill and UI metadata

**Files:**
- Create: `SKILL.md`
- Create: `agents/openai.yaml`

**Interfaces:**
- Consumes: user brief, repository inspection output, `references/platforms.md`, `references/archetypes.yaml`, `references/design-quality.md`, and `references/review-rubric.md`.
- Produces: a reusable `design-skills` skill that triggers on app/web product design, UI implementation, redesign, and UX review requests.

- [ ] **Step 1: Write frontmatter and trigger description**

  Start the description with `Use when...`, include app/web/platform/archetype/UI review symptoms and keywords, and keep it trigger-focused rather than summarizing the workflow.

- [ ] **Step 2: Write the orchestration workflow**

  Require platform selection, repository inspection, archetype selection, design brief, IA/navigation, tokens, component states, implementation, and review. Link each detailed reference directly from the relevant decision point.

- [ ] **Step 3: Write the output contract and red flags**

  Require explicit assumptions and a review report. Add direct counters for generic bottom navigation, decorative gradients/glass, unbounded card nesting, missing states, and skipping visual/accessibility QA.

- [ ] **Step 4: Add metadata**

  Set `display_name`, a 25–64 character `short_description`, and a default prompt explicitly naming `$design-skills`. Do not add unrequested icons or tool dependencies.

- [ ] **Step 5: Commit the skill**

  Run `git add SKILL.md agents && git commit -m "feat: add platform-aware design skill"`.

### Task 5: Verify, refactor, and prepare the open-source handoff

**Files:**
- Modify: `SKILL.md`, references, or tests only when a verification finding requires it

- [ ] **Step 1: Run tests and validator**

  Run `python3 -m unittest discover -s tests -v`.

  Run `python3 /Users/uulab/.codex/skills/.system/skill-creator/scripts/quick_validate.py .` using a Python environment that has PyYAML available; if unavailable, run an equivalent frontmatter check with a standard-library parser and record the environment limitation.

- [ ] **Step 2: Run static checks**

  Check `wc -l SKILL.md`, ensure all linked reference paths exist, ensure no `TODO` or `TBD` placeholders remain, and validate `references/archetypes.yaml` with an available YAML parser.

- [ ] **Step 3: Run the skill pressure scenarios**

  Apply the skill to the community mobile, SaaS web dashboard, and camera game prompts. Confirm each output declares a platform, chooses an archetype, avoids generic navigation defaults, defines state coverage, and ends with platform-specific review findings.

- [ ] **Step 4: Review the final diff**

  Run `git diff --check` and `git status --short`. Confirm no generated caches, credentials, temporary files, or user-specific absolute paths are tracked.

- [ ] **Step 5: Commit and push the release**

  Run `git add . && git commit -m "feat: launch platform-aware design skills"`, verify `git log -1 --oneline`, then run `git push origin main`.
