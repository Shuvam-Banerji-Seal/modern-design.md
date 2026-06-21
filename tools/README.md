# tools/

Helper Python scripts used by the agent in **Phase 1** of the
contribution workflow. They dump a live website into `tmp/<site-slug>/`
so the sub-agent can read it offline and write a `design.md`.

All scripts are invokable from the **repo root** as
`python tools/<name>.py …`. They are path-independent and create
`tmp/` as needed.

## Install (one-time)

The project is managed with [uv](https://docs.astral.sh/uv/) and declares
its dependencies in `pyproject.toml`. Python **3.13** is required.

```bash
# from the repo root, or from tools/ — uv finds the nearest pyproject.toml
uv sync
```

This creates a local virtualenv under `.venv/` and installs every
runtime dep. To enable the optional Playwright-based dynamic pass:

```bash
uv sync --extra playwright
playwright install chromium
```

The scripts can then be run either via the entry points
(`scrape <url> <slug>`, `inventory <slug>`) — after `uv sync` exposes
them on `PATH` — or directly with `uv run`:

```bash
uv run scrape https://stripe.com stripe --depth 2
uv run inventory stripe
```

If you don't use uv, the equivalent pip workflow is:

```bash
python -m venv .venv && source .venv/bin/activate
pip install requests beautifulsoup4 lxml
# optionally:
pip install playwright && playwright install chromium
python tools/scrape.py <url> <slug>
```

## scrape.py

```bash
uv run scrape <url> <site-slug> [--depth 2] [--use-playwright] [--extra-urls file.txt]
# or, without uv:
python tools/scrape.py <url> <site-slug> [--depth 2] [--use-playwright] [--extra-urls file.txt]
```

Walks a site and dumps everything it can find into `tmp/<site-slug>/`:

```
tmp/<slug>/
├── html/        ← .html, .htm
├── css/         ← .css
├── js/          ← .js, .mjs
├── fonts/       ← .woff, .woff2, .ttf, .otf, .eot
├── images/      ← .png, .jpg, .webp, .gif, .avif, .ico
├── svgs/        ← .svg
├── models/      ← .glb, .gltf, .obj, .fbx, .usdz, .dae
├── media/       ← .mp4, .webm, .mp3, .wav
├── other/       ← anything unclassified
└── manifest.json
```

What it does, in order:

1. Fetch the entry URL → `html/index.html`.
2. Parse it for `<link>`, `<script>`, `<img>`, `<source>`, `<meta>`,
   `preload`, `modulepreload`, JSON-LD, inline scripts, etc. Download
   each URL, classify by extension + content-type, place in matching
   folder. The local filename is `<original>__<sha1-8>.<ext>` so
   collisions are impossible.
3. Recurse into downloaded CSS (`@import`, `url(...)`) and JS
   (`import ... from "…"`, `fetch("…")`, `new URL("…", …)`) up to
   `--depth` (default 2).
4. Optionally `--use-playwright` to render the page in headless
   Chromium, wait for network idle, and capture every runtime response
   body. Useful for SPAs and sites that lazy-load code.
5. Optionally `--extra-urls <file>` to seed the queue with a list of
   URLs (one per line) that were discovered by the agent's own
   Playwright pass.
6. Write `tmp/<slug>/manifest.json` with every file's URL, local path,
   type, size, sha1, content-type, how it was discovered, and the
   depth it was reached at. The sub-agent reads this manifest in
   Phase 2.

Limits: stays on the same registrable domain by default (won't wander
into third-party tracking). Override with `--no-domain-limit` if you
genuinely need cross-origin scraping.

## inventory.py

```bash
uv run inventory <site-slug>
# or, without uv:
python tools/inventory.py <site-slug>
```

Reads `tmp/<site-slug>/` and `tmp/<site-slug>/manifest.json`, prints:

- A tree of the dump
- A per-extension file count and byte total
- The number of errors recorded in the manifest

Use this as a sanity check before spawning the sub-agent. If the count
is suspiciously small (e.g. <10 files for a non-trivial site), the
dump was incomplete — re-run `scrape.py` with a higher `--depth` or
do a Playwright pass.

## requirements.txt

```
requests>=2.31
beautifulsoup4>=4.12
lxml>=4.9
playwright>=1.40   # optional, only required for --use-playwright
```

## Writing your own

If a site needs something the baseline doesn't cover — a GraphQL API,
an S3 bucket, a CDN with signed URLs, a specific SPA framework —
add a new script to `tools/`. Conventions:

- One script per concern.
- First line: `#!/usr/bin/env python3` and a short docstring.
- Read inputs from `sys.argv`; write outputs under `tmp/<slug>/`.
- Update `tmp/<slug>/manifest.json` if you add files (use the same
  schema as `scrape.py`).
- Append the script to the table in the AGENTS.md §3.2.
