/* Home hero: glowing 3D brain inside a transparent head (three.js + bloom).
   The canvas fills the hero; the head is framed inside the .hero-3d placeholder so it lines up with the layout.
   Falls back to the SVG illustration if WebGL is unavailable. */
import * as THREE from 'three';
import { EffectComposer } from '../vendor/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../vendor/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../vendor/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from '../vendor/jsm/postprocessing/OutputPass.js';
import { SimplexNoise } from '../vendor/jsm/math/SimplexNoise.js';

const hero = document.querySelector('.hero');
const slot = document.querySelector('.hero-3d');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = innerWidth < 760;

// Head profile (facing left), in the same coordinates as the SVG fallback
const HEAD = 'M398 640C392 590 388 540 400 500C418 470 470 440 492 380C520 300 510 200 460 140C410 80 320 52 250 66C185 78 140 120 132 185C128 210 134 225 128 240C122 255 110 270 100 292C94 304 98 312 112 316C120 318 124 322 120 332C116 340 122 346 118 352C114 360 122 366 126 372C130 382 126 392 134 404C142 420 170 428 200 430C230 432 246 450 250 480C254 540 250 600 246 640Z';
const OX = 300, OY = 300; // world origin in profile coordinates
const W3 = (x, y, z = 0) => new THREE.Vector3(x - OX, OY - y, z);

function loadScript(src) {
  return new Promise((ok, fail) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = fail; document.head.append(s); });
}
function samplePath(d, step) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('style', 'position:absolute;width:0;height:0'); document.body.append(svg);
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); svg.append(p);
  const L = p.getTotalLength(), pts = [];
  for (let s = 0; s < L; s += step) { const q = p.getPointAtLength(s); pts.push([q.x, q.y]); }
  svg.remove(); return pts;
}
const inside = (poly, x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
const edgeDist = (poly, x, y) => { let m = Infinity; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [ax, ay] = poly[j], [bx, by] = poly[i], dx = bx - ax, dy = by - ay; const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1))); const ex = ax + t * dx - x, ey = ay + t * dy - y; m = Math.min(m, ex * ex + ey * ey); } return Math.sqrt(m); };

