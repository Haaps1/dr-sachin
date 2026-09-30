/* Dr Sachin G R — shared interactions.
   Contact details live here; the same values are in the HTML as a no-JS fallback. */
window.SITE = {
  phone: '99142 08940',
  phoneIntl: '+919914208940',
  whatsapp: '919914208940',
  email: 'care@drsachingr.com' // placeholder — replace with the real address
};

(function () {
  'use strict';
  const d = document, root = d.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const $ = (s, c = d) => c.querySelector(s), $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- Contact placeholders ---------- */
  $$('[data-phone]').forEach((a) => { a.href = 'tel:' + SITE.phoneIntl; if (a.dataset.phone === 'text') a.textContent = SITE.phone; });
  $$('[data-wa]').forEach((a) => { a.href = 'https://wa.me/' + SITE.whatsapp + (a.dataset.wa ? '?text=' + encodeURIComponent(a.dataset.wa) : ''); });
  $$('[data-email]').forEach((a) => { a.href = 'mailto:' + SITE.email; if (a.dataset.email === 'text') a.textContent = SITE.email; });
  $$('[data-year]').forEach((e) => { e.textContent = new Date().getFullYear(); });

  /* ---------- Header state + nav pill + tab blob ---------- */
  const header = $('.header');
  const onScroll = () => header && header.classList.toggle('is-solid', scrollY > 30);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  const nav = $('.nav');
  if (nav) {
    const pill = d.createElement('span'); pill.className = 'nav-pill'; nav.prepend(pill);
    const cur = $('a[aria-current]', nav);
    const place = (a) => { if (!a) { pill.style.width = 0; return; } pill.style.left = a.offsetLeft + 'px'; pill.style.width = a.offsetWidth + 'px'; };
    place(cur);
    $$('a', nav).forEach((a) => a.addEventListener('pointerenter', () => place(a)));
    nav.addEventListener('pointerleave', () => place(cur));
    addEventListener('resize', () => place(cur));
    d.fonts && d.fonts.ready.then(() => place(cur));
  }
  const tabbar = $('.tabbar');
  if (tabbar) {
    const blob = d.createElement('span'); blob.className = 'tab-blob'; tabbar.prepend(blob);
    const put = (t) => { if (!t) { blob.style.opacity = 0; return; } blob.style.opacity = 1; blob.style.left = (t.offsetLeft + t.offsetWidth / 2 - 27) + 'px'; };
    const cur = $('.tab[aria-current]', tabbar); put(cur);
    addEventListener('resize', () => put($('.tab[aria-current]', tabbar)));
    $$('.tab:not(.tab--fab)', tabbar).forEach((t) => t.addEventListener('click', () => { $$('.tab', tabbar).forEach((x) => x.removeAttribute('aria-current')); t.setAttribute('aria-current', 'page'); put(t); }));
  }

  /* ---------- Split text into words for 3D reveals ---------- */
  $$('[data-split]').forEach((el) => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = d.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(' '); return; }
            const w = d.createElement('span'); w.className = 'w';
            const wi = d.createElement('span'); wi.className = 'wi'; wi.style.setProperty('--i', i++); wi.textContent = part;
            w.append(wi); frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('rotator')) walk(n);
        else if (n.nodeType === 1) { n.style.setProperty('--i', i++); }
      });
    };
    walk(el);
  });

  /* ---------- Reveal on view ---------- */
  $$('[data-stagger]').forEach((g) => [...g.children].forEach((c, i) => c.style.setProperty('--d', (i * 0.09).toFixed(2) + 's')));
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  // Clip-path reveals are invisible to IntersectionObserver, so watch their parent instead
  const clipped = new Map();
  const pio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    (clipped.get(e.target) || []).forEach((el) => el.classList.add('in'));
    clipped.delete(e.target); pio.unobserve(e.target);
  }), { rootMargin: '0px 0px -15% 0px' });
  const observe = (el) => {
    if (!/^(scan|iris)$/.test(el.dataset.reveal || '')) return io.observe(el);
    const p = el.parentElement;
    if (!clipped.has(p)) { clipped.set(p, []); pio.observe(p); }
    clipped.get(p).push(el);
  };
  $$('[data-split], [data-reveal]').forEach(observe);
  SITE.observe = observe;

  /* ---------- Counters ---------- */
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, t0 = performance.now(), dur = reduce ? 1 : 1800;
    (function tick(now) { const k = clamp((now - t0) / dur, 0, 1), v = end * (1 - Math.pow(1 - k, 4)); el.textContent = Math.round(v).toLocaleString('en-IN'); if (k < 1) requestAnimationFrame(tick); })(t0);
  }), { threshold: 0.6 });
  $$('[data-count]').forEach((el) => cio.observe(el));

  /* ---------- Hero word rotator (3D cube flip) ---------- */
  $$('.rotator').forEach((r) => {
    const items = $$('span', r); if (items.length < 2) return;
    let i = 0; items[0].classList.add('on');
    setInterval(() => {
      const a = items[i]; i = (i + 1) % items.length; const b = items[i];
      a.classList.remove('on'); a.classList.add('out'); b.classList.remove('out'); b.classList.add('on');
      setTimeout(() => a.classList.remove('out'), 900);
    }, 2600);
  });

  /* ---------- Tilt + glare, magnetic buttons (pointer devices only) ---------- */
  if (fine && !reduce) {
    d.addEventListener('pointermove', (e) => {
      const el = e.target.closest && e.target.closest('[data-tilt]');
      if (!el) return;
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 10}deg) translateZ(0)`;
      el.style.setProperty('--gx', x * 100 + '%'); el.style.setProperty('--gy', y * 100 + '%');
    }, { passive: true });
    d.addEventListener('pointerout', (e) => {
      const el = e.target.closest && e.target.closest('[data-tilt]');
      if (el && !el.contains(e.relatedTarget)) el.style.transform = '';
    });
    const mag = (el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
        el.style.transform = `translate(${(x - r.width / 2) * 0.18}px, ${(y - r.height / 2) * 0.28}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    };
    $$('[data-magnetic], .btn--primary, .btn--glow').forEach(mag);
    new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && n.querySelectorAll && n.querySelectorAll('[data-magnetic]').forEach(mag)))).observe(d.body, { childList: true, subtree: true });
  }

  /* ---------- Portrait fallback ---------- */
  $$('img[data-fallback]').forEach((img) => {
    const hide = () => { img.remove(); };
    if (img.complete && !img.naturalWidth) hide(); else img.addEventListener('error', hide);
  });

  /* ---------- Hero brain: lobes highlight in turn; hover, tap or focus to explore ---------- */
  $$('[data-brain]').forEach((stage) => {
    const lobes = $$('.lobe', stage), card = $('.lobe-card', stage), pin = $('.lobe-pin', stage), svg = $('svg', stage);
    if (!lobes.length) return;
    let i = 0, timer, visible = true;
    const show = (k) => {
      i = k; const l = lobes[k];
      lobes.forEach((x) => x.classList.toggle('on', x === l));
      $('b', card).textContent = l.dataset.name; $('small', card).textContent = l.dataset.info;
      card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap');
      pin.style.transform = `translate(${l.dataset.x}px, ${l.dataset.y}px)`;
    };
    const play = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => { if (visible) show((i + 1) % lobes.length); }, 3200); };
    lobes.forEach((l, k) => {
      l.addEventListener('pointerenter', () => { show(k); clearInterval(timer); });
      l.addEventListener('pointerleave', play);
      l.addEventListener('focus', () => { show(k); clearInterval(timer); });
      l.addEventListener('blur', play);
      l.addEventListener('click', () => { show(k); play(); });
    });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stage);
    if (fine && !reduce) {
      stage.addEventListener('pointermove', (e) => {
        const r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        svg.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 6}deg)`;
      });
      stage.addEventListener('pointerleave', () => { svg.style.transform = ''; });
    }
    show(0); play();
  });

  /* ---------- Scroll-linked progress: spine indicator, top bar, journey, neuron drawing ---------- */
  const topbar = $('.top-progress');
  const journeys = $$('[data-progress]');
  let ticking = false;
  function onProgress() {
    ticking = false;
    const max = root.scrollHeight - innerHeight, p = max > 0 ? scrollY / max : 0;
    if (topbar) topbar.style.setProperty('--p', p.toFixed(4));
    journeys.forEach((j) => {
      const r = j.getBoundingClientRect(), k = clamp((innerHeight * 0.8 - r.top) / (r.height + innerHeight * 0.2), 0, 1);
      j.style.setProperty('--p', k.toFixed(3));
      const steps = $$('.step', j); steps.forEach((s, i) => s.classList.toggle('lit', k >= (i + 0.5) / steps.length - 0.05));
      const fg = $('.journey-line .fg', j); if (fg) fg.style.setProperty('--p', k.toFixed(3));
    });
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onProgress); } }, { passive: true });
  onProgress();

  /* ---------- Testimonials coverflow ---------- */
  $$('[data-carousel]').forEach((wrap) => {
    const track = $('.tcarousel', wrap), cards = $$('.tcard', track), dots = $('.tdots', wrap);
    let i = 0, timer;
    cards.forEach((c, k) => { const b = d.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Show review ' + (k + 1)); b.addEventListener('click', () => go(k)); dots.append(b); });
    function layout() {
      const n = cards.length;
      cards.forEach((c, k) => {
        let off = k - i; if (off > n / 2) off -= n; if (off < -n / 2) off += n;
        const a = Math.abs(off);
        c.style.transform = `translateX(${off * 62}%) translateZ(${-a * 180}px) rotateY(${-off * 28}deg) scale(${1 - a * 0.06})`;
        c.style.opacity = a > 2 ? 0 : 1 - a * 0.35; c.style.zIndex = 10 - a;
        c.setAttribute('aria-hidden', String(!!off)); c.style.pointerEvents = off ? 'none' : '';
      });
      $$('button', dots).forEach((b, k) => k === i ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current'));
    }
    const go = (k) => { i = (k + cards.length) % cards.length; layout(); restart(); };
    const restart = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => go(i + 1), 5200); };
    $('.prev', wrap).addEventListener('click', () => go(i - 1));
    $('.next', wrap).addEventListener('click', () => go(i + 1));
    let x0 = null;
    track.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    track.addEventListener('pointerup', (e) => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1)); });
    wrap.addEventListener('pointerenter', () => clearInterval(timer)); wrap.addEventListener('pointerleave', restart);
    layout(); restart();
  });

  /* ---------- FAQ: animated open/close ---------- */
  $$('.faq details').forEach((det) => {
    const sum = $('summary', det), ans = $('.ans', det);
    sum.addEventListener('click', (e) => {
      if (reduce) return;
      e.preventDefault();
      if (det.open) {
        const a = ans.animate([{ height: ans.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
        det.classList.add('closing'); a.onfinish = () => { det.open = false; det.classList.remove('closing'); };
      } else {
        det.open = true;
        ans.animate([{ height: '0px', opacity: 0 }, { height: ans.offsetHeight + 'px', opacity: 1 }], { duration: 560, easing: 'cubic-bezier(.22,1,.36,1)' });
      }
    });
  });

  /* ---------- About: training world map ---------- */
  $$('[data-world]').forEach((wrap) => {
    const btns = $$('.tl button', wrap);
    const pick = (id) => {
      btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.city === id)));
      $$('.city', wrap).forEach((c) => c.classList.toggle('lit', c.dataset.city === id || c.dataset.city === 'in'));
      $$('.arc', wrap).forEach((a) => a.classList.toggle('lit', a.dataset.city === id));
    };
    btns.forEach((b) => b.addEventListener('click', () => { pick(b.dataset.city); clearInterval(auto); }));
    let k = 0; const auto = setInterval(() => { if (reduce) return; k = (k + 1) % btns.length; pick(btns[k].dataset.city); }, 3200);
    pick(btns[0].dataset.city);
  });

  /* ---------- Contact form → WhatsApp ---------- */
  $$('form[data-wa-form]').forEach((f) => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      $$('[required]', f).forEach((inp) => {
        const bad = !inp.value.trim() || (inp.type === 'tel' && inp.value.replace(/\D/g, '').length < 10);
        inp.closest('.field').classList.toggle('invalid', bad); if (bad && ok) { inp.focus(); ok = false; }
      });
      if (!ok) return;
      const v = (n) => (f.elements[n] && f.elements[n].value.trim()) || '';
      const msg = `Hello Dr Sachin,\nName: ${v('name')}\nPhone: ${v('phone')}${v('age') ? '\nAge: ' + v('age') : ''}\nConcern: ${v('concern')}${v('message') ? '\n' + v('message') : ''}`;
      window.open('https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
    $$('input, select', f).forEach((i) => i.addEventListener('input', () => i.closest('.field').classList.remove('invalid')));
  });
})();
