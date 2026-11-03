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

  // Facebook Page Plugin — loads only when the section scrolls near view; shows latest page posts.
  const box = document.querySelector('[data-fb-page]');
  const loadFb = () => {
    if (box.dataset.loaded) return; box.dataset.loaded = 1;
    const w = Math.max(180, Math.min(500, Math.round(box.clientWidth)));
    const p = new URLSearchParams({ href: box.dataset.fbPage, tabs: 'timeline', width: w, height: 700,
      small_header: 'false', adapt_container_width: 'true', hide_cover: 'false', show_facepile: 'false', locale: box.dataset.locale });
    const f = document.createElement('iframe');
    f.src = 'https://www.facebook.com/plugins/page.php?' + p;
    f.title = 'Facebook — Nine Innovation'; f.loading = 'lazy';
    f.allow = 'encrypted-media; clipboard-write'; f.setAttribute('scrolling', 'no');
    f.onload = () => box.querySelector('.fb-fallback')?.remove();
    box.appendChild(f);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { loadFb(); io.disconnect(); } }), { rootMargin: '400px' });
    io.observe(box);
  } else loadFb();

  // Reveal on scroll
  const els = document.querySelectorAll('.section h2, .card, .pillar, .contact-row, .table-wrap');
  if ('IntersectionObserver' in window) {
    const ro = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } }), { threshold: .15 });
    els.forEach((el) => { el.classList.add('reveal'); ro.observe(el); });
  }
})();
