# Sage Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle all 37 pages of softeditools.com to a sage green / cream editorial aesthetic via a shared theme layer, with fade-in-on-scroll, hover lift, button press, and copy-checkmark motion.

**Architecture:** One shared `/theme.css` (design-token overrides + editorial components + motion CSS) and one `/theme.js` (IntersectionObserver fade-in), linked into every page's `<head>` **after** the inline `<style>` so the theme wins the cascade. All 37 pages already use identical CSS variable names (`--accent`, `--bg`, `--border`, …), so token overrides do most of the recolor automatically. Structural edits are limited to the homepage, `nav.js`, and copy-button label text on 4 tool pages.

**Tech Stack:** Static HTML/CSS/vanilla JS. No build system. Google Fonts (Cormorant Garamond). Python (stdlib only) for the one-shot head-injection script.

**Spec:** `docs/superpowers/specs/2026-07-03-sage-editorial-redesign-design.md`

## Global Constraints

- Palette (exact values): accent `#7C8B6F`, accent-dark `#5B6B4E`, accent-light `#EDF0E5`, forest `#3F4A38`, text `#33382E`, muted `#7A7E6F`, page background cream `#F7F4EA`, card/surface warm white `#FDFCF7`, deeper cream surface `#F2EFE4`, border `#E5E1D3`.
- Display font: Cormorant Garamond (weights 500, 600, italic 500/600), Google Fonts, `display=swap`. Body/UI stays Inter stack.
- Motion: fade-in 0.5s ease-out, translateY(14px); hover lift 0.25s, translateY(-4px); button press `scale(0.98)`; copy feedback reverts on the page's existing timeout. All fade/lift animation gated behind `prefers-reduced-motion: no-preference`.
- Do NOT change: HTML structure/SEO (titles, meta, canonical, OG, JSON-LD), AdSense slots or publisher ID `ca-pub-6940565595128907`, tool logic, URLs, sitemap.
- Content must remain visible with JavaScript disabled (fade-in hidden state only applies when JS adds `js-fade` to `<html>`).
- No build tooling, no npm. Files are UTF-8; preserve each file's existing line endings.
- There are exactly **37** `index.html` files (1 root + 11 tools + blog index + 21 posts + about/contact/privacy).

---

### Task 1: Create `/theme.css`

**Files:**
- Create: `theme.css` (repo root)

**Interfaces:**
- Produces: CSS custom properties (`--accent`, `--forest`, etc.), heading/typography overrides, card + hover-lift styles, button press, `.copied` success styling, and fade-in rules keyed on `html.js-fade .fade-in.is-visible` — consumed by every page (Task 3), theme.js (Task 2), and the homepage (Task 5).

- [ ] **Step 1: Write `theme.css` with exactly this content**

