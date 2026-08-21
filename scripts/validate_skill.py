#!/usr/bin/env python3
"""Validate the dependency-free contract of the design-skills repository."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Dict, Iterable, List, Tuple


MAX_SKILL_LINES = 500
CONTENT_ROOTS = ("SKILL.md", "references", "scripts", "tests", "examples/community")
PLACEHOLDER_SCAN_EXCLUDES = {Path("scripts/validate_skill.py")}
MARKDOWN_LINK_RE = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
FRONTMATTER_RE = re.compile(r"\A---\n(?P<body>.*?)\n---\n", re.DOTALL)
KEY_VALUE_RE = re.compile(r"^(?P<key>[A-Za-z0-9_-]+):\s*(?P<value>.*)$")
PLACEHOLDER_TERMS = ("TO" + "DO", "T" + "BD")


def _content_files(root: Path) -> Iterable[Path]:
    for relative_root in CONTENT_ROOTS:
        path = root / relative_root
        if path.is_file():
            yield path
            continue
        if not path.is_dir():
            continue
        for candidate in sorted(path.rglob("*")):
            if candidate.is_file() and ".git" not in candidate.parts:
                yield candidate


def _parse_frontmatter(skill_text: str) -> Tuple[Dict[str, str], List[str]]:
    match = FRONTMATTER_RE.match(skill_text)
    if not match:
        return {}, ["SKILL.md must begin with YAML frontmatter delimited by ---"]

    values: Dict[str, str] = {}
    errors: List[str] = []
    for line_number, line in enumerate(match.group("body").splitlines(), start=2):
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        parsed = KEY_VALUE_RE.match(line)
        if not parsed:
            errors.append("frontmatter line {} is not a simple key/value pair".format(line_number))
            continue
        values[parsed.group("key")] = parsed.group("value").strip().strip('"').strip("'")
    return values, errors


def _markdown_link_errors(root: Path) -> List[str]:
    errors: List[str] = []
    for source in _content_files(root):
        if source.suffix.lower() != ".md":
            continue
        try:
            text = source.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        for raw_target in MARKDOWN_LINK_RE.findall(text):
            target = raw_target.split("#", 1)[0].strip()
            if not target or "://" in target or target.startswith(("mailto:", "/")):
                continue
            resolved = (source.parent / target).resolve()
            if not resolved.is_file():
                errors.append(
                    "{} link does not resolve: {}".format(source.relative_to(root), target)
                )
    return errors


def _placeholder_hits(root: Path) -> List[str]:
    hits: List[str] = []
    for path in _content_files(root):
        if path.relative_to(root) in PLACEHOLDER_SCAN_EXCLUDES:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        for line_number, line in enumerate(text.splitlines(), start=1):
            if any(re.search(r"\b{}\b".format(term), line, re.IGNORECASE) for term in PLACEHOLDER_TERMS):
                hits.append("{}:{}".format(path.relative_to(root).as_posix(), line_number))
    return hits


def validate_project(root: Path) -> Dict[str, object]:
    """Return deterministic validation results without requiring third-party packages."""
    root = Path(root).expanduser().resolve()
    errors: List[str] = []
    warnings: List[str] = []
    skill_path = root / "SKILL.md"

    if not skill_path.is_file():
        errors.append("SKILL.md is missing")
        return {"ok": False, "errors": errors, "warnings": warnings, "metrics": {}}

    skill_text = skill_path.read_text(encoding="utf-8")
    frontmatter, frontmatter_errors = _parse_frontmatter(skill_text)
    errors.extend(frontmatter_errors)
    if frontmatter.get("name") != "design-skills":
        errors.append("frontmatter name must be design-skills")
    description = frontmatter.get("description", "")
    if not description.startswith("Use when"):
        errors.append("frontmatter description must start with 'Use when'")

    errors.extend(_markdown_link_errors(root))
    placeholder_hits = _placeholder_hits(root)
    if placeholder_hits:
        errors.append("placeholder text found: {}".format(", ".join(placeholder_hits)))

    metrics = {
        "skill_lines": len(skill_text.splitlines()),
        "reference_count": len(list((root / "references").glob("*"))) if (root / "references").is_dir() else 0,
        "content_files_checked": len(list(_content_files(root))),
    }
    if metrics["skill_lines"] > MAX_SKILL_LINES:
        errors.append("SKILL.md exceeds {} lines".format(MAX_SKILL_LINES))

    yaml_path = root / "references" / "archetypes.yaml"
    if not yaml_path.is_file():
        errors.append("references/archetypes.yaml is missing")
    else:
        warnings.append("YAML syntax is validated separately by an available YAML parser")

    return {
        "ok": not errors,
        "errors": errors,
        "warnings": warnings,
        "metrics": metrics,
    }


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Validate design-skills without third-party dependencies.")
    parser.add_argument("--path", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--json", action="store_true", help="Print machine-readable JSON")
    return parser


def main() -> int:
    args = _build_parser().parse_args()
    result = validate_project(args.path)
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True))
    else:
        print("Validation: {}".format("PASS" if result["ok"] else "FAIL"))
        for error in result["errors"]:
            print("ERROR: {}".format(error))
        for warning in result["warnings"]:
            print("WARN: {}".format(warning))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
