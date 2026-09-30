/* Transparent-body treatment explorer, treatment sheet and treatment directory.
   Depends on treatments.js (window.TREATMENTS / window.CATEGORIES) and main.js (window.SITE). */
(function () {
  'use strict';
  const T = window.TREATMENTS, C = window.CATEGORIES;
  const SPRITE = 'assets/img/icons.svg';
  const CAT_ICON = { brain: 'brain', skullbase: 'skullbase', vascular: 'vessel', spine: 'spine', nerves: 'nerve', pediatric: 'child' };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const icon = (id) => `<svg class="ico" aria-hidden="true"><use href="${SPRITE}#i-${id}"/></svg>`;
  const catName = (id) => (C.find((c) => c.id === id) || { name: 'All' }).name;
  const byId = (id) => T.find((t) => t.id === id);
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------------- Body SVG ---------------- */
  const BODY = 'M221 150C229.1 157.6 219.1 182.3 224 192C228.9 201.7 237.2 200.4 248 204C258.8 207.6 272.8 207.3 284 212C295.2 216.7 303.2 221 310 230C316.8 239 318.8 247.6 322 262C325.2 276.4 325.8 290.2 328 310C330.2 329.8 331.5 354.4 334 372C336.5 389.6 338.8 390.4 342 408C345.2 425.6 348.8 447.7 352 470C355.2 492.3 356.8 514.7 360 532C363.2 549.3 368.6 554.1 370 566C371.4 577.9 370.9 589.4 368 598C365.1 606.6 358.7 614.4 354 614C349.3 613.6 344.9 605.7 342 596C339.1 586.3 341.2 581.2 338 560C334.8 538.8 328.7 504.3 324 478C319.3 451.7 316.3 438.1 312 414C307.7 389.9 304.3 367 300 344C295.7 321 290.9 288.5 288 286C285.1 283.5 286.5 309.8 284 330C281.5 350.2 277.6 378.2 274 398C270.4 417.8 263.6 422.4 264 440C264.4 457.6 272.4 476.6 276 496C279.6 515.4 283.3 522.1 284 548C284.7 573.9 282.5 612.3 280 640C277.5 667.7 271.4 679.7 270 702C268.6 724.3 273.8 740.2 272 764C270.2 787.8 263.2 817.4 260 834C256.8 850.6 251.8 849.2 254 856C256.2 862.8 269.8 866.6 272 872C274.2 877.4 274.3 883.5 266 886C257.7 888.5 233.9 890.3 226 886C218.1 881.7 222.4 877.5 222 862C221.6 846.5 224 821.6 224 800C224 778.4 223.4 760 222 742C220.6 724 217.8 720.2 216 700C214.2 679.8 213.8 651.6 212 630C210.2 608.4 208.2 591.2 206 580C203.8 568.8 202.2 568 200 568C197.8 568 196.2 568.8 194 580C191.8 591.2 189.8 608.4 188 630C186.2 651.6 185.8 679.8 184 700C182.2 720.2 179.4 724 178 742C176.6 760 176 778.4 176 800C176 821.6 178.4 846.5 178 862C177.6 877.5 181.9 881.7 174 886C166.1 890.3 142.3 888.5 134 886C125.7 883.5 125.8 877.4 128 872C130.2 866.6 143.8 862.8 146 856C148.2 849.2 143.2 850.6 140 834C136.8 817.4 129.8 787.8 128 764C126.2 740.2 131.4 724.3 130 702C128.6 679.7 122.5 667.7 120 640C117.5 612.3 115.3 573.9 116 548C116.7 522.1 120.4 515.4 124 496C127.6 476.6 135.6 457.6 136 440C136.4 422.4 129.6 417.8 126 398C122.4 378.2 118.5 350.2 116 330C113.5 309.8 114.9 283.5 112 286C109.1 288.5 104.3 321 100 344C95.7 367 92.3 389.9 88 414C83.7 438.1 80.7 451.7 76 478C71.3 504.3 65.2 538.8 62 560C58.8 581.2 60.9 586.3 58 596C55.1 605.7 50.7 613.6 46 614C41.3 614.4 34.9 606.6 32 598C29.1 589.4 28.6 577.9 30 566C31.4 554.1 36.8 549.3 40 532C43.2 514.7 44.8 492.3 48 470C51.2 447.7 54.8 425.6 58 408C61.2 390.4 63.5 389.6 66 372C68.5 354.4 69.8 329.8 72 310C74.2 290.2 74.8 276.4 78 262C81.2 247.6 83.2 239 90 230C96.8 221 104.8 216.7 116 212C127.2 207.3 141.2 207.6 152 204C162.8 200.4 171.1 201.7 176 192C180.9 182.3 170.9 157.6 179 150Z';
  const mirror = (d) => d.replace(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g, (m, x, y) => `${+(400 - x).toFixed(1)} ${y}`);

  const ARM = 'M206 214C240 220 280 228 302 252C312 300 318 360 326 410C334 460 342 520 352 566';
  const LEG = 'M204 486C224 500 240 520 244 560C248 620 246 680 242 740C240 790 240 830 240 858';
  const FINGERS = 'M352 566L360 596M352 566L352 600M352 566L345 595';
  const CORD = 'M200 136L200 530';
  const CAROTID = 'M212 262C214 230 213 200 212 170C211 150 220 134 224 118C230 104 228 84 220 68';
  const ARM_ART = 'M212 262C250 244 290 236 308 258C318 300 324 360 332 412C340 466 346 520 354 562';

  function vertebrae() {
    let out = '', y = 150;
    for (let i = 0; i < 24; i++) {
      const cerv = i < 7, lum = i >= 19;
      const w = cerv ? 15 : lum ? 26 : 19 + i * 0.25, h = cerv ? 8 : lum ? 13 : 10;
      out += `<rect x="${(200 - w / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h}" rx="3"/>`;
      y += h + (cerv ? 3 : lum ? 4 : 3.6);
    }
    return out + '<path d="M186 506L214 506L207 542L193 542Z" fill="rgba(186,230,253,.22)" stroke="#bae6fd"/>';
  }
  function ribs() {
    let out = '';
    [262, 288, 314, 340, 366].forEach((y, i) => {
      const r = `M205 ${y}C${226 + i} ${y + 2} ${252 - i * 2} ${y + 12} ${270 - i * 2} ${y + 32}`;
      out += `<path d="${r}"/><path d="${mirror(r)}"/>`;
    });
    return out;
  }
  function particles() {
    let out = '', s = 7;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < 26; i++) {
      out += `<circle cx="${(rnd() * 400).toFixed(0)}" cy="${(rnd() * 900).toFixed(0)}" r="${(0.8 + rnd() * 1.6).toFixed(1)}" opacity="${(0.3 + rnd() * 0.5).toFixed(2)}" style="animation-delay:-${(rnd() * 7).toFixed(1)}s"/>`;
    }
    return out;
  }

  const HOTSPOTS = [
    { id: 'brain', x: 200, y: 66, lx: 262, ly: 40, anchor: 'start' },
    { id: 'skullbase', x: 200, y: 112, lx: 128, ly: 128, anchor: 'end' },
    { id: 'vascular', x: 212, y: 196, lx: 270, ly: 186, anchor: 'start' },
    { id: 'spine', x: 200, y: 372, lx: 128, ly: 350, anchor: 'end' },
    { id: 'nerves', x: 244, y: 640, lx: 300, ly: 624, anchor: 'start' }
  ];
  const VIEW = {
    all: [-10, -60, 420, 1030], pediatric: [-10, -60, 420, 1030],
    brain: [100, 6, 200, 170], skullbase: [110, 40, 180, 150], vascular: [90, 40, 220, 290],
    spine: [40, 130, 320, 440], nerves: [10, 180, 380, 700]
  };

  function bodySVG(uid) {
    const g = (id) => `${id}-${uid}`;
    const pulses = [CORD, ARM, mirror(ARM), LEG, mirror(LEG)]
      .map((d, i) => `<path d="${d}" pathLength="428" style="animation-delay:-${i * 0.7}s"/>`).join('');
    const vPulses = [CAROTID, mirror(CAROTID), ARM_ART, mirror(ARM_ART)]
      .map((d, i) => `<path d="${d}" pathLength="428" style="animation-delay:-${i * 0.5}s"/>`).join('');
    const hs = HOTSPOTS.map((h) => {
      const tx = h.anchor === 'end' ? h.lx - 4 : h.lx + 4;
      return `<g class="hotspot" data-cat="${h.id}" tabindex="0" role="button" aria-label="Show ${catName(h.id)} treatments">
        <line class="hs-line" x1="${h.x}" y1="${h.y}" x2="${h.lx}" y2="${h.ly}"/>
        <text class="hs-label" x="${tx}" y="${h.ly + 3}" text-anchor="${h.anchor}">${catName(h.id)}</text>
        <g class="hs-dot"><circle class="hs-hit" cx="${h.x}" cy="${h.y}" r="18"/>
        <circle class="hs-ring" cx="${h.x}" cy="${h.y}" r="8"/>
        <circle class="hs-core" cx="${h.x}" cy="${h.y}" r="4"/></g></g>`;
    }).join('');
    return `<svg class="ex-svg" viewBox="0 0 400 900" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Transparent human body showing the brain, skull base, blood vessels, spine and nerves">
    <defs>
      <linearGradient id="bGlass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7dd3fc" stop-opacity=".30"/><stop offset=".5" stop-color="#38BDF8" stop-opacity=".12"/><stop offset="1" stop-color="#0E7490" stop-opacity=".08"/></linearGradient>
      <radialGradient id="${g('sheen')}" cx=".35" cy=".25" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <linearGradient id="${g('scan')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38BDF8" stop-opacity="0"/><stop offset=".85" stop-color="#38BDF8" stop-opacity=".35"/><stop offset="1" stop-color="#e0f2fe" stop-opacity=".95"/></linearGradient>
      <radialGradient id="${g('bg')}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#38BDF8" stop-opacity=".55"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0"/></radialGradient>
      <filter id="bGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <clipPath id="${g('clip')}"><path d="${BODY}"/><ellipse cx="200" cy="92" rx="54" ry="66"/></clipPath>
    </defs>
    <g class="b-particles">${particles()}</g>
    <g class="b-figure"><g class="b-breathe">
      <g class="b-body">
        <path class="b-shell" d="${BODY}"/>
        <path d="${BODY}" fill="url(#${g('sheen')})"/>
      </g>
      <g class="b-organ o-nerves">${ribs()}<path d="${ARM}"/><path d="${mirror(ARM)}"/><path d="${LEG}"/><path d="${mirror(LEG)}"/>
        <path d="${FINGERS}"/><path d="${mirror(FINGERS)}"/>
        <path d="M242 740C252 770 254 810 252 850"/><path d="${mirror('M242 740C252 770 254 810 252 850')}"/></g>
      <g class="b-organ o-vascular"><path d="${CAROTID}"/><path d="${mirror(CAROTID)}"/><path d="M188 262C194 255 206 255 212 262M200 258L200 330"/><path d="${ARM_ART}"/><path d="${mirror(ARM_ART)}"/></g>
      <g class="b-organ o-spine">${vertebrae()}<path class="cord" d="${CORD}"/></g>
      <g class="pulse">${pulses}</g><g class="pulse v">${vPulses}</g>
      <g class="b-head">
        <g class="b-body"><ellipse class="b-shell" cx="200" cy="92" rx="54" ry="66"/><ellipse cx="200" cy="92" rx="54" ry="66" fill="url(#${g('sheen')})"/></g>
        <circle class="b-brain-glow" cx="200" cy="82" r="48" fill="url(#${g('bg')})"/>
        <g class="b-organ o-brain">
          <path class="cortex" d="M160 90C152 62 174 44 200 46C226 44 248 62 240 90C238 104 226 110 214 108C206 114 194 114 186 108C174 110 162 104 160 90Z"/>
          <path class="gyri" d="M200 48C197 64 204 86 200 110M170 62C178 68 175 80 186 82M230 62C222 68 225 80 214 82M165 90C176 87 180 98 191 95M235 90C224 87 220 98 209 95M180 52C186 58 194 57 195 66M220 52C214 58 206 57 205 66M172 76C166 80 168 86 176 86M228 76C234 80 232 86 224 86"/>
          <ellipse cx="200" cy="117" rx="17" ry="7"/><path d="M196 112L197 138M204 112L203 138"/>
        </g>
        <g class="b-organ o-skullbase"><path d="M156 112C174 126 226 126 244 112"/><circle cx="200" cy="112" r="3.4"/></g>
        <g class="b-organ o-vascular"><path d="M176 118C170 104 172 84 180 68M188 120C194 113 206 113 212 120"/></g>
      </g>
    </g></g>
    <g clip-path="url(#${g('clip')})"><rect class="b-scan" x="0" y="0" width="400" height="70" fill="url(#${g('scan')})"/></g>
    <g class="b-reticle" style="transform:translate(200px,450px)">
      <circle class="r1" r="30" fill="none" stroke="#7dd3fc" stroke-width="1" stroke-dasharray="3 5"/>
      <circle class="r2" r="40" fill="none" stroke="#38BDF8" stroke-opacity=".6" stroke-width="1.4" stroke-dasharray="40 22"/>
      <path d="M-50 0h8M42 0h8M0 -50v8M0 42v8" stroke="#bae6fd" stroke-width="1.2"/>
    </g>
    <g class="hotspots">${hs}</g>
  </svg>`;
  }

  /* ---------------- Rows / cards ---------------- */
  const row = (t, i) => `<button class="t-row" type="button" data-open="${t.id}" style="--i:${i}">
      <span class="t-ic">${icon(CAT_ICON[t.c])}</span>
      <span><b>${esc(t.n)}</b><small>${esc(t.s)}</small></span>
      <span class="t-go">${icon('arrow')}</span></button>`;

  /* ---------------- Explorer ---------------- */
  let uidSeq = 0;
  function Explorer(root) {
    const uid = ++uidSeq;
    const chips = [{ id: 'all', name: 'All' }].concat(C).map((c) => {
      const n = c.id === 'all' ? T.length : T.filter((t) => t.c === c.id).length;
      return `<button class="chip" type="button" data-cat="${c.id}" aria-pressed="false">${c.id === 'all' ? icon('grid') : icon(CAT_ICON[c.id])}${c.name}<span class="n">${n}</span></button>`;
    }).join('');
    root.classList.add('explorer');
    root.innerHTML = `
      <div class="ex-stage" data-reveal="scan">
        <div class="ex-hud"><span>Neuro-scan · live<br><b class="hud-cat">Whole body</b></span><span>Tap a glowing point<br><b class="hud-n">${T.length} treatments</b></span></div>
        ${bodySVG(uid)}
        <div class="ex-foot" role="group" aria-label="Body view">
          <button type="button" data-cat="all" aria-pressed="true">Adult</button>
          <button type="button" data-cat="pediatric" aria-pressed="false">${'Child'}</button>
        </div>
      </div>
      <div class="ex-panel">
        <div class="chips" role="group" aria-label="Filter treatments by area">${chips}</div>
        <div class="ex-head" aria-live="polite"><h3><span class="ex-title">All treatments</span><span class="count"></span></h3><p class="ex-blurb"></p></div>
        <div class="ex-list"></div>
        ${root.dataset.more ? `<div class="ex-more"><a class="btn btn--primary" href="${root.dataset.more}" data-magnetic>Explore all treatments ${icon('arrow')}</a></div>` : ''}
      </div>`;
    const svg = root.querySelector('.ex-svg');
    const list = root.querySelector('.ex-list');
    const reticle = root.querySelector('.b-reticle');
    let vb = VIEW.all.slice(), anim;
    svg.setAttribute('viewBox', vb.join(' '));

    function tweenView(to) {
      cancelAnimationFrame(anim);
      const from = vb.slice(), t0 = performance.now(), dur = reduce ? 1 : 1100;
      const ease = (x) => 1 - Math.pow(1 - x, 4);
      (function step(now) {
        const k = ease(Math.min(1, (now - t0) / dur));
        vb = from.map((v, i) => v + (to[i] - v) * k);
        svg.setAttribute('viewBox', vb.map((v) => v.toFixed(2)).join(' '));
        svg.style.setProperty('--hs', (vb[2] / 420).toFixed(3));
        if (k < 1) anim = requestAnimationFrame(step);
      })(t0);
    }

    function select(cat, opts = {}) {
      root.dataset.focus = cat;
      root.querySelectorAll('.chip').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
      root.querySelectorAll('.ex-foot button').forEach((b) => b.setAttribute('aria-pressed', String(cat === 'pediatric' ? b.dataset.cat === 'pediatric' : b.dataset.cat === 'all')));
      root.querySelectorAll('.hotspot').forEach((h) => h.classList.toggle('on', h.dataset.cat === cat));
      const hs = HOTSPOTS.find((h) => h.id === cat);
      if (hs) reticle.style.transform = `translate(${hs.x}px, ${hs.y}px) scale(var(--hs, 1))`;
      tweenView(VIEW[cat] || VIEW.all);
      const items = cat === 'all' ? T : T.filter((t) => t.c === cat);
      const c = C.find((x) => x.id === cat);
      root.querySelector('.ex-title').textContent = c ? c.name : 'All treatments';
      root.querySelector('.count').textContent = items.length + (items.length === 1 ? ' treatment' : ' treatments');
      root.querySelector('.ex-blurb').textContent = c ? c.blurb : 'Complete brain, spine and nerve surgery, from keyhole endoscopy to complex skull base operations.';
      root.querySelector('.hud-cat').textContent = c ? c.name : 'Whole body';
      root.querySelector('.hud-n').textContent = items.length + ' treatments';
      list.innerHTML = items.map(row).join('');
      if (opts.scroll && innerWidth < 960) root.querySelector('.ex-head').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }

    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-cat]');
      if (b && root.contains(b)) {
        const same = root.dataset.focus === b.dataset.cat && b.classList.contains('hotspot');
        select(same ? 'all' : b.dataset.cat, { scroll: b.classList.contains('hotspot') });
      }
    });
    root.addEventListener('keydown', (e) => {
      const h = e.target.closest('.hotspot');
      if (h && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); h.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
    });

    // Hologram parallax: gentle 3D turn following the pointer (no custom cursor)
    const stage = root.querySelector('.ex-stage');
    if (!reduce && matchMedia('(pointer: fine)').matches) {
      stage.addEventListener('pointermove', (e) => {
        const r = stage.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        svg.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 8}deg)`;
      });
      stage.addEventListener('pointerleave', () => { svg.style.transform = ''; });
    }
    select(root.dataset.start || 'all');
    return { select };
  }

  /* ---------------- Sheet ---------------- */
  let sheet, scrim, lastOrigin, isOpen = false;
  function buildSheet() {
    scrim = document.createElement('div'); scrim.className = 'sheet-scrim';
    sheet = document.createElement('section');
    sheet.className = 'sheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-labelledby', 'sheet-title'); sheet.tabIndex = -1;
    document.body.append(scrim, sheet);
    scrim.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { // keep focus inside the sheet
        const f = sheet.querySelectorAll('a[href], button');
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }
  function fill(t) {
    const S = window.SITE || {};
    const msg = encodeURIComponent(`Hello Dr Sachin, I would like to consult about ${t.n}.`);
    sheet.innerHTML = `
      <div class="sheet-top"><span class="sheet-handle"></span><div class="sheet-drag"></div>
        <button class="sheet-close" type="button" aria-label="Close">${icon('close')}</button>
        <span class="eyebrow">${esc(catName(t.c))}</span>
        <h2 id="sheet-title">${esc(t.n)}</h2><p>${esc(t.s)}</p>
        <div class="sheet-tags">${t.t.map((x) => `<span>${esc(x)}</span>`).join('')}</div></div>
      <div class="sheet-body">
        <p class="anim" style="--i:0">${esc(t.o)}</p>
        <div class="anim" style="--i:1"><h3>${icon('list')}When is it needed?</h3><ul class="ticks">${t.w.map((x) => `<li>${icon('check')}<span>${esc(x)}</span></li>`).join('')}</ul></div>
        <div class="anim" style="--i:2"><h3>${icon('spark')}How Dr Sachin approaches it</h3><ol class="steps">${t.h.map((x) => `<li>${esc(x)}</li>`).join('')}</ol></div>
        <div class="recovery anim" style="--i:3"><h3>${icon('shield')}Recovery</h3><p>${esc(t.r)}</p></div>
        <p class="sheet-note anim" style="--i:4">This is general information. Your treatment plan is decided after a personal consultation and review of your scans.</p>
      </div>
      <div class="sheet-cta">
        <a class="btn btn--primary" href="tel:${S.phoneIntl || ''}">${icon('phone')}Call now</a>
        <a class="btn btn--glow" href="https://wa.me/${S.whatsapp || ''}?text=${msg}" target="_blank" rel="noopener">${icon('chat')}WhatsApp</a>
      </div>`;
    sheet.querySelector('.sheet-close').addEventListener('click', close);
    enableDrag();
  }
  function insetFrom(el) {
    const s = sheet.getBoundingClientRect();
    if (!el || !el.isConnected) return `inset(${s.height * 0.4}px ${s.width * 0.1}px ${s.height * 0.4}px ${s.width * 0.1}px round 32px)`;
    const o = el.getBoundingClientRect();
    const cl = (v) => Math.max(0, v).toFixed(1) + 'px';
    return `inset(${cl(o.top - s.top)} ${cl(s.right - o.right)} ${cl(s.bottom - o.bottom)} ${cl(o.left - s.left)} round 20px)`;
  }
  function open(id, origin, push = true) {
    const t = byId(id); if (!t) return;
    if (!sheet) buildSheet();
    lastOrigin = origin || document.activeElement;
    fill(t);
    sheet.classList.add('open'); scrim.classList.add('open'); document.body.classList.add('lock');
    sheet.style.transform = '';
    isOpen = true;
    if (!reduce) sheet.animate([{ clipPath: insetFrom(origin), opacity: 0.4 }, { clipPath: 'inset(0px 0px 0px 0px round 32px)', opacity: 1 }], { duration: 750, easing: 'cubic-bezier(.22,1,.36,1)' });
    sheet.querySelector('.sheet-body').scrollTop = 0;
    setTimeout(() => sheet.querySelector('.sheet-close').focus({ preventScroll: true }), 60);
    if (push) history.replaceState(null, '', '#t-' + id);
  }
  function close() {
    if (!isOpen) return;
    isOpen = false;
    scrim.classList.remove('open'); document.body.classList.remove('lock');
    const done = () => { sheet.classList.remove('open'); sheet.style.transform = ''; };
    if (reduce) done();
    else sheet.animate([{ clipPath: 'inset(0px 0px 0px 0px round 32px)', opacity: 1 }, { clipPath: insetFrom(lastOrigin), opacity: 0 }], { duration: 520, easing: 'cubic-bezier(.64,0,.78,0)' }).onfinish = done;
    if (location.hash.startsWith('#t-')) history.replaceState(null, '', location.pathname + location.search);
    if (lastOrigin && lastOrigin.focus) lastOrigin.focus({ preventScroll: true });
  }
  function enableDrag() { // pull the bottom sheet down to dismiss on phones
    const zone = sheet.querySelector('.sheet-top');
    let y0 = null, dy = 0;
    zone.addEventListener('pointerdown', (e) => { if (innerWidth > 640 || e.target.closest('button')) return; y0 = e.clientY; dy = 0; zone.setPointerCapture(e.pointerId); sheet.style.transition = 'none'; });
    zone.addEventListener('pointermove', (e) => { if (y0 === null) return; dy = Math.max(0, e.clientY - y0); sheet.style.transform = `translateY(${dy}px)`; });
    const end = () => {
      if (y0 === null) return; y0 = null; sheet.style.transition = 'transform .45s cubic-bezier(.22,1,.36,1)';
      if (dy > 110) close(); else sheet.style.transform = '';
      setTimeout(() => { sheet.style.transition = ''; }, 460);
    };
    zone.addEventListener('pointerup', end); zone.addEventListener('pointercancel', end);
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]');
    if (b) { e.preventDefault(); open(b.dataset.open, b); }
  });

  /* ---------------- Directory (search + filter with FLIP) ---------------- */
  function Directory(root) {
    const chips = [{ id: 'all', name: 'All' }].concat(C).map((c) => `<button class="chip" type="button" data-f="${c.id}" aria-pressed="${c.id === 'all'}">${c.name}</button>`).join('');
    root.innerHTML = `<div class="dir-tools"><label class="search"><span class="sr-only">Search treatments</span>${icon('search')}<input type="search" placeholder="Search e.g. disc, tumour, child" autocomplete="off"></label><div class="chips" role="group" aria-label="Filter by area">${chips}</div></div>
      <div class="dir">${T.map((t) => `<button type="button" class="card" data-tilt data-open="${t.id}" data-c="${t.c}" data-k="${esc((t.n + ' ' + t.s + ' ' + t.t.join(' ') + ' ' + catName(t.c)).toLowerCase())}"><span class="glare"></span><span class="cat">${catName(t.c)}</span><span class="t-ic">${icon(CAT_ICON[t.c])}</span><h3>${esc(t.n)}</h3><p>${esc(t.s)}</p><span class="link-arrow">View details ${icon('arrow')}</span></button>`).join('')}</div>
      <p class="dir-empty">No treatment matches that search. Try another word, or call us and we will guide you.</p>`;
    const cards = [...root.querySelectorAll('.dir .card')];
    const input = root.querySelector('input');
    let f = 'all';
    function apply() {
      const q = input.value.trim().toLowerCase();
      const first = new Map(cards.map((c) => [c, c.getBoundingClientRect()]));
      let shown = 0;
      cards.forEach((c) => {
        const ok = (f === 'all' || c.dataset.c === f) && (!q || q.split(/\s+/).every((w) => c.dataset.k.includes(w)));
        c.classList.toggle('gone', !ok); if (ok) shown++;
      });
      root.querySelector('.dir-empty').classList.toggle('show', !shown);
      if (reduce) return;
      cards.forEach((c) => {
        if (c.classList.contains('gone')) return;
        const a = first.get(c), b = c.getBoundingClientRect();
        if (!a.width) { c.animate([{ opacity: 0, transform: 'scale(.85)', filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 600, easing: 'cubic-bezier(.22,1,.36,1)' }); return; }
        const dx = a.left - b.left, dy = a.top - b.top;
        if (dx || dy) c.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)' });
      });
    }
    root.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => {
      f = b.dataset.f; root.querySelectorAll('[data-f]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); apply();
    }));
    input.addEventListener('input', apply);
  }

  /* ---------------- Boot ---------------- */
  document.querySelectorAll('[data-explorer]').forEach((el) => Explorer(el));
  document.querySelectorAll('[data-directory]').forEach((el) => Directory(el));
  const S = window.SITE;
  document.querySelectorAll('[data-explorer] [data-reveal], [data-directory] [data-reveal]').forEach((el) => S && S.observe ? S.observe(el) : el.classList.add('in'));
  const openFromHash = () => { const m = location.hash.match(/^#t-([\w-]+)/); if (m && byId(m[1])) open(m[1], null, false); };
  openFromHash();
  addEventListener('hashchange', openFromHash);
  window.Treatments = { open, close };
})();
