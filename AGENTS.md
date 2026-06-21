# AGENTS.md

> Operating manual for **agents and humans** contributing a `design.md` to
> this repository. If you are an LLM or coding agent, treat this as your
> source of truth. If you are a human, treat it as the contribution guide.
>
> **TL;DR** — given a website URL, you dump it to `tmp/<slug>/` using the
> scripts in `tools/`, then spawn a sub-agent to read that dump and
> produce `websites/<slug>/design.md`. `tmp/` is gitignored.

---

## Table of contents

1. [Mission](#1-mission)
2. [Where files go](#2-where-files-go)
3. [Capabilities you have](#3-capabilities-you-have)
4. [The dump workflow — Phase 1](#4-the-dump-workflow--phase-1)
5. [The design.md workflow — Phase 2 (sub-agent)](#5-the-designmd-workflow--phase-2-sub-agent)
6. [Authoring rules for `design.md`](#6-authoring-rules-for-designmd)
7. [Commit, push, PR](#7-commit-push-pr)
8. [Pull request checklist](#8-pull-request-checklist)
9. [Naming & file hygiene](#9-naming--file-hygiene)
10. [When you are dropped into this repo with no task](#10-when-you-are-dropped-into-this-repo-with-no-task)

---

## 1. Mission

You will be given a **website URL**. Your job is to produce a single
`design.md` file at `websites/<site-slug>/design.md` that fully
describes that website's design — visual language, layout, components,
motion, **assets, animations, JavaScript, fonts, colors** — well enough
that a reader (human or agent) can reconstruct the look-and-feel without
ever opening the original site.

You are **not** reverse-engineering source code, scraping assets to host,
or reproducing copyrighted content. You are writing a *design
specification* in your own words, from observation of the public site.

The pipeline has **two phases**, both owned by you (the lead agent):

| Phase | What | Where output lands |
| --- | --- | --- |
| **Phase 1** — Dump | Download the live site's HTML, CSS, JS, fonts, images, SVGs, 3D models, and any other assets into a local folder. | `tmp/<site-slug>/` (gitignored) |
| **Phase 2** — Specify | Spawn a sub-agent that reads every file in the dump and writes a structured `design.md`. | `websites/<site-slug>/design.md` |

The sub-agent is not optional. The point of dumping the site is to give
the sub-agent raw material to read; without the sub-agent, the dump is
just a folder of files.

---

## 2. Where files go

```
modern-design.md/
├── README.md                    ← project intro, index table
├── AGENTS.md                    ← this file
├── LICENSE                      ← MIT
├── .gitignore
├── template/
│   └── design.md                ← skeleton copied for each new site
├── tools/                       ← reusable Python helpers (committed)
│   ├── scrape.py                ← Phase 1: dump a site into tmp/<slug>/
│   ├── inventory.py             ← Phase 1: summarize a dump
│   ├── requirements.txt
│   └── README.md
├── websites/
│   └── <site-slug>/
│       ├── design.md            ← Phase 2: the specification (committed)
│       ├── notes.md             ← optional: your research notes
│       └── assets/              ← optional: only if you generated them
└── tmp/                         ← Phase 1 dumps (GITIGNORED)
    └── <site-slug>/
        ├── html/
        ├── css/
        ├── js/
        ├── fonts/
        ├── images/
        ├── svgs/
        ├── models/              ← 3D: .glb, .gltf, .obj, .fbx, .usdz
        ├── media/               ← video, audio
        └── manifest.json
```

**Slug rule:** lowercase, hyphens, no dots, no TLD. `stripe.com` →
`stripe`, `linear.app` → `linear-app`, `the-browser.company` →
`the-browser-company`.

---

## 3. Capabilities you have

### 3.1 Web tools (built into your environment)

- `curl` via the `bash` tool — fast single-URL fetches with `-O`,
  `-L` (follow redirects), `-H` (headers), `-I` (headers only).
- `fetch_fetch` / `webfetch` — full-page fetches that return content as
  markdown or text. Good for quick reads; not for downloading assets.
- `playwright_browser_*` MCP tools — headless Chromium. Use this for
  sites that are JS-rendered, where `curl` only returns an empty shell.
  Also use it to capture screenshots, computed styles, animations,
  and network requests at runtime.
- `context7_query-docs` — useful for looking up framework/library APIs
  (Next.js, GSAP, Three.js, Tailwind, etc.) that you detect in the dump.
- `fetch_fetch` and `webfetch` are **read-only**. Do not post anything
  or hit authenticated endpoints.

### 3.2 The `tools/` scripts

These are reusable, committed, and invoked from the repo root. The
project is managed with [uv](https://docs.astral.sh/uv/) and declares
its dependencies in `tools/pyproject.toml` (Python 3.13+).

| Script | Phase | Purpose |
| --- | --- | --- |
| `tools/scrape.py` | 1 | Walks a site, downloads HTML/CSS/JS/assets into `tmp/<slug>/`, writes `manifest.json`. |
| `tools/inventory.py` | 1 | Prints a tree + extension summary of an existing dump. Sanity check before Phase 2. |
| `tools/pyproject.toml` | — | Python 3.13 project manifest, dependencies, entry points. |
| `tools/uv.lock` | — | Resolved dependency lockfile (committed). |
| `tools/README.md` | — | Documents how to add new scripts. |

Install once with `cd tools && uv sync` (or `uv sync --extra playwright`
to enable the headless-Chromium dynamic pass, then
`playwright install chromium`). Then run either via the entry points
(`scrape …`, `inventory …`) or with `uv run python tools/scrape.py …`.

Treat the scripts as a baseline — extend them when a site needs
something the baseline doesn't cover (e.g. a GraphQL endpoint, a
CDN-signed URL, an S3 bucket). New scripts go in `tools/`, one per
concern. Add a `[project.scripts]` entry in `pyproject.toml` if the
script should be runnable as a CLI command.

### 3.3 Sub-agent delegation

You can spawn a sub-agent with the `task` tool, `subagent_type: "general"`.
The sub-agent gets a fresh context window, so you must hand it
**everything it needs in the prompt**:

- The path to the dump (`tmp/<slug>/`)
- The path where it should write (`websites/<site-slug>/`)
- The site URL (so it can sanity-check what it finds)
- A pointer to the template (`template/design.md`)
- A reminder of the authoring rules in §6
- An explicit list of every section the final `design.md` must contain

See §5 for the exact sub-agent prompt to use.

---

## 4. The dump workflow — Phase 1

The goal: produce a complete-enough snapshot of the site under
`tmp/<site-slug>/` that the sub-agent can read it offline and still
write an accurate `design.md`.

### 4.1 Pre-flight

```bash
ls websites/                                  # check for existing entry
ls tmp/ 2>/dev/null || echo "tmp/ not present yet"  # sanity check
test -f tools/scrape.py && echo "scrape.py ready" || echo "need to write scrape.py"
cd tools && uv sync                           # one-time
```

If `tools/scrape.py` is missing or out-of-date, write/extend it
*before* dumping. See `tools/README.md` for the conventions.

### 4.2 Static pass (most sites)

```bash
python tools/scrape.py <url> <site-slug> --depth 2
```

What happens:
1. Fetch the entry-point HTML → `tmp/<slug>/html/index.html`.
2. Parse it for `<link>`, `<script>`, `<img>`, `<source>` URLs. Download
   each, classify by extension + content-type, place in the matching
   subfolder.
3. Recurse into CSS (`@import`, `url(...)`) and JS (`import ... from`,
   `fetch(`, `new URL(`) up to `--depth` levels. This catches CSS-loaded
   fonts, hero images referenced from stylesheets, and lazy-loaded JS
   modules.
4. Write `tmp/<slug>/manifest.json` with every file's URL, local path,
   type, size, sha1, and how it was discovered.

### 4.3 Dynamic pass (JS-heavy sites)

If the site is a SPA (Next.js, Nuxt, Vite SPA, Astro-hydrated, Gatsby,
etc.), `scrape.py` will only see the bootstrap shell. The actual
content, fonts, and code-split chunks are loaded at runtime by JS.

**Option A — let Playwright drive:** open the site with the
`playwright_browser_navigate` tool, wait for network idle
(`browser_wait_for` with a long `time`, or use `browser_snapshot` to
confirm content rendered), then `browser_network_requests` (with
`static: true`) to enumerate every runtime URL. Feed those URLs back
into `scrape.py` by adding them to a small text file:

```bash
# /tmp/extra-urls.txt — one URL per line
python tools/scrape.py <url> <site-slug> --extra-urls /tmp/extra-urls.txt
```

(`scrape.py` reads `--extra-urls` as a seed list in addition to the
entry URL.) You can also just call `scrape.py` repeatedly with each
URL, or extend `scrape.py` to accept a list directly.

**Option B — script it in Python:** `scrape.py --use-playwright` will
launch a headless Chromium, navigate the URL, wait for network idle,
and capture every response body into the right subfolder. Requires
`playwright install chromium`.

**Save key Playwright artifacts into `tmp/<slug>/playwright/`:**
- `homepage.html` — the fully-rendered DOM (use `browser_snapshot`'s
  underlying HTML).
- `homepage.png` / `homepage-fullpage.png` — screenshots.
- `computed-styles.json` — a small Playwright script that walks the
  DOM and dumps computed `font-family`, `font-size`, `color`,
  `background-color`, `border-radius`, `box-shadow` for every visible
  element. This is gold for the color and typography sections.
- `network.json` — every network request's URL, method, status, type,
  size, content-type.

The sub-agent will read these directly when writing `design.md`.

### 4.4 Sanity check

```bash
python tools/inventory.py <site-slug>
```

Expect a tree of `tmp/<slug>/`, a per-extension file count, and a
`Total: N files` line. If `N` is tiny (e.g. <10) for a non-trivial
site, the dump was incomplete — re-run with a higher `--depth`, do the
dynamic pass, or extend `scrape.py`.

### 4.5 What to do about the dump after Phase 2

`tmp/<site-slug>/` is **not** committed — it is gitignored. Once the
sub-agent has produced `websites/<site-slug>/design.md`, the dump has
served its purpose. You may delete it to save disk
(`rm -rf tmp/<site-slug>`) or leave it for future re-runs. Do **not**
add it to git, do **not** upload it, do **not** copy assets from it
into `websites/<site-slug>/assets/`.

---

## 5. The design.md workflow — Phase 2 (sub-agent)

After Phase 1, the dump is on disk and you have a `manifest.json`. Now
spawn a sub-agent to read the dump and produce `design.md`.

### 5.1 Spawn the sub-agent

Use the `task` tool with `subagent_type: "general"`. The prompt must
include all of the following — sub-agents have no memory of your
session.

**Sub-agent prompt template:**

```
You are producing a `design.md` file for the website at <URL>.

## Inputs you must read
- Dump folder:        tmp/<site-slug>/
- Dump manifest:      tmp/<site-slug>/manifest.json
- Output path:        websites/<site-slug>/design.md
- Skeleton/structure: template/design.md
- Authoring rules:    AGENTS.md §6

## What to do
1. `ls tmp/<site-slug>/` to see the layout.
2. Read `tmp/<site-slug>/manifest.json` to know every file, its type,
   and where it came from.
3. For each section in template/design.md, open the relevant files
   in the dump and extract real values:
   - HTML files         → structure, copy patterns, landmarks, inline SVGs
   - CSS files          → colors (hex), type stacks, @keyframes, radii,
                          shadows, breakpoints
   - JS files           → library names, animation timelines, framework
                          detection (Next/Nuxt/Svelte/etc.)
   - fonts/             → font families, weights, formats
   - images/            → list every image with dimensions if findable
   - svgs/ + inline     → every distinct icon, logo, illustration
   - models/            → every 3D model, format, size, where used
   - media/             → every video/audio asset
   - playwright/*       → computed styles, screenshot, network.json
4. Write `design.md` strictly following the template's section order.
   Do not skip sections. If a section truly does not apply (e.g. no
   3D models), write "N/A — no 3D assets observed in the dump" with a
   one-line reason.

## Hard rules
- Every color in #RRGGBB uppercase, with the closest CSS name in
  parens if helpful.
- Every type value must include family + weight + size + line-height
  + tracking.
- Every animation entry must include the @keyframes name, the file
  it lives in, duration, easing, and trigger.
- Every asset must list local dump path + format + size + source URL.
- No marketing copy from the original site. Paraphrase, don't quote
  >8 words.
- If you couldn't observe something, write "Not observed" — do not
  invent.
- Target 400–1200 lines.

## Return value
A single line: `OK: websites/<site-slug>/design.md (N lines)`.
If you failed, return `FAIL: <reason>`.
```

### 5.2 Validate the output

Before you commit, open `websites/<site-slug>/design.md` and check:

- [ ] First line is `# <site-name> — design.md`
- [ ] Every section from the template is present (Overview, Visual
      Language, Layout & Grid, Components, JavaScript & Libraries,
      Animations, Assets, Motion & Interaction, Content & Voice,
      Information Architecture, Accessibility, Sources).
- [ ] At least 5 hex colors in the Color table.
- [ ] At least 3 component entries.
- [ ] At least 1 entry in the Animations catalog.
- [ ] The Assets section has rows for every type observed in the dump.
- [ ] Sources section lists at least the entry URL.
- [ ] Length is 400–1200 lines.

If any check fails, send the sub-agent a focused fix prompt. Do not
patch the file yourself unless the fix is a one-line correction.

---

## 6. Authoring rules for `design.md`

These are non-negotiable. A `design.md` that breaks them will be
rejected in review.

### Voice & originality
- Write in **your own words**. Do not copy marketing copy, taglines, or
  body text from the original site. You may quote ≤8 words with
  quotation marks and a note.
- Use **present tense, descriptive prose**. "The hero is a full-bleed
  gradient with a centered H1", not "The hero looks nice."
- Be **specific and measurable**. `48px`, `#0A0A0A`, `clamp(2rem, 4vw,
  3.5rem)`, `ease-out 200ms`. Never "big" or "dark" without a value.

### Structure
- Follow the **section order in `template/design.md`** exactly. Sections
  may be marked N/A with a reason; they may not be reordered or renamed.
- Use **H2 (`##`) for top-level sections**, H3 (`###`) for subsections.
  No H1 in the body — the title is the file's first H1.

### Visuals
- Color values are always **uppercase hex** (`#FF3B30`), with the closest
  CSS name in parentheses if helpful.
- Type values include **family, weight, size, line-height, tracking**.
- Spacing values are in **px or rem** with the assumed base (16px).
- Animation entries name the **specific @keyframes / library call**,
  not "there are some animations".

### Honesty
- If you could not observe something (e.g. motion on a static page),
  write **"Not observed"** — do not invent.
- Cite the **source URL** for every claim that is non-obvious. The
  Sources section is mandatory.
- Do not include personal data, login-gated content, or anything that
  would only be visible to an authenticated user.

### Length
- Target **400–1200 lines** of Markdown per `design.md`. Shorter than
  300 lines is almost certainly too thin; longer than 1500 is almost
  certainly too verbose.

---

## 7. Commit, push, PR

```bash
# from the repo root
git checkout -b add/<site-slug>
git add websites/<site-slug>/ README.md
git status                    # confirm only the new site + index row
git diff --cached --stat
git commit -m "Add design.md for <site-slug>"
git push -u origin add/<site-slug>
gh pr create \
  --title "Add <site-slug>" \
  --body "Adds design.md for <original URL>."
```

Report the PR URL back to the user.

If the user asked you to update an existing entry, branch as
`update/<site-slug>`, commit with `Update design.md for <site-slug>`,
and note the diff in the PR body.

---

## 8. Pull request checklist

Before opening a PR, confirm:

- [ ] `websites/<site-slug>/design.md` exists and is 400–1200 lines
- [ ] Every required section is present and follows the template order
- [ ] All claims are specific and measurable
- [ ] The Assets section lists every 3D model, font, image, SVG, and
      media file the dump contained (or N/A with a reason)
- [ ] The Animations catalog names every observed @keyframes and JS
      animation timeline
- [ ] The JavaScript & Libraries table lists every detected library
- [ ] Sources section lists every URL you observed
- [ ] `README.md` index table has a new row for this site
- [ ] `tmp/<site-slug>/` is **not** in the diff (it should be gitignored)
- [ ] No copyrighted text was copy-pasted
- [ ] No login-gated or private content is described
- [ ] Commit message is `Add design.md for <site-slug>`

---

## 9. Naming & file hygiene

- Site slugs are **lowercase, hyphen-separated, no dots**. `figma.com` →
  `figma`, `arc.net` → `arc`, `the-browser.company` →
  `the-browser-company`.
- Filenames inside a site folder are **lowercase, hyphen-separated**:
  `design.md`, `notes.md`, `homepage-screenshot.png`.
- Never commit: `node_modules/`, `.DS_Store`, `*.log`, build outputs,
  `tmp/`, large raw screenshots (>1 MB — compress first).
- One PR per site. Do not bundle multiple sites into a single PR.
- When extending `tools/`, keep one script per concern and add a short
  docstring explaining when to use it.

---

## 10. When you are dropped into this repo with no task

If you were dropped into this repo **without** a specific request, the
only valid first action is:

```bash
ls websites/ && cat README.md && cat AGENTS.md
```

Then wait for a website URL or a specific task from the user. Do not
speculatively start writing `design.md` files.
