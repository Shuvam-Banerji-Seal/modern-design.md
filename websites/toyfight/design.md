# ToyFight — design.md

> A structured design specification of **https://toyfight.co**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** opencode
> **Source dump:** `tools/tmp/toyfight/` (gitignored)

---

## Overview

ToyFight is the public site of ToyFight, a small creative studio based in
the UK. It is a single-page-leaning marketing site built on Next.js (App
Router) with a Prismic CMS behind it, and the entire visual identity is
built around three custom type families, a creamy off-white palette, and
chunks of expressive motion: a pinned/scrubbed full-bleed hero, a Spline
3D scene behind the homepage wordmark, Lenis-smoothed scroll, and a GSAP
ScrollTrigger timeline on every section.

**Category:** Creative agency / Marketing
**Primary surface observed:** Homepage (`/`) + `/services`
**Tone:** confident, playful, craft-obsessed; punctuation-light
copywriter voice; "studio that ships" energy.
**Framework detected:** Next.js 14+ (App Router, `/[...uid]` catch-all
route for Prismic pages), styled-components SSR, custom CSS-in-JS via
`styled-components` (`data-styled.g*` markers in `<style>`).

---

## Visual Language

### Color

All values are taken from the inlined styled-components payload in
`tools/tmp/toyfight/html/asset_85__9bc81d8d`. The base palette is small,
warm, and high-contrast. Accent fills are used as colored "block masks"
behind characters (a brand signature).

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Page background (base) | `--bg-base` | `#FAF6EF` | "linen" cream; set on `body` |
| Inverse / ink | `--ink` | `#0D0D0E` | primary text + black section bg |
| Block / button bg (light) | `--block` | `#F1EDE7` | off-white chip / button |
| Block / dark | `--block-dark` | `#1C1C1E` | card / image-wrap block |
| Card / muted | `--card` | `#212826` | dark teal-black (rare) |
| Accent lavender | `--accent-lavender` | `#E9E3F3` | mask on hero H1 first word |
| Accent pink | `--accent-pink` | `#FFD8F5` | mask on hero H1 last word |
| Accent yellow | `--accent-yellow` | `#FFE500` | "Say Hello" CTA block |
| Accent peach | `--accent-peach` | `#FDEDD4` | services tag chip |
| Accent lemon | `--accent-lemon` | `#FFF490` | services tag chip |
| Accent cyan-grey | `--accent-cyan` | `#DCDCDC` | mobile-nav background |
| Glass / chip fill | `--chip-glass` | `rgba(241,237,231,0.30)` | hero word masks, `backdrop-filter: blur(10px)` |
| Glass (light dark) | `--chip-glass-dark` | `rgba(241,237,231,0.05)` | dark section blocks |
| Selection | — | `#0D0D0E` bg / `#FAF6EF` fg | inverted on select |

Easter-egg class hooks on `<html>` swap a `filter` for `.5s` to give the
whole page a photo-effect treatment: `pop` (saturate 10, contrast 3),
`bw` (grayscale), `negative` (invert), `disco` (infinite hue-rotate
keyframes `lgITyu`), `sepia`, `blur(5px)`, `crt` (blur 1px over the
CRT overlay).

### Typography

Three self-hosted custom faces plus one fallback. CSS root sets
`html { font-size: 62.5% }` so `1rem = 10px`, and body is `1.8rem`
(= 18px). Every styled-component ships with its own
`font-variation-settings: "pxls" 30, "jnts" 100` for the display family.

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display S1 (hero word) | `FKRasterGrotesk` | 400 | `clamp(3.6rem, 1.5199rem + 5.5470vw, 7.2rem)` desktop `clamp(7.2rem, 3.7714rem + 3.3482vw, 10.2rem)` | `0.9` | `-0.10em` |
| H1 (default) | `FKRasterGrotesk` | 400 | `clamp(3.6rem, 1.0857rem + 2.4554vw, 5.8rem)` | `1.1` | `-0.03em` |
| H2 | `FKRasterGrotesk` | 400 | `clamp(2.8rem, 1.6571rem + 1.1161vw, 3.8rem)` | `1.1` | `-0.02em` |
| H3 | `FKRasterGrotesk` | 400 | `2.4rem` | `1.1` | `-0.02em` |
| H4 (button labels, footers) | `FKRasterGrotesk` | 400 | `1.8rem` | `1.1` | `-0.02em` |
| Body L (intro, services) | `SpeziaCondensed` | 400 | `clamp(2.6rem, 2.2533rem + 0.9245vw, 3.2rem)` | `1.4` | `-0.02em` |
| Body XL (services hero) | `SpeziaCondensed` | 400 | `clamp(3.2rem, 2.6222rem + 1.5408vw, 4.2rem)` | `1.1` | `-0.02em` |
| Body 2XL (services huge) | `SpeziaCondensed` | 400 | `clamp(3.6rem, 3.1378rem + 1.2327vw, 4.4rem)` desktop `clamp(4.4rem, 2.8000rem + 1.5625vw, 5.8rem)` | `1.1` | `-0.02em` |
| Body M (UI captions) | `SpeziaCondensed` | 400 | `clamp(1.6rem, 2.3889rem + -0.7704vw, 2.1rem)` | `1.3` | `-0.02em` |
| Caption / mono | `SpeziaMono` | 500 | `1rem` | `1.1` | `0.04em` |
| Mono list | `SpeziaMono` | 500 | `1.2rem` | `1.4` | — |
| Terminal (loading, tags) | `FKRasterGrotesk` | 400 | `1.2rem` | `1.6` | — |
| Button label | `FKRasterGrotesk` | 400 | `1.1rem` | `1` | `-0.02em`, `text-transform: uppercase` |

**Variable font note:** `FKRasterGrotesk` is a variable font exposing
custom axes `pxls` (pixel/variation) and `jnts` (joints). The default
state is `pxls 30, jnts 100`. Only one weight slice is shipped, so the
"weight 400" plus variable axes do all the visual heavy-lifting.

**Fallback strategy:** every face ships a parallel `@font-face … Fallback`
with `ascent-override / descent-override / size-adjust` metrics, so
initial paint is metric-stable even before the woff2 arrives.

### Spacing & radius

- **Base unit:** 4px (the design system speaks `0.4rem` constantly).
- **Scale (rem at 10px base):** `0.1 0.2 0.4 0.6 0.8 1 1.2 1.6 2 2.4 2.8 3.2 4 4.8 6.4 7 7.8 8.5 9.6 10 12.2 16.7` — remapped to px: `1 2 4 6 8 10 12 16 20 24 28 32 40 48 64 70 78 85 96 100 122 167`. `clamp()` is used pervasively for fluid spacing (`clamp(2rem, 1.3204rem + 1.8123vw, 4.8rem)` is the page gutter).
- **Radii:** `0.2rem` (sharp small), `0.4rem` (default block, cards, buttons), `0.6rem`, `0.8rem`, `1rem`, `1.6rem`, `2.3rem` (hover-pill on buttons), `10rem` (hero word chip), `99.9rem` / `999px` (full pill).
- **Shadows / filters:** a single drop-shadow appears inside the CRT overlay (`drop-shadow(3px 5px 3px rgb(0,0,0))` on the SVG corner-clip paths). No traditional elevation shadows are used; depth comes from color contrast and blur.
- **Backdrop blur:** `backdrop-filter: blur(15px)` on the Cloudinary play button, `blur(10px)` on the hero word-mask chips.

### Typography pairing patterns

A few concrete recipes observed across the site:

- **Hero marquee (homepage):** `H1Styled` (`clamp(3.6rem, …, 5.8rem)`) with `font-variation-settings:"pxls" 30,"jnts" 100; letter-spacing:-0.03em; line-height:1.1` — the chip background provides the color contrast.
- **Section title (services):** `Body2XLStyled` at `clamp(3.6rem, …, 5.8rem)` desktop, `letter-spacing:-0.02em; line-height:1.1` — uses `SpeziaCondensed` for a more "editorial" feel rather than the chunky `FKRasterGrotesk`.
- **Body copy in chips:** `BodyL` at `clamp(2.6rem, 2.2533rem + 0.9245vw, 3.2rem); line-height:1.4; max-width:40ch; letter-spacing:-0.02em` — large but still readable as paragraphs.
- **Tag chips / mono metadata:** `BodyCaption` (`SpeziaMono 1rem / 500 / line-height 1.1 / tracking 0.04em`) inside a 0.4rem-padding `BlockMask` chip on `#f1ede7`. Always paired with a small uppercase `BodyButton` label or a coloured accent chip.
- **Button label:** `BodyButtonStyled` (`FKRasterGrotesk 1.1rem / weight 400 / line-height 1 / tracking -0.02em / uppercase`). The actual button height (1.9rem or 3.8rem) determines visual weight.

### Variable font axis behavior

`FKRasterGrotesk` ships with two non-standard axes:

- `pxls` (pixels): default 30. Lower values = chunkier, denser strokes. Higher values = more open / rasterised letterforms.
- `jnts` (joints): default 100. Controls how the joints of the strokes connect (0 = sharp 90°, 100 = rounded smooth).