```css
/* ==========================================================================
   softeditools.com — Sage Editorial Theme
   Loaded AFTER each page's inline <style> so equal-specificity rules here
   win the cascade. Recoloring flows through the CSS variables shared by
   every page; the rest is editorial typography, soft cards, and motion.
   ========================================================================== */

:root {
  --accent:       #7C8B6F;
  --accent-dark:  #5B6B4E;
  --accent-light: #EDF0E5;
  --forest:       #3F4A38;
  --text:         #33382E;
  --muted:        #7A7E6F;
  /* --bg stays warm white: inputs and cards read var(--bg) for their own
     background. The cream page canvas is set on body below. */
  --bg:           #FDFCF7;
  --card-bg:      #FDFCF7;
  --surface:      #F2EFE4;
  --border:       #E5E1D3;
  --radius:       14px;
  --serif:        'Cormorant Garamond', Georgia, Cambria, serif;
  --font-display: 'Cormorant Garamond', Georgia, Cambria, serif;
}

body {
  background: #F7F4EA;
  color: var(--text);
}

/* ── Editorial typography ── */
h1, h2, .site-name {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: 0.005em;
}

h1 { font-size: 2.9rem; line-height: 1.12; }
h2 { font-size: 1.75rem; }

.site-name { font-size: 3.1rem; font-weight: 500; }

.stat-value, .result-value {
  font-family: var(--font-display);
  font-weight: 600;
}

@media (max-width: 480px) {
  h1 { font-size: 2.15rem; }
  .site-name { font-size: 2.3rem; }
}

/* ── Soft cards + hover lift ── */
.tool-card, .blog-card, .stat-card, .result-box {
  background: var(--card-bg);
  border-color: var(--border);
  border-radius: 18px;
}

.tool-card, .blog-card {
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

@media (prefers-reduced-motion: no-preference) {
  .tool-card:hover, .blog-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(63, 74, 56, 0.10);
  }
}

/* ── Button press ── */
button { transition: transform 0.15s ease, background 0.15s, border-color 0.15s, color 0.15s; }

@media (prefers-reduced-motion: no-preference) {
  button:active { transform: scale(0.98); }
}

/* ── Recolor hardcoded greens to the sage family ── */
.badge-new { background: var(--accent-dark); }

#copy-btn.copied,
.copy-btn.copied,
.copy-all-btn.copied,
.bulk-copy-btn.copied,
.icon-btn.copied {
  background: var(--forest);
  border-color: var(--forest);
  color: #F7F4EA;
}

/* ── Footer ── */
footer {
  border-top: 1px solid var(--border);
  color: var(--muted);
}

footer a, .footer-blog-link { color: var(--accent-dark); }
footer a:hover, .footer-blog-link:hover { color: var(--forest); }

/* ── Fade-in on scroll ──
   theme.js adds .js-fade to <html> and .fade-in to candidate elements,
   then .is-visible on first intersection. Without JS nothing is hidden. */
@media (prefers-reduced-motion: no-preference) {
  html.js-fade .fade-in {
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  }

  html.js-fade .fade-in.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- [ ] **Step 2: Sanity-check the file**

Run: `Get-Content theme.css -TotalCount 5`
Expected: the header comment block. Also confirm the brace count balances: `((Get-Content theme.css -Raw) -split '\{').Count -eq ((Get-Content theme.css -Raw) -split '\}').Count` → `True`.

- [ ] **Step 3: Commit**

```powershell
git add theme.css; git commit -m @'
feat: add sage editorial theme stylesheet

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
'@
```

---

### Task 2: Create `/theme.js`

**Files:**
- Create: `theme.js` (repo root)

**Interfaces:**
- Consumes: `html.js-fade .fade-in` / `.is-visible` CSS from Task 1.
- Produces: automatic fade-in tagging — no page markup required. Pages only need `<script src="/theme.js" defer></script>` (Task 3).

- [ ] **Step 1: Write `theme.js` with exactly this content**

```js
/* Fade-in on scroll for softeditools.com sage editorial theme.
   Adds .js-fade to <html> only when it will actually animate, so content
   is never hidden for no-JS visitors or reduced-motion users. */
