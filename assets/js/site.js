/* =====================================================================
   JAGAN A. — site behaviour (all pages)
   Everything here is progressive enhancement: with JavaScript off,
   every page still reads top to bottom and every link works.
   ===================================================================== */
(() => {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const root = document.documentElement;
  root.classList.add('js');

  /* ---------- contact links from config.js (hidden when empty) ---------- */
  const C = (window.SITE && window.SITE.contact) || {};
  const hrefs = {
    whatsapp:  C.whatsapp ? `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(C.whatsappMessage || '')}` : '',
    github:    C.github || '',
    email:     C.email ? `mailto:${C.email}` : '',
    linkedin:  C.linkedin || '',
    instagram: C.instagram || ''
  };
  const labels = { whatsapp: C.whatsappDisplay || '', github: (C.github || '').replace(/^https?:\/\//, ''),
                   email: C.email || '', linkedin: 'LinkedIn profile', instagram: (C.instagram || '').replace(/^https?:\/\/(www\.)?/, '') };
  $$('[data-contact]').forEach(el => {
    const k = el.dataset.contact, h = hrefs[k];
    if (!h) { el.remove(); return; }
    el.hidden = false; el.href = h;
    if (!h.startsWith('mailto:')) { el.target = '_blank'; el.rel = 'noopener'; }
    const v = $('[data-contact-value]', el); if (v) v.textContent = labels[k];
  });

  /* ---------- intro loader (home page, once per visit) ---------- */
  const intro = $('.intro');
  const done = () => { window.__introDone = true; document.body.classList.add('ready'); };
  let seen = false; try { seen = sessionStorage.getItem('ja-intro') === '1'; } catch (e) {}
  if (intro && !reduce && !seen) {
    const num = $('.intro-count', intro); let n = 0;
    const step = () => { n = Math.min(100, n + Math.ceil((100 - n) / 9)); if (num) num.textContent = String(n).padStart(3, '0');
      if (n < 100) setTimeout(step, 38); };
    step();
    setTimeout(() => { intro.classList.add('out'); done(); try { sessionStorage.setItem('ja-intro', '1'); } catch (e) {} }, 1700);
    setTimeout(() => intro.remove(), 2600);
  } else { intro && intro.remove(); done(); }

  /* ---------- page transitions between home and case studies ---------- */
  const curtain = $('.curtain');
  if (curtain) requestAnimationFrame(() => curtain.classList.add('lift'));
  document.addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a || !curtain || reduce) return;
    const url = new URL(a.href, location.href);
    if (a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || url.origin !== location.origin) return;
    if (url.pathname === location.pathname) return;            // same-page anchors scroll instead
    e.preventDefault(); curtain.classList.remove('lift'); curtain.classList.add('drop');
    setTimeout(() => { location.href = url.href; }, 480);
  });
  addEventListener('pageshow', e => { if (e.persisted && curtain) { curtain.classList.remove('drop'); curtain.classList.add('lift'); } });

  /* ---------- smooth scrolling (Lenis) wired to GSAP ScrollTrigger ---------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    } else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const t = $(id); if (!t) return;
    e.preventDefault(); closeMenu();
    if (lenis) lenis.scrollTo(t, { offset: -10 }); else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', id);
  }));

  /* ---------- header + mobile menu ---------- */
  const header = $('.site-header'), toggle = $('.menu-toggle'), menu = $('#site-menu');
  function closeMenu() { if (!menu) return; menu.classList.remove('open'); document.body.classList.remove('menu-open'); toggle && toggle.setAttribute('aria-expanded', 'false'); }
  toggle && toggle.addEventListener('click', () => {
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open); document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (open) { const first = $('a', menu); first && first.focus(); }
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY; header && header.classList.toggle('scrolled', y > 40);
    header && header.classList.toggle('hide', y > lastY && y > 400 && !document.body.classList.contains('menu-open'));
    lastY = y;
  }, { passive: true });
  // highlight the section in view
  const navLinks = $$('.site-nav a[href^="#"]');
  if (navLinks.length) {
    const spy = new IntersectionObserver(es => es.forEach(en => { if (!en.isIntersecting) return;
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(l => { const s = $(l.getAttribute('href')); s && spy.observe(s); });
  }

  /* ---------- custom cursor (mouse / trackpad only) ---------- */
  if (fine && !reduce) {
    const dot = document.createElement('div'), ring = document.createElement('div');
    dot.className = 'cursor-dot'; ring.className = 'cursor-ring'; document.body.append(dot, ring);
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px,${y}px)`; }, { passive: true });
    const loop = () => { rx += (x - rx) * .18; ry += (y - ry) * .18; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); }; loop();
    document.addEventListener('pointerover', e => { const t = e.target.closest('a,button,[data-cursor]');
      ring.classList.toggle('big', !!t); ring.dataset.label = t && t.dataset.cursor ? t.dataset.cursor : ''; });
    document.addEventListener('pointerleave', () => { dot.style.opacity = ring.style.opacity = 0; });
    document.addEventListener('pointerenter', () => { dot.style.opacity = ring.style.opacity = ''; });
  }

  /* ---------- headings: split into letters for the slam entrance ---------- */
  $$('.slam').forEach(h => {
    let i = 0;
    const walk = n => [...n.childNodes].forEach(c => {
      if (c.nodeType === 3) { const f = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(word => { if (!word) return; if (/^\s+$/.test(word)) { f.append(' '); return; }
          const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
          [...word].forEach(ch => { const s = document.createElement('span'); s.className = 'ch'; s.style.setProperty('--i', i++); s.textContent = ch; w.append(s); });
          f.append(w); });
        c.replaceWith(f); }
      else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c); });
    if (!h.getAttribute('aria-label')) h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
    walk(h);
  });

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(en => { if (!en.isIntersecting) return;
    en.target.classList.add('is-in'); io.unobserve(en.target); }), { rootMargin: '0px 0px -12% 0px' });
  $$('.reveal, .slam, .blade, .stagger').forEach(el => io.observe(el));

  /* ---------- selected works: horizontal gallery on large screens ---------- */
  const track = $('.works-track'), pin = $('.works-pin');
  if (track && pin && window.gsap && window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const dist = () => track.scrollWidth - innerWidth;
      const tween = gsap.to(track, { x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: pin, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .6, invalidateOnRefresh: true,
          onUpdate: self => { const bar = $('.works-progress i'); bar && (bar.style.transform = `scaleX(${self.progress})`); } } });
      $$('.work-card', track).forEach(card => {
        const art = $('.work-art', card);
        art && gsap.fromTo(art, { xPercent: 8 }, { xPercent: -8, ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      });
      return () => gsap.set(track, { x: 0 });
    });
  }

  /* ---------- subtle tilt on project visuals ---------- */
  if (fine && !reduce) $$('[data-tilt]').forEach(el => {
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      el.style.setProperty('--rx', (-py * 6) + 'deg'); el.style.setProperty('--ry', (px * 8) + 'deg'); });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  });

  /* ---------- journey: the line fills and each step lights up ---------- */
  const path = $('.path'), fill = $('.path-fill');
  if (path && fill) {
    const steps = $$('.step', path);
    const tick = () => { const r = path.getBoundingClientRect(), mid = innerHeight * .6;
      fill.style.transform = `scaleY(${Math.max(0, Math.min(1, (mid - r.top) / r.height))})`;
      steps.forEach(s => s.classList.toggle('lit', s.getBoundingClientRect().top < mid)); };
    addEventListener('scroll', tick, { passive: true }); addEventListener('resize', tick); tick();
  }

  /* ---------- small things ---------- */
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
