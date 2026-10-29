#!/usr/bin/env python3
"""Deterministic, dependency-free UULAB design-taste direction selector.

It proposes prompts, not quality scores or validated visual outcomes.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIBRARY = ROOT / "library" / "directions.json"
REQUIRED = {"id", "platform", "title", "signature", "composition",
            "typography", "color", "imagery", "motion", "fit_terms", "avoid"}


def read_library() -> list[dict]:
    data = json.loads(LIBRARY.read_text(encoding="utf-8"))
    items = data.get("directions")
    if not isinstance(items, list):
        raise ValueError("library.directions must be an array")
    ids: set[str] = set()
    for item in items:
        if not isinstance(item, dict) or not REQUIRED <= set(item):
            raise ValueError("Each direction requires all documented fields")
        if item["id"] in ids:
            raise ValueError("Duplicate direction id: " + item["id"])
        ids.add(item["id"])
        if item["platform"] not in ("web", "app", "game"):
            raise ValueError("Unsupported direction platform")
        if not isinstance(item["fit_terms"], list) or not item["fit_terms"]:
            raise ValueError("fit_terms must be a nonempty list")
    return items


def draw(platform: str, brief: str, seed: str = "0") -> dict:
    if platform not in ("web", "app", "game"):
        raise ValueError("Select web, app or game")
    if not brief.strip():
        raise ValueError("A real product brief is required")
    normalized = brief.casefold()
    candidates = [item for item in read_library() if item["platform"] == platform]
    if len(candidates) < 3:
        raise ValueError("Need at least three directions for platform " + platform)

    def rank(item: dict) -> tuple[int, str]:
        fit = sum(1 for term in item["fit_terms"] if term.casefold() in normalized)
        stable = hashlib.sha256(
            (seed + "|" + brief + "|" + item["id"]).encode("utf-8")
        ).hexdigest()
        return -fit, stable

    chosen = sorted(candidates, key=rank)[:3]
    return {
        "schema_version": 1,
        "platform": platform,
        "brief": brief,
        "seed": seed,
        "status": "options_only_requires_human_or_agent_selection",
        "note": "Scores are keyword relevance only. Reject or revise any option that does not fit real users, brand and task.",
        "options": [
            {**item, "keyword_hits": [
                term for term in item["fit_terms"] if term.casefold() in normalized
            ]}
            for item in chosen
        ],
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Suggest three product-specific visual directions.")
    parser.add_argument("--platform", choices=("web", "app", "game"), required=True)
    parser.add_argument("--brief", required=True)
    parser.add_argument("--seed", default="0")
    parser.add_argument("--out", type=Path)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args(argv)
    try:
        result = draw(args.platform, args.brief, args.seed)
        payload = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
        if args.out:
            if args.out.exists() and not args.force:
                raise ValueError("Output exists; specify --force to replace it")
            args.out.parent.mkdir(parents=True, exist_ok=True)
            args.out.write_text(payload, encoding="utf-8")
            print("Direction sheet: " + str(args.out))
        else:
            sys.stdout.write(payload)
        return 0
    except (ValueError, OSError, json.JSONDecodeError) as exc:
        print("ERROR: " + str(exc), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
