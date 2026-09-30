/* 3D body for the treatment explorer.
   The glass body is "inflated" from the same 2D outline the SVG fallback uses, so both always match.
   Loads three.js only when the explorer comes near the viewport; if WebGL is unavailable the SVG stays. */
const ROOT = new URL('../', import.meta.url).href; // …/assets/
const G = window.BODY_GEO;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function loadScript(src) {
  return new Promise((ok, fail) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = fail; document.head.append(s); });
}
function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}

/* ---------- 2D helpers (SVG coordinates: x 0–400, y 0–900) ---------- */
const NS = 'http://www.w3.org/2000/svg';
let holder;
function sample(d, step) {
  if (!holder) { holder = document.createElementNS(NS, 'svg'); holder.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden'); holder.setAttribute('aria-hidden', 'true'); document.body.append(holder); }
  const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); holder.append(p);
  const L = p.getTotalLength(), pts = [];
  for (let s = 0; s <= L; s += step) { const q = p.getPointAtLength(s); pts.push([q.x, q.y]); }
  p.remove(); return pts;
}
function inside(poly, x, y) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function edgeDist(poly, x, y) {
  let m = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, ay] = poly[j], [bx, by] = poly[i], dx = bx - ax, dy = by - ay;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1)));
    const ex = ax + t * dx - x, ey = ay + t * dy - y, d = ex * ex + ey * ey;
    if (d < m) m = d;
  }
  return Math.sqrt(m);
}
const DEPTH = 3.5, BACK = 0.82;
const depthAt = (poly, x, y) => DEPTH * Math.sqrt(Math.max(0, edgeDist(poly, x, y)));