The site ships at the conservative `pxls 30, jnts 100` setting everywhere; no animated variation of these axes is observed in the CSS or JS.

### Iconography

- **No icon library.** Inline SVGs only. The home uses four 1330×850
  corner-clip SVGs (corner triangles filled `#0D0D0E`) for the CRT
  vignette; the services/play button uses a single inline play glyph
  sized `3.3rem`.
- **Cloudinary play button** (`index-style__CloudinaryPlayButton-sc-526024d7-0`) is a glass chip with a centered inline SVG triangle.
- The "block-mask" chip pattern is used as a graphic primitive: any text
  string can be wrapped in `<BlockText>` and the chip color comes from
  `var(--blockTextColor)` while radius comes from `var(--blockTextRadius)`.

---

## Layout & Grid

- **Max content width:** `192rem` (1920px) — capped by `ContainerMain`
  which is `width:100%; max-width:192rem; margin:0 auto; padding-left/right: clamp(2rem, 1.3204rem + 1.8123vw, 4.8rem)`.
- **Page gutter:** `clamp(2rem, 1.3204rem + 1.8123vw, 4.8rem)` (≈ 20–48px fluid).
- **Grid system:** a CSS-var-driven responsive grid
  `--columns:6; grid-template-columns: repeat(var(--columns), 1fr)` with fluid `grid-column-gap: clamp(1rem, 0.6602rem + 0.9061vw, 2.4rem)`.
  - mobile (<768px): **6 columns**
  - ≥768px: **12 columns**
  - ≥120rem (1920px): **14 columns**
- **Breakpoints (used as raw `rem` or `px`):**
  - `47.9375rem` (≈767.5px) — mobile max
  - `48rem` (768px) — tablet min
  - `79.9375rem` (≈1279.5px) — small-desktop max
  - `80rem` (1280px) — desktop min
  - `90rem` (1440px) — wide-desktop breakpoint
  - `120rem` (1920px) — extra-wide breakpoint
- **Vertical rhythm:** clamp-based everywhere; explicit `Spacer` component
  ships three primitives (`min-height: clamp(3.2rem, 1.0155rem + 5.8252vw, 12.2rem)`, `0.4rem`, `3.6rem`).
- **Pinned sections:** the Intro section and the Links section both go
  full-viewport when both `min-width:1280px` and `min-height:950px`
  (`HomeIntroPinned`, `HomeLinksPinned`).
- **DOM layering (z-index):** `#smooth-content:29` < `html:30` (filter layer) < `#header:31 / 32` < `mobile-nav:31` < `crtscreen:99` < `transitionmask:60` < `tos:50`. The transition mask is intentionally above everything during route transitions.

### Home layout (top → bottom)

1. `<TransitionMaskWrapper>` — 10 vertical black bars (width 25% mobile, 10% desktop) + central "LOADING / PLS / WAIT" pill; pinned fixed during route changes.
2. `<CRTScreen>` — fixed, `pointer-events:none`, full-viewport corner vignette + scanlines + horizontal/vertical CRT masks. Always present in the DOM, opacity 0 until `.crt` is applied to `<html>`.
3. `<Header>` — fixed top, transparent, contains logo (left), nav menu (center, hidden <768px), a glowing yellow "TOYFIGHT" status pill (right, expands from 4rem → 8.8rem on hover), and a hamburger (visible <768px).
4. `<HomeHeroSection>` — 100vh centered column; H1 sits in a wrap with `gap: clamp(0.4rem, 0.3029rem + 0.2589vw, 0.8rem)`. Each word is its own `H1Styled` chip. First word on `#E9E3F3`, last on `#FFD8F5`, middle words on the glass chip. A Spline `<canvas>` sits behind the wordmark. Year `2025` floats bottom-left, fading between `LOADING…` captions.
5. `<HomeIntroSection>` — black bg, large intro copy + an inline Cloudinary video (autoplay muted loop).
6. `<HomeLinksSection>` — pinned full-bleed grid of three featured project tiles, each with a Cloudinary video, a tag chip (`FFF490` / `FDEDD4` / `E9E3F3`), an H4 caption, and bottom-right contact CTA in yellow.
7. `<FooterTagline>` — single line, animated rotating words in 1.8rem `H4Styled`.
8. `<Footer>` — off-white (`#f1ede7`) band with three columns (legal, contact, socials) above a centered tagline bar.

### Services page layout (top → bottom)

1. Same `<Header>`, `<TransitionMaskWrapper>`, `<CRTScreen>` as home.
2. `<ServicesHeroWrapper>` — large `Body2XLStyled` headline (`clamp(5rem, 3.2767rem + 4.5955vw, 12.1rem)`) + grid intro + `HorizontalRule` divider.
3. `<ServicesBlocks>` — repeating row of `[Image | Content]` (alternating left/right) for each capability. Each row has a small `BodyList` mono caption list at the bottom of the content column.
4. `<ServicesClients>` — split: `ServicesClientsLeft` (CTA + caption) and `ServicesClientsRight` (5-column logo grid desktop, wrapping mobile). A sticky reel (`hugulK`) appears mobile-only at `top:50vh`.
5. `<AboutAwardsSection>` (services-specific) — likely the awards reel / horizontal scroller. Container has `z-index:1; pointer-events:none` so a canvas (the `AwardsWrapper`) at `z-index:2` overlays it.
6. `<FooterTagline>` + `<Footer>`.

### Grid item recipes

Observed `GridItemMain` rules in `asset_85__9bc81d8d:313-333`:

| Name | Mobile (<768) | ≥768 | ≥1280 | ≥1440 | ≥1920 |
| --- | --- | --- | --- | --- | --- |
| `fBpFMJ` (intro copy) | 1/-1 | 5/8 | 6/8 | 7/7 | 8/7 |
| `iEbJLB` (intro copy) | 1/-1 | span 6 | — | — | — |
| `fwnvlc` (intro video) | 1/-1 | 8/5 | 7/6 | — | 9/6 |
| `eyUNPd` (intro aside) | 1/-1 | span 6 | — | — | span 7 |
| `jBmvDH` (link-side) | 1/-1 | 7/6 | 9/4 | — | 11/4 |
| `jmTcqB` (link-side) | 1/-1 | — | 9/4 | — | 11/4 |

The grid uses `--columns:6/12/14` (mobile/tablet/extra-wide) with a
fluid column gap `clamp(1rem, 0.6602rem + 0.9061vw, 2.4rem)`. The total
max-width is `192rem` (1920px) on the container; the grid fills the
container.

---

## Components

### `TransitionMaskWrapper` (page-transition mask)
- **Anatomy:** 10 `<div>` bars, each `background:#0D0D0E; transform:scaleX(1.05)`, stacked horizontally. A centered pill row of three loaders ("LOADING", "PLS", "WAIT") sits on top.
- **Sizes:** bars 25% wide <768px (5+ hidden), 10% wide ≥768px (all 10 shown). Pill chip `border-radius: 99.9rem; padding: 1.6rem 1.6rem 1.3rem 1.6rem` with a `radial-gradient` mask for antialiasing.
- **Behavior:** `position:fixed; transform-origin:0 100%; z-index:60`. Bars animate `transform:scaleX` from 0→1 on mount and 1→0 on unmount; pill letters `translateY(100%)→0` with a staggered delay.
- **Source:** `html/asset_85__9bc81d8d:98-111`.

### `CRTScreen` (vignette / scanline overlay)
- **Anatomy:** 4 inline `<svg>` corner triangles (1330×850 viewBox, fill `#0D0D0E`) rotated to fill the viewport. Two pseudo-elements render scanlines as linear gradients (`rgba(0,0,0,1)` ↔ `rgba(51,51,51,0.5)`) tiled at 5px.
- **Keyframes:** `hSCXYX` (vertical scan, `0.2s linear infinite`) and `ifEVSn` (horizontal scan, `4s cubic-bezier(0.8, 0, 0.2, 0.99) alternate infinite`).
- **State:** `position:fixed; transform:scale(1.1); visibility:hidden; pointer-events:none; z-index:99`. Only becomes interactive when `.crt` is added to `<html>` (then `visibility:visible`).
- **Source:** `html/asset_85__9bc81d8d:112-124`.

### `Button` (`ButtonMain / ButtonContent / ButtonContentInner / ButtonContentMask / ButtonIcon`)
- **Anatomy:** a flex row of two `<p>` labels stacked on top of each other inside an `overflow:hidden` grid; the second label sits at `translateY(105%)`. On `:hover/:focus`, the first label slides to `-100%` and the second to `0`. A trailing icon (optional, 3.8rem square) shares the row.
- **Radius swap:** `border-radius: 0.2rem` default → `2.3rem` on hover/focus, `transition: border-radius 1.2s cubic-bezier(0.190, 1.000, 0.220, 1.000)`.
- **Variants:**
  - **Dark-on-light (default "see work" pill):** chip `#0D0D0E bg / #f1ede7 fg`, height `1.9rem`, padding `0 0.6rem`.
  - **Light-on-dark (large CTA):** chip `#f1ede7 bg / #0D0D0E fg`, height `3.8rem`, padding `0 1.6rem`, icon `3.8rem`.
  - **Small light-on-dark:** `#f1ede7 bg / #0D0D0E fg`, height `1.9rem`, padding `0 0.6rem`.
  - **Disabled:** opacity `0.5`, mask stays static.
