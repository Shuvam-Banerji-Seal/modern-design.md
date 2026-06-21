# showcase/

A live, deployed showcase of every `design.md` in this repository. The
landing page renders a grid of all 36 sites, and each card links to:

- **design.md** — the source spec in `../websites/<slug>/design.md`
- **sample** — a working HTML/CSS/JS implementation in
  `html/<slug>/index.html` that an LLM generated **from the design.md
  alone**. This is the proof that the spec is complete enough to rebuild
  from.

## How it ships

GitHub Actions rebuilds `assets/manifest.json` from the `websites/`
directory on every push to `main` (see `.github/workflows/pages.yml`),
then publishes this folder to GitHub Pages.

## Per-site structure

```
showcase/
├── index.html             ← landing page (auto-renders grid from manifest)
├── css/
│   ├── shared.css         ← landing-page styles
│   └── <slug>/
│       └── style.css      ← per-site sample styles (LLM-generated)
├── js/
│   ├── shared.js          ← landing-page scripts
│   └── <slug>/
│       └── script.js      ← per-site sample scripts (LLM-generated)
├── html/
│   └── <slug>/
│       └── index.html     ← per-site sample page (LLM-generated)
└── assets/
    ├── manifest.json      ← built by tools/build_manifest.py
    └── <slug>/            ← per-site generated images if any
```

## Live URL

https://shuvam-banerji-seal.github.io/modern-design.md/showcase/

(The repo's GitHub Pages root is set to `showcase/` in
**Settings → Pages**.)
