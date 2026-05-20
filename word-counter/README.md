# Word Counter — softeditools.com

A free, single-file online word counter tool. No frameworks, no build tools, no dependencies — just plain HTML, CSS, and JavaScript.

## Live URL

```
https://softeditools.com/word-counter
```

## Features

- **Real-time counting** — stats update instantly as you type
- **Word count**
- **Character count** (with spaces)
- **Character count** (without spaces)
- **Sentence count**
- **Paragraph count**
- **Estimated reading time** (based on 200 words per minute)
- **Keyword density** — top 5 most-used words, excluding common stop words
- **Clear button** — resets the textarea in one click
- Fully **mobile responsive**
- Runs **entirely in the browser** — no text is sent to any server

## File Structure

```
wordcounter/
├── index.html   # The entire app — HTML, CSS, and JS in one file
└── README.md    # This file
```

## Deployment

No build step required. Upload `index.html` to your server or static hosting provider and it works immediately.

```bash
# Example: deploy to a server via scp
scp index.html user@yourserver.com:/var/www/softeditools.com/word-counter/index.html
```

## Before Going Live

1. Replace all instances of `yourdomain.com` in `index.html` with your actual domain. There are **4 occurrences**:
   - `<link rel="canonical" href="...">`
   - `<meta property="og:url" content="...">`
   - JSON-LD schema `"url"` field
   - The HTML comment at the top of the file

2. Replace the AdSense placeholder comments with your actual AdSense ad unit code:
   - `<!-- AdSense slot 1 -->` — leaderboard above the tool (728×90 desktop / 320×50 mobile)
   - `<!-- AdSense slot 2 -->` — below the tool (same sizes)

## SEO

The page includes:
- Optimized `<title>` and `<meta description>`
- Canonical URL tag
- Open Graph tags (Facebook/LinkedIn sharing)
- Twitter Card meta tags
- `robots: index, follow`
- `WebApplication` JSON-LD schema markup
- Semantic heading hierarchy (`h1` → `h2` → `h3`)
- "How to use" content section
- FAQ section with 6 questions targeting common search queries

## Tech Stack

| Layer      | Implementation              |
|------------|-----------------------------|
| Markup     | Plain HTML5                 |
| Styles     | Plain CSS3 (in `<style>`)   |
| Logic      | Plain JavaScript (in `<script>`) |
| Fonts      | System font stack — Inter, Segoe UI, Arial |
| Frameworks | None                        |
| Build tool | None                        |

## License

MIT — free to use, modify, and distribute.