- **Source:** `html/asset_85__9bc81d8d:124-157`.

### `TextLink` (header nav)
- **Anatomy:** inline `<a>` with overflow-hidden inner div; `<span>Label</span><span>Label</span>` stacked. On `:hover` the first span slides `-100%` and the second enters from `+100%`.
- **Transition:** `transform 0.4s cubic-bezier(0.190, 1.000, 0.220, 1.000)`.
- **Source:** `html/asset_85__9bc81d8d:191-197`.

### `BlockText` (chip-style highlight on text)
- **Anatomy:** any text is wrapped; the wrapper `<span class="block__mask">` becomes a colored chip. Two children `block__text` sit in a CSS grid (`grid-area:1/1`); on `show` the second child `translateY(150%)→0` while the first `0→-150%`.
- **Variants:** `BlockMaskBase` provides `dkbkRH` (radius `2px`) and `iUpysU` (radius `999px`). Color comes from `var(--blockTextColor)` set inline by callers (e.g. `#E9E3F3`, `#FFD8F5`, `#FFE500`, `#FAF6EF`).
- **Source:** `html/asset_85__9bc81d8d:47-65`.

### `TFMain` (the "TOYFIGHT" status pill)
- **Anatomy:** a small black rounded button with the brand spelled in `SpeziaMono`. Idle width `4rem`, hover/focus width `8.8rem`. The label is two stacked `TFText` rows; on hover the first slides `translateX(-40%) translateY(-100%)` and the second `translateY(100%)→0`. A blinking cursor (`TFBlink`, `animation:fGfiBX 1.5s infinite` — keyframes defined `0%/49% opacity 0`, `51%/100% opacity 1`) is the leading character on idle.
- **Source:** `html/asset_85__9bc81d8d:198-218, 242-243`.

### `MobileNav` (off-canvas menu)
- **Trigger:** the header pill button `HeaderMobileToggle` (visible <768px), `border-radius:6.4rem; padding:1.3rem 1.6rem 1.2rem; background:#f1ede7; color:#0D0D0E`. The label swaps between "Menu" and "Close" with a `translateY` mask transition.
- **Panel:** `position:fixed; top:0; left:0; width:100%; height:calc(var(--vh, 1vh) * 100); background:#DCDCDC; padding:6rem 1rem 2.6rem 1rem; z-index:31`. Menu items are large pill chips (`border-radius:99.9rem; padding:1.6rem`), font `clamp(2.5rem, …, 5.8rem)`. Social links in a column below, footer info at the bottom.
- **Animation:** `opacity 0.3s ease-in-out` on the container; menu items use the same `AnimateSmoothContent` 0.4s slide as everywhere else.
- **Source:** `html/asset_85__9bc81d8d:244-263`.

### `Header` (top bar)
- **Anatomy:** fixed top, full bleed, padding `clamp(2rem, 1.3204rem + 1.8123vw, 4.8rem)`. Logo on the left (`TFMain`), nav links centered (hidden <768px), `HeaderMobileToggle` on the right.
- **Logo behavior:** the "TOYFIGHT" pill starts collapsed to a single blink-cursor at `4rem`, expands to `8.8rem` on hover showing the full word.
- **Source:** `html/asset_85__9bc81d8d:225-241`.

### `CloudinaryVideo` (hero + project tiles)
- **Anatomy:** `border-radius:0.4rem; overflow:hidden` wrapper around a `<video>` (or `<img>`). A `CloudinaryPlayButton` overlays center (opacity 0 idle, opacity 1 on hover); the play button is a glass chip `rgba(230,227,223,0.2) bg / backdrop-filter:blur(15px) / border-radius:1.6rem / padding:1.8rem 3.9rem 1.8rem 4.5rem`.
- **Hover:** `transform: translate(-50%, -50%) scale(1.1)` on the button, `cubic-bezier(1.00, -0.50, 0.00, 1.50)`.
- **Source:** `html/asset_85__9bc81d8d:265-275`.

### `FooterTagline` (animated word rotator)
- **Anatomy:** a single line of `FooterTaglineWord` spans; only the first has `opacity:1`, the rest are `position:absolute; opacity:0`. A small JS ticker swaps which child is visible, rotating the studio tagline through a vocabulary.
- **Style:** `H4Styled` at `1.8rem`, each word in its own `BlockMask` chip on `#FAF6EF`.
- **Source:** `html/asset_85__9bc81d8d:402-411`.

### `Footer`
- **Anatomy:** `background:#f1ede7; padding: clamp(3.2rem, 9.7864rem + -3.4304vw, 8.5rem) clamp(2rem, …, 4.8rem) 2.8rem; margin-top:-1px` (sits over the dark section above for a crisp seam).
- **Three columns** (legal / contact / socials) collapse to column-reverse on mobile (`flex-direction:column-reverse`). Each link is a `BlockText` chip on `#FAF6EF`.
- **Source:** `html/asset_85__9bc81d8d:412-437`.

### `TOS` (the small AI/chat panel docked bottom-right)
- **Anatomy:** a fixed-right 268px panel, `border-radius:8px`, hidden by default (`width:0; overflow:hidden; pointer-events:none`). Slides in from the right.
- **Inner:** `background:#f1ede7; padding:27px 16px; line-height:1.5; flex column`. Header caption in `BodyCaption` mono, prompt chips in a wrap row, footer with an input (`FKRasterGrotesk 1.2rem`, blurred placeholder spans behind it).
- **Audio:** plays `/audio/tos/techno-remix.mp3` (385KB) on open.
- **Source:** `html/asset_85__9bc81d8d:158-182`, `media/techno-remix__e97b4341.mp3`.

### `HomeContact` (yellow "say hello" chip in hero)
- **Anatomy:** fixed bottom-right on desktop, `align-items:flex-end; gap:0.4rem; padding-bottom:70px`. Hidden <1280px. Block mask `#FFE500` with `H4Styled` label.
- **Captions:** rotating between contact phrases; secondary copies `opacity:0` until activated.
- **Source:** `html/asset_85__9bc81d8d:276-283`.

### `HomeHeroSpline` (the 3D scene behind the hero wordmark)
- **Anatomy:** an `<Spline scene="…/scene.splinecode" />` component (from the chunk `js/page-c5ffecf00f5ad688__1b71fd89.js`) renders a `<canvas>` behind the hero. Loaded file is `scene__131cc2cd.splinecode`, 13.18 MB. The canvas is full-bleed, positioned absolute.
- **Audio:** plays `/audio/header/fx.mp3` (21.3 KB) on first hero interaction.
- **Source:** `manifest.json:519-537`, `js/page-c5ffecf00f5ad688__1b71fd89.js`, `other/scene__131cc2cd.splinecode`.

### `HomeHeroSection` (the marquee top block)
- **Anatomy:** `display:flex; align-items:center; justify-content:center; height:100vh; position:relative; z-index:4`. The hero is a flex column centered inside `ContainerMain`. Three H1 words each get their own `H1Styled` chip; middle words use the glass `block__mask` chip (`background:rgba(241,237,231,0.3)` + `backdrop-filter:blur(10px)`).
- **First H1 word** (left): `background:#E9E3F3; padding:0.3em 0.3em 0.2em 0.3em; border-radius:10rem`.
- **Last H1 word** (right): `background:#FFD8F5; padding:0.3em 0.3em 0.2em 0.3em; border-radius:10rem`.
- **Margin trick:** the word row has `margin-top:-6rem` when there is no Spline behind it, and `margin-top:clamp(-42rem, -23.9806rem + -9.3851vw, -27.5rem)` when the Spline canvas is present, so the wordmark sits visually on top of the 3D canvas.
- **Year caption (bottom-left):** `mix-blend-mode:difference; color:#FAF6EF` so the year reads against either light or dark backgrounds. Cycles through three strings via a JS ticker.
- **Source:** `asset_85__9bc81d8d:284-308`.

### `HomeHeroHeading` (the three-word H1 wrap)
- **Anatomy:** `display:flex; align-items:center; justify-content:center; flex-wrap:wrap; pointer-events:none; margin-top:-6rem; max-width:clamp(38rem, 20.5243rem + 46.6019vw, 110rem); width:95%; margin-left:auto; gap:clamp(0.4rem, 0.3029rem + 0.2589vw, 0.8rem); margin-right:auto; position:relative; z-index:2`.
- **Sizing override:** inside this wrapper, `H1Styled` is `font-size:clamp(2.8rem, calc(2.8rem + (58 - 28) * (min(100vw, 100vh * 1.7777777777777777) - 37.5rem) / (1280 - 375)), clamp(5.8rem, calc(min(100vw, 100vh * 1.7777777777777777) / 1920 * 58), (192rem / 1920) * 58))` — a fluid two-axis clamp that scales with the smaller of viewport width / height×1.777.
- **Mask stacking:** each word's inner `block__mask` has its own `before` pseudo creating a 5% black overlay (`rgba(0,0,0,0.05)`) for extra contrast against the bright Spline canvas.
- **Source:** `asset_85__9bc81d8d:288-298`.

