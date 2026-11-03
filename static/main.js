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
