# Palette & Color Finder — Design Spec

**Date:** 2026-07-03  
**URL:** `/palette-finder/`  
**File:** `palette-finder/index.html`

---

## Overview

A single static HTML page (same pattern as all existing SoftEdit Tools pages) with two tab-switched features:
1. **Color Palette Extractor** — upload an image, get 5–6 dominant colors extracted client-side via Canvas API + Median Cut
2. **Color Name to Hex** — type a color name (e.g. "dusty rose"), get up to 4 matching HEX codes from a local ~180-entry database

No server calls. No external libraries. No dark mode (site is light-only).

---

## File Structure

```
palette-finder/
  index.html     ← single self-contained file
```

Also updated:
- `index.html` (root) — add tool card to the grid
- `sitemap.xml` — add `/palette-finder/` URL entry

---

## Page Skeleton

```html
<head>
  SEO meta (title, description, og, canonical, schema.org)
  Inline <style>
  AdSense script
  <script src="/nav.js" defer>
</head>
<body>
  [nav.js injects shared nav bar]
  .container
    <header>  h1 + subtitle
    <main>
      .tab-bar          two tab buttons
      #tab-extractor    Feature 1 panel
      #tab-namefinder   Feature 2 panel
    </main>
    <section> How to use
    <section> FAQ
    <footer>
</body>
```

---

## CSS Design Tokens (existing site tokens, no changes)

```css
--accent:       #0d9488
--accent-dark:  #0f766e
--accent-light: #f0fdfa
--text:         #1e293b
--muted:        #64748b
--bg:           #ffffff
--surface:      #f8fafc
--border:       #e2e8f0
--radius:       8px
--font:         Inter, 'Segoe UI', Arial, sans-serif
```

---

## Tab Bar

- Two buttons: "Color Palette Extractor" | "Color Name to Hex"
- Active tab: accent underline + accent text color
- Inactive tab: muted text
- Switching hides one panel and shows the other via `.hidden` class
- Default active: Color Palette Extractor (tab 1)

---

## Feature 1 — Color Palette Extractor

### Upload Zone
- Dashed-border drop zone (full width, ~180px tall in empty state)
- Center content: upload icon (SVG) + "Drop image here or click to upload" text
- `<input type="file" accept="image/*">` hidden, triggered by clicking drop zone
- `dragover` → accent highlight on drop zone border/bg
- `dragleave` / `drop` → reset highlight
- Accepts: any `image/*` MIME type

### Processing Flow
1. File object → `FileReader.readAsDataURL` → creates `<img>` element
2. Hidden `<canvas>` draws the image (max 400px wide for performance)
3. `ctx.getImageData(0, 0, w, h)` → flat RGBA pixel array
4. Sample every 10th pixel to reduce dataset
5. **Modified Median Cut** (3-level recursion → 8 buckets → take top 6 by bucket size):
   - Find channel (R/G/B) with greatest range in current pixel set
   - Sort by that channel, split at median
   - Recurse on each half
   - Leaf bucket average → dominant color
6. Sort result colors by perceived luminance (dark → light)
7. Render 6 color cards

### States
- **Empty**: drop zone only, result grid hidden
- **Loading**: drop zone replaced by spinner + "Extracting colors…" text
- **Result**: image preview (max-height 200px, object-fit contain) + 6 color cards + "Copy all hex" button
- **Error**: if canvas fails or no pixels, show "Could not read this image. Try a different file."

### Color Card
```
┌──────────────────────┐
│  [64×64 color swatch]│
│  #A3B1C2             │
│  rgb(163, 177, 194)  │
│  [Copy hex]          │
└──────────────────────┘
```
- Card grid: 3 columns desktop / 2 columns mobile (≤640px) / 2 columns ≤480px
- "Copy hex" → copies `#A3B1C2` to clipboard → button text → "Copied!" for 1.8s
- "Copy all hex" → copies `#A3B1C2, #D4C5B0, …` → button text → "Copied all!" for 1.8s

---

## Feature 2 — Color Name to Hex

### Input UI
- Single text input + "Find" button (also triggers on Enter)
- `placeholder="e.g. dusty rose, sage green, terracotta…"`
- Debounce 300ms on `input` event (real-time search)
- Popular color chips below input (empty state only): `dusty rose` `sage green` `terracotta` `ivory` `blush` — clicking auto-fills input and runs search

### Matching Algorithm (client-side, local data only)
Priority order, collect up to 4 results total:
1. **Exact match** — `name === query` (case-insensitive)
2. **Starts-with match** — `name.startsWith(query)`
3. **Substring match** — `name.includes(query)`
4. **Word intersection** — any word in query matches any word in name

Deduplicate by HEX value. Show top 4.

### Color Database (~180 entries, inline JS object)
Categories:
- **Basic web** (~30): red, blue, green, teal, orange, purple, pink, navy, brown, grey…
- **Editorial/pastel** (~80): dusty rose, sage green, ivory, blush, cream, taupe, terracotta, muted coral, warm ivory, sage, rust, mustard, charcoal, olive, mauve, lavender, champagne, celadon, ecru, blush pink, dusty pink, dusty blue, dusty lavender, warm beige, cool grey, ash grey, dusty teal, muted sage, muted mauve, pale pink, pale sage, pale blue, pale yellow, soft peach, soft lilac, warm white, cool white, antique white, off white, linen white…
- **Etsy/goods design** (~50): clay, dusk, parchment, linen, sand, thistle, biscuit, slate, stone, fog, mist, pine, forest, copper, gold, bronze, pewter, birch, mushroom, cocoa, caramel, butterscotch, honey, amber, tobacco, sienna, brick, wine, plum, boysenberry, currant, fig, wisteria, periwinkle, cornflower, powder blue, sky, cerulean, tiffany, seafoam, mint, pistachio, fern, moss, khaki, oatmeal, flax…
- **Trendy** (~20): millennial pink, gen z yellow, matcha, moss, aubergine, lilac, buttercup, peach fuzz, cerulean blue, digital lavender…

### States
- **Empty**: input + popular color chips
- **Results**: input + up to 4 color cards (same card design as Feature 1)
- **No results**: "No colors found for '[query]'. Try 'sage', 'blush', or 'rust'."

---

## Responsive Breakpoints

| Breakpoint | Change |
|---|---|
| ≤640px | Tab bar wraps if needed; card grid 2-col |
| ≤480px | h1 font-size smaller; card grid 2-col; drop zone height reduced |

---

## SEO

- `<title>Color Palette Extractor & Color Name to Hex — Free Online Tool</title>`
- `<meta name="description" content="Free color palette extractor and color name to hex converter. Upload any image to get dominant colors, or type a color name like 'dusty rose' to find its hex code. No sign-up.">`
- `<link rel="canonical" href="https://softeditools.com/palette-finder/">`
- Schema.org `WebApplication` with name, url, description, applicationCategory: "UtilityApplication"

---

## Homepage & Sitemap Updates

**index.html** — add card to tools grid:
```html
<article class="tool-card">
  <div class="card-icon">🎨</div>
  <div class="card-name"><a href="/palette-finder/">Palette & Color Finder</a></div>
  <p class="card-desc">Extract dominant colors from any image, or find the hex code for any color name.</p>
  <a class="card-cta" href="/palette-finder/" tabindex="-1" aria-hidden="true">Use tool →</a>
</article>
```

**sitemap.xml** — add entry:
```xml
<url>
  <loc>https://softeditools.com/palette-finder/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## Out of Scope

- Dark mode
- Server-side processing
- External color APIs
- Image color history / saved palettes
- Export to ASE/PNG palette file