/* ---------- Head: inflate the profile silhouette into a closed 3D shell ---------- */
function headGeometry() {
  const poly = samplePath(HEAD, 4), S = 9, pts = poly.slice();
  for (let y = 50, r = 0; y < 640; y += S * 0.87, r++) for (let x = 90 + (r % 2) * S / 2; x < 530; x += S) if (inside(poly, x, y) && edgeDist(poly, x, y) > S * 0.5) pts.push([x, y]);
  const del = window.Delaunator.from(pts), nO = poly.length, N = pts.length;
  const h = pts.map(([x, y], i) => (i < nO ? 0 : 10.5 * Math.sqrt(edgeDist(poly, x, y))));
  const pos = new Float32Array((2 * N - nO) * 3);
  pts.forEach(([x, y], i) => pos.set([x - OX, OY - y, h[i]], i * 3));
  for (let i = nO; i < N; i++) pos.set([pts[i][0] - OX, OY - pts[i][1], -h[i]], (N + i - nO) * 3);
  const back = (i) => (i < nO ? i : N + i - nO), idx = [], t = del.triangles;
  for (let k = 0; k < t.length; k += 3) {
    let a = t[k], b = t[k + 1], c = t[k + 2];
    if (!inside(poly, (pts[a][0] + pts[b][0] + pts[c][0]) / 3, (pts[a][1] + pts[b][1] + pts[c][1]) / 3)) continue;
    const cr = (pts[b][0] - pts[a][0]) * (pts[a][1] - pts[c][1]) - (pts[a][1] - pts[b][1]) * (pts[c][0] - pts[a][0]);
    if (cr < 0) [b, c] = [c, b];
    idx.push(a, b, c, back(a), back(c), back(b));
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}

/* ---------- Brain: a deformed ellipsoid with ridged-noise folds ---------- */
function brainGeometry(noise) {
  const g = new THREE.SphereGeometry(1, small ? 150 : 220, small ? 110 : 160), p = g.attributes.position;
  const col = new Float32Array(p.count * 3), c1 = new THREE.Color(0x0d3a86), c2 = new THREE.Color(0x6fc0ff), tmp = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    // overall lateral brain shape: long front–back, flatter base, temporal lobe bulge
    if (y < -0.25) y = -0.25 + (y + 0.25) * 0.7;
    const temporal = Math.exp(-((x + 0.05) ** 2 * 5 + (y + 0.55) ** 2 * 14)) * 0.12 * Math.min(1, Math.abs(z) * 1.6);
    const frontalBase = x < -0.4 && y < -0.1 ? (y + 0.1) * 0.35 : 0;
    // ridged noise → gyri, plus the midline and lateral (Sylvian) fissures
    const n1 = noise.noise3d(x * 3.1, y * 3.6, z * 3.1), n2 = noise.noise3d(x * 6.4 + 7, y * 6.4, z * 6.4);
    const g1 = Math.exp(-Math.pow(n1 / 0.13, 2)), g2 = Math.exp(-Math.pow(n2 / 0.12, 2)) * 0.6;
    const groove = Math.min(1, g1 + g2);
    const fold = 1 - groove;
    const mid = Math.exp(-Math.pow(z * 14, 2)) * (y > -0.3 ? 0.13 : 0);
    const syl = Math.exp(-Math.pow((y - (-0.18 + (x + 0.6) * 0.33)) * 16, 2)) * (x > -0.6 && x < 0.35 ? 0.07 : 0) * Math.min(1, Math.abs(z) * 2);
    const k = 1 - groove * 0.06 + (1 - groove) * 0.012 * Math.sin(x * 20) + temporal - mid - syl;
    p.setXYZ(i, x * k, y * k + frontalBase * 0.3, z * k);
    tmp.copy(c1).lerp(c2, Math.min(1, Math.max(0, fold * 0.95 - (mid + syl) * 5)));
    col.set([tmp.r, tmp.g, tmp.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

function glowTexture(inner, outer) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, inner); g.addColorStop(0.25, outer); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

async function start() {
  if (!window.Delaunator) await loadScript(new URL('../vendor/delaunator.min.js', import.meta.url).href);
  const renderer = new THREE.WebGLRenderer({ antialias: !small, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.95;
  const canvas = renderer.domElement; canvas.className = 'hero-canvas'; canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);

  const scene = new THREE.Scene();
  const bg = document.createElement('canvas'); bg.width = 64; bg.height = 64;
  const bx = bg.getContext('2d'), bgr = bx.createRadialGradient(46, 26, 2, 40, 32, 52);
  bgr.addColorStop(0, '#1f63b4'); bgr.addColorStop(0.45, '#0c2d5e'); bgr.addColorStop(1, '#061329');
  bx.fillStyle = bgr; bx.fillRect(0, 0, 64, 64);
  scene.background = new THREE.CanvasTexture(bg); scene.background.colorSpace = THREE.SRGBColorSpace;

  const camera = new THREE.PerspectiveCamera(30, 1, 10, 8000);
  scene.add(new THREE.HemisphereLight(0x9fd0ff, 0x061329, 0.9));
  const key = new THREE.DirectionalLight(0xcfe6ff, 2.2); key.position.set(-300, 500, 700); scene.add(key);
  const rim = new THREE.DirectionalLight(0x3b8cff, 3); rim.position.set(500, 200, -600); scene.add(rim);
  const warm = new THREE.PointLight(0xff9a3c, 60000, 420, 2); warm.position.copy(W3(330, 180, 60)); scene.add(warm);

  const rig = new THREE.Group(); scene.add(rig);

  // head shell: fresnel glass, fading out at the neck
  const headMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    uniforms: { c: { value: new THREE.Color(0x2f86f0) } },
    vertexShader: 'varying vec3 n; varying vec3 v; varying float yy; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); n = normalize(normalMatrix*normal); v = normalize(-mv.xyz); yy = position.y; gl_Position = projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 c; varying vec3 n; varying vec3 v; varying float yy; void main(){ vec3 nn = length(n) > 1e-4 ? normalize(n) : vec3(0.0,0.0,1.0); float f = clamp(pow(1.0-abs(dot(nn,normalize(v))), 3.0), 0.0, 1.0); float fade = smoothstep(-330.0, -170.0, yy); gl_FragColor = vec4(c*(f*0.95+0.012)*fade, 1.0); }'
  });
  rig.add(new THREE.Mesh(headGeometry(), headMat));

  // brain
  const noise = new SimplexNoise({ random: (() => { let s = 7; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })() });
  const brainMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.38, metalness: 0.15, emissive: 0x1a5fc4, emissiveIntensity: 0.3 });
  const brain = new THREE.Mesh(brainGeometry(noise), brainMat);
  brain.scale.set(160, 106, 124); brain.position.copy(W3(318, 184, 0)); rig.add(brain);
  // cerebellum with fine horizontal folia
  const cg = new THREE.SphereGeometry(1, 96, 64), cp = cg.attributes.position;
  for (let i = 0; i < cp.count; i++) { const y = cp.getY(i), k = 1 + Math.sin(y * 34 + Math.sin(cp.getX(i) * 6) * 1.5) * 0.018; cp.setXYZ(i, cp.getX(i) * k, y, cp.getZ(i) * k); }
  cg.computeVertexNormals();
  const cer = new THREE.Mesh(cg, new THREE.MeshStandardMaterial({ color: 0x2c78d6, roughness: 0.4, metalness: 0.1, emissive: 0x0f4aa8, emissiveIntensity: 0.5 }));
  cer.scale.set(58, 36, 84); cer.position.copy(W3(425, 292, 0)); rig.add(cer);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(20, 14, 150, 32), new THREE.MeshStandardMaterial({ color: 0x3585dc, roughness: 0.45, emissive: 0x0f4aa8, emissiveIntensity: 0.45 }));
  stem.position.copy(W3(372, 330, 0)); stem.rotation.z = -0.2; rig.add(stem);
  // soft blue halo around the brain
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('rgba(90,170,255,.55)', 'rgba(40,110,230,.22)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  halo.scale.set(520, 400, 1); halo.position.copy(W3(318, 200, -60)); rig.add(halo);

  // orange neural activity
  const orange = glowTexture('rgba(255,236,190,1)', 'rgba(255,150,50,.75)');
  const spots = [[250, 150, 90], [360, 120, 95], [305, 250, 105], [430, 205, 80], [200, 215, 85], [330, 175, 118], [395, 262, 70], [270, 110, 70]].map(([x, y, z], i) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: orange, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, transparent: true }));
    s.position.copy(W3(x, y, z)); s.renderOrder = 5; s.userData = { base: 60 + (i % 3) * 22, ph: i * 1.7 }; rig.add(s); return s;
  });
  // sparks travelling between activity points
  const links = [[0, 5], [5, 1], [5, 2], [1, 3], [2, 6], [4, 0], [7, 1], [4, 2]];
  const sparks = links.map(([a, b], i) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: orange, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, transparent: true })); s.renderOrder = 6; s.scale.setScalar(26); s.userData = { a: spots[a].position, b: spots[b].position, o: i / links.length }; rig.add(s); return s; });
  const lineMat = new THREE.LineBasicMaterial({ color: 0xffa24a, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthTest: false });
  links.forEach(([a, b]) => {
    const A = spots[a].position, B = spots[b].position, M = A.clone().add(B).multiplyScalar(0.5).add(new THREE.Vector3(0, 0, 30));
    rig.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(new THREE.QuadraticBezierCurve3(A, M, B).getPoints(24)), lineMat));
  });

  // floating dust for depth
  const dustN = small ? 140 : 320, dp = new Float32Array(dustN * 3);
  for (let i = 0; i < dustN; i++) dp.set([(Math.random() - 0.5) * 2400, (Math.random() - 0.5) * 1400, (Math.random() - 0.5) * 1400 - 300], i * 3);
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ map: glowTexture('rgba(200,230,255,1)', 'rgba(120,190,255,.4)'), size: 14, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.7 }));
  scene.add(dust);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), small ? 0.5 : 0.6, 0.5, 0.62);
  composer.addPass(bloom); composer.addPass(new OutputPass());

  /* ----- Frame the head inside the layout slot ----- */
  const HEAD_H = 600; // world units from crown to neck
  const anchor = new THREE.Vector2();
  function layout() {
    const W = hero.clientWidth, H = hero.clientHeight;
    renderer.setSize(W, H, false); composer.setSize(W, H);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    const hr = hero.getBoundingClientRect(), r = slot.getBoundingClientRect();
    const cx = r.left - hr.left + r.width / 2, cy = r.top - hr.top + r.height / 2;
    const fit = Math.min(r.height, r.width * 1.12) * 0.98;
    const tanH = Math.tan((camera.fov * Math.PI) / 360);
    const d = (HEAD_H * H) / (2 * tanH * fit);
    camera.position.set(0, 0, d); camera.lookAt(0, 0, 0);
    const unit = (2 * d * tanH) / H; // world units per pixel at the head's depth
    anchor.set((cx - W / 2) * unit, -(cy - H / 2) * unit + 40 * unit * 0);
  }
  new ResizeObserver(layout).observe(hero); layout();

  let mx = 0, my = 0, tx = 0, ty = 0, visible = true;
  if (matchMedia('(pointer: fine)').matches) hero.addEventListener('pointermove', (e) => { const r = hero.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5; });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) requestAnimationFrame(loop); }).observe(hero);
  const t0 = performance.now();
  function loop(now) {
    if (!visible || document.hidden) return;
    requestAnimationFrame(loop);
    const t = reduce ? 0 : (now - t0) / 1000;
    mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
    rig.rotation.y = Math.sin(t * 0.35) * 0.32 + mx * 0.5 - 0.12;
    rig.rotation.x = my * 0.18;
    rig.position.set(anchor.x, anchor.y + Math.sin(t * 0.8) * 8, 0);
    spots.forEach((s) => { const k = 0.65 + 0.35 * Math.sin(t * 1.6 + s.userData.ph); s.scale.setScalar(s.userData.base * (0.7 + k * 0.6)); s.material.opacity = 0.55 + k * 0.45; });
    sparks.forEach((s) => { const u = (t * 0.45 + s.userData.o) % 1; s.position.lerpVectors(s.userData.a, s.userData.b, u); s.material.opacity = Math.sin(u * Math.PI); });
    dust.rotation.y = t * 0.02;
    composer.render();
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visible) requestAnimationFrame(loop); });
  hero.classList.add('is-3d');
  requestAnimationFrame(loop);
}

function webglOK() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
if (hero && slot && webglOK()) start().catch((e) => console.warn('3D hero unavailable', e));
