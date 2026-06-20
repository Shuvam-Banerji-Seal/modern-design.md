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
| [Lusion](https://lusion.co) | [lusion/design.md](./websites/lusion/design.md) | Interactive / 3D Studio |
| [Bruno Simon](https://bruno-simon.com) | [bruno-simon/design.md](./websites/bruno-simon/design.md) | Interactive / 3D Studio |
| [Resn](https://resn.co.nz) | [resn/design.md](./websites/resn/design.md) | Interactive / 3D Studio |
| [Immersive Garden](https://immersive-g.com) | [immersive-g/design.md](./websites/immersive-g/design.md) | Interactive / 3D Studio |
| [North Kingdom](https://www.northkingdom.com) | [northkingdom/design.md](./websites/northkingdom/design.md) | Interactive / 3D Studio |
| [FIELD](https://field.io) | [field/design.md](./websites/field/design.md) | Interactive / 3D Studio |
| [Obys Agency](https://obys.agency) | [obys/design.md](./websites/obys/design.md) | Design / Portfolio |
| [Basement](https://basement.studio) | [basement/design.md](./websites/basement/design.md) | Design Studio |
| [Dogstudio](https://dogstudio.co) | [dogstudio/design.md](./websites/dogstudio/design.md) | Interactive / 3D Studio |
| [Make Me Pulse](https://makemepulse.com) | [makemepulse/design.md](./websites/makemepulse/design.md) | Interactive / 3D Studio |
| [Active Theory](https://activetheory.net) | [active-theory/design.md](./websites/active-theory/design.md) | Interactive / 3D Studio |
| [UNIT9](https://unit9.com) | [unit9/design.md](./websites/unit9/design.md) | Production / Interactive |
| [Locomotive](https://locomotive.ca/en) | [locomotive/design.md](./websites/locomotive/design.md) | Digital Agency |
| [Stink Studios](https://www.stinkstudios.com) | [stinkstudios/design.md](./websites/stinkstudios/design.md) | Creative Studio |
| [Hello Monday](https://www.hellomonday.com) | [hellomonday/design.md](./websites/hellomonday/design.md) | Creative Agency |
| [Aristide Benoist](https://aristidebenoist.com) | [aristidebenoist/design.md](./websites/aristidebenoist/design.md) | Motion / Interaction |
| [Zhenya Rynzhuk](https://zhenyary.com) | [zhenyary/design.md](./websites/zhenyary/design.md) | Art Direction / Portfolio |
| [Niccolò Miranda](https://niccolomiranda.com) | [niccolomiranda/design.md](./websites/niccolomiranda/design.md) | Designer / Portfolio |
| [ToyFight](https://toyfight.co) | [toyfight/design.md](./websites/toyfight/design.md) | Creative Agency |
| [fffuel](https://fffuel.co) | [fffuel/design.md](./websites/fffuel/design.md) | Tool Collection |
| [Sequence](https://sequence.xyz) | [sequence/design.md](./websites/sequence/design.md) | Web3 / Developer Tool |
| [Wonderland](https://wonderland.studio) | [wonderland/design.md](./websites/wonderland/design.md) | Brand / Digital Studio |
| [BASIC](https://basicagency.com) | [basicagency/design.md](./websites/basicagency/design.md) | Digital Agency |
| [Bureau Cool](https://bureau.cool) | [bureau-cool/design.md](./websites/bureau-cool/design.md) | Design Studio |
| [Oui Will](https://ouiwill.com) | [ouiwill/design.md](./websites/ouiwill/design.md) | Creative Agency |
| [EPIC Agency](https://www.epic.net) | [epic/design.md](./websites/epic/design.md) | Branding / Web Agency |
| [Garden Eight](https://garden-eight.com) | [garden-eight/design.md](./websites/garden-eight/design.md) | Creative Studio |
| [K72](https://k72.ca) | [k72/design.md](./websites/k72/design.md) | Agency |
| [Monks / MediaMonks](https://media.monks.com) | [media-monks/design.md](./websites/media-monks/design.md) | Global Creative Agency |
| [Firewatch](https://firewatchgame.com) | [firewatchgame/design.md](./websites/firewatchgame/design.md) | Indie Game Marketing |
| [Tendril](https://tendril.ca) | [tendril/design.md](./websites/tendril/design.md) | Motion Design Studio |
| [Awwwards](https://www.awwwards.com/websites/web-interactive/) | [awwwards/design.md](./websites/awwwards/design.md) | Web Design Gallery |
| [The FWA](https://thefwa.com) | [thefwa/design.md](./websites/thefwa/design.md) | Web Design Gallery |
| [Godly](https://godly.website) | [godly/design.md](./websites/godly/design.md) | Web Design Gallery |
| [SiteInspire](https://www.siteinspire.com) | [siteinspire/design.md](./websites/siteinspire/design.md) | Web Design Gallery |
| [CSS Design Awards](https://www.cssdesignawards.com) | [cssdesignawards/design.md](./websites/cssdesignawards/design.md) | Web Design Gallery |

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
