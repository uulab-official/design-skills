#!/usr/bin/env python3
"""Original, deterministic visual-direction briefing for web/app/game products.

Offline and stdlib-only: recommendations are prompts, not measured visual quality.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DIRECTIONS = ROOT / "library" / "directions.json"
MOVES = ROOT / "library" / "craft-moves.json"
SOURCES = ROOT / "library" / "reference-sources.json"
PLATFORMS = ("web", "app", "game")


def read_catalog(path: Path, key: str, required: set[str]) -> list[dict[str, Any]]:
    raw = json.loads(path.read_text(encoding="utf-8"))
    if raw.get("schema_version") != 1 or not isinstance(raw.get(key), list):
        raise ValueError(f"Invalid {path.name}: schema_version=1 and {key} array required")
    items = raw[key]
    ids: set[str] = set()
    for item in items:
        if not isinstance(item, dict) or not required.issubset(item):
            raise ValueError(f"Invalid entry in {path.name}; missing required fields")
        if not isinstance(item.get("id"), str) or item["id"] in ids:
            raise ValueError(f"Duplicate or invalid id in {path.name}")
        ids.add(item["id"])
    return items


def stable_key(seed: str, brief: str, item_id: str) -> str:
    return hashlib.sha256((seed + "|" + brief + "|" + item_id).encode("utf-8")).hexdigest()


def matches(terms: list[str], content: str) -> list[str]:
    return [term for term in terms if term.casefold() in content]


def order(items: list[dict], content: str, seed: str, brief: str,
          terms_field: str) -> list[dict]:
    return sorted(items, key=lambda entry: (
        -len(matches(entry[terms_field], content)),
        stable_key(seed, brief, entry["id"]),
    ))


def normalize_facts(values: list[str]) -> list[str]:
    unique = []
    for raw in values:
        fact = raw.strip()
        if fact and fact not in unique:
            unique.append(fact)
    return unique


def load_context(path: Path | None) -> dict:
    if not path:
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("Context must be a JSON object")
    for key in ("facts", "constraints", "avoid"):
        if key in data and (not isinstance(data[key], list) or
                            not all(isinstance(x, str) for x in data[key])):
            raise ValueError(f"Context {key} must be a string array")
    for key in ("brand", "audience", "primary_job"):
        if key in data and not isinstance(data[key], str):
            raise ValueError(f"Context {key} must be text")
    return data


def research_refs(platform: str, sources: list[dict], seed: str, brief: str) -> list[dict]:
    candidates = [s for s in sources if platform in s["platforms"]]
    gallery_kinds = {"web-gallery", "app-reference", "game-reference"}
    gallery = sorted(
        (x for x in candidates if x["kind"] in gallery_kinds),
        key=lambda s: stable_key(seed, brief, s["id"]),
    )
    engineering = sorted(
        (x for x in candidates if x["kind"] not in gallery_kinds),
        key=lambda s: stable_key(seed, brief + "-technical", s["id"]),
    )
    chosen = gallery[:1] + engineering[:1]
    return [{
        "id": s["id"], "name": s["title"], "url": s["url"],
        "research_question": s["study_question"],
        "rights": "Reference only; inspect current source/terms before reuse",
    } for s in chosen]


def draw(platform: str, brief: str, seed: str = "0", facts: list[str] | None = None,
         brand: str = "", audience: str = "", primary_job: str = "",
         constraints: list[str] | None = None, avoid: list[str] | None = None) -> dict:
    if platform not in PLATFORMS:
        raise ValueError("Select web, app or game")
    if not isinstance(brief, str) or not brief.strip():
        raise ValueError("A real product brief is required")
    facts = normalize_facts(facts or [])
    constraints = normalize_facts(constraints or [])
    avoid = normalize_facts(avoid or [])
    content = " ".join([brief, audience, primary_job, *facts, *constraints]).casefold()

    directions = read_catalog(DIRECTIONS, "directions",
                              {"id", "platform", "title", "composition", "fit_terms", "avoid"})
    moves = read_catalog(MOVES, "moves",
                         {"id", "platform", "axis", "title", "lead", "sequence",
                          "focus", "stress_states", "acceptance_question", "match_terms"})
    sources = read_catalog(SOURCES, "sources",
                           {"id", "kind", "title", "url", "platforms", "study_question"})
    directions = [x for x in directions if x["platform"] == platform]
    moves = [x for x in moves if x["platform"] == platform]
    if len(directions) < 3 or len({x["axis"] for x in moves}) < 3:
        raise ValueError(f"Need three distinct directions and craft axes for {platform}")
    for item in directions:
        if not isinstance(item["fit_terms"], list):
            raise ValueError("Invalid fit_terms")
    for item in moves:
        if not isinstance(item["match_terms"], list):
            raise ValueError("Invalid match_terms")

    chosen_directions = order(directions, content, seed, brief, "fit_terms")[:3]
    ranked_moves = order(moves, content, seed, brief, "match_terms")
    used_axes: set[str] = set()
    options = []
    for direction in chosen_directions:
        # Select a different structural lens for each direction; color-only variations are not enough.
        move = next(x for x in ranked_moves if x["axis"] not in used_axes)
        used_axes.add(move["axis"])
        options.append({
            "id": direction["id"] + "+" + move["id"],
            "title": direction["title"] + " / " + move["title"],
            "visual_direction": direction,
            "composition_move": move,
            "task_match_terms": {
                "direction": matches(direction["fit_terms"], content),
                "composition": matches(move["match_terms"], content),
            },
            "specificity_inputs": facts,
            "requires_real_content": not bool(facts),
            "approved_brand_to_preserve": brand or None,
            "deliberate_exclusions": normalize_facts(direction["avoid"] + avoid),
            "verification_task": move["acceptance_question"],
            "disallowed_shortcuts": [
                "Inventing product metrics, customer claims or owned assets",
                "Copying third-party brand expression or artwork",
                "Calling this direction release-ready before real render review",
            ],
        })

    warnings = [
        "These are deterministic starting directions, NOT visually validated designs.",
        "External reference pages were NOT fetched or copied by this offline command.",
    ]
    if len(facts) < 3:
        warnings.append(
            "Supply >=3 observed product facts (ideally 6–12) using --fact or --context to ground originality."
        )
    if not primary_job:
        warnings.append("Name the primary user job and real action before choosing an option.")
    return {
        "schema_version": 2,
        "platform": platform, "brief": brief, "seed": seed,
        "audience": audience or None, "primary_job": primary_job or None,
        "brand": brand or None, "constraints": constraints, "facts": facts,
        "status": "unvalidated_design_options",
        "references_to_review": research_refs(platform, sources, seed, brief),
        "warnings": warnings,
        "selection_rule": (
            "Choose by user job, genuine product details, platform/input, "
            "distinct composition, accessibility and visual evidence. "
            "Reject all options if none serves the task."
        ),
        "options": options,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Propose 3 task-specific visual directions without network calls.")
    parser.add_argument("--platform", choices=PLATFORMS, required=True)
    parser.add_argument("--brief", required=True)
    parser.add_argument("--seed", default="0")
    parser.add_argument("--fact", action="append", default=[], help="Real product fact; repeat (never fabricate)")
    parser.add_argument("--brand", default="")
    parser.add_argument("--audience", default="")
    parser.add_argument("--primary-job", default="")
    parser.add_argument("--constraint", action="append", default=[])
    parser.add_argument("--avoid", action="append", default=[])
    parser.add_argument("--context", type=Path, help="Optional local JSON with facts/brand/audience/primary_job/constraints/avoid")
    parser.add_argument("--out", type=Path)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args(argv)
    try:
        context = load_context(args.context)
        result = draw(
            args.platform, args.brief, args.seed,
            facts=(context.get("facts") or []) + args.fact,
            brand=args.brand or context.get("brand", ""),
            audience=args.audience or context.get("audience", ""),
            primary_job=args.primary_job or context.get("primary_job", ""),
            constraints=(context.get("constraints") or []) + args.constraint,
            avoid=(context.get("avoid") or []) + args.avoid,
        )
        payload = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
        if args.out:
            if args.out.exists() and not args.force:
                raise ValueError("Output already exists; --force required to replace it")
            args.out.parent.mkdir(parents=True, exist_ok=True)
            args.out.write_text(payload, encoding="utf-8")
            print("Design directions: " + str(args.out))
        else:
            sys.stdout.write(payload)
        return 0
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print("ERROR: " + str(exc), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
