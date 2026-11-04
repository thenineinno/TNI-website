// Static site generator for Nine Innovation — no dependencies.
// Usage: node build.mjs        -> writes ./dist
//        node build.mjs --strict  -> fails if any TODO placeholder remains
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from './src/render.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'dist');
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));

const cfg = read('site.config.json');
cfg.siteUrl = cfg.siteUrl.replace(/\/$/, '');
const langs = [read('content/th.json'), read('content/en.json')];

// Collect TODO placeholders so nothing unfinished ships unnoticed.
const todos = [];
const scan = (obj, path) => {
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string' && v.startsWith('TODO')) todos.push(`${path}.${k}`);
    else if (v && typeof v === 'object') scan(v, `${path}.${k}`);
  }
};
scan(cfg, 'site.config');
langs.forEach((t) => scan(t, `content/${t.lang}`));

// Warn about image paths that don't exist in static/ (a common typo when editing on GitHub).
const imgs = [cfg.heroImage, ...langs.flatMap((t) => t.services.items.map((s) => s.image))].filter(Boolean);
for (const src of new Set(imgs))
  if (!/^https?:/.test(src) && !existsSync(join(root, 'static', src.replace(/^\//, ''))))
    console.warn(`⚠  Image not found: ${src} (upload it to static/assets/ and check the spelling, including .jpg/.png)`);

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(root, 'static'), out, { recursive: true });

for (const t of langs) {
  const dir = join(out, t.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), render(t, cfg, langs));
}

// sitemap.xml with hreflang alternates
const today = new Date().toISOString().slice(0, 10);
const alts = langs
  .map((l) => `    <xhtml:link rel="alternate" hreflang="${l.lang}" href="${cfg.siteUrl}${l.path}"/>`)
  .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${cfg.siteUrl}/"/>`)
  .join('\n');
writeFileSync(
  join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${langs
  .map(
    (l) => `  <url>
    <loc>${cfg.siteUrl}${l.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${l.path === '/' ? '1.0' : '0.9'}</priority>
${alts}
  </url>`
  )
  .join('\n')}
</urlset>
`
);
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${cfg.siteUrl}/sitemap.xml\n`);
writeFileSync(
  join(out, 'site.webmanifest'),
  JSON.stringify(
    {
      name: cfg.brandName,
      short_name: 'NINE',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#357045',
      icons: [{ src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' }],
    },
    null,
    2
  )
);

console.log(`Built ${langs.length} pages into dist/`);
if (todos.length) {
  console.warn(`\n⚠  ${todos.length} placeholder(s) still marked TODO:\n  - ${todos.join('\n  - ')}`);
  if (process.argv.includes('--strict')) process.exit(1);
}