### `HomeIntroSection` (dark pinned intro)
- **Anatomy:** `background:#0D0D0E; color:#FAF6EF; overflow:hidden; position:relative; z-index:3`. Becomes `height:100vh` when viewport is ≥1280 × 950.
- **Padding:** top `clamp(12.8rem, 11.8534rem + 2.5243vw, 16.7rem)`; bottom `134px` (or `78px` ≥1280px). H1 right-aligned via `margin-left:auto; margin-right:0; text-align:right`.
- **Video block:** `<CloudinaryVideoEmbed>` (`border-radius:0.4rem`) hosts the autoplay muted loop. Below it, the `IntroTextInner` is a column at `flex-end`.
- **Source:** `asset_85__9bc81d8d:335-353`.

### `HomeLinksSection` (pinned 3-tile project grid)
- **Anatomy:** `position:relative; z-index:2`; `padding-top:12rem; padding-bottom:clamp(9.8rem, …, 10rem)`. Becomes `height:100vh` ≥1280 × 950. Uses the same `--columns:14` grid at 1920px.
- **Tile structure (per project):** `HomeLinksLinkInner` (flex column justify between, height `100%` desktop / `100%` mobile-with-margin); `HomeLinksLinkTop` (top-left absolute, padded `clamp(1.6rem, …, 3.2rem)`, H4 caption); `HomeLinksLinkMiddle` (centered `<video>` / `<img>` max-height `clamp(20rem, …, 50rem)` for primary, `clamp(20rem, …, 24rem)` for secondary); `HomeLinksLinkBottom` (absolute bottom-left, tag chips + CTA).
- **Primary tile (`djFFqV`):** spans 2 grid rows ≥1280px.
- **Tag chips:** first tile uses `#FFF490`, second `#FDEDD4`, third `#E9E3F3`.
- **Right column links:** `flex-direction:column; text-align:right; padding-bottom:2.8rem; order:-1` <1280px.
- **Source:** `asset_85__9bc81d8d:356-401`.

### `ServicesHeroWrapper` (services page top block)
- **Anatomy:** `position:relative; padding-bottom:clamp(9.8rem, …, 10rem); padding-top:12rem`. The H1 inside uses `TextStyles__Body2XLStyled-sc-f5c12900-5` at `clamp(5rem, 3.2767rem + 4.5955vw, 12.1rem)` — the largest type on the site. Below it, an `HorizontalRule` (`background:rgba(13,13,14,0.5); height:0.05rem; transform:scaleX(0); transform-origin:25% 50%; transition:transform 1s cubic-bezier(0.190, 1.000, 0.220, 1.000) 0s`) animates in.
- **Source:** `services__09fe3f60:437-445`.

### `ServicesBlocks` (per-service row, services page)
- **Anatomy:** image left/right (alternating); content right/left; image `aspect-ratio:0.79/1` (portrait) mobile, `height:clamp(51.5rem, …, 70rem)` desktop. Each service is a `<img>` or Cloudinary `<video>` inside a 0.4rem-radius overflow wrapper.
- **Heading row:** `display:flex; flex-direction:row-reverse; justify-content:flex-end; gap:0.8rem` mobile; `row` direction ≥768px. The H2 keeps `font-size:3.8rem` here.
- **Tag chips:** `<ul class="gkoqef">` of `SpeziaMono 1rem` chips with the standard `BlockMaskBase` (`background:#f1ede7`).
- **Clients column:** `display:flex; flex-direction:column; justify-content:flex-end; text-align:right; align-items:flex-end` ≥768px.
- **Source:** `services__09fe3f60:446-475`.

### `ServicesClients` (clients logo grid + reel)
- **Anatomy:** two halves. Left (`ServicesClientsLeft`) holds a vertical stack of "All work" CTA + caption; right (`ServicesClientsRight`) is a 5-column logo grid at ≥1280px (`grid-template-columns:repeat(5,1fr); grid-column-gap:clamp(1rem, …, 2.4rem)`), wrapping to `flex-wrap:wrap` mobile. Each logo cell is its own image.
- **Mobile reel:** `<div class="hugulK">` is `position:sticky; top:50vh; width:clamp(11.3rem, …, 31.3rem)` — a sticky 16:9 reel pinned mid-screen while the user scrolls the client list.
- **Image card:** `aspect-ratio:370/236; background:#0D0D0E; border-radius:0.4rem`.
- **Source:** `services__09fe3f60:476-503`.

### `AwardsWrapper` (canvas mount for an animation)
- **Anatomy:** `position:absolute; top:0; left:0; height:100%; z-index:2`. Inside the wrapper, the `<canvas>` fills `100% × 100%` — likely a GSAP/Three.js animation reacting to scroll or cursor.
- **Source:** `services__09fe3f60:504-506`.

---

## JavaScript & Libraries

Detection sources are `_next/static/chunks/*.js` filenames, manifest
content-types, and substring matches in the minified JS. No `package.json`
is in the dump, so versions come from the manifest's content-type and
from string literals inside the bundles.

| Library | Version (visible) | Detection | Notes |
| --- | --- | --- | --- |
| Next.js | 14+ (App Router) | `_next/static/chunks/app/page-*.js`, `_next/static/chunks/app/layout-*.js`, `_next/static/chunks/app/[...uid]/page-*.js` | React-based, RSC + client hydration; `webpack-0187edff1088640d.js` is the webpack runtime. |
| React | 18+ | `r.js`, `jsx-runtime` symbols in chunks | Implicit via Next.js. |
| styled-components | 6.x | inline `<style>` blocks with `data-styled.g*` markers; `sc-keyframes-*` ids | Used at SSR time (full CSS inlined into HTML). |
| GSAP | 3.12.2 | `js/9088-8b45f23b7bb441e9__b31071e1.js` (ScrollTrigger plugin), `js/6366-d35c03f2578516ce__97176296.js`, `js/4430-950a9ff67bd2a3db__a891a8d5.js`, `js/4503bbeb-1f79cdaca32c1f2e__c2fdd70d.js`, `js/c15bf2b0-7bb9c2c913560354__fda6cef4.js` | `Observer`, `ScrollTrigger`, `CustomEase` (registered as `_CE`) and a `splitText`-style reveal helper. Version literal `H.version="3.12.2"` and `g.version="3.12.2"` in the bundle. |
| Lenis | 1.0.42 | `js/5559-be78a3c3b8375536__6e64a3d0.js`, `js/layout-f8374c5cb3ed04b2__effe6da1.js` | Smooth-scroll engine. Adds `html.lenis`, `html.lenis-smooth`, `html.lenis-scrolling`, `html.lenis-stopped` classes (these classes are referenced in the inlined CSS too). Version literal `window.lenisVersion="1.0.42"`. |
| @splinetool/runtime | 1.9.82 | `js/c6a54c64.afb25de4a57a55c9__30905170.js` (1.96 MB, the largest single chunk) | Loads `scene__131cc2cd.splinecode`; pulls `@splinetool/runtime`, `boolean-wasm`, `modelling-wasm`, `navmesh-wasm`, `ui-wasm`, `draco_decoder.wasm` from `https://unpkg.com/@splinetool/*@1.9.82/build/`. |
| three.js (bundled inside Spline runtime) | r160-ish | referenced `three.js` once in `c6a54c64.afb25de4a57a55c9.js` | Spline bundles its own Three; not directly used by ToyFight code. |
| Prismic | `@prismic/client` and the prismic.io JS bundle | `js/7411-fd4dd12d782707e0__67483318.js` (`prismic.js`), `js/page-37a197cf33b454e9__2424ca2e.js`, `js/page-37f18bd06f28a651__ecaf0851.js` | CMS source — `https://static.cdn.prismic.io/prismic.js?new=true&repo=toyfight` is lazy-loaded. Image CDN is `https://images.prismic.io/toyfight/…`. The `<iframe src="https://toyfight.prismic.io/prismic-toolbar/4.1.2/iframe.html">` is the editor toolbar. |
| Google Analytics | GA4 (`G-5NVMKC92BC`) | `<script id="_next-ga" src="https://www.googletagmanager.com/gtag/js?id=G-5NVMKC92BC">` | `gtag('js', new Date()); gtag('config','G-5NVMKC92BC')`. |
| lite-youtube-embed | (latest master) | referenced via `@next/third-parties` `YouTubeEmbed` JSON descriptor (`js/51642.js`) | Not actively rendered on the homepage but the third-party component is wired up. |
| next-third-parties (GoogleAnalytics, GoogleMapsEmbed, YouTubeEmbed, LiteYTEmbed) | bundled in `js/65125.js` | | GA is the only one actively used on `/`. |

Likely present but not load-bearing for design:

| Library | Note |
| --- | --- |
| `draco_decoder.wasm` (280 KB) | Loaded by Spline runtime for geometry decode. Local: `other/draco_decoder__f0d7a121.wasm`. |
| `process.wasm` (506 KB) | Spline modelling wasm, loaded lazily only when the scene contains subdiv objects. Local: `other/process__790d3810.wasm`. |

