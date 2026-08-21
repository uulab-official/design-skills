#!/usr/bin/env python3
"""Read-only, dependency-free project inspection for design-skills."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from typing import Any, Dict, Iterable, List, Set


IGNORED_DIRECTORIES = {
    ".git",
    ".next",
    ".turbo",
    ".venv",
    "__pycache__",
    "build",
    "coverage",
    "dist",
    "node_modules",
    "Pods",
    "venv",
}

SOURCE_EXTENSIONS = {
    ".css",
    ".dart",
    ".html",
    ".java",
    ".js",
    ".jsx",
    ".kt",
    ".py",
    ".scss",
    ".svelte",
    ".swift",
    ".tsx",
    ".ts",
    ".vue",
}

ASSET_EXTENSIONS = {
    ".avif",
    ".gif",
    ".jpeg",
    ".jpg",
    ".mp3",
    ".mp4",
    ".png",
    ".svg",
    ".webp",
    ".woff",
    ".woff2",
}

MANIFEST_FILES = {
    "AndroidManifest.xml",
    "Podfile",
    "Package.swift",
    "app.json",
    "app.config.js",
    "app.config.ts",
    "build.gradle",
    "build.gradle.kts",
    "package.json",
    "package-lock.json",
    "pnpm-lock.yaml",
    "pubspec.yaml",
    "vite.config.js",
    "vite.config.ts",
    "yarn.lock",
}

ROUTE_DIRECTORY_NAMES = {
    "app",
    "navigation",
    "pages",
    "route",
    "routes",
    "screen",
    "screens",
    "views",
}

COMPONENT_DIRECTORY_NAMES = {"components", "component", "widgets"}
ASSET_DIRECTORY_NAMES = {"assets", "images", "public", "static"}
MAX_REPORTED_FILES = 200


def _is_ignored_directory(name: str) -> bool:
    return name in IGNORED_DIRECTORIES or name.startswith(".")


def _iter_files(root: Path) -> Iterable[Path]:
    for current, directories, files in os.walk(root, followlinks=False):
        directories[:] = sorted(
            name for name in directories if not _is_ignored_directory(name)
        )
        for filename in sorted(files):
            path = Path(current) / filename
            if path.is_symlink():
                continue
            yield path


def _relative_path(root: Path, path: Path) -> str:
    return path.relative_to(root).as_posix()


def _bounded_paths(paths: Iterable[str]) -> List[str]:
    return sorted(set(paths))[:MAX_REPORTED_FILES]


def _read_package_json(path: Path) -> Dict[str, Any]:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError):
        return {}
    return payload if isinstance(payload, dict) else {}


def _dependency_names(package: Dict[str, Any]) -> Set[str]:
    names: Set[str] = set()
    for key in ("dependencies", "devDependencies", "peerDependencies"):
        values = package.get(key, {})
        if isinstance(values, dict):
            names.update(str(name).lower() for name in values)
    return names


def _classify_project(root: Path, files: List[Path], package: Dict[str, Any]) -> str:
    names = {path.name for path in files}
    dependencies = _dependency_names(package)

    if "expo" in dependencies or "react-native" in dependencies or "app.json" in names:
        return "react-native-or-expo"
    if "pubspec.yaml" in names:
        return "flutter"
    if "Package.swift" in names or any(path.suffix == ".xcodeproj" for path in files):
        return "native-ios-or-apple"
    if "AndroidManifest.xml" in names or "build.gradle" in names or "build.gradle.kts" in names:
        return "native-android"
    if dependencies.intersection({"next", "vite", "react-dom", "vue", "svelte"}):
        return "web"
    if any(path.suffix in {".html", ".css"} for path in files):
        return "web"
    return "unknown"


def _platform_hints(
    root: Path, files: List[Path], package: Dict[str, Any]
) -> List[str]:
    names = {path.name for path in files}
    dependencies = _dependency_names(package)
    hints: Set[str] = set()

    if "expo" in dependencies:
        hints.add("expo")
    if "react-native" in dependencies:
        hints.add("react-native")
    if dependencies.intersection({"next", "vite", "react-dom", "vue", "svelte"}):
        hints.add("web")
    if "Package.swift" in names or any(path.suffix == ".xcodeproj" for path in files):
        hints.add("ios-or-apple")
    if "AndroidManifest.xml" in names or "build.gradle" in names or "build.gradle.kts" in names:
        hints.add("android")
    if "pubspec.yaml" in names:
        hints.add("flutter")

    return sorted(hints)


def inspect_project(path: Path) -> Dict[str, Any]:
    """Inspect a project without writing to it and return deterministic metadata."""
    root = Path(path).expanduser().resolve()
    if not root.exists():
        raise FileNotFoundError("Project path does not exist: {}".format(root))
    if not root.is_dir():
        raise NotADirectoryError("Project path is not a directory: {}".format(root))

    files = list(_iter_files(root))
    relative_files = [_relative_path(root, file) for file in files]
    package_path = root / "package.json"
    package = _read_package_json(package_path) if package_path.exists() else {}

    directories = {
        str(Path(relative).parent).replace("\\", "/")
        for relative in relative_files
        if Path(relative).parent != Path(".")
    }
    directory_names = {Path(directory).name.lower() for directory in directories}

    routes = [
        relative
        for relative, file in zip(relative_files, files)
        if file.suffix.lower() in SOURCE_EXTENSIONS
        and (
            any(part.lower() in ROUTE_DIRECTORY_NAMES for part in file.relative_to(root).parts[:-1])
            or file.stem.lower() in {"route", "routes", "navigation"}
        )
    ]
    components = [
        relative
        for relative, file in zip(relative_files, files)
        if file.suffix.lower() in SOURCE_EXTENSIONS
        and any(part.lower() in COMPONENT_DIRECTORY_NAMES for part in file.relative_to(root).parts[:-1])
    ]
    assets = [
        relative
        for relative, file in zip(relative_files, files)
        if file.suffix.lower() in ASSET_EXTENSIONS
        or any(part.lower() in ASSET_DIRECTORY_NAMES for part in file.relative_to(root).parts[:-1])
    ]

    manifest_files = [
        relative
        for relative, file in zip(relative_files, files)
        if file.name in MANIFEST_FILES
        or file.name.startswith("next.config.")
        or file.name.startswith("vite.config.")
        or file.suffix == ".xcodeproj"
    ]

    return {
        "path": str(root),
        "project_type": _classify_project(root, files, package),
        "platform_hints": _platform_hints(root, files, package),
        "package_managers": _bounded_paths(manifest_files),
        "directories": _bounded_paths(
            directory
            for directory in directories
            if Path(directory).name.lower() in COMPONENT_DIRECTORY_NAMES
            or Path(directory).name.lower() in ASSET_DIRECTORY_NAMES
            or Path(directory).name.lower() in ROUTE_DIRECTORY_NAMES
            or Path(directory).name.lower() in {"src", "app"}
        ),
        "screens_or_routes": _bounded_paths(routes),
        "components": _bounded_paths(components),
        "assets": _bounded_paths(assets),
        "file_count": len(files),
        "truncated": any(
            len(values) > MAX_REPORTED_FILES
            for values in (routes, components, assets, manifest_files)
        ),
    }


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Inspect an app or web project without modifying it."
    )
    parser.add_argument("--path", type=Path, required=True, help="Project directory")
    parser.add_argument(
        "--json", action="store_true", help="Print machine-readable JSON"
    )
    return parser


def main() -> int:
    args = _build_parser().parse_args()
    try:
        result = inspect_project(args.path)
    except (FileNotFoundError, NotADirectoryError) as error:
        print(str(error), file=os.sys.stderr)
        return 2

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True))
    else:
        print("Project: {}".format(result["path"]))
        print("Type: {}".format(result["project_type"]))
        print("Platform hints: {}".format(", ".join(result["platform_hints"]) or "none"))
        print("Routes/screens: {}".format(len(result["screens_or_routes"])))
        print("Components: {}".format(len(result["components"])))
        print("Assets: {}".format(len(result["assets"])))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
