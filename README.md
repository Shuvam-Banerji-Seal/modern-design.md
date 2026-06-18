<div align="center">

# modern-design.md

**An open-source library of recreated `design.md` files for modern websites.**

Each entry here is a structured Markdown specification of a real website's
design — covering visual language, layout, components, motion, and content
patterns — written so it can be read by humans *and* agents.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./AGENTS.md)
[![Made with Markdown](https://img.shields.io/badge/Made%20with-Markdown-000000.svg)](./template/design.md)

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
├── template/
│   └── design.md          ← copy this when starting a new entry
├── websites/
│   └── <site-slug>/
│       ├── design.md      ← the recreated design specification
│       └── notes.md       ← optional: research notes, screenshots, sources
└── assets/
    └── <site-slug>/       ← optional: logos, color swatches, screenshots
```

---

## Contributing

1. Pick a website that does **not** already have an entry.
2. Read [`AGENTS.md`](./AGENTS.md) — it is the source of truth for how
   agents (and humans) should write a `design.md` here.
3. Copy [`template/design.md`](./template/design.md) into
   `websites/<site-slug>/design.md` and fill it in.
4. Open a pull request. The PR description should link the original site
   and the new `design.md` path.

---

## License

[MIT](./LICENSE) — do whatever you want, just keep the attribution.
