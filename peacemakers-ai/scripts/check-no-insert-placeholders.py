#!/usr/bin/env python3
"""Fail when unfinished template markers are present in the built site.

The marketing site is static HTML. This scans that output (and the generator
that writes it) for the forbidden marker. The marker is assembled at runtime
so this file does not contain it literally.
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NEEDLE = "[" + "INSERT"
TEXT_SUFFIXES = {
    ".html",
    ".xml",
    ".json",
    ".js",
    ".css",
    ".webmanifest",
    ".txt",
    ".md",
    ".svg",
    ".py",
    ".yml",
    ".yaml",
}
SKIP_DIRS = {"__pycache__", ".vercel", "node_modules", ".git"}


def iter_built_files(root: Path):
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        yield path


def find_markers(root: Path) -> list[str]:
    hits: list[str] = []
    for path in iter_built_files(root):
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            hits.append(f"{path}: not valid UTF-8")
            continue
        for number, line in enumerate(text.splitlines(), start=1):
            if NEEDLE in line:
                hits.append(f"{path.relative_to(root)}:{number}:{line.strip()}")
    return hits


def main() -> int:
    hits = find_markers(ROOT)
    if hits:
        print("Forbidden unfinished template marker found in built output:", file=sys.stderr)
        for hit in hits:
            print(hit, file=sys.stderr)
        return 1
    print(f"No unfinished template marker in {ROOT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