async function mount(stage, root) {
  const [THREE] = await Promise.all([import(ROOT + 'vendor/three.module.min.js'), window.Delaunator ? 0 : loadScript(ROOT + 'vendor/delaunator.min.js')]).then(([t]) => [t]);
  const V = (x, y, z = 0) => new THREE.Vector3(x - 200, 450 - y, z);

  /* ----- Body mesh: outline + interior grid → Delaunay → inflate by distance to edge ----- */
  const poly = sample(G.BODY, 3);
  const S = 6, pts = poly.slice();
  for (let y = 16, r = 0; y < 892; y += S * 0.87, r++) {
    for (let x = 20 + (r % 2) * S / 2; x < 380; x += S) {
      if (inside(poly, x, y) && edgeDist(poly, x, y) > S * 0.5) pts.push([x, y]);
    }
  }
  const del = window.Delaunator.from(pts);
  const nOut = poly.length, N = pts.length;
  const h = pts.map(([x, y], i) => (i < nOut ? 0 : depthAt(poly, x, y)));
  const pos = new Float32Array((N + (N - nOut)) * 3);
  pts.forEach(([x, y], i) => { pos.set([x - 200, 450 - y, h[i]], i * 3); });
  for (let i = nOut; i < N; i++) pos.set([pts[i][0] - 200, 450 - pts[i][1], -h[i] * BACK], (N + i - nOut) * 3);
  const back = (i) => (i < nOut ? i : N + i - nOut);
  const idx = [];
  const t = del.triangles;
  for (let k = 0; k < t.length; k += 3) {
    let a = t[k], b = t[k + 1], c = t[k + 2];
    const cx = (pts[a][0] + pts[b][0] + pts[c][0]) / 3, cy = (pts[a][1] + pts[b][1] + pts[c][1]) / 3;
    if (!inside(poly, cx, cy)) continue;
    const e = (p, q) => Math.hypot(pts[p][0] - pts[q][0], pts[p][1] - pts[q][1]);
    if (Math.max(e(a, b), e(b, c), e(c, a)) > S * 3) continue;
    // screen y is flipped in 3D, so fix winding to face +z
    const cross = (pts[b][0] - pts[a][0]) * (pts[a][1] - pts[c][1]) - (pts[a][1] - pts[b][1]) * (pts[c][0] - pts[a][0]);
    if (cross < 0) [b, c] = [c, b];
    idx.push(a, b, c, back(a), back(c), back(b));
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setIndex(idx); geo.computeVertexNormals();

  /* ----- Scene ----- */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  const canvas = renderer.domElement; canvas.className = 'ex-3d'; canvas.setAttribute('aria-hidden', 'true');
  stage.prepend(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 10, 6000);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xbfe0ec, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(420, 600, 900); scene.add(key);
  const rim = new THREE.DirectionalLight(0x7dd3fc, 2.4); rim.position.set(-600, 300, -500); scene.add(rim);

  const fig = new THREE.Group(); scene.add(fig);

  // glass body: back faces, then front faces, then a fresnel rim for a crisp 3D edge
  const glass = (side, op) => new THREE.MeshPhysicalMaterial({ color: 0x9fd6ea, roughness: 0.28, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.2, transparent: true, opacity: op, side, depthWrite: false });
  const bBack = new THREE.Mesh(geo, glass(THREE.BackSide, 0.22)); bBack.renderOrder = 2;
  const bFront = new THREE.Mesh(geo, glass(THREE.FrontSide, 0.34)); bFront.renderOrder = 3;
  const rimMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { c: { value: new THREE.Color(0x0e7490) } },
    vertexShader: 'varying vec3 n; varying vec3 v; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); n = normalize(normalMatrix*normal); v = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 c; varying vec3 n; varying vec3 v; void main(){ float f = pow(1.0-abs(dot(normalize(n),normalize(v))), 2.6); gl_FragColor = vec4(c, f*0.75); }'
  });
  const bRim = new THREE.Mesh(geo, rimMat); bRim.renderOrder = 4;
  fig.add(bBack, bFront, bRim);

  const organs = {};
  const grp = (k) => { const g = new THREE.Group(); organs[k] = g; fig.add(g); return g; };
  const std = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.05, transparent: true, opacity: 1, ...extra });

  // brain with folded surface
  const brainG = grp('brain');
  const bg = new THREE.SphereGeometry(1, 96, 72), bp = bg.attributes.position;
  for (let i = 0; i < bp.count; i++) {
    const x = bp.getX(i), y = bp.getY(i), z = bp.getZ(i);
    const fold = Math.sin(x * 11 + Math.sin(y * 9) * 2.2) * Math.sin(z * 10 + Math.cos(x * 7) * 2) * 0.045 + Math.sin(y * 14 + z * 5) * 0.02;
    const groove = Math.exp(-Math.pow(x * 9, 2)) * 0.08 * (y > -0.2 ? 1 : 0); // midline fissure
    const k = 1 + fold - groove; bp.setXYZ(i, x * k, y * k, z * k);
  }
  bg.computeVertexNormals();
  const brain = new THREE.Mesh(bg, std(0x6cc2e2, { roughness: 0.55 })); brain.scale.set(40, 31, 44); brain.position.copy(V(200, 80, -2)); brainG.add(brain);
  const cbl = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 24), std(0x8fd0e6)); cbl.scale.set(18, 9, 14); cbl.position.copy(V(200, 116, -22)); brainG.add(cbl);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(5, 4, 30, 16), std(0x9fd8ea)); stem.position.copy(V(200, 130, -10)); brainG.add(stem);

  // skull base: a curved shelf under the brain, with the pituitary
  const sbG = grp('skullbase');
  const shelf = new THREE.Mesh(new THREE.TorusGeometry(36, 2.2, 10, 48, Math.PI), std(0x1e4d73)); shelf.rotation.x = Math.PI / 2; shelf.position.copy(V(200, 112, -4)); sbG.add(shelf);
  const pit = new THREE.Mesh(new THREE.SphereGeometry(4.5, 20, 14), std(0x0b1f3a)); pit.position.copy(V(200, 112, 8)); sbG.add(pit);

  // spine: vertebrae placed toward the back of the torso, plus the spinal cord
  const spG = grp('spine');
  const vMat = std(0xf3f8fb, { roughness: 0.35 });
  let yv = 150; const spinePts = [];
  for (let i = 0; i < 24; i++) {
    const cerv = i < 7, lum = i >= 19, w = cerv ? 15 : lum ? 26 : 19 + i * 0.25, hh = cerv ? 8 : lum ? 13 : 10;
    const cy = yv + hh / 2, z = -depthAt(poly, 200, cy) * BACK * 0.5;
    const m = new THREE.Mesh(new THREE.CylinderGeometry(w / 2, w / 2, hh, 24), vMat); m.scale.z = 0.72; m.position.copy(V(200, cy, z)); spG.add(m);
    const sp = new THREE.Mesh(new THREE.ConeGeometry(3.2, 12, 10), vMat); sp.rotation.x = -Math.PI / 2; sp.position.copy(V(200, cy + 1, z - w * 0.45)); spG.add(sp);
    spinePts.push(V(200, cy, z - 2)); yv += hh + (cerv ? 3 : lum ? 4 : 3.6);
  }
  const sac = new THREE.Mesh(new THREE.ConeGeometry(14, 36, 4), vMat); sac.rotation.z = Math.PI; sac.scale.z = 0.5; sac.position.copy(V(200, 524, -depthAt(poly, 200, 520) * 0.4)); spG.add(sac);

  // ribcage: elliptical arcs from the spine round to the front
  const ribMat = std(0xf3f8fb, { transparent: true, opacity: 0.85 });
  [256, 278, 300, 322, 344, 366, 388].forEach((y0, r) => {
    let hw = 0; for (let x = 200; x < 400; x += 2) { if (!inside(poly, x, y0)) break; hw = x - 200; }
    const rx = Math.min(hw, 84) * 0.86, rz = depthAt(poly, 200, y0) * 0.8, zc = 0;
    [1, -1].forEach((sgn) => {
      const pts3 = [];
      for (let k = 0; k <= 16; k++) {
        const a = -Math.PI / 2 + (k / 16) * Math.PI * (0.92 - r * 0.03);
        pts3.push(new THREE.Vector3(sgn * rx * Math.cos(a), 450 - y0 - (k / 16) * 16, zc + rz * Math.sin(a)));
      }
      spG.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts3), 32, 1.7, 8), ribMat));
    });
  });

  const tube3 = (d, z, r, mat, step = 6) => {
    const p2 = sample(d, step); if (p2.length < 2) return null;
    const curve = new THREE.CatmullRomCurve3(p2.map(([x, y]) => V(x, y, typeof z === 'function' ? z(x, y) : z)));
    return { mesh: new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(24, p2.length * 2), r, 8), mat), curve };
  };
  // nerves
  const nvG = grp('nerves'), nMat = std(0x0e7490, { emissive: 0x0e7490, emissiveIntensity: 0.25 });
  const curves = [];
  [G.ARM, G.mirror(G.ARM), G.LEG, G.mirror(G.LEG)].forEach((d) => { const t3 = tube3(d, 0, 1.3, nMat); nvG.add(t3.mesh); curves.push(t3.curve); });
  const cord = new THREE.CatmullRomCurve3(spinePts); nvG.add(new THREE.Mesh(new THREE.TubeGeometry(cord, 64, 2, 8), nMat)); curves.push(cord);
  // vessels
  const vsG = grp('vascular'), aMat = std(0xe11d48, { roughness: 0.4 });
  [G.CAROTID, G.mirror(G.CAROTID)].forEach((d) => vsG.add(tube3(d, (x, y) => (y < 160 ? 4 : 10), 1.6, aMat).mesh));
  [G.ARM_ART, G.mirror(G.ARM_ART)].forEach((d) => vsG.add(tube3(d, 4, 1.4, aMat).mesh));
  vsG.add(tube3('M188 262C194 255 206 255 212 262', 12, 2.6, aMat).mesh, tube3('M200 258L200 470', 12, 2.6, aMat, 10).mesh);

  // travelling nerve signals
  const sigMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const sigs = curves.map((c, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(2.8, 12, 10), sigMat); m.userData = { c, o: i * 0.21 }; nvG.add(m); return m; });

  // soft floor shadow
  const sc = document.createElement('canvas'); sc.width = sc.height = 128;
  const sctx = sc.getContext('2d'), grd = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(11,31,58,.28)'); grd.addColorStop(1, 'rgba(11,31,58,0)'); sctx.fillStyle = grd; sctx.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(260, 90), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.set(0, -440, 0); scene.add(shadow);

  /* ----- Hotspots (HTML buttons projected from 3D points) ----- */
  const HS = { brain: V(200, 66, 20), skullbase: V(200, 112, 26), vascular: V(212, 196, 14), spine: V(200, 372, 0), nerves: V(244, 640, 8) };
  const layer = document.createElement('div'); layer.className = 'hs3-layer';
  layer.innerHTML = G.HOTSPOTS.map((hs) => `<button type="button" class="hs3" data-cat="${hs.id}" aria-label="Show ${hs.name} treatments"><span class="ring"></span><span class="lbl">${hs.name}</span></button>`).join('');
  stage.append(layer);
  const btns = [...layer.children];

  /* ----- Camera framing per area ----- */
  let W = 1, H = 1;
  const frame = (key) => {
    const [x, y, w, hgt] = G.VIEW[key] || G.VIEW.all;
    const fov = (camera.fov * Math.PI) / 180, aspect = W / H;
    const dist = Math.max((hgt / 2) / Math.tan(fov / 2), (w / 2) / (Math.tan(fov / 2) * aspect)) * 1.04;
    const tgt = V(x + w / 2, y + hgt / 2); return { tgt, pos: tgt.clone().add(new THREE.Vector3(0, 0, dist)) };
  };
  let cur = frame('all'), from = null, to = null, t0 = 0, focus = 'all';
  const resize = () => {
    W = stage.clientWidth; H = stage.clientHeight; renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix(); cur = frame(focus); to = null;
  };
  new ResizeObserver(resize).observe(stage); resize();
  root.addEventListener('focuscat', (e) => {
    focus = e.detail; from = { tgt: cur.tgt.clone(), pos: cur.pos.clone() }; to = frame(focus); t0 = performance.now();
    const all = focus === 'all' || focus === 'pediatric';
    Object.entries(organs).forEach(([k, g]) => g.traverse((o) => { if (o.material && o.material !== sigMat) { o.material.opacity = all || k === focus ? (o.material === ribMat ? 0.85 : 1) : 0.12; } }));
    targetScale = focus === 'pediatric' ? 0.8 : 1;
    turn = focus === 'spine' ? Math.PI * 0.85 : focus === 'nerves' ? 0.5 : 0;
  });
  let targetScale = 1;

  /* ----- Drag to rotate (horizontal only, so the page still scrolls on phones) ----- */
  let spin = 0, turn = 0, drag = null, lastInteract = -1e9;
  canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, s: spin }; lastInteract = performance.now(); });
  addEventListener('pointermove', (e) => { if (drag) { spin = drag.s + (e.clientX - drag.x) * 0.012; lastInteract = performance.now(); } });
  addEventListener('pointerup', () => { drag = null; });

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) requestAnimationFrame(loop); }).observe(stage);
  const ease = (x) => 1 - Math.pow(1 - x, 4);
  const v3 = new THREE.Vector3();
  function loop(now) {
    if (!visible) return;
    requestAnimationFrame(loop);
    if (to) {
      const k = ease(Math.min(1, (now - t0) / 1100));
      cur = { tgt: from.tgt.clone().lerp(to.tgt, k), pos: from.pos.clone().lerp(to.pos, k) };
      if (k >= 1) to = null;
    }
    camera.position.copy(cur.pos); camera.lookAt(cur.tgt);
    const idle = now - lastInteract > 2500;
    if (idle) spin += (turn - spin) * (reduce ? 1 : 0.04);
    fig.rotation.y = spin + (reduce ? 0.3 : Math.sin(now / 2600) * (focus === 'all' || focus === 'pediatric' ? 0.55 : 0.22));
    fig.scale.setScalar(fig.scale.x + (targetScale - fig.scale.x) * 0.08);
    fig.position.y = -450 * (1 - fig.scale.x);
    if (!reduce) sigs.forEach((m) => { const u = (now / 3200 + m.userData.o) % 1; m.position.copy(m.userData.c.getPointAt(u)); });
    renderer.render(scene, camera);
    fig.updateMatrixWorld();
    btns.forEach((b) => {
      v3.copy(HS[b.dataset.cat]).applyMatrix4(fig.matrixWorld).project(camera);
      b.style.transform = `translate(${((v3.x + 1) / 2) * W}px, ${((1 - v3.y) / 2) * H}px)`;
      b.style.visibility = Math.abs(v3.x) > 1.05 || Math.abs(v3.y) > 1.05 ? 'hidden' : '';
    });
  }
  stage.classList.add('is-3d');
  requestAnimationFrame(loop);
}

if (G && webglOK()) {
  document.querySelectorAll('.explorer').forEach((root) => {
    const stage = root.querySelector('.ex-stage');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      mount(stage, root).catch((err) => console.warn('3D body unavailable, using 2D', err));
    }, { rootMargin: '600px' });
    io.observe(stage);
  });
}
