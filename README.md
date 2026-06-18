<div align="center">

# modern-design.md

**An open-source library of recreated `design.md` files for modern websites.**

Each entry here is a structured Markdown specification of a real website's
design — covering visual language, layout, components, motion, fonts,
colors, and assets — written so it can be read by humans *and* agents.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./AGENTS.md)
[![Made with Markdown](https://img.shields.io/badge/Made%20with-Markdown-000000.svg)](./template/design.md)
[![Python 3.13+](https://img.shields.io/badge/python-3.13+-blue.svg)](./tools/pyproject.toml)

</div>

---

## What is a `design.md`?

A `design.md` is a single Markdown file that captures the *full design* of a
website or product surface — typography, color, grid, components, motion,
microcopy, and information architecture — in a form that is:

- **Readable** — anyone can skim it in a code review.
- **Diff-able** — design changes become pull requests.
- **Agent-friendly** — an LLM or coding agent can read it and reproduce the
  look-and-feel without seeing the original site.

This repository collects those files for well-known websites so designers,
developers, and agents have a shared reference library.

---

## How it's built (two phases)

Every entry is produced by a two-phase pipeline run by an LLM agent.
The agent has its own operating manual — see **[`AGENTS.md`](./AGENTS.md)**
for the full workflow. In short:

| Phase | What the agent does | Output |
| --- | --- | --- |
| **1 — Dump** | Walks the live site, downloads HTML/CSS/JS/fonts/images/SVGs/3D models into a local folder, plus a `manifest.json` of every file. | `tmp/<site-slug>/` (gitignored) |
| **2 — Specify** | Spawns a sub-agent that reads the dump and writes a structured `design.md` covering colors, typography, layout, components, JS libraries, animations, and every asset. | `websites/<site-slug>/design.md` |

The dump phase is automated by Python scripts in **[`tools/`](./tools/)**
(managed with `uv`, Python 3.13+). The specify phase is done by a
sub-agent reading the dump.

---

## Index

Each website lives in its own folder under [`websites/`](./websites). The
folder name is the site's slug; the file is always `design.md`.

| Website | `design.md` | Category |
| --- | --- | --- |
| _(none yet — be the first!)_ | — | — |

> Adding an entry is a single pull request. See [`AGENTS.md`](./AGENTS.md)
> for the full workflow and authoring rules.

---

## Repository layout

```
modern-design.md/
├── README.md              ← you are here
├── AGENTS.md              ← instructions for humans + agents contributing
├── LICENSE                ← MIT
├── .gitignore
├── template/
│   └── design.md          ← copy this when starting a new entry
├── tools/                 ← Phase-1 scrapers (Python 3.13, uv)
│   ├── pyproject.toml
│   ├── uv.lock
│   ├── scrape.py          ← `uv run scrape <url> <slug>`
│   ├── inventory.py       ← `uv run inventory <slug>`
│   └── README.md
├── websites/
│   └── <site-slug>/
│       ├── design.md      ← Phase-2 spec (committed)
│       └── notes.md       ← optional: research notes
├── assets/
│   └── <site-slug>/       ← optional: only if you generated them
└── tmp/                   ← Phase-1 dumps (GITIGNORED)
    └── <site-slug>/
        ├── html/  css/  js/  fonts/  images/  svgs/  models/  media/
        └── manifest.json
```

---

## Contributing

1. Pick a website that does **not** already have an entry.
2. Read **[`AGENTS.md`](./AGENTS.md)** — it is the source of truth for how
   agents (and humans) should write a `design.md` here.
3. Copy **[`template/design.md`](./template/design.md)** into
   `websites/<site-slug>/design.md` and fill it in.
4. Open a pull request. The PR description should link the original site
   and the new `design.md` path.

If you are an LLM/coding agent, follow AGENTS.md exactly — it specifies
the dump-then-specify pipeline and the sub-agent prompt template.

---

## License

[MIT](./LICENSE) — do whatever you want, just keep the attribution.