(function () {
  'use strict';

  function init() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var selector = '.tool-card, .blog-card, .stat-card, main section, main article';
    var targets = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!targets.length) return;

    targets.forEach(function (el) { el.classList.add('fade-in'); });
    document.documentElement.classList.add('js-fade');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
```

- [ ] **Step 2: Verify JS syntax**

Run: `node --check theme.js`
Expected: no output, exit code 0. (If node is unavailable, skip — the file is verified in the browser in Task 7.)

- [ ] **Step 3: Commit**

```powershell
git add theme.js; git commit -m @'
feat: add fade-in-on-scroll script for editorial theme

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
'@
```

---

### Task 3: Link fonts + theme into all 37 pages

**Files:**
- Create (temporary, deleted in this task): `inject_theme.py` (repo root)
- Modify: every `**/index.html` (37 files) — insert 6 lines before `</head>`

**Interfaces:**
- Consumes: `/theme.css` (Task 1), `/theme.js` (Task 2).
- Produces: every page loads Cormorant Garamond + theme.css + theme.js. The snippet inserted is exactly the `SNIPPET` below — Task 5/6 pages will already contain it.

- [ ] **Step 1: Write `inject_theme.py` with exactly this content**

```python
import pathlib

SNIPPET_LINES = [
    '  <!-- Sage editorial theme -->',
    '  <link rel="preconnect" href="https://fonts.googleapis.com">',
    '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&display=swap" rel="stylesheet">',
    '  <link rel="stylesheet" href="/theme.css">',
    '  <script src="/theme.js" defer></script>',
]

count = 0
for p in sorted(pathlib.Path('.').rglob('index.html')):
    text = p.read_bytes().decode('utf-8')
    if '/theme.css' in text:
        print('skip (already themed):', p)
        continue
    if '</head>' not in text:
        print('WARNING no </head>:', p)
        continue
    nl = '\r\n' if '\r\n' in text else '\n'
    snippet = nl.join(SNIPPET_LINES) + nl
    text = text.replace('</head>', snippet + '</head>', 1)
    p.write_bytes(text.encode('utf-8'))
    count += 1
    print('themed:', p)
print('done:', count, 'files')
```

- [ ] **Step 2: Run it from the repo root**

Run: `python inject_theme.py`
Expected: 37 `themed:` lines ending with `done: 37 files`. No `WARNING` lines.

- [ ] **Step 3: Verify coverage**

Use Grep: pattern `/theme.css`, glob `**/index.html`, output_mode `files_with_matches`.
Expected: 37 files.

- [ ] **Step 4: Spot-check one diff**

Run: `git diff word-counter/index.html`
Expected: only the 6-line snippet inserted immediately before `</head>`, nothing else.

- [ ] **Step 5: Delete the script and commit**

```powershell
Remove-Item inject_theme.py -Confirm:$false
git add -A; git commit -m @'
feat: link sage theme and Cormorant Garamond into all pages

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
'@
```

---

### Task 4: Restyle the shared nav (`nav.js`)

**Files:**
- Modify: `nav.js:2-30` (the `css` array only — DOM markup and toggle logic unchanged)

**Interfaces:**
- Consumes: Cormorant Garamond loaded by page heads (Task 3).
- Produces: floating-pill nav on all pages; class names unchanged.

- [ ] **Step 1: Replace the `css` array (lines 2–30) with exactly this**

```js
  var css = [
    '.site-nav{background:transparent;padding:14px 20px 0;}',
    '.site-nav__inner{max-width:1020px;margin:0 auto;padding:0 26px;height:56px;',
      'display:flex;align-items:center;justify-content:space-between;',
      'background:rgba(253,252,247,.92);border:1px solid #E5E1D3;border-radius:999px;',
      '-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);}',
    '.site-nav__brand{font-family:"Cormorant Garamond",Georgia,Cambria,serif;',
      'font-size:1.3rem;font-weight:600;color:#33382E;text-decoration:none;',
      'letter-spacing:0.01em;transition:color 0.15s;flex-shrink:0;}',
    '.site-nav__brand:hover{color:#5B6B4E;}',
    '.site-nav__links{display:flex;align-items:center;gap:28px;',
      'list-style:none;margin:0;padding:0;}',
    '.site-nav__links a{font-family:Inter,"Segoe UI",Arial,sans-serif;',
      'font-size:0.875rem;color:#7A7E6F;text-decoration:none;',
      'letter-spacing:0.01em;transition:color 0.15s;}',
    '.site-nav__links a:hover{color:#5B6B4E;}',
    '.site-nav__toggle{display:none;flex-direction:column;justify-content:center;',
      'gap:5px;background:none;border:none;cursor:pointer;padding:6px 4px;}',
    '.site-nav__toggle span{display:block;width:22px;height:1.5px;',
      'background:#33382E;border-radius:2px;}',
    '@media(max-width:600px){',
      '.site-nav{position:relative;padding:10px 14px 0;}',
      '.site-nav__inner{height:50px;padding:0 20px;}',
      '.site-nav__toggle{display:flex;}',
      '.site-nav__links{display:none;position:absolute;top:100%;left:14px;right:14px;',
        'margin-top:8px;background:#FDFCF7;border:1px solid #E5E1D3;border-radius:16px;',
        'box-shadow:0 12px 32px rgba(63,74,56,.12);z-index:50;',
        'flex-direction:column;align-items:stretch;gap:0;padding:6px 0 10px;}',
      '.site-nav__links.is-open{display:flex;}',
      '.site-nav__links a{display:block;padding:10px 20px;font-size:0.9rem;}',
    '}'
  ].join('');
```

- [ ] **Step 2: Verify JS syntax**

Run: `node --check nav.js`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```powershell
git add nav.js; git commit -m @'
feat: restyle nav as cream floating pill with serif brand

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
'@
```

---

### Task 5: Homepage — hero band, CTA arrow chips

**Files:**
- Modify: `index.html` (root) — the intro section HTML, the card CTA markup (10 cards), and inline CSS additions

**Interfaces:**
- Consumes: `--forest`, `--accent`, `--serif` from theme.css (Task 1); page already linked to theme (Task 3).
- Produces: `.hero-band`, `.hero-eyebrow`, `.hero-title`, `.hero-text`, `.cta-circle` classes — homepage-only, defined in the homepage's inline `<style>`.

- [ ] **Step 1: Replace the intro section (Edit on `index.html`)**

Old string:

```html
    <section class="intro-section">
      <p style="max-width:640px;margin:0 auto 52px;text-align:center;color:var(--muted);font-size:0.95rem;line-height:1.75;">
        SoftEdit Tools is a free collection of simple online utilities for everyday tasks — word counting, unit conversion, password generation, and more. No sign-up required. Everything runs in your browser, so your text stays private.
      </p>
    </section>
```

New string:

```html
    <section class="hero-band">
      <p class="hero-eyebrow">Free online tools &middot; no sign-up</p>
      <h2 class="hero-title">Simple tools, <em>softly made</em></h2>
      <p class="hero-text">
        SoftEdit Tools is a free collection of simple online utilities for everyday tasks — word counting, unit conversion, password generation, and more. Everything runs in your browser, so your text stays private.
      </p>
    </section>
```

- [ ] **Step 2: Convert the 10 card CTAs to arrow chips (Edit, replace_all)**

Old string (replace_all): `Use tool &rarr;</a>`
New string: `Use tool <span class="cta-circle">&rarr;</span></a>`

Verify: Grep pattern `cta-circle` in `index.html` → 10 matches.

- [ ] **Step 3: Add homepage-only CSS (Edit on `index.html`)**

Old string:

```css
    /* ── Mobile header ── */
```

New string:

```css
    /* ── Hero band ── */
    .hero-band {
      background: var(--forest, #3F4A38);
      color: #F7F4EA;
      border-radius: 24px;
      padding: 60px 36px 64px;
      text-align: center;
      margin-bottom: 56px;
    }

    .hero-eyebrow {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: #C9CDB8;
      margin-bottom: 18px;
    }

    .hero-title {
      font-family: var(--serif);
      font-size: 2.6rem;
      font-weight: 500;
      line-height: 1.15;
      color: #F7F4EA;
    }

    .hero-text {
      max-width: 560px;
      margin: 18px auto 0;
      font-size: 0.95rem;
      line-height: 1.75;
      color: #DDDCC8;
    }

    @media (max-width: 480px) {
      .hero-band { padding: 44px 22px 48px; border-radius: 20px; }
      .hero-title { font-size: 1.9rem; }
    }

    /* ── CTA circle ── */
    .card-cta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .cta-circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: 1px solid currentColor;
      border-radius: 50%;
      font-size: 0.85rem;
      transition: background 0.2s, color 0.2s;
    }

    .tool-card:hover .cta-circle {
      background: var(--accent);
      color: #F7F4EA;
      border-color: var(--accent);
    }

    /* ── Mobile header ── */
```

- [ ] **Step 4: Visual check**

Run: `python -m http.server 8080` (background, repo root), open `http://localhost:8080/` in the browser.
Expected: cream page, serif masthead, deep-green rounded hero band, warm-white cards with circular arrow chips that fill sage on hover, cards lift on hover, sections fade in on scroll.

- [ ] **Step 5: Commit**

```powershell
git add index.html; git commit -m @'
feat: redesign homepage with forest hero band and arrow-chip CTAs

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
'@
```

---

### Task 6: Copy feedback — checkmark transition

**Files:**
- Modify: `case-converter/index.html` (~line 536), `lorem-ipsum-generator/index.html` (~line 610), `palette-finder/index.html` (~lines 363, 370), `password-generator/index.html` (~lines 852, 860, 902, 915)

**Interfaces:**
- Consumes: `.copied` sage/forest success styling from theme.css (Task 1). Each page's existing revert timers stay as-is.
- Produces: all copy buttons show `✓ Copied` while in the success state.

Every copy handler on these 4 pages sets the label with the literal string `'Copied!'`. In **each of the 4 files**, run a single Edit with `replace_all`:

- [ ] **Step 1: `case-converter/index.html`** — replace_all `'Copied!'` → `'✓ Copied'` (1 occurrence)
- [ ] **Step 2: `lorem-ipsum-generator/index.html`** — replace_all `'Copied!'` → `'✓ Copied'` (1 occurrence)
- [ ] **Step 3: `palette-finder/index.html`** — replace_all `'Copied!'` → `'✓ Copied'` (2 occurrences)
- [ ] **Step 4: `password-generator/index.html`** — replace_all `'Copied!'` → `'✓ Copied'` (4 occurrences)
- [ ] **Step 5: Verify no `'Copied!'` remains**

Use Grep: pattern `Copied!`, glob `**/index.html`.
Expected: no matches.

- [ ] **Step 6: Commit**

```powershell
git add case-converter/index.html lorem-ipsum-generator/index.html palette-finder/index.html password-generator/index.html
git commit -m @'
feat: show checkmark on copy success across tools

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
'@
```

---

### Task 7: Full-site browser verification pass

**Files:**
- Modify: only if fixes are needed (theme.css tweaks expected; note them in the commit)

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Serve the site**

Run: `python -m http.server 8080` from repo root (background). Absolute paths (`/theme.css`, `/nav.js`) require serving from root.

- [ ] **Step 2: Check each page type in the browser**

Visit and confirm sage/cream palette, serif headings, pill nav, fade-in, hover lift:
- `http://localhost:8080/` — homepage (hero band, arrow chips)
- `http://localhost:8080/word-counter/` — stat cards restyled, serif stat values
- `http://localhost:8080/scientific-calculator/` — key grid still usable, press scale on keys
- `http://localhost:8080/currency-converter/` — page loads without JS errors (config.js pattern intact)
- `http://localhost:8080/palette-finder/` — copy a hex → button shows `✓ Copied` in forest green, reverts
- `http://localhost:8080/password-generator/` — copy button + bulk copy show `✓ Copied`
- `http://localhost:8080/blog/` and one post (e.g. `/blog/what-is-lorem-ipsum/`) — cards, article typography
- `http://localhost:8080/about/` and `/privacy-policy/`

- [ ] **Step 3: Check motion edge cases**

- Reload homepage with DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce" → no fade/lift/press animation, all content visible.
- Disable JavaScript → all content visible (no hidden fade-in elements). Re-enable.
- Fade-in fires once per element (scroll down, scroll back up — no re-animation).
- Mobile width (~400px): nav toggle opens the rounded dropdown; tool grid single column; hero band readable.

- [ ] **Step 4: Fix and commit any issues found**

Prefer fixing in `theme.css` (shared) over per-page edits. Commit with:

```powershell
git add -A; git commit -m @'
fix: polish sage theme after full-site visual pass

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
'@
```