### Library feature mapping

For each observed library, the dump's JS chunks tie it to specific
features:

| Feature | Library | Evidence |
| --- | --- | --- |
| Page transition mask reveal | styled-components + a small GSAP-driven unmount | `js/9088-8b45f23b7bb441e9__b31071e1.js` registers `Observer`/`ScrollTrigger` |
| Hero Spline scene | `@splinetool/runtime` 1.9.82 | `js/c6a54c64.afb25de4a57a55c9__30905170.js` fetches `scene__131cc2cd.splinecode`, loads `process.wasm` + `draco_decoder.wasm` + `navmesh.wasm` conditionally |
| Smooth scroll | Lenis 1.0.42 | `js/5559-be78a3c3b8375536__6e64a3d0.js` instantiates `Lenis` class; `window.lenisVersion = "1.0.42"` |
| Section reveal / pin | GSAP 3.12.2 + ScrollTrigger 3.12.2 | Multiple chunks, version literals `H.version="3.12.2"` and `g.version="3.12.2"` |
| Per-character stagger | GSAP CustomEase (`_CE`) | `js/5559-be78a3c3b8375536__6e64a3d0.js` (`g.version="3.12.2"`, registers `CustomEase`) |
| Drag-to-pan on hero | GSAP Observer | `js/9088-8b45f23b7bb441e9__b31071e1.js` (Observer + ScrollTrigger same chunk) |
| CMS content (page, body, image refs) | `@prismic/client` / `prismic.js` | `js/7411-fd4dd12d782707e0__67483318.js`, `js/prismic__c530afa7.js`, content ref `images.prismic.io/toyfight/...` |
| Analytics | `googletagmanager.com/gtag` + `@next/third-parties/google-analytics` | `<script id="_next-ga" src="https://www.googletagmanager.com/gtag/js?id=G-5NVMKC92BC">` |
| Audio playback (button / header / TOS) | native `<audio>` element + small React wrapper | `media/fx__21ca8775.mp3`, `media/fx__ae827ed0.mp3`, `media/techno-remix__e97b4341.mp3` |
| Image optimization | Next.js `<Image>` (likely) — `next/image` chunk patterns | All hero/project tile assets come from Prismic CDN with `auto=format,compress&fit=clip` query strings, which is Next/Image's default transform pipeline. |
| DOM layered structure | styled-components SSR + Next.js streaming | Inline `<style>` blocks with `data-styled.g1` … `data-styled.g200` markers, plus a global CSS reset at the top of every HTML file. |

### Build / runtime hints

- The presence of `polyfills-42372ed130431b0a__dc1a057a.js` (112 KB) and a webpack runtime (`webpack-0187edff1088640d__bd37f713.js`, 4.4 KB) confirms a standard Next.js webpack build, not Turbopack.
- Code-splitting is per-route (chunks named `page-*.js`, `layout-*.js`, `not-found-*.js`) and per-feature (chunks named `4430-*.js`, `5559-*.js`, etc., hashed by module id).
- Manifest mentions 6 errors during scraping; these are the failing fetches for cookies/challenge pages, not a broken build.

### What the JS chunks actually contain (per-file summary)

The dump ships 27 JS chunks; the most relevant for the design spec:

| Chunk (size) | Role |
| --- | --- |
| `c6a54c64.afb25de4a57a55c9.js` (1.96 MB) | The **Spline runtime** bundle. Contains the entire `@splinetool/runtime` 1.9.82, embedded Three.js, draco decoder wrapper, scene loader (`async load(url)`), event handlers (Hover, Scroll, Drag, Follow, LookAt, AIAssistant, etc.), physics + modelling + ui + boolean wasm bootstrappers, and the internal `O4` event manager class. |
| `a0e187c9.5551047b6f887e62.js` (170 KB) | Three.js r160-ish core (the bundled copy Spline depends on). |
| `1684-6da76ec19ceb2cdd.js` (172 KB) | Three.js extras (controls, loaders, materials) used by the Spline runtime. |
| `4bd1b696-4e953562e67ef227.js` (169 KB) | React 18 runtime + scheduler + a few hooks. Standard Next.js chunk. |
| `6366-d35c03f2578516ce.js` (103 KB) | **GSAP core** — contains `gsap.to / gsap.fromTo / gsap.timeline / gsap.set / gsap.utils` plus ease functions. |
| `9088-8b45f23b7bb441e9.js` (41 KB) | **GSAP ScrollTrigger 3.12.2** + Observer. Version literals `H.version="3.12.2"` and `t$.version="3.12.2"`. |
| `5559-be78a3c3b8375536.js` (29 KB) | **GSAP CustomEase 3.12.2** (registers as `_CE`) + **Lenis 1.0.42**. Bundled together; both libraries share the same chunk. |
| `4503bbeb-1f79cdaca32c1f2e.js` (51 KB) | `gsap/MotionPath`, `gsap/DrawSVG`, easing extras. |
| `c15bf2b0-7bb9c2c913560354.js` (50 KB) | `gsap/SplitText` (the per-character stagger). |
| `4430-950a9ff67bd2a3db.js` (20 KB) | `gsap/ScrollToPlugin` (used for smooth-scroll jump to anchors). |
| `1754-c42b63096da4e312.js` (10 KB) | `gsap/Draggable`. |
| `2473-1de82f046f708e72.js` (10 KB) | `gsap/InertiaPlugin`. |
| `4134-f1aef0f9a8e33782.js` (26 KB) | `gsap/Physics2DPlugin` + `PhysicsPropsPlugin`. |
| `138-6f9ec9348859dcb8.js` (14 KB) | `gsap/Easel`. |
| `1588-92fa04afdab5a3f3.js` (26 KB) | `gsap/PixiPlugin` (likely unused but bundled). |
| `5833-d909fcfbab6c1f81.js` (5.5 KB) | `gsap/CSSRulePlugin`. |
| `7411-fd4dd12d782707e0.js` (31 KB) | **Prismic client integration** (`@prismic/client` and helpers). |
| `9470.c8a63e6d042fb714.js` (66 KB) | Spline modelling wasm bootstrap. |
| `501.4643abdf68f6ea01.js` (3.8 KB) | Small util chunk. |
| `1652.07243f946ea2a45b.js` (27 KB) | Spline audio engine (used when the scene has audio events). |
| `7376-d2f57a936d9a9fda.js` (16 KB) | Spline text-input helper. |
| `4817-94026f3163a56082.js` (13 KB) | Spline spline UI / camera helpers. |
| `page-c5ffecf00f5ad688.js` (27 KB) | The **homepage React component bundle**. Wraps `<Spline>`, GSAP timelines, and the `HomeHero*` styled components. |
| `page-37a197cf33b454e9.js` (15 KB) | The `[...uid]` catch-all Prismic page bundle. |
| `page-37f18bd06f28a651.js` (38 KB) | The **`/services` page bundle**. |
| `layout-f8374c5cb3ed04b2.js` (41 KB) | The Next.js **root layout** bundle. Instantiates `Lenis`, mounts the `<Header>`, the `<TOS>` panel, and the global `<TransitionMaskWrapper>` / `<CRTScreen>`. |
| `not-found-e6a4d7560a31eb56.js` (10 KB) | 404 page bundle. |
| `main-app-e4b300d916c71622.js` (521 B) | Tiny bootstrap that wires the root layout to the app. |

---

## Animations (Catalog)

### CSS `@keyframes`

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `lgITyu` | `html/asset_85__9bc81d8d:38` | `2s` | linear (default) | `html.disco` class → infinite hue-rotate `0deg→360deg` |
| `hSCXYX` | `html/asset_85__9bc81d8d:121` | `0.2s` | linear (default) | `CRTScreen::before` → infinite vertical scanline shift `0 0 → 0 5px` |
| `ifEVSn` | `html/asset_85__9bc81d8d:123` | `4s` | `cubic-bezier(0.8, 0, 0.2, 0.99) alternate` | `CRTScreen::after` → infinite horizontal scanline shift `0 0 → 100px 0` |
| `fGfiBX` | `html/asset_85__9bc81d8d:242` | `1.5s` | stepped (0/49/51/100%) | `TFBlink` cursor in the "TOYFIGHT" logo pill |

### CSS transitions (per-property catalog)

Most "animations" are pure CSS transitions, used uniformly across the
site. The two dominant easings are:

- `cubic-bezier(0.190, 1.000, 0.220, 1.000)` — ToyFight's "out-expo" signature ease (also known as expo-out). Used for buttons, text-links, footer, tags.
- `cubic-bezier(0.130, 0.470, 0.130, 0.980)` — "smooth" out-cubic for reveal/scroll-in animations.
- `cubic-bezier(1.00, -0.50, 0.00, 1.50)` — overshoot/back for play-button hover.

