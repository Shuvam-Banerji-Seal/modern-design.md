#!/usr/bin/env python3
"""
inventory.py — Print a tree + summary of a dumped site under tmp/<slug>/.

Usage
-----
    python tools/inventory.py <site-slug> [--json]

Output
------
    A tree of every file in tmp/<site-slug>/, then a per-extension
    count and byte total, then a short manifest summary. Pass --json
    to emit a single JSON document instead (handy for piping into other
    tools or sub-agent prompts).
"""

import argparse
import json
import sys
from collections import Counter
from pathlib import Path


def summarise(root: Path) -> tuple[Counter, Counter, int]:
    counts: Counter = Counter()
    sizes: Counter = Counter()
    total_bytes = 0
    for path in sorted(root.rglob("*")):
        if not path.is_file():
            continue
        ext = path.suffix.lower() or "(none)"
        size = path.stat().st_size
        counts[ext] += 1
        sizes[ext] += size
        total_bytes += size
    return counts, sizes, total_bytes


def print_text(root: Path) -> None:
    manifest_path = root / "manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else None

    print(f"\n{root}/")
    for path in sorted(root.rglob("*")):
        if path.is_dir():
            continue
        rel = path.relative_to(root)
        size = path.stat().st_size
        depth = len(rel.parts) - 1
        print(f"  {'  ' * depth}{rel.name}  ({size:,} bytes)")

    counts, sizes, total_bytes = summarise(root)
    print("\nBy extension:")
    print(f"  {'ext':12}  {'files':>6}  {'bytes':>14}")
    for ext, n in counts.most_common():
        print(f"  {ext or '(none)':12}  {n:>6}  {sizes[ext]:>14,}")
    print(f"  {'TOTAL':12}  {sum(counts.values()):>6}  {total_bytes:>14,}")

    if manifest:
        print(f"\nmanifest.json: {manifest.get('stats', {})}")
        errs = manifest.get("errors", [])
        if errs:
            print(f"first {min(5, len(errs))} errors:")
            for e in errs[:5]:
                print(f"  - {e['url']}: {e['error']}")


def print_json(root: Path) -> None:
    manifest_path = root / "manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    counts, sizes, total_bytes = summarise(root)
    by_type: Counter = Counter(f.get("type", "?") for f in manifest.get("files", []))
    print(
        json.dumps(
            {
                "root": str(root),
                "stats": manifest.get("stats", {}),
                "total_files_on_disk": sum(counts.values()),
                "total_bytes_on_disk": total_bytes,
                "by_extension": dict(counts.most_common()),
                "by_manifest_type": dict(by_type.most_common()),
            },
            indent=2,
        )
    )


def main() -> None:
    p = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    p.add_argument("slug", help="Slug of the dumped site (under tmp/)")
    p.add_argument("--json", action="store_true", help="Emit a single JSON document")
    args = p.parse_args()

    root = Path("tmp") / args.slug
    if not root.exists():
        print(f"Not found: {root}", file=sys.stderr)
        sys.exit(1)

    if args.json:
        print_json(root)
    else:
        print_text(root)


if __name__ == "__main__":
    main()
