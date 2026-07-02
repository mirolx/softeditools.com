# Sage Editorial Redesign — Design Spec

**Date:** 2026-07-03
**Scope:** Entire site — homepage, all 14 tool pages, blog index + 21 posts, about/contact/privacy, shared nav.

## Goal

Restyle softeditools.com from the current teal/white utility look to a soft editorial
"Pinterest aesthetic" inspired by the reference (Regal Crest golf club landing page):
sage green + cream palette, elegant display serif headings, rounded soft surfaces,
subtle motion. No changes to tool logic, HTML structure/SEO, ad slots, or URLs.

## Approach (chosen: A — shared theme layer)

One shared stylesheet and one small script, loaded by every page:

- `/theme.css` — design tokens (CSS variable overrides), editorial component styling,
  and all animation/transition rules. Loaded **after** each page's inline `<style>`
  so it wins the cascade.
- `/theme.js` — IntersectionObserver-driven fade-in-on-scroll. Auto-tags candidate
  elements (cards, sections, articles) so pages need no markup changes. Respects
  `prefers-reduced-motion`. Loaded with `defer`.

Per-page edits are limited to `<head>` additions (Google Fonts + theme.css + theme.js),
except the homepage (real layout changes) and pages with copy buttons (checkmark feedback).

Rejected alternatives: (B) rewriting inline CSS in all ~40 files — huge drift risk,
40-file edits for every future tweak; (C) homepage-only deep redesign — inconsistent feel
on tool pages.

## 1. Palette & tokens (theme.css `:root` overrides)

| Token | Value | Role |
|---|---|---|
| `--accent` | `#7C8B6F` | sage green (replaces teal) |
| `--accent-dark` | `#5B6B4E` | hover/darker sage |
| `--accent-light` | `#EDF0E5` | soft sage tint surfaces |
| `--forest` | `#3F4A38` | deep green — dark blocks, footer, emphasis |
| `--text` | `#33382E` | warm near-black green |
| `--muted` | `#7A7E6F` | olive-grey secondary text |
| `--bg` | `#F7F4EA` | cream page background |
| `--surface` / `--card-bg` | `#FDFCF7` | warm white cards/surfaces |
| `--border` | `#E5E1D3` | warm border |
| `--radius` | `16px` | soft rounded corners (cards 16–18px, buttons pill) |

## 2. Typography

- **Display serif:** Cormorant Garamond (Google Fonts; weights 500, 600 + italics)
  for site name, h1, h2, stat numbers, blockquote-style accents.
- **Body/UI:** Inter stack (unchanged).
- Headings: larger sizes, normal-to-tight letter-spacing, occasional italic accent
  (tagline stays italic).
- Google Fonts loaded per page via `<link rel="preconnect">` + stylesheet link with
  `display=swap`.

## 3. Homepage

- Cream page, centered serif masthead (large Cormorant site name).
- Soft sage-green rounded "hero band" section (deep sage `--forest`/`--accent` block with
  cream serif text) introducing the site — replaces the plain intro paragraph.
- Tool cards: warm-white rounded (16px+) cards, hover lift, circular arrow chip CTA
  (like the reference's card arrows) replacing the "Use tool →" text link.
- Footer: deep green (`--forest`) text and links on cream, with warm border separator.

## 4. Tool / blog / info pages

- Recolored + retypographed entirely via theme.css: cream background, warm-white rounded
  tool surfaces, serif h1/h2, sage buttons/focus states, stat tiles as soft cards.
- No structural HTML changes except the `<head>` additions.

## 5. Nav (nav.js)

- Update injected CSS: cream/translucent background (subtle blur), serif brand mark,
  sage hover states, rounded floating-pill feel echoing the reference nav.
- Mobile menu keeps current behavior; colors updated.

## 6. Motion

All durations 0.4–0.6s, subtle; everything gated behind `prefers-reduced-motion: no-preference`.

1. **Fade-in on scroll** — theme.js observes cards/sections/articles; on first
   intersection adds `.is-visible`. Base state `opacity:0; transform:translateY(14px)`,
   transition `0.5s ease-out`, one-shot. Elements auto-selected (e.g. `.tool-card`,
   `main section`, `article`) — no per-page markup. If JS fails, content stays visible
   (base hidden state applied only when JS adds a root class).
2. **Hover lift** — cards: `translateY(-4px)` + soft warm shadow, ~0.25s.
3. **Button press** — all buttons: `:active { transform: scale(0.98) }`.
4. **Copy feedback** — copy buttons swap label to a checkmark (✓ / "Copied ✓") for
   ~1.5s with a sage success state class, then revert. Implemented per page that has
   a copy action (password-generator, lorem-ipsum-generator, case-converter,
   palette-finder; audit others during implementation). Shared `.copy-success` CSS
   lives in theme.css.

## 7. Explicitly unchanged

- HTML structure, titles, meta, canonical, Open Graph, JSON-LD schema.
- AdSense slots and publisher ID.
- All tool logic/JS behavior (except copy-button feedback visuals).
- URLs, sitemap, robots.

## Testing / verification

- Visual pass in browser on: homepage, one text tool (word-counter), one calculator,
  currency-converter (API key config must still load), palette-finder (copy feedback),
  blog index + one post, about/privacy.
- Verify fade-in triggers once per element and content is visible with JS disabled.
- Verify `prefers-reduced-motion` disables fade/lift/press animations.
- Mobile widths (≤480px, ≤780px) for grid and nav.
