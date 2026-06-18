# AGENTS.md

> Instructions for **agents and humans** contributing a `design.md` to this
> repository. If you are an LLM or coding agent reading this, treat it as
> your operating manual for this repo. If you are a human, treat it as the
> contribution guide.

---

## 1. Mission

You will be given a **website URL**. Your job is to produce a single
`design.md` file that fully describes that website's design — visual
language, layout, components, motion, and content patterns — well enough
that a reader (human or agent) can reconstruct the look-and-feel without
ever opening the original site.

You are **not** reverse-engineering source code, scraping assets, or
reproducing copyrighted content. You are writing a *design specification* in
your own words, from observation of the public site.

---

## 2. Where the file goes

```
websites/<site-slug>/design.md
```

- **`<site-slug>`** is the site's domain with the TLD stripped and
  non-alphanumerics replaced by `-` (e.g. `stripe.com` → `stripe`,
  `linear.app` → `linear-app`, `vercel.com` → `vercel`). All lowercase.
- Each site gets **its own folder** under `websites/`. Never put two sites
  in the same folder.
- The file is **always named `design.md`**. Not `DESIGN.md`, not
  `design.MD`.
- Optional companion files in the same folder:
  - `notes.md` — your research notes, links, observations
  - `assets/` — color swatches, type specimens, annotated screenshots
    (only if you generated them yourself or they are clearly license-free)

Always start by copying [`template/design.md`](./template/design.md) and
filling it in. Do not invent a new structure.

---

## 3. Workflow

When a human (or another agent) gives you a website URL and asks you to
add it to this repo:

1. **Check for an existing entry.** `ls websites/` — if a folder for this
   site already exists, open the existing `design.md` and decide whether
   you are *updating* it (edit + PR with `Update` prefix) or whether the
   user wants a fresh one (ask first).
2. **Create the folder** `websites/<site-slug>/` if missing.
3. **Copy the template** `template/design.md` → `websites/<site-slug>/design.md`.
4. **Research the site.** Open the URL. Read the homepage, at least one
   product/marketing page, and one docs/inner page if it exists. Note the
   visual system, the type scale, the components, the motion, the
   information architecture, and the tone of voice.
5. **Write `design.md`** in your own words following the template's
   section order. Be specific. Use real values (px, rem, hex), not
   hand-wavy descriptions.
6. **Update the index** in [`README.md`](./README.md): add a row to the
   table linking to the new `design.md`, the original site, and a short
   category label (e.g. `SaaS`, `Docs`, `E-commerce`, `Marketing`,
   `Design Tool`).
7. **Commit and push.**
   ```bash
   git checkout -b add/<site-slug>
   git add websites/<site-slug>/ README.md
   git commit -m "Add design.md for <site-slug>"
   git push -u origin add/<site-slug>
   gh pr create --title "Add <site-slug>" --body "Adds design.md for <original URL>."
   ```
8. **Report the PR URL** back to the user when done.

---

## 4. Authoring rules

These are non-negotiable. A `design.md` that breaks them will be rejected
in review.

### Voice & originality
- Write in **your own words**. Do not copy marketing copy, taglines, or
  body text from the original site. You may quote ≤8 words with quotation
  marks and a note.
- Use **present tense, descriptive prose**. "The hero is a full-bleed
  gradient with a centered H1", not "The hero looks nice."
- Be **specific and measurable**. `48px`, `#0A0A0A`, `clamp(2rem, 4vw,
  3.5rem)`, `ease-out 200ms`. Never "big" or "dark" without a value.

### Structure
- Follow the **section order in `template/design.md`** exactly. Sections
  may be removed if genuinely not applicable (note "N/A" with a reason);
  sections may not be reordered or renamed.
- Every `design.md` **must** contain: Overview, Visual Language, Layout &
  Grid, Components, Motion & Interaction, Content & Voice, Information
  Architecture, Accessibility, and Sources.
- Use **H2 (`##`) for top-level sections**, H3 (`###`) for subsections.
  No H1 in the body — the title is the file's first H1.

### Visuals
- Color values are always **uppercase hex** (`#FF3B30`), with the closest
  CSS name in parentheses if helpful.
- Type values include **family, weight, size, line-height, tracking**.
- Spacing values are in **px or rem** with the assumed base (16px).

### Honesty
- If you could not observe something (e.g. motion on a static page),
  write **"Not observed"** — do not invent.
- Cite the **source URL** for every claim that is non-obvious. The Sources
  section is mandatory.
- Do not include personal data, login-gated content, or anything that
  would only be visible to an authenticated user.

### Length
- Target **400–1200 lines** of Markdown per `design.md`. Shorter than
  300 lines is almost certainly too thin; longer than 1500 is almost
  certainly too verbose.

---

## 5. Naming & file hygiene

- Site slugs are **lowercase, hyphen-separated, no dots**. `figma.com` →
  `figma`, `arc.net` → `arc`, `the-browser.company` → `the-browser-company`.
- Filenames inside a site folder are **lowercase, hyphen-separated**:
  `design.md`, `notes.md`, `homepage-screenshot.png`.
- Never commit: `node_modules/`, `.DS_Store`, `*.log`, build outputs,
  large raw screenshots (>1 MB — compress first).
- One PR per site. Do not bundle multiple sites into a single PR.

---

## 6. Pull request checklist

Before opening a PR, confirm:

- [ ] File is at `websites/<site-slug>/design.md`
- [ ] Follows the template's section order
- [ ] All claims are specific and measurable
- [ ] Sources section lists every URL you observed
- [ ] `README.md` index table has a new row for this site
- [ ] No copyrighted text was copy-pasted
- [ ] No login-gated or private content is described
- [ ] Commit message is `Add design.md for <site-slug>`

If any box is unchecked, fix it before requesting review.

---

## 7. When you are given this repository

If you were dropped into this repo **without** a specific request, the
only valid first action is:

```bash
ls websites/ && cat README.md && cat AGENTS.md
```

Then wait for a website URL or a specific task from the user. Do not
speculatively start writing `design.md` files.