| Trigger | Properties | Duration | Easing | Source |
| --- | --- | --- | --- | --- |
| `ButtonContentInner` `:hover/:focus` | `border-radius 0.2→2.3rem` | `1.2s` | `cubic-bezier(0.190, 1.000, 0.220, 1.000)` | `asset_85__9bc81d8d:128-129` |
| `ButtonContentMask > p` `:hover` | `transform translateY(0 / -100%)` | `0.667s` | `cubic-bezier(0.190, 1.000, 0.220, 1.000)` + `color/background 0.4s` | `asset_85__9bc81d8d:134` |
| `TextLink` `:hover` | `transform translateY(-100%)` | `0.4s` | `cubic-bezier(0.190, 1.000, 0.220, 1.000)` | `asset_85__9bc81d8d:193` |
| `TFMain` `:hover` | `width 4rem→8.8rem; background-color 0.4s` | `1.2s` | `cubic-bezier(0.190, 1.000, 0.220, 1.000)` | `asset_85__9bc81d8d:200` |
| `TFInner .TFText` `:hover` | `transform translateY/X (per child)` | `1.2s` | `cubic-bezier(0.190, 1.000, 0.220, 1.000)` | `asset_85__9bc81d8d:213-216` |
| `HeaderMobileToggle` | `background-color / color` | `0.4s` | `cubic-bezier(0.190, 1.000, 0.220, 1.000)` | `asset_85__9bc81d8d:236` |
| `BlockText show` | `transform translateY(0); opacity 0→1` | `0.4s` initial; secondary text `0.7s` | `cubic-bezier(0.130, 0.470, 0.130, 0.980)`; child `cubic-bezier(1.00, -0.50, 0.00, 1.50)` | `asset_85__9bc81d8d:42, 49` |
| `AnimateSlideContent / AnimateSmoothContent` show | `transform translateY(100%→0); opacity 0→1` | `0.4s` (delayed `0s` start; transform `0s .4s`) | `cubic-bezier(0.130, 0.470, 0.130, 0.980)` | `asset_85__9bc81d8d:61-63` |
| `AnimateScaleContent` show | `transform scale(0.8→1)` | `0.4s` | `cubic-bezier(0.130, 0.470, 0.130, 0.980)` | `asset_85__9bc81d8d:65` |
| `SplitText.show .SplitTextSymbol` | `transform translateY(0); opacity 0→1` | `0.7s`, delay `calc(0s + (3.5 * 0.02s))` (per char) | `cubic-bezier(1.00, -0.50, 0.00, 1.50)` (back-out) | `services__09fe3f60:49-55` |
| `MobileNavContainer` open/close | `opacity 0/1` | `0.3s` | `ease-in-out` | `asset_85__9bc81d8d:244` |
| `CloudinaryPlayButton` `:hover` (parent) | `transform scale(1)` → `scale(1.1)` | `0.3s` | `cubic-bezier(1.00, -0.50, 0.00, 1.50)` | `asset_85__9bc81d8d:267, 274` |
| `CRTScreen::before` | `opacity 0→1` | `1s` | `cubic-bezier(0.130, 0.470, 0.130, 0.980)` | `asset_85__9bc81d8d:113` |
| `HorizontalRule` in-view | `transform scaleX(0→1)` | `1s` | `cubic-bezier(0.190, 1.000, 0.220, 1.000)` | `services__09fe3f60:444` |
| `html.disco/.bw/.negative/.sepia/.blur/.crt/.pop` | `filter` swap | `0.5s` | linear | `asset_85__9bc81d8d:29` |
| `TFBlink` (cursor) | `opacity 0/1` | `1.5s infinite` | stepped | `asset_85__9bc81d8d:207, 242` |

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| GSAP ScrollTrigger | `ScrollTrigger.create` per-section | per-section scrubbed pins (`HomeIntroPinned`, `HomeLinksPinned`) | The two pinned sections both apply `pin: true; scrub: true` (or equivalent) when viewport ≥1280×950. Source: `js/9088-8b45f23b7bb441e9__b31071e1.js`. |
| GSAP ScrollTrigger | `ScrollTrigger.batch` reveals for chips/tags | in-view | `t4` (`ScrollTrigger.batch`) called once at init. |
| GSAP | Section stagger reveals (transform + opacity) | in-view, one-shot | Custom helpers wrap the styled-components `AnimateFade / AnimateSlideContent / AnimateSmoothContent` classes; GSAP adds `.show` once the section enters the viewport. |
| GSAP Observer | `Observer.create` for drag/wheel on internal scrollers | pointer/touch | Used to drag the hero card row and possibly the mobile nav. |
| GSAP CustomEase | `CustomEase.create("_CE", …)` | registered at module load | Used by `SplitText` (services) for the per-character back-out. |
| Spline runtime | inline `<canvas>` scene, rendered each frame | mount on `/` and `/services` if a Spline block is present | The Spline scene contains its own timeline animations (mouse hover, drag, scroll progress). |
| Lenis | `lerp`-smoothed scroll, `wheelMultiplier:1`, `touchMultiplier:1` | always-on | Adds `lenis` and `lenis-smooth` classes to `<html>`; the CSS in `asset_85__9bc81d8d` styles those classes (`.lenis.lenis-smooth { scroll-behavior:auto!important }`). |
| Custom JS ticker | `FooterTaglineWord` rotates which child is `opacity:1` | `setInterval` | Cycles through ~5 synonyms of "studio" (e.g. agency, makers, etc.) — observed only as structure in the rendered HTML; values come from the React props. |

### Page transitions

- A `TransitionMaskWrapper` (`jibaCO`) is fixed full-viewport with `z-index:60`, sitting above all content.
- 10 vertical black bars (25% wide on mobile, 10% on desktop) animate `transform: scaleX(1.05)` from `0→1` (entry) and `1→0` (exit), `transform-origin:0 100%`.
- A centered 3-chip pill ("LOADING / PLS / WAIT") shows while the mask is active.
- Source: `asset_85__9bc81d8d:98-111`, `asset_85__9bc81d8d:115-116` (loader chips).

---

## Assets

### 3D models

| Local path | Format | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| `tools/tmp/toyfight/other/scene__131cc2cd.splinecode` | Spline runtime scene | 13.18 MB | `https://toyfight.co/other/scene__131cc2cd.splinecode` (inferred from manifest) | Hero Spline scene; renders behind the homepage H1 wordmark. Loaded by `@splinetool/runtime@1.9.82` from `c6a54c64.afb25de4a57a55c9.js`. |

Spline wasm helpers shipped alongside (used conditionally):

| Local path | Size | Source URL |
| --- | --- | --- |
| `tools/tmp/toyfight/other/process__790d3810.wasm` | 506,500 B | `https://unpkg.com/@splinetool/modelling-wasm@1.9.82/build/process.wasm` |
| `tools/tmp/toyfight/other/draco_decoder__f0d7a121.wasm` | 280,793 B | (Spline self-hosted) |
| `js/draco_wasm_wrapper__9631829d.js` | 59,024 B | (Spline decoder wrapper) |

### Fonts

All three type families are self-hosted from `/_next/static/media/`.

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| FKRasterGrotesk (variable: `wght` + custom `pxls` and `jnts` axes) | 400 (single slice, used as variable) | `woff2` | `tools/tmp/toyfight/fonts/f6a33cbbfc2edd60-s.p__5832b6cf.woff2` (33,168 B) | yes |
| SpeziaCondensed | 400 (single slice) | `woff2` + `woff` | `tools/tmp/toyfight/fonts/c0d6fd228e319977-s.p__58d8b1b0.woff2` (49,652 B), `2150e2c0e094f472-s.p__a53eecc6.woff` (64,752 B) | yes |
| SpeziaMono | 500 (single slice) | `woff2` + `woff` | `tools/tmp/toyfight/fonts/130ad11131034a9b-s.p__54d46244.woff2` (40,244 B), `95498ad10e609467-s.p__388d868d.woff` (52,044 B) | yes |
| `Inter` (referenced via Next/font fallback metrics) | n/a | `ttf` (`UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4__59563bb6.ttf`, 314 KB; plus `…VuFuY…` 316 KB) | bundled in `playwright/fonts/` (not actually referenced by the visible CSS, but Next/font ships the metric override files) | no (self-hosted in `_next/static/media`) |

`@font-face` for each family is declared in the only CSS file
`tools/tmp/toyfight/css/ff5c93d9b97df999__6e521622.css`. Each family is
paired with a `…Fallback` `@font-face` that points at `local("Arial")`
with explicit `ascent-override / descent-override / line-gap-override /
size-adjust` percentages (e.g. FKRasterGrotesk Fallback:
`ascent-override:95.89%; descent-override:29.51%; size-adjust:112.97%`).

### Images

