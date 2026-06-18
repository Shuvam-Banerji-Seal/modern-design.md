# design.md — <site-name>

> A structured design specification of **<original URL>**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** YYYY-MM-DD · **Author:** <handle>

---

## Overview

One-paragraph summary of what this site is, who it is for, and what its
design is trying to do. ~3–5 sentences. No marketing fluff from the
original site.

**Category:** SaaS / Docs / Marketing / E-commerce / Design tool / Other
**Primary surface observed:** Homepage + <list other pages>
**Tone:** e.g. confident, technical, playful, minimal

---

## Visual Language

### Color

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (base) | `--bg-base` | `#XXXXXX` | Closest name |
| Background (elevated) | `--bg-elevated` | `#XXXXXX` | |
| Text (primary) | `--text-primary` | `#XXXXXX` | |
| Text (secondary) | `--text-secondary` | `#XXXXXX` | |
| Text (muted) | `--text-muted` | `#XXXXXX` | |
| Accent | `--accent` | `#XXXXXX` | |
| Accent (hover) | `--accent-hover` | `#XXXXXX` | |
| Border | `--border` | `#XXXXXX` | |
| Success / Warning / Error | — | `#XXXXXX` / `#XXXXXX` / `#XXXXXX` | |

Add rows as needed. Note dark-mode variants if the site supports them.

### Typography

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display (H1) | `<stack>` | 700 | `clamp(2.5rem, 5vw, 4rem)` | 1.05 | `-0.02em` |
| H2 | `<stack>` | 600 | `2.25rem` | 1.15 | `-0.015em` |
| H3 | `<stack>` | 600 | `1.5rem` | 1.25 | `-0.01em` |
| Body L | `<stack>` | 400 | `1.125rem` | 1.6 | `0` |
| Body | `<stack>` | 400 | `1rem` | 1.6 | `0` |
| Body S / caption | `<stack>` | 400 | `0.875rem` | 1.5 | `0` |
| Mono | `<stack>` | 400 | `0.9em` | 1.5 | `0` |

`<stack>` examples: `"Inter Variable", "Inter", system-ui, sans-serif`,
`"JetBrains Mono", ui-monospace, monospace`. Note if the site uses a
self-hosted variable font vs. a system stack.

### Spacing & radius

- **Base unit:** 4px
- **Scale:** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px
- **Radii:** sm `6px`, md `10px`, lg `16px`, xl `24px`, full `9999px`
- **Shadows:** describe elevation levels (e.g. `0 1px 2px rgba(0,0,0,0.06)`,
  `0 8px 24px rgba(0,0,0,0.12)`)

### Iconography

- **Style:** outline / filled / duotone, stroke width, viewBox
- **Library (if observable):** Lucide / Phosphor / Heroicons / custom
- **Default size:** 20px in body, 16px inline, 24px in nav

---

## Layout & Grid

- **Max content width:** e.g. `1200px` or `1280px`
- **Page gutter:** e.g. `clamp(16px, 4vw, 48px)`
- **Grid:** 12-column with `24px` gutter, or 4-column on mobile, etc.
- **Breakpoints:** sm `640`, md `768`, lg `1024`, xl `1280` (px)
- **Vertical rhythm:** baseline grid of `8px`

Describe the homepage's primary layout in 2–3 short paragraphs (hero,
section sequence, footer treatment). Reference sections by their H2 in the
"Components" chapter.

---

## Components

For each major component: purpose, anatomy, states, and any responsive
behavior. Aim for 6–12 components. Suggested starting list — keep, drop,
or add as needed.

### Button
- **Variants:** primary, secondary, ghost, destructive
- **Sizes:** sm `32px`, md `40px`, lg `48px` tall
- **Anatomy:** label (Body S medium), optional leading icon, optional
  trailing arrow
- **States:** default, hover (background shift + slight elevation),
  active (scale 0.98), focus (2px accent ring, 2px offset), disabled
  (40% opacity, no pointer)
- **Radius:** matches `--radius-md`

### Input
- **Anatomy:** label (above), input field, helper text (below), error text
- **Heights:** md `40px`, lg `48px`
- **States:** default (1px border), focus (accent border + ring),
  error (red border + helper text), disabled

### Card
- **Padding:** 24px
- **Background:** `--bg-elevated`
- **Border:** 1px `--border` OR `0 1px 2px rgba(0,0,0,0.06)`
- **Hover:** translateY(-2px) + shadow elevation, 150ms ease-out

### Nav (top bar)
- **Height:** 64px desktop, 56px mobile
- **Anatomy:** logo (left), primary links (center or left-of-center),
  utility actions + CTA (right)
- **Behavior:** sticky, transparent over hero → solid on scroll

### Modal / Dialog
- **Max width:** 480px
- **Backdrop:** `rgba(0,0,0,0.4)` + 8px backdrop-blur
- **Enter:** fade backdrop 150ms, scale dialog 0.96→1.0 200ms ease-out
- **Exit:** reverse, 120ms

### (Add or remove components as appropriate.)

---

## Motion & Interaction

### Principles
- Short, purposeful, never decorative without reason.
- Default easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` (or describe what you
  observed).
- Default duration: 150ms (micro), 200ms (small), 320ms (medium), 500ms
  (large/page).

### Specific behaviors
- **Link hover:** color shift to accent, 120ms.
- **Button press:** scale 0.98, 80ms.
- **Section reveal on scroll:** fade + 8px translateY, staggered 60ms
  between siblings.
- **Page transition:** none / fade / crossfade (describe what you saw).

### Reduced motion
- `@media (prefers-reduced-motion: reduce)` — note what the site does.
  Most good sites: disable non-essential motion, keep focus rings.

---

## Content & Voice

- **Tone:** e.g. confident and direct, technically literate, occasionally
  playful. Do **not** paste the site's taglines — paraphrase.
- **Sentence length:** short to medium. Active voice.
- **Capitalization:** Sentence case in headings (or Title Case — pick one
  and note it).
- **Punctuation:** Oxford comma yes/no, em-dash style, etc.
- **CTA vocabulary:** the 4–6 verbs the site actually uses (e.g.
  *Start free*, *Get a demo*, *Read the docs*).

---

## Information Architecture

List the top-level routes you observed and what each is for. Example:

- `/` — marketing homepage
- `/product` — product overview
- `/pricing` — plans
- `/docs` — documentation root
- `/changelog` — release notes
- `/blog` — content
- `/login`, `/signup` — auth

For each, one sentence on its purpose and primary component.

---

## Accessibility

- **Color contrast:** minimum observed (e.g. body text 7.2:1 on base bg).
- **Focus indicators:** always visible, 2px ring, never removed.
- **Keyboard:** all interactive elements reachable in logical order;
  describe any skip-links.
- **Screen reader landmarks:** header, nav, main, footer are all present
  and labeled.
- **Motion:** reduced-motion handling noted above.
- **Alt text:** observed convention for images and icons.

---

## Sources

Every URL you actually opened while writing this. Group by purpose if it
helps.

- Homepage — https://example.com/
- Product page — https://example.com/product
- Docs — https://example.com/docs
- ...

---

## Changelog

- YYYY-MM-DD — Initial draft by <handle>.
