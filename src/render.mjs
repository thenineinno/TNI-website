// Renders one language version of the landing page.
const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const isTodo = (s) => typeof s === 'string' && s.startsWith('TODO');
const clean = (s = '') => String(s).replace(/^TODO:\s*/, '');
const txt = (s) => esc(clean(s));
const filled = (s) => s && !isTodo(s);

const MARK = `<svg class="mark" viewBox="0 0 428 390" aria-hidden="true" focusable="false"><rect width="428" height="390" fill="var(--green-light)"/><path fill="var(--green-dark)" d="M86 0h256v256zM86 134l256 256H86z"/></svg>`;
const WORD = `<svg class="word" viewBox="517 0 813 390" aria-hidden="true" focusable="false"><g fill="currentColor"><path d="M517 0h73v390h-73z"/><path d="M679 0h85l157 261V0h73v390h-78L751 114v276h-72z"/><path d="M1082 0h248v70h-174v90h156v70h-156v90h174v70h-248z"/></g></svg>`;

const ICONS = {
  phone: '<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/>',
  email: '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v.5l8 5 8-5V6zm16 2.85-8 5-8-5V18h16z"/>',
  line: '<path d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.3 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.5 1.1-.5 6-3.5 8.2-6.1A7.4 7.4 0 0 0 22 11c0-4.4-4.5-8-10-8z"/>',
  address: '<path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7zm0 4.5A2.5 2.5 0 1 0 12 11.5 2.5 2.5 0 0 0 12 6.5z"/>',
  facebook: '<path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.5V4.46A20 20 0 0 0 14.3 4.3c-2.2 0-3.8 1.35-3.8 3.84v2.36H8v3h2.5V21z"/>',
};
const SVC = {
  lift: '<rect x="9" y="5" width="30" height="38" rx="2"/><path d="M15 12h12v26H15zM21 12v26M33 20l2.5 3h-5zM33 30l2.5-3h-5z"/><path d="M18 8h6"/>',
  escalator: '<circle cx="21" cy="10" r="3"/><path d="M19 15h4v8h-4z"/><path d="M6 37h9l16-16h7a4 4 0 0 1 0 8h-4L18 45H6a4 4 0 0 1 0-8z"/><path d="M30 41l8-8M33 33h5v5"/>',
  gear: '<circle cx="20" cy="24" r="6"/><path d="M20 12v4M20 32v4M8 24h4M28 24h4M11.5 15.5l2.8 2.8M25.7 29.7l2.8 2.8M11.5 32.5l2.8-2.8M25.7 18.3l2.8-2.8"/><path d="M6 14A20 20 0 0 1 40 10M42 34A20 20 0 0 1 8 38"/><path d="M40 4v6h-6M8 44v-6h6"/>',
  hand: '<path d="M4 20l8-8 6 3 6-3 6 3 6-3 8 8"/><path d="M12 12l-8 16 6 6M44 20l-6 14-10 8-4-3M24 15l-8 8a2.5 2.5 0 0 0 4 3l6-5 10 10"/><path d="M14 36l3 3M18 32l4 4M22 28l4 4"/>',
};
const svcIcon = (k) => `<svg class="svc-ic" viewBox="0 0 48 48" aria-hidden="true">${SVC[k] || ''}</svg>`;
const icon = (k) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg>`;

export function render(t, cfg, langs) {
  const url = cfg.siteUrl + t.path;
  const other = langs.find((l) => l.lang !== t.lang);
  const address = t.lang === 'th' ? cfg.addressTh : cfg.addressEn;
  const legalName = t.lang === 'th' ? cfg.legalNameTh : cfg.legalNameEn;
  const year = new Date().getFullYear();

  // Structured data — only real (non-TODO) values are included.
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${cfg.siteUrl}/#organization`,
    name: cfg.brandName,
    alternateName: ['ไนน์ อินโนเวชั่น', 'NINE Innovation'],
    url: cfg.siteUrl + '/',
    logo: `${cfg.siteUrl}/assets/icon-512.png`,
    image: `${cfg.siteUrl}/assets/og-image.png`,
    description: t.meta.description,
    sameAs: [cfg.facebookUrl],
  };
  const phones = (cfg.phones || []).filter(filled);
  org['@type'] = ['Organization', 'LocalBusiness'];
  org.name = cfg.legalNameEn;
  org.alternateName = [cfg.legalNameTh, 'เดอะ ไนน์ อินโนเวชั่น', 'The Nine Innovation', 'NINE Innovation'];
  org.legalName = cfg.legalNameEn;
  if (filled(cfg.taxId)) org.taxID = cfg.taxId;
  if (filled(cfg.email)) org.email = cfg.email;
  if (phones.length) org.telephone = phones[0];
  org.address = {
    '@type': 'PostalAddress',
    streetAddress: cfg.street,
    addressLocality: cfg.addressLocality,
    addressRegion: cfg.addressRegion,
    postalCode: cfg.postalCode,
    addressCountry: 'TH',
  };
  org.areaServed = (cfg.areaServed || []).map((n) => ({ '@type': 'AdministrativeArea', name: n }));
  org.knowsAbout = ['Elevator installation', 'Elevator maintenance', 'Elevator modernization', 'Escalator installation', 'Escalator maintenance', 'Elevator spare parts'];
  org.contactPoint = phones.map((tel) => ({
    '@type': 'ContactPoint', contactType: 'customer service', telephone: '+66-' + tel.replace(/^0/, ''),
    email: cfg.email, areaServed: 'TH', availableLanguage: ['Thai', 'English'],
  }));
  org.hasOfferCatalog = {
    '@type': 'OfferCatalog', name: t.services.title,
    itemListElement: t.services.items.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, description: s.text } })),
  };
  const site = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${cfg.siteUrl}/#website`,
    url: cfg.siteUrl + '/',
    name: cfg.brandName,
    inLanguage: ['th', 'en'],
    publisher: { '@id': `${cfg.siteUrl}/#organization` },
  };
  const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;

  // Contact rows: placeholder values render dimmed so the layout is visible until filled in.
  const row = (k, label, value, href) => {
    const ph = isTodo(value);
    const v = txt(value);
    const inner = !ph && href ? `<a href="${esc(href)}">${v}</a>` : `<span>${v}</span>`;
    return `<li class="contact-row${ph ? ' is-placeholder' : ''}">${icon(k)}<div><span class="label">${esc(label)}</span>${inner}</div></li>`;
  };
  const telLinks = phones.map((p) => `<a href="tel:+66${p.replace(/\D/g, '').replace(/^0/, '')}">${esc(p)}</a>`).join('<span class="sep">,</span> ');
  const pj = t.projects;

  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.meta.title)}</title>