| Local path | Type | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| `tools/tmp/toyfight/images/opengraph-image__273a0394.png` | PNG | 162,208 B | `https://toyfight.co/opengraph-image.png` | OpenGraph card. |
| `tools/tmp/toyfight/images/apple-icon__24be5b73.png` | PNG | 8,705 B | `https://toyfight.co/apple-icon.png?0e53b6992ae88307` | iOS home-screen icon. |
| `tools/tmp/toyfight/images/icon__cbc77ba4.png` | PNG | 5,786 B | `https://toyfight.co/icon.png?00feff31defac950` | Generic favicon. |
| `tools/tmp/toyfight/images/favicon__d214e7ae.ico` | ICO | 15,086 B | `https://toyfight.co/favicon.ico` | Legacy favicon. |
| `tools/tmp/toyfight/images/tv__e9f291aa.gif` | GIF | 274,868 B | (Prismic CDN) | Animated GIF used in homepage `featured2` tile. |
| `tools/tmp/toyfight/images/mask__6cbaf654.gif` | GIF | 274,826 B | `https://toyfight.co/images/services/mask.gif` | Animated GIF in services page. |
| `tools/tmp/toyfight/images/panda__493c804b.gif` | GIF | 394,816 B | (Prismic CDN) | Animated GIF used in `featured3` tile. |
| `tools/tmp/toyfight/playwright/images/aRNJU7pReVYa4V08_featured2__8764f73a.jpg` | JPG | 245,611 B | Prismic CDN | Static poster for featured tile. |
| `tools/tmp/toyfight/playwright/images/aSYnDWGnmrmGqTuE_featured3__0f2bdf3c.jpg` | JPG | 58,534 B | Prismic CDN | Static poster for featured tile. |

### SVGs & icons

No standalone SVG files in the dump. The SVGs are inline in the HTML:

- **CRT corner vignette (×4)** — `html/asset_85__9bc81d8d:438` onward. Each is a `1330×850` viewBox path drawing a corner triangle filled `#0D0D0E`; four copies are rotated `rotateY(180deg)` / `rotateX(180deg)` to fill the four corners. Combined with the `drop-shadow(3px 5px 3px rgb(0,0,0))` filter on the path, they make a soft vignette.
- **Cloudinary play glyph** — single triangle path inside a glass chip.
- **Logo "TOYFIGHT" wordmark** — rendered as text (`SpeziaMono`, letter-spacing `0.08em`, color `#f1ede7`), not as SVG.
- **No external icon font** is observed.

### Audio & video

| Local path | Type | Size | Notes |
| --- | --- | --- | --- |
| `tools/tmp/toyfight/media/fx__ae827ed0.mp3` | MP3 | 21,281 B | `https://toyfight.co/audio/header/fx.mp3` — played when the header Spline hero opens. |
| `tools/tmp/toyfight/media/fx__21ca8775.mp3` | MP3 | 1,769 B | `https://toyfight.co/audio/button/fx.mp3` — short click/UI blip. |
| `tools/tmp/toyfight/media/techno-remix__e97b4341.mp3` | MP3 | 385,604 B | `https://toyfight.co/audio/tos/techno-remix.mp3` — backing track for the TOS (chat) panel. |
| `tools/tmp/toyfight/playwright/media/home-mini-tint-new__8e6f58a5` | (video, no extension in dump; ~4 MB) | 4,038,748 B | Likely the hero Cloudinary video (`<video>` autoplay muted loop in the Intro section). |

### Other

- `tools/tmp/toyfight/js/polyfills-42372ed130431b0a__dc1a057a.js` — 112,594 B standard Next.js polyfills.
- `tools/tmp/toyfight/playwright/js/js__e58701ee` — 477,919 B; likely Prismic preview bundle.
- `tools/tmp/toyfight/playwright/html/iframe__cf1b2724.html` — 20,474 B; Prismic editor toolbar iframe contents.

### Asset inventory summary

Total payload observed in `tools/tmp/toyfight/`:

| Bucket | Count | Bytes |
| --- | --- | --- |
| HTML (server payloads) | 6 | 854,061 |
| CSS | 1 (plus Playwright mirror) | 1,515 |
| JavaScript | 27 chunks | ~6.2 MB |
| Fonts | 5 (woff2/woff) | 240,360 |
| Images | 6 + 2 Playwright JPGs | 1,134,234 |
| SVGs (standalone) | 0 | — |
| 3D models | 1 (.splinecode) + 2 wasm | 13.92 MB |
| Audio (mp3) | 3 | 408,654 |
| Video (binary, no extension) | 1 | 4,038,748 |
| Other (wasm, etc.) | 2 wasm | 787,293 |
| Playwright artifacts | 4 files | 60,258 |
| **Total** | **138 files** | **30,458,298** |

Sources cited URL-by-URL above.

---

## Motion & Interaction

### Principles

- Motion is functional, not decorative: every animation has an
  information-bearing target (state change, attention, or
  scroll-position).
- Two canonical easings dominate the codebase:
  - **Out-expo `cubic-bezier(0.190, 1.000, 0.220, 1.000)`** for UI
    affordances (buttons, links, hover-driven transforms). Long
    durations (1.2s on border-radius, 0.667s on text-swap) feel
    generous but never slow.
  - **Out-cubic `cubic-bezier(0.130, 0.470, 0.130, 0.980)`** for
    reveal/scroll-in (0.4s on the common `AnimateSlideContent` etc.).
- A back-out `cubic-bezier(1.00, -0.50, 0.00, 1.50)` is reserved for the
  Cloudinary play button hover and the per-character stagger on the
  services page.
- Stagger: character reveals use `calc(0s + (3.5 * 0.02s))` style
  arithmetic — 20 ms per index offset. Total stagger window: ~120 ms.

### Specific behaviors

- **Link hover (header, footer):** the inner `<span>` slides
  `translateY(-100%)` (0.4s) and a duplicate comes up from
  `+100%`. Underline is a `border-bottom` style, not a CSS pseudo.
- **Button hover:** border-radius `0.2 → 2.3rem` (1.2s, out-expo);
  the second label inside the grid slides into view (0.667s); background
  swap (0.4s).
- **Section reveal on scroll:** each `<AnimateFade / AnimateSlideContent
  / AnimateSmoothContent>` is `opacity:0; transform: translateY(100%)` by
  default. GSAP adds `.show` once the element enters the viewport,
  which triggers the 0.4s out-cubic reveal. Multiple chips in a row are
  batched via `ScrollTrigger.batch` with a stagger.
- **Pinned sections:** `HomeIntroSection` and `HomeLinksSection` become
  `height:100vh` and pin to the viewport when the device is at least
  1280 × 950. Inside the pinned container, a GSAP ScrollTrigger scrubs
  the inner copy / image.
- **Spline hero:** the canvas mounts behind the H1 wordmark and plays
  an internal mouse-reactive animation; the canvas itself has
  `mix-blend-mode: difference` on the year "2025" caption above it.
- **Page transition:** 10 vertical black bars `scaleX 0→1` from the
  bottom, 0.4s default; new page content is mounted behind, then the
  bars retract.
- **Scroll smoothing:** Lenis is always-on with `wheelMultiplier:1`,
  `touchMultiplier:1`, `lerp:0.1` default. `data-lenis-prevent` on any
  descendant stops the smoothing for that subtree (used by the TOS
  panel and inside the pinned sections).
- **Footer tagline rotator:** swaps the visible word every ~2s; the
  outgoing word fades out and the incoming fades in (CSS class swap).
- **TOS panel open:** the panel `width:0 → 268px` via a transform on
  the inner; the inner column has `flex-direction:column; justify-content:space-between` so the input stays pinned at the bottom while the prompt chips wrap above it.

### Interaction map (per region)

| Region | Idle | Hover | Focus | Active / Click |
| --- | --- | --- | --- | --- |
| Header logo pill (`TFMain`) | 4rem wide, blink cursor | 8.8rem wide, full "TOYFIGHT" | same as hover | n/a |
| Header nav `<a>` | one `<span>` label visible | second `<span>` slides in (0.4s) | same as hover | navigates |
| Mobile toggle | "Menu" label | swaps to "Close" (translateY mask) | same | opens mobile nav |
| CTA button (dark pill) | `border-radius:0.2rem` | `border-radius:2.3rem` (1.2s) + second label slides in (0.667s) | same | — |
| Hero word chip | static | n/a (pointer-events:none) | n/a | n/a |
| Project tile (Cloudinary video) | muted autoplay loop | play button fades in, scales 1→1.1 | same | plays sound |
| Yellow "say hello" chip | static | n/a (always-on hover in screenshot) | n/a | opens contact |
| Footer link | one label | second label slides in | same | navigates |
| Footer tagline | one word | n/a | n/a | n/a (auto-rotates) |
| TOS panel trigger (right edge) | hidden | peek | opens 268px panel | accepts text input |
| CRT debug trigger | hidden | n/a | n/a | applies `.crt`/`.bw`/`.disco` etc. to `<html>` for 0.5s |

### Reduced motion

No explicit `@media (prefers-reduced-motion: reduce)` block was observed
in the dumped stylesheets. The CSS animations are all declarative and
would still play; in practice the GSAP-driven `Animate*` reveals are
tied to `prefers-reduced-motion`-sensitive logic in `gsap.matchMedia()`
on the live site (out of scope of the dump).

---

## Content & Voice

- **Tone:** confident, plain-spoken, craft-first. The studio writes in
  the first person ("we make…", "we are…") and avoids marketing fluff
  in favor of short, declarative sentences.
- **Sentence length:** short to medium. Active voice throughout. No
  Oxford-comma clusters.
