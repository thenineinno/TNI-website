(() => {
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Mobile menu
  const btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', open); nav.classList.toggle('open', open);
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) { btn.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); } });

  // Remember language choice
  document.querySelectorAll('[data-lang]').forEach((a) =>
    a.addEventListener('click', () => { try { localStorage.setItem('lang', a.dataset.lang); } catch {} }));

  // Facebook feed via the official JS SDK. The SDK fires "xfbml.render" when done, so we can tell
  // whether the feed really appeared; if not (blocked by the browser, unsupported page, etc.)
  // the branded "Follow us" card stays visible instead of an empty box.
  const box = document.querySelector('.fb-frame');
  const fail = () => box.classList.add('fb-failed');
  const loadFb = () => {
    if (box.dataset.loaded) return; box.dataset.loaded = 1;
    const timer = setTimeout(fail, 10000);
    window.fbAsyncInit = () => {
      FB.init({ xfbml: true, version: 'v24.0' });
      FB.Event.subscribe('xfbml.render', () => {
        const f = box.querySelector('.fb-page iframe');
        if (f && f.offsetHeight > 120) { clearTimeout(timer); box.classList.add('fb-ok'); }
        else { clearTimeout(timer); fail(); }
      });
    };
    const s = document.createElement('script');
    s.async = true; s.defer = true; s.crossOrigin = 'anonymous';
    s.src = `https://connect.facebook.net/${box.dataset.fbLocale}/sdk.js`;
    s.onerror = () => { clearTimeout(timer); fail(); };
    document.body.appendChild(s);
  };
  // Preferred: latest posts from our own /api/fb-posts (Cloudflare Worker + Graph API),
  // rendered as cards. If that isn't configured or fails, fall back to the Facebook embed.
  const sec = document.querySelector('.updates');
  const fmt = (d) => { try { return new Intl.DateTimeFormat(sec.dataset.lang === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d)); } catch { return ''; } };
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const renderPosts = (posts) => {
    const grid = el('ul', 'fb-posts');
    posts.forEach((p) => {
      const li = el('li', 'post');
      const a = el('a', 'post-link'); a.href = p.url; a.target = '_blank'; a.rel = 'noopener';
      if (p.image) { const img = el('img', 'post-img'); img.src = p.image; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'; a.append(img); }
      const body = el('div', 'post-body');
      body.append(el('time', 'post-date', fmt(p.created)));
      body.lastChild.dateTime = p.created;
      if (p.message) body.append(el('p', 'post-text', p.message));
      body.append(el('span', 'post-more', sec.dataset.readMore + ' →'));
      a.append(body); li.append(a); grid.append(li);
    });
    const more = el('a', 'btn btn-ghost fb-all', sec.dataset.more); more.href = sec.dataset.fbUrl; more.target = '_blank'; more.rel = 'noopener';
    box.replaceWith(grid); grid.after(more);
    sec.classList.add('has-posts');
  };
  const start = () => {
    fetch('/api/fb-posts', { headers: { accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => (d.posts && d.posts.length ? renderPosts(d.posts) : loadFb()))
      .catch(() => loadFb());
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { start(); io.disconnect(); } }), { rootMargin: '400px' });
    io.observe(box);
  } else start();

  // Reveal on scroll
  const els = document.querySelectorAll('.section h2, .card, .pillar, .contact-row, .table-wrap');
  if ('IntersectionObserver' in window) {
    const ro = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } }), { threshold: .15 });
    els.forEach((el) => { el.classList.add('reveal'); ro.observe(el); });
  }
})();
