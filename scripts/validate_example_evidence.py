#!/usr/bin/env python3
"""Validate the community example's portable visual and runtime evidence manifest."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Dict, Iterable, List, Tuple


REQUIRED_CAPTURE_IDS = {
    "board-wide",
    "board-content",
    "board-boundary",
    "board-mobile",
    "prototype-wide",
    "prototype-mobile",
}
REQUIRED_RUNTIME_IDS = {
    "default",
    "filtered",
    "empty",
    "composer-validation",
    "composer-success",
    "mobile-drawer",
    "recovery",
}


def _jpeg_dimensions(path: Path) -> Tuple[int, int]:
    data = path.read_bytes()
    if not data.startswith(b"\xff\xd8"):
        raise ValueError("{} is not a JPEG".format(path))
    index = 2
    while index + 9 < len(data):
        if data[index] != 0xFF:
            index += 1
            continue
        marker = data[index + 1]
        index += 2
        if marker in {0xD8, 0xD9}:
            continue
        if index + 2 > len(data):
            break
        segment_length = int.from_bytes(data[index : index + 2], "big")
        if marker in set(range(0xC0, 0xC4)) | set(range(0xC5, 0xC8)) | set(range(0xC9, 0xCC)) | set(range(0xCD, 0xD0)):
            if index + 7 > len(data):
                break
            height = int.from_bytes(data[index + 3 : index + 5], "big")
            width = int.from_bytes(data[index + 5 : index + 7], "big")
            return width, height
        index += segment_length
    raise ValueError("could not read JPEG dimensions from {}".format(path))


def _unique_ids(items: Iterable[Dict[str, object]], label: str, errors: List[str]) -> Dict[str, Dict[str, object]]:
    indexed: Dict[str, Dict[str, object]] = {}
    for item in items:
        identifier = item.get("id")
        if not isinstance(identifier, str) or not identifier:
            errors.append("{} entry is missing a string id".format(label))
            continue
        if identifier in indexed:
            errors.append("duplicate {} id: {}".format(label, identifier))
        indexed[identifier] = item
    return indexed


def validate_evidence(root: Path) -> Dict[str, object]:
    root = Path(root).expanduser().resolve()
    evidence_dir = root / "examples" / "community" / "evidence"
    manifest_path = evidence_dir / "manifest.json"
    errors: List[str] = []
    warnings: List[str] = []
    if not manifest_path.is_file():
        return {"ok": False, "errors": ["evidence/manifest.json is missing"], "warnings": [], "metrics": {}}

    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as error:
        return {"ok": False, "errors": ["invalid evidence manifest: {}".format(error)], "warnings": [], "metrics": {}}

    if manifest.get("version") != 1:
        errors.append("evidence manifest version must be 1")
    captures = manifest.get("captures", [])
    runtime_checks = manifest.get("runtime_checks", [])
    if not isinstance(captures, list):
        errors.append("captures must be a list")
        captures = []
    if not isinstance(runtime_checks, list):
        errors.append("runtime_checks must be a list")
        runtime_checks = []

    capture_index = _unique_ids(captures, "capture", errors)
    runtime_index = _unique_ids(runtime_checks, "runtime check", errors)
    missing_captures = sorted(REQUIRED_CAPTURE_IDS - set(capture_index))
    missing_runtime = sorted(REQUIRED_RUNTIME_IDS - set(runtime_index))
    if missing_captures:
        errors.append("missing captures: {}".format(", ".join(missing_captures)))
    if missing_runtime:
        errors.append("missing runtime checks: {}".format(", ".join(missing_runtime)))

    measured: Dict[str, List[int]] = {}
    for identifier, capture in capture_index.items():
        file_name = capture.get("file")
        viewport = capture.get("viewport")
        route = capture.get("route")
        if not isinstance(file_name, str) or Path(file_name).name != file_name:
            errors.append("{} capture must reference a file name in evidence/".format(identifier))
            continue
        if not isinstance(route, str) or not route.startswith("/"):
            errors.append("{} capture route must start with /".format(identifier))
        if not isinstance(viewport, dict) or not isinstance(viewport.get("width"), int) or not isinstance(viewport.get("height"), int):
            errors.append("{} capture viewport must declare integer width and height".format(identifier))
            continue
        image_path = evidence_dir / file_name
        if not image_path.is_file():
            errors.append("{} capture file is missing: {}".format(identifier, file_name))
            continue
        try:
            image_width, image_height = _jpeg_dimensions(image_path)
        except (OSError, ValueError) as error:
            errors.append(str(error))
            continue
        if image_width != viewport["width"]:
            errors.append("{} image width {} does not match viewport width {}".format(identifier, image_width, viewport["width"]))
        if image_height <= viewport["height"]:
            warnings.append("{} is not taller than its viewport; confirm it is a full-page capture".format(identifier))
        measured[identifier] = [image_width, image_height]

    for identifier, check in runtime_index.items():
        if check.get("verified") is not True:
            errors.append("{} runtime check is not marked verified".format(identifier))
        if not isinstance(check.get("assertion"), str) or not check["assertion"].strip():
            errors.append("{} runtime check needs an assertion".format(identifier))

    return {
        "ok": not errors,
        "errors": errors,
        "warnings": warnings,
        "metrics": {
            "captures": len(capture_index),
            "runtime_checks": len(runtime_index),
            "measured_images": measured,
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate community visual and runtime evidence.")
    parser.add_argument("--path", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    result = validate_evidence(args.path)
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True))
    else:
        print("Evidence validation: {}".format("PASS" if result["ok"] else "FAIL"))
        for error in result["errors"]:
            print("ERROR: {}".format(error))
        for warning in result["warnings"]:
            print("WARN: {}".format(warning))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
