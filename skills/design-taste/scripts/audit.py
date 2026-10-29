#!/usr/bin/env python3
"""Heuristic review helper for generic UI content and unfinished interactions.

Findings are candidates for human review; they cannot detect authorship or beauty.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

VALID = {".html", ".htm", ".css", ".scss", ".sass", ".jsx", ".tsx", ".vue", ".svelte", ".astro"}
EXCLUDED = {
    ".git", ".next", ".nuxt", ".svelte-kit", ".expo", "node_modules",
    "dist", "build", "vendor", "coverage", ".venv", "venv", "__pycache__",
    ".design-taste", "evidence", ".cache",
}
MAX_FILES = 2000
MAX_BYTES = 500_000
GENERIC = re.compile(
    r"\b(?:revolutioniz(?:e|ing)\s+your|unlock\s+(?:the\s+)?(?:power|potential)|"
    r"elevate\s+your\s+(?:experience|workflow)|the\s+future\s+of\s+\w+|"
    r"seamlessly\s+(?:connect|integrate)\s+\w+)\b|"
    r"(?:혁신적인\s+(?:경험|서비스)|당신의\s+모든\s+것을|새로운\s+경험을\s+시작)",
    re.IGNORECASE,
)
PLACEHOLDER = re.compile(
    r"\blorem\s+ipsum\b|\byour\s+amazing\s+(?:product|app)\b|"
    r"\b(?:feature|benefit)\s+[123]\b|(?:이미지|텍스트)\s*자리",
    re.IGNORECASE,
)
DEAD_LINK = re.compile(r"\bhref\s*=\s*(['\"])#\1", re.IGNORECASE)
DEAD_HANDLER = re.compile(
    r"\bonClick\s*=\s*\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*\}", re.IGNORECASE
)
TRIPLE_COLUMNS = re.compile(r"(?:\bgrid-cols-3\b|repeat\s*\(\s*3\s*,)", re.IGNORECASE)
CARD = re.compile(r"<\s*(?:FeatureCard|Card)\b|class(?:Name)?\s*=\s*['\"][^'\"]*\b(?:feature-card|card)\b", re.IGNORECASE)
ORNAMENTS = {
    "gradient": re.compile(r"(?:linear-gradient|radial-gradient|\bbg-gradient\b|\bbg-\[linear-gradient)", re.IGNORECASE),
    "blur": re.compile(r"(?:backdrop-filter\s*:|backdrop-blur|\bblur-\[|\bglassmorphism\b)", re.IGNORECASE),
    "shadow": re.compile(r"(?:\bshadow-xl\b|\bshadow-2xl\b|box-shadow\s*:)", re.IGNORECASE),
    "glow": re.compile(r"\bglow\b|drop-shadow\s*\(", re.IGNORECASE),
}


def eligible_files(root: Path):
    if root.is_file():
        if root.suffix.lower() not in VALID:
            raise ValueError("Unsupported file type: " + root.suffix)
        yield root
        return
    if not root.is_dir():
        raise ValueError("Project path does not exist")
    count = 0
    for file in sorted(root.rglob("*")):
        if file.is_symlink() or not file.is_file() or file.suffix.lower() not in VALID:
            continue
        if any(part in EXCLUDED for part in file.relative_to(root).parts):
            continue
        count += 1
        if count > MAX_FILES:
            raise ValueError(f"More than {MAX_FILES} UI files; select a smaller --path")
        if file.stat().st_size <= MAX_BYTES:
            yield file


def audit(root: Path, platform: str) -> dict:
    if platform not in {"web", "app", "game"}:
        raise ValueError("Select web, app or game")
    root = root.expanduser().resolve()
    findings: list[dict] = []
    count = 0
    for file in eligible_files(root):
        count += 1
        text = file.read_text(encoding="utf-8", errors="replace")
        rel = file.name if root.is_file() else file.relative_to(root).as_posix()

        def record(code: str, severity: str, pattern: re.Pattern, reason: str, suggestion: str):
            match = pattern.search(text)
            if match:
                findings.append({
                    "file": rel, "line": text.count("\n", 0, match.start()) + 1,
                    "code": code, "severity": severity, "confidence": "heuristic",
                    "reason": reason, "next_action": suggestion,
                })

        record(
            "placeholder-content", "high", PLACEHOLDER,
            "Placeholder or numbered-generic feature text may remain in a production screen.",
            "Replace with real product content or explicitly isolated demo fixtures."
        )
        record(
            "dead-anchor", "high", DEAD_LINK,
            "An anchor points only to # and may mislead users.",
            "Use a real target/action or a non-interactive element if it is not a link."
        )
        record(
            "empty-click-handler", "high", DEAD_HANDLER,
            "A visible action may have an empty handler.",
            "Implement its promised behavior, disable honestly, or remove the control."
        )
        record(
            "category-default-copy", "review", GENERIC,
            "Generic category slogan may be interchangeable across competitors.",
            "Replace with a testable product-specific promise and real supporting evidence."
        )
        if platform == "web" and TRIPLE_COLUMNS.search(text) and len(CARD.findall(text)) >= 3:
            record(
                "three-card-template", "review", TRIPLE_COLUMNS,
                "Equal three-card rows can be a landing-page default rather than content-led composition.",
                "Verify the chosen structure against actual content, compare at least two alternatives."
            )
        ornamental_counts = {name: len(pattern.findall(text))
                             for name, pattern in ORNAMENTS.items()}
        if sum(ornamental_counts.values()) >= 5 and sum(n > 0 for n in ornamental_counts.values()) >= 2:
            first_pattern = next(ORNAMENTS[name] for name, n in ornamental_counts.items() if n)
            record(
                "ornament-density", "review", first_pattern,
                "Many glow/gradient/blur/shadow treatments may obscure hierarchy or indicate generic styling.",
                "Check actual rendered usage and product rationale; do not ban effects that convey state or identity."
            )
    return {
        "schema_version": 1,
        "platform": platform,
        "path": str(root),
        "files_checked": count,
        "disclaimer": "Heuristic source review, not AI authorship detection or visual-quality approval.",
        "counts": {
            "high": sum(f["severity"] == "high" for f in findings),
            "review": sum(f["severity"] == "review" for f in findings),
        },
        "findings": findings,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Surface possible generic UI patterns without blaming authorship.")
    parser.add_argument("--path", type=Path, default=Path("."))
    parser.add_argument("--platform", choices=("web", "app", "game"), required=True)
    parser.add_argument("--json", action="store_true")
    parser.add_argument("--strict", action="store_true", help="Fail on unfinished HIGH issues only, not subjective visual flags")
    args = parser.parse_args()
    try:
        report = audit(args.path, args.platform)
    except (OSError, ValueError) as exc:
        print("ERROR: " + str(exc), file=sys.stderr)
        return 2
    if args.json:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print(f"Reviewed {report['files_checked']} UI files | high={report['counts']['high']} | review={report['counts']['review']}")
        for item in report["findings"]:
            print(f"{item['file']}:{item['line']} [{item['severity']}] {item['code']}: {item['reason']}")
        print(report["disclaimer"])
    return 1 if args.strict and report["counts"]["high"] > 0 else 0


if __name__ == "__main__":
    raise SystemExit(main())