<meta name="description" content="${esc(t.meta.description)}">
<meta name="keywords" content="${esc(t.meta.keywords)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
${langs.map((l) => `<link rel="alternate" hreflang="${l.lang}" href="${cfg.siteUrl}${l.path}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${cfg.siteUrl}/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(cfg.brandName)}">
<meta property="og:title" content="${esc(t.meta.title)}">
<meta property="og:description" content="${esc(t.meta.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${cfg.siteUrl}/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Nine Innovation logo">
<meta property="og:locale" content="${t.locale}">
<meta property="og:locale:alternate" content="${other.locale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(t.meta.title)}">
<meta name="twitter:description" content="${esc(t.meta.description)}">
<meta name="twitter:image" content="${cfg.siteUrl}/assets/og-image.png">
<meta name="theme-color" content="#357045">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/assets/mark.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=Inter:wght@800;900&display=swap">
<link rel="stylesheet" href="/styles.css">
${ld(org)}
${ld(site)}
</head>
<body>
<div id="fb-root"></div>
<a class="skip" href="#main">${esc(t.skip)}</a>

<header class="site-header" id="top">
  <div class="wrap header-inner">
    <a class="brand" href="${t.path}" aria-label="${esc(cfg.brandName)}">${MARK}${WORD}</a>
    <button class="menu-btn" aria-expanded="false" aria-controls="nav"><span class="sr">${esc(t.nav.menu)}</span><span class="bars" aria-hidden="true"></span></button>
    <nav id="nav" class="nav" aria-label="${esc(t.nav.menu)}">
      <a href="#about">${esc(t.nav.about)}</a>
      <a href="#services">${esc(t.nav.services)}</a>
      <a href="#updates">${esc(t.nav.updates)}</a>
      <a href="#projects">${esc(t.nav.projects)}</a>
      <a href="#contact">${esc(t.nav.contact)}</a>
      <a class="lang" href="${other.path}" hreflang="${other.lang}" lang="${other.lang}" aria-label="${esc(t.langSwitch.aria)}" data-lang="${other.lang}">${esc(t.langSwitch.label)}</a>
    </nav>
  </div>
</header>

<main id="main">
  <section class="hero">
    <div class="wrap hero-inner">
      <div class="hero-copy">
        <p class="eyebrow">${esc(t.hero.eyebrow)}</p>
        <h1>${t.hero.title}</h1>
        <p class="lead">${txt(t.hero.lead)}</p>
        <div class="actions">
          <a class="btn btn-primary" href="#contact">${esc(t.hero.ctaPrimary)}</a>
          <a class="btn btn-ghost" href="#services">${esc(t.hero.ctaSecondary)}</a>
        </div>
        <ul class="stats">${t.hero.stats.map((x) => `<li><strong>${esc(x.n)}</strong><span>${esc(x.l)}</span></li>`).join('')}</ul>
      </div>
      <div class="hero-art" aria-hidden="true">${MARK}</div>
    </div>
  </section>

  <section id="about" class="section">
    <div class="wrap about">
      <div>
        <p class="kicker">${esc(t.about.kicker)}</p>
        <h2>${esc(t.about.title)}</h2>
        ${t.about.body.map((b) => `<p class="body">${esc(b)}</p>`).join('\n        ')}
      </div>
      <div class="pillars">
        <div class="pillar"><span class="num">01</span><h3>${esc(t.about.visionTitle)}</h3><p class="quote">“${esc(t.about.vision)}”</p></div>
        <div class="pillar"><span class="num">02</span><h3>${esc(t.about.missionTitle)}</h3><ul class="ticks">${t.about.mission.map((m) => `<li>${esc(m)}</li>`).join('')}</ul></div>
      </div>
    </div>
  </section>

  <section id="services" class="section section-tint">
    <div class="wrap">
      <p class="kicker">${esc(t.services.kicker)}</p>
      <h2>${esc(t.services.title)}</h2>
      <ul class="cards">
        ${t.services.items.map((s) => `<li class="card">${svcIcon(s.icon)}<h3>${txt(s.title)}</h3><p>${txt(s.text)}</p></li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  <section id="updates" class="section">
    <div class="wrap updates" data-read-more="${esc(t.updates.readMore)}" data-more="${esc(t.updates.more)}" data-fb-url="${esc(cfg.facebookUrl)}" data-lang="${t.lang}">
      <div class="updates-copy">
        <p class="kicker">${esc(t.updates.kicker)}</p>
        <h2>${esc(t.updates.title)}</h2>
        <p class="body">${txt(t.updates.lead)}</p>
        <a class="btn btn-primary" href="${esc(cfg.facebookUrl)}" target="_blank" rel="noopener">${icon('facebook')}${esc(t.updates.follow)}</a>
      </div>
      <div class="fb-frame" data-fb-locale="${t.locale}">
        <div class="fb-card">
          ${MARK}
          <p class="fb-name">${esc(cfg.brandName)}</p>
          <p class="fb-sub">${icon('facebook')}Facebook</p>
          <p class="fb-text">${esc(t.updates.cardText)}</p>
          <a class="btn btn-primary" href="${esc(cfg.facebookUrl)}" target="_blank" rel="noopener">${esc(t.updates.follow)}</a>
        </div>
        <div class="fb-page" data-href="https://www.facebook.com/${esc(cfg.facebookPageId)}" data-tabs="timeline" data-width="500" data-height="700" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="false" data-lazy="true">
          <blockquote cite="${esc(cfg.facebookUrl)}" class="fb-xfbml-parse-ignore"><a href="${esc(cfg.facebookUrl)}">${esc(cfg.brandName)}</a></blockquote>
        </div>
      </div>
    </div>
  </section>

  <section id="projects" class="section section-tint">
    <div class="wrap">
      <p class="kicker">${esc(pj.kicker)}</p>
      <h2>${esc(pj.title)}</h2>
      <p class="body">${esc(pj.lead)}</p>
      <div class="table-wrap">
        <table class="projects">
          <thead><tr><th scope="col">${esc(pj.cols.no)}</th><th scope="col">${esc(pj.cols.name)}</th><th scope="col">${esc(pj.cols.place)}</th><th scope="col" class="num">${esc(pj.cols.qty)}</th><th scope="col">${esc(pj.cols.work)}</th></tr></thead>
          <tbody>
            ${pj.items.map((p, i) => `<tr><td class="idx">${i + 1}</td><th scope="row">${esc(p.name)}</th><td>${esc(pj.prov + p.place)}</td><td class="num">${p.qty}</td><td><span class="tag tag-${p.work}">${esc(pj.work[p.work])}</span></td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>
      <p class="note">${esc(pj.asOf)}</p>
    </div>
  </section>

  <section id="contact" class="section section-dark">
    <div class="wrap contact">
      <div>
        <p class="kicker">${esc(t.contact.kicker)}</p>
        <h2>${esc(t.contact.title)}</h2>
        <p class="body">${esc(t.contact.lead)}</p>
        <a class="btn btn-light" href="${esc(cfg.messengerUrl)}" target="_blank" rel="noopener">${esc(t.contact.messenger)}</a>
      </div>
      <address>
        <ul class="contact-list">
          <li class="contact-row">${icon('phone')}<div><span class="label">${esc(t.contact.phone)}</span><span class="multi">${telLinks}</span></div></li>
          ${row('email', t.contact.email, cfg.email, `mailto:${cfg.email}`)}
          ${row('address', t.contact.address, address)}
          ${row('address', t.contact.branch, t.contact.branchText)}
          ${row('facebook', t.contact.facebook, cfg.brandName, cfg.facebookUrl)}
        </ul>
      </address>
    </div>
    ${filled(cfg.googleMapsEmbedUrl) ? `<div class="wrap"><iframe class="map" src="${esc(cfg.googleMapsEmbedUrl)}" title="${esc(t.contact.map)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>` : ''}
  </section>
</main>

<footer class="site-footer">
  <div class="wrap footer-inner">
    <img src="/assets/logo.svg" alt="The Nine Innovation" width="160" height="66" loading="lazy">
    <p>© ${year} ${esc(legalName)} · ${esc(t.footer.tax)} ${esc(cfg.taxId)}<br>${esc(t.footer.rights)}</p>
  </div>
</footer>

<script src="/main.js" defer></script>
</body>
</html>
`;
}
