#!/usr/bin/env python3
"""
build_manifest.py — Emit a JSON manifest of all per-site sample pages.

Run automatically by the GitHub Pages workflow before deploy. Re-scans
the `websites/` directory so the landing-page grid stays in sync with
the repo without any manual index maintenance.

Usage
-----
    python3 tools/build_manifest.py > showcase/assets/manifest.json
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEBSITES = ROOT / "websites"
SHOWCASE_HTML = ROOT / "showcase" / "html"

# Consolidated categories. Each slug maps to ONE of these so the
# landing-page filter stays at ~5 chips instead of 20.
CATEGORY_OVERRIDES = {
    # Interactive / 3D — heavy JS, WebGL, GLSL, custom physics
    "lusion": "Interactive / 3D",
    "bruno-simon": "Interactive / 3D",
    "resn": "Interactive / 3D",
    "immersive-g": "Interactive / 3D",
    "northkingdom": "Interactive / 3D",
    "field": "Interactive / 3D",
    "makemepulse": "Interactive / 3D",
    "dogstudio": "Interactive / 3D",
    "active-theory": "Interactive / 3D",
    "aristidebenoist": "Interactive / 3D",
    "tendril": "Interactive / 3D",
    # Design / Creative Agency — most studios
    "obys": "Design Agency",
    "basement": "Design Agency",
    "unit9": "Design Agency",
    "locomotive": "Design Agency",
    "stinkstudios": "Design Agency",
    "hellomonday": "Design Agency",
    "toyfight": "Design Agency",
    "wonderland": "Design Agency",
    "basicagency": "Design Agency",
    "bureau-cool": "Design Agency",
    "ouiwill": "Design Agency",
    "epic": "Design Agency",
    "garden-eight": "Design Agency",
    "k72": "Design Agency",
    "media-monks": "Design Agency",
    # Portfolio — single designers
    "zhenyary": "Portfolio",
    "niccolomiranda": "Portfolio",
    # Web3 / Tools
    "sequence": "Web3 / Tools",
    "fffuel": "Web3 / Tools",
    # Web Design Gallery
    "awwwards": "Web Design Gallery",
    "thefwa": "Web Design Gallery",
    "godly": "Web Design Gallery",
    "siteinspire": "Web Design Gallery",
    "cssdesignawards": "Web Design Gallery",
    # Indie Game
    "firewatchgame": "Indie Game",
}

# Special-case display names where the slug-derived name is wrong
# (no dash in slug, or compound word that needs splitting).
DISPLAY_NAME_OVERRIDES = {
    "aristidebenoist": "Aristide Benoist",
    "bruno-simon": "Bruno Simon",
    "basicagency": "BASIC",
    "media-monks": "MediaMonks",
    "active-theory": "Active Theory",
    "firewatchgame": "Firewatch",
    "obys": "Obys Agency",
    "zhenyary": "Zhenya Rynzhuk",
    "niccolomiranda": "Niccolò Miranda",
    "sequence": "Sequence",
    "fffuel": "fffuel",
    "dogstudio": "Dogstudio",
    "makemepulse": "Make Me Pulse",
    "tendril": "Tendril",
    "epic": "EPIC Agency",
    "k72": "K72",
    "ouiwill": "Oui Will",
    "bureau-cool": "Bureau Cool",
    "toyfight": "ToyFight",
    "obys": "Obys Agency",
    "wonderland": "Wonderland",
    "stinkstudios": "Stink Studios",
    "hellomonday": "Hello Monday",
    "locomotive": "Locomotive",
    "garden-eight": "Garden Eight",
    "immersive-g": "Immersive Garden",
    "northkingdom": "North Kingdom",
    "media-monks": "MediaMonks",
    "firewatchgame": "Firewatch",
    "awwwards": "Awwwards",
    "thefwa": "The FWA",
    "cssdesignawards": "CSS Design Awards",
}


def display_name(slug: str) -> str:
    """Best-effort human name from slug.

    Overrides win first (for compound slugs without dashes). Otherwise
    split on dashes AND camelCase boundaries, then title-case each word.
    """
    if slug in DISPLAY_NAME_OVERRIDES:
        return DISPLAY_NAME_OVERRIDES[slug]
    import re

    parts = re.sub(r"([a-z])([A-Z])", r"\1 \2", slug)
    parts = parts.replace("-", " ")
    return " ".join(w.capitalize() if w else w for w in parts.split())


def first_overview_paragraph(design_md: Path) -> str:
    """Return the first paragraph of the Overview section, plain text."""
    if not design_md.exists():
        return ""
    text = design_md.read_text(encoding="utf-8")
    # Find the Overview section, take up to the next H2.
    m = re.search(
        r"^## Overview\s*$(.*?)(?=^## |\Z)",
        text,
        re.MULTILINE | re.DOTALL,
    )
    if not m:
        return ""
    para = m.group(1).strip()
    # First non-empty paragraph, capped at ~240 chars.
    for block in re.split(r"\n\s*\n", para):
        block = re.sub(r"\s+", " ", block).strip(" >#-*")
        if block and not block.startswith("**Category"):
            return block[:240] + ("…" if len(block) > 240 else "")
    return ""


def main() -> None:
    if not WEBSITES.exists():
        print("[]")
        return

    entries = []
    for slug_dir in sorted(WEBSITES.iterdir()):
        if not slug_dir.is_dir():
            continue
        slug = slug_dir.name
        design_md = slug_dir / "design.md"
        if not design_md.exists():
            continue
        has_sample = (SHOWCASE_HTML / slug / "index.html").exists()
        entries.append(
            {
                "slug": slug,
                "name": display_name(slug),
                "category": CATEGORY_OVERRIDES.get(slug, "Design Spec"),
                "description": first_overview_paragraph(design_md),
                "design_md": f"../websites/{slug}/design.md",
                "sample": f"html/{slug}/index.html" if has_sample else None,
            }
        )

    json.dump(entries, sys.stdout, indent=2, ensure_ascii=False)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