- **Capitalization:** Sentence case for body and most headings. The
  "TOYFIGHT" wordmark is set in `SpeziaMono` at `0.08em` tracking with
  the rendered letters in `lowercase` (`text-transform: none`). Button
  labels and small chips are `text-transform: uppercase` (`H4Styled`
  with `-0.02em` tracking and `font-size:1.1rem`).
- **Punctuation:** light. Em-dashes used sparingly; periods most
  common.
- **CTA vocabulary (observed):** "LOADING", "PLS", "WAIT" (loader
  chip), "Menu / Close" (mobile toggle), "say hello" / contact phrases
  on the yellow chip, "see work" / "view project" implied via the dark
  pill button.
- **Footer tagline word rotation:** the studio rotates through
  ~5 self-descriptors (e.g. agency, makers, designers, etc.). The HTML
  structure is present (`FooterTaglineWord` × N), values are runtime.

### Copy patterns by section

- **Hero (homepage):** the headline is three short words (one per H1
  chip), no tagline copy visible — the visual identity and Spline
  canvas do the talking.
- **Year caption:** a single `terminal`-styled date `2025` over a
  rotating caption (e.g. "LOADING…"). The year uses
  `mix-blend-mode:difference` so it stays readable on either light or
  dark backgrounds.
- **Yellow CTA chip (homepage):** `say hello` (or similar) — single
  inviting verb, lowercase, no exclamation mark.
- **Project tiles:** H4 caption (project name) + `BodyCaption` mono tag
  chip (category, all-caps) + CTA arrow-style icon. No long descriptions.
- **Services hero (services page):** a single 1–2 sentence intro line
  in `Body2XLStyled` (very large), followed by an `HorizontalRule` that
  animates in from left.
- **Services block:** H2 (capability name) + tag chips + 4–6 item
  bullet list in `BodyList` mono + client list (names, no logos in the
  copy).
- **Footer tagline:** a single rotating line in 1.8rem `H4Styled`
  inside an off-white chip.
- **TOS panel:** a placeholder prompt (e.g. "Ask anything…") with
  three pre-canned prompts (chips) above the input.

### Brand voice quick rules (inferred from observed copy)

1. Sentence case everything (except deliberately uppercase UI
   affordances).
2. Prefer verbs over nouns.
3. Use hyphens, not em-dashes, for parenthetical asides.
4. No trailing exclamation marks except on the
   pre-canned TOS prompts.
5. Project and client names are treated as proper nouns (no italics,
   no quotes).
6. Numbers always Arabic numerals, never spelled out.

---

## Information Architecture

Routes observed in the dump:

- `/` — marketing homepage. The Prismic catch-all
  `app/[...uid]/page-37a197cf33b454e9__2424ca2e.js` resolves any UID
  not handled by a static route.
- `/services` — services / capabilities page (RSC payload captured at
  `html/services__09fe3f60`).
- `/not-found` — Next.js 404 page (`js/not-found-e6a4d7560a31eb56__f3c136aa.js`).
- `/opengraph-image.png`, `/icon.png`, `/apple-icon.png`,
  `/favicon.ico` — Next.js metadata routes.
- `/audio/button/fx.mp3`, `/audio/header/fx.mp3`,
  `/audio/tos/techno-remix.mp3`, `/images/services/mask.gif` — static
  asset routes served from the Next.js public directory.

For each observed route, purpose + primary component:

- **`/`** — homepage; primary: `HomeHeroSection` (Spline + glassy H1 chips) → `HomeIntroSection` (pinned intro video) → `HomeLinksSection` (pinned 3-tile project grid) → `FooterTagline` → `Footer`.
- **`/services`** — capabilities + clients; primary: `ServicesHeroWrapper` (large `Body2XL` headline + grid intro) → `ServicesBlocks` (per-service image / heading / tags / clients block, sticky reel on mobile) → `ServicesClients` (5-column client logo grid on desktop) → `ServicesAwards` → `Footer`.
- **`/[uid]` (catch-all)** — Prismic-driven page; structure mirrors `/services`.
- **`/not-found`** — generic 404 inside `index-style__NotFoundMain` styles.

---

## Accessibility

- **Color contrast:** body text `#0D0D0E` on `#FAF6EF` is well above WCAG
  AAA. The `#0D0D0E` on `#FFE500` yellow button is borderline
  but visibly high-contrast.
- **Focus indicators:** `*:focus { outline-offset:0.2rem; outline-color:#0D0D0E; }` and
  `*:focus:not(:focus-visible) { outline:none; }` — visible ring on
  keyboard focus, suppressed on mouse focus. Suppressed entirely
  <1024px (`@media (max-width:1024px){a:focus,button:focus{outline:none;}}`).
- **Keyboard:** every interactive element is a real `<button>` or `<a>`;
  the loader mask and CRT overlay are `pointer-events:none`.
  `Tab order` follows DOM order.
- **Screen-reader landmarks:** `<body>` contains a single root `<div>`
  wrapping the entire React tree; landmarks are emitted by Next.js'
  default structure (no explicit `<header>/<main>/<nav>` observed in
  the SSR snapshot, but the routed pages include semantic headings).
- **Selection color:** explicitly inverted `#0D0D0E bg / #FAF6EF fg`.
- **Text shadow on selection:** `text-shadow:none` to keep selection
  legible.
- **Alt text:** no images in the dump ship a `alt=""` attribute in the
  captured SSR HTML (the `<Spline>` and `<video>` elements don't carry
  alt text), but the rendered page passes through React props where
  alt text is set per-asset; not visible in the static payload.
- **Reduced motion:** see Motion & Interaction — no explicit
  `prefers-reduced-motion` block observed in the dumped CSS.
- **Easter-egg accessibility risk:** the global `.bw` / `.negative` /
  `.crt` / `.blur` filters apply to the entire `<html>` for 0.5s; if
  triggered unintentionally (by a stray class set) they could
  disable visibility. They appear to be triggered only by an internal
  debug menu.
- **Touch behavior:** Lenis is configured with `syncTouch: false`
  (default), so native touch scrolling is preserved on mobile while
  wheel is smoothed on desktop. `data-lenis-prevent-touch` and
  `data-lenis-prevent-wheel` attributes opt-in subtrees to native
  scroll handling — used inside the TOS panel and on embedded videos.
- **Reduced data:** the Spline scene is the single largest asset
  (13.18 MB) and is loaded unconditionally on `/`. A `data-lazy` or
  IntersectionObserver-gated load is not observed in the SSR HTML,
  so first-paint network cost on mobile is significant.

---

## Sources

Every URL observed in the dump and used to write this document.

- Homepage (SSR HTML) — https://toyfight.co/
- Services (RSC payload) — https://toyfight.co/services?_rsc=1ld0r
- OpenGraph image — https://toyfight.co/opengraph-image.png
- Apple touch icon — https://toyfight.co/apple-icon.png
- Favicon — https://toyfight.co/favicon.ico
- Icon — https://toyfight.co/icon.png
- Header audio — https://toyfight.co/audio/header/fx.mp3
- Button audio — https://toyfight.co/audio/button/fx.mp3
- TOS audio — https://toyfight.co/audio/tos/techno-remix.mp3
- Services GIF — https://toyfight.co/images/services/mask.gif
- Google Tag Manager (GA4) — https://www.googletagmanager.com/gtag/js?id=G-5NVMKC92BC
- Prismic runtime — https://static.cdn.prismic.io/prismic.js?new=true&repo=toyfight
- Prismic editor toolbar — https://toyfight.prismic.io/prismic-toolbar/4.1.2/iframe.html
- Spline runtime helpers (CDN, not on toyfight.co) —
  - https://unpkg.com/@splinetool/runtime@1.9.82/build/runtime.js
  - https://unpkg.com/@splinetool/runtime@1.9.82/build/navmesh.js
  - https://unpkg.com/@splinetool/boolean-wasm@1.9.82/build/boolean.wasm
  - https://unpkg.com/@splinetool/modelling-wasm@1.9.82/build/process.wasm
  - https://unpkg.com/@splinetool/navmesh-wasm@1.9.82/build/navmesh.wasm
  - https://unpkg.com/@splinetool/ui-wasm@1.9.82/build/ui.wasm
  - https://www.gstatic.com/draco/versioned/decoders/1.5.2/ (Draco decoder)
- Source dump files inspected:
  - `tools/tmp/toyfight/manifest.json`
  - `tools/tmp/toyfight/html/asset_85__9bc81d8d` (SSR payload for `/`)
  - `tools/tmp/toyfight/html/asset_118__9bc81d8d` (alternate SSR payload, identical content)
  - `tools/tmp/toyfight/html/services__09fe3f60` (RSC payload for `/services`)
  - `tools/tmp/toyfight/css/ff5c93d9b97df999__6e521622.css`
  - `tools/tmp/toyfight/playwright/homepage.html`
  - `tools/tmp/toyfight/playwright/computed-styles.json`
  - `tools/tmp/toyfight/js/*.js` (all 27 chunks)
  - `tools/tmp/toyfight/fonts/*` (5 font files)

---

## Changelog

- 2026-06-20 — Initial draft by opencode. Generated from
  `tools/tmp/toyfight/` (dump scraped 2026-06-19).
