#!/usr/bin/env python3
"""
parse_designs.py — Extract structured data from every design.md.

For each `websites/<slug>/design.md` we extract:
  - `colors`:        unique uppercase hex values, in order of appearance, capped.
  - `fonts`:         rows from the Typography table (role, family, weight, size).
  - `components`:    names of components (## Component-name sections).
  - `animations`:    count of `@keyframes` plus count of JS animation references.
  - `js_libraries`:  rows from the JavaScript & Libraries table.
  - `spacing`:       spacing values from the Spacing & radius section.
  - `radii`:         border-radius values from the Spacing & radius section.
  - `stats`:         line count, table presence, section count, etc.

Output: JSON written to showcase/assets/design-details.json, suitable
for the landing page to consume at runtime.

Usage
-----
    python3 tools/parse_designs.py \\
        --out showcase/assets/design-details.json
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEBSITES = ROOT / "websites"

# Regex helpers ------------------------------------------------------------

RE_HEX = re.compile(r"#([0-9A-Fa-f]{6})\b")
RE_HEX_IN_BACKTICKS = re.compile(r"`#([0-9A-Fa-f]{6})`")
RE_KEYFRAMES = re.compile(r"@keyframes\s+([\w-]+)")
RE_GSAP_TIMELINE = re.compile(
    r"(?:gsap\.(?:timeline|from|to|fromTo)|new\s+TimelineMax|ScrollTrigger|"
    r"framer-motion|Lottie)",
    re.IGNORECASE,
)
RE_TABLE_ROW = re.compile(r"^\s*\|(.+)\|\s*$")


# Inline copy of build_manifest.display_name — kept here so this
# script stays self-contained and runnable standalone.
def display_name(slug: str) -> str:
    OVERRIDES = {
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
        "wonderland": "Wonderland",
        "stinkstudios": "Stink Studios",
        "hellomonday": "Hello Monday",
        "locomotive": "Locomotive",
        "garden-eight": "Garden Eight",
        "immersive-g": "Immersive Garden",
        "northkingdom": "North Kingdom",
        "cssdesignawards": "CSS Design Awards",
        "thefwa": "The FWA",
        "awwwards": "Awwwards",
        "godly": "Godly",
        "siteinspire": "SiteInspire",
    }
    if slug in OVERRIDES:
        return OVERRIDES[slug]
    parts = re.sub(r"([a-z])([A-Z])", r"\1 \2", slug).replace("-", " ")
    return " ".join(w.capitalize() if w else w for w in parts.split())


def split_md_row(line: str) -> list[str]:
    """Split a markdown table row into cells, trimming whitespace and quotes."""
    parts = line.strip().strip("|").split("|")
    return [p.strip().strip("`").strip('"').strip("'") for p in parts]


def is_separator_row(cells: list[str]) -> bool:
    return all(re.fullmatch(r":?-+:?", c.strip()) for c in cells)


def find_section(text: str, heading: str) -> tuple[int, int] | None:
    """Return (start, end) byte offsets of `## <heading>` up to the next H2."""
    pat = re.compile(rf"^##\s+{re.escape(heading)}\s*$\n", re.MULTILINE)
    m = pat.search(text)
    if not m:
        return None
    start = m.end()
    rest = text[start:]
    next_h = re.search(r"^##\s+", rest, re.MULTILINE)
    end = start + next_h.start() if next_h else len(text)
    return start, end


def slice_section(text: str, heading: str) -> str:
    rng = find_section(text, heading)
    if not rng:
        return ""
    return text[rng[0] : rng[1]]


def extract_table(text: str) -> list[list[str]]:
    """Return the first markdown table found in `text` as rows of cells."""
    rows: list[list[str]] = []
    for line in text.splitlines():
        m = RE_TABLE_ROW.match(line)
        if not m:
            if rows:  # end of contiguous table block
                break
            continue
        cells = split_md_row(line)
        if is_separator_row(cells):
            continue
        rows.append(cells)
    return rows


# Field extractors ----------------------------------------------------------


def extract_colors(text: str, cap: int = 30) -> list[dict]:
    """Unique hex colors with the first role/description we can find."""
    found: list[dict] = []
    seen: set[str] = set()

    # Walk through every typography/color table row to associate colors
    # with their role name. The first column of the row before the hex
    # is usually the role (e.g. "Background (base)").
    for section_heading in ("Color", "Visual Language"):
        body = slice_section(text, section_heading)
        if not body:
            continue
        for line in body.splitlines():
            if "#" not in line:
                continue
            cells = split_md_row(line) if line.lstrip().startswith("|") else []
            if cells:
                # Cells[0] is the role; find the hex in subsequent cells.
                role = cells[0]
                for cell in cells[1:]:
                    m = RE_HEX.search(cell)
                    if m:
                        hex_ = m.group(1).upper()
                        if hex_ not in seen:
                            seen.add(hex_)
                            found.append({"hex": f"#{hex_}", "role": role})
            else:
                # Loose hex mention — no role context.
                for m in RE_HEX.finditer(line):
                    hex_ = m.group(1).upper()
                    if hex_ not in seen:
                        seen.add(hex_)
                        found.append({"hex": f"#{hex_}", "role": ""})

    # Fall back: just collect every hex from the whole file.
    if not found:
        for m in RE_HEX.finditer(text):
            hex_ = m.group(1).upper()
            if hex_ not in seen:
                seen.add(hex_)
                found.append({"hex": f"#{hex_}", "role": ""})
            if len(found) >= cap:
                break

    return found[:cap]


def extract_fonts(text: str) -> list[dict]:
    """Typography table rows."""
    body = slice_section(text, "Typography")
    if not body:
        # Fall back: scan the whole doc for the first table that has
        # "Role | Family | Weight | Size".
        for block_start in re.finditer(r"(?m)^#{1,3}\s+.+\n", text):
            snippet = text[block_start.end() : block_start.end() + 4000]
            if re.search(r"Role.*Family.*Weight", snippet):
                body = snippet
                break
    if not body:
        return []
    rows = extract_table(body)
    fonts = []
    for cells in rows:
        if len(cells) < 3:
            continue
        # Skip the header row.
        if cells[0].lower() == "role":
            continue
        fonts.append(
            {
                "role": cells[0],
                "family": cells[1] if len(cells) > 1 else "",
                "weight": cells[2] if len(cells) > 2 else "",
                "size": cells[3] if len(cells) > 3 else "",
            }
        )
    return fonts[:12]


def extract_components(text: str) -> list[str]:
    """Names of distinct components (### headings inside ## Components)."""
    components_section = slice_section(text, "Components")
    if not components_section:
        return []
    names = []
    for m in re.finditer(r"^###\s+(.+?)\s*$", components_section, re.MULTILINE):
        name = m.group(1).strip()
        # Skip generic placeholders.
        if name.startswith("(") or "Add or remove" in name:
            continue
        names.append(name)
    # Dedupe, preserve order.
    seen = set()
    out = []
    for n in names:
        k = n.lower()
        if k in seen:
            continue
        seen.add(k)
        out.append(n)
    return out


def extract_animations(text: str) -> dict:
    keyframes = RE_KEYFRAMES.findall(text)
    js_refs = RE_GSAP_TIMELINE.findall(text)
    # Count unique JS library references.
    libs = set()
    for ref in js_refs:
        key = ref.lower().split(".")[0]
        libs.add(key)
    return {
        "keyframes_count": len(set(keyframes)),
        "keyframes_sample": sorted(set(keyframes))[:8],
        "js_animation_count": len(js_refs),
        "js_libraries_referenced": sorted(libs),
    }


def extract_js_libraries(text: str) -> list[dict]:
    body = slice_section(text, "JavaScript & Libraries")
    if not body:
        return []
    rows = extract_table(body)
    libs = []
    for cells in rows:
        if not cells or cells[0].lower() in ("library", "lib"):
            continue
        if len(cells) >= 2:
            libs.append(
                {
                    "name": cells[0],
                    "version": cells[1] if len(cells) > 1 else "",
                    "detection": cells[2] if len(cells) > 2 else "",
                }
            )
    return libs[:20]


def extract_spacing_radii(text: str) -> dict:
    body = slice_section(text, "Spacing & radius")
    out: dict = {"scale": [], "radii": [], "shadows": []}
    if not body:
        return out
    # Bullet lists of tokens.
    for line in body.splitlines():
        if not line.lstrip().startswith(("-", "*", "·")):
            continue
        clean = line.lstrip("-*· ").strip()
        if "base unit" in clean.lower():
            m = re.search(r"(\d+)\s*px", clean)
            if m:
                out["base_unit_px"] = int(m.group(1))
        elif "scale" in clean.lower():
            out["scale"].append(clean)
        elif "radius" in clean.lower() or "radii" in clean.lower():
            out["radii"].append(clean)
        elif "shadow" in clean.lower():
            out["shadows"].append(clean)
    return out


def extract_stats(text: str) -> dict:
    return {
        "lines": text.count("\n") + 1,
        "hex_colors_total": len(set(RE_HEX.findall(text))),
        "h2_sections": len(re.findall(r"^##\s+", text, re.MULTILINE)),
        "h3_subsections": len(re.findall(r"^###\s+", text, re.MULTILINE)),
        "tables": len(re.findall(r"^\s*\|.*\|\s*$", text, re.MULTILINE)) // 2,
        "code_blocks": len(re.findall(r"```", text)) // 2,
    }


def parse_design(slug: str, path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    # Pull the first overview paragraph for the card description.
    overview = slice_section(text, "Overview")
    description = ""
    if overview:
        for block in re.split(r"\n\s*\n", overview):
            cleaned = re.sub(r"\s+", " ", block).strip(" >#-*")
            if cleaned and not cleaned.startswith("**Category"):
                description = cleaned[:240] + ("…" if len(cleaned) > 240 else "")
                break

    return {
        "slug": slug,
        "name": display_name(slug),
        "description": description,
        "design_md_url": f"https://raw.githubusercontent.com/Shuvam-Banerji-Seal/modern-design.md/main/websites/{slug}/design.md",
        "design_md_view": f"https://github.com/Shuvam-Banerji-Seal/modern-design.md/blob/main/websites/{slug}/design.md",
        "colors": extract_colors(text),
        "fonts": extract_fonts(text),
        "components": extract_components(text),
        "animations": extract_animations(text),
        "js_libraries": extract_js_libraries(text),
        "spacing_radii": extract_spacing_radii(text),
        "stats": extract_stats(text),
    }


def main() -> None:
    p = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    p.add_argument(
        "--out",
        type=Path,
        default=Path("showcase/assets/design-details.json"),
        help="Output JSON path (default: showcase/assets/design-details.json)",
    )
    args = p.parse_args()

    if not WEBSITES.exists():
        print(f"websites/ not found at {WEBSITES}", file=sys.stderr)
        sys.exit(1)

    entries = []
    for slug_dir in sorted(WEBSITES.iterdir()):
        if not slug_dir.is_dir():
            continue
        design_md = slug_dir / "design.md"
        if not design_md.exists():
            continue
        entries.append(parse_design(slug_dir.name, design_md))

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(entries, indent=2, ensure_ascii=False), encoding="utf-8")
    total_colors = sum(len(e["colors"]) for e in entries)
    total_fonts = sum(len(e["fonts"]) for e in entries)
    print(
        f"Parsed {len(entries)} designs → {args.out} "
        f"({total_colors} colors, {total_fonts} font rows extracted)"
    )


if __name__ == "__main__":
    main()
