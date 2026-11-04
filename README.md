# The Nine Innovation — company website

Static, dependency-free bilingual landing page (Thai default at `/`, English at `/en/`).

## Build
```bash
node build.mjs
```
Output goes to `dist/`. Upload that folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, or regular web hosting).

## Edit content
Step-by-step guide for non-developers (text, photos, icons): see [EDITING.md](EDITING.md).

| What | File |
|---|---|
| Domain, phones, email, address, Facebook URL, map, tax ID | `site.config.json` |
| Thai text | `content/th.json` |
| English text | `content/en.json` |
| Styles / behaviour | `static/styles.css`, `static/main.js` |
| Page markup | `src/render.mjs` |

Run `node build.mjs` again after any change. Values starting with `TODO` are listed by the build and left out of SEO data. Use `--strict` to make the build fail if any remain.

## Facebook updates
The "Updates" section embeds the official Facebook Page Plugin for `facebookUrl`, so new posts show up automatically and nothing needs rebuilding.

## SEO included
- Separate crawlable URLs per language, plus `hreflang` (th / en / x-default) and canonical tags
- Title, description and keywords targeting lift/escalator searches in Hat Yai, Songkhla, Phuket and Southern Thailand
- Open Graph + Twitter cards (`assets/og-image.png`)
- JSON-LD `LocalBusiness` with address, phones, tax ID, area served, service catalog and Facebook `sameAs`
- `sitemap.xml` (with alternates), `robots.txt`, web manifest, favicons
- Semantic HTML, mobile-first, lazy-loaded embeds

## After going live
1. Set `siteUrl` in `site.config.json` to the real domain, then rebuild.
2. Add the site to Google Search Console and submit `/sitemap.xml`.
3. Create or claim a Google Business Profile for the Hat Yai office (this matters most for local search).
4. Add the website link to the Facebook page.

## Facebook posts as cards (optional, recommended)
`worker/index.mjs` exposes `/api/fb-posts`, which reads the latest Page posts from the
Facebook Graph API using the Cloudflare secret `FB_PAGE_TOKEN` (a non-expiring Page access
token) and caches them for 15 minutes. The homepage shows them as cards. Without the secret,
the site falls back to the standard Facebook embed.
