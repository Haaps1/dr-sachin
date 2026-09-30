/* Hero: real 3D head (Lee Perry-Smith head scan, CC BY 3.0) rendered as blue glass,
   with a glowing brain, cerebellum and spinal cord inside. Rotates 360°: slow auto-spin, drag to turn.
   Draws into the .hero-img box; the flat image stays as the fallback when WebGL is unavailable. */
import * as THREE from 'three';
import { GLTFLoader } from '../vendor/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from '../vendor/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../vendor/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../vendor/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from '../vendor/jsm/postprocessing/OutputPass.js';
import { SimplexNoise } from '../vendor/jsm/math/SimplexNoise.js';

const box = document.querySelector('.hero-img');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = innerWidth < 760;
const BG = '#051129';

function webglOK() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }

function glowTexture(inner, outer) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, inner); g.addColorStop(0.25, outer); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* Brain: ellipsoid with ridged grooves (gyri/sulci), midline and lateral fissures. Long axis = x, front = -x. */
function brainGeometry() {
  let seed = 7; const noise = new SimplexNoise({ random: () => ((seed = (seed * 16807) % 2147483647) / 2147483647) });
  const g = new THREE.SphereGeometry(1, small ? 140 : 200, small ? 100 : 150), p = g.attributes.position;
  const col = new Float32Array(p.count * 3), dark = new THREE.Color(0x0b3a8a), light = new THREE.Color(0x7cc8ff), tmp = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    if (y < -0.25) y = -0.25 + (y + 0.25) * 0.7; // flatter base
    const temporal = Math.exp(-(Math.pow(x + 0.05, 2) * 5 + Math.pow(y + 0.55, 2) * 14)) * 0.12 * Math.min(1, Math.abs(z) * 1.6);
    const n1 = noise.noise3d(x * 3.1, y * 3.6, z * 3.1), n2 = noise.noise3d(x * 6.4 + 7, y * 6.4, z * 6.4);
    const groove = Math.min(1, Math.exp(-Math.pow(n1 / 0.13, 2)) + Math.exp(-Math.pow(n2 / 0.12, 2)) * 0.6);
    const mid = Math.exp(-Math.pow(z * 14, 2)) * (y > -0.3 ? 0.13 : 0);
    const syl = Math.exp(-Math.pow((y - (-0.18 + (x + 0.6) * 0.33)) * 16, 2)) * (x > -0.6 && x < 0.35 ? 0.07 : 0) * Math.min(1, Math.abs(z) * 2);
    const k = 1 - groove * 0.06 + temporal - mid - syl;
    p.setXYZ(i, x * k, y * k, z * k);
    tmp.copy(dark).lerp(light, Math.min(1, Math.max(0, (1 - groove) * 0.95 - (mid + syl) * 5)));
    col.set([tmp.r, tmp.g, tmp.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

async function start() {
  const gltf = await new GLTFLoader().loadAsync(new URL('../models/head.glb', import.meta.url).href);
  const src = gltf.scene.getObjectByName('LeePerrySmith') || gltf.scene.children.find((o) => o.isMesh);

  const renderer = new THREE.WebGLRenderer({ antialias: !small, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.5 : 2));
  const canvas = renderer.domElement; canvas.className = 'hero-canvas3d'; canvas.setAttribute('aria-label', 'Rotating 3D model of a human head and brain. Drag to turn it.'); canvas.setAttribute('role', 'img');
  box.append(canvas);

  const scene = new THREE.Scene(); scene.background = new THREE.Color(BG);
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200);
  scene.add(new THREE.HemisphereLight(0x9fd0ff, 0x061329, 1.1));
  const key = new THREE.DirectionalLight(0xcfe6ff, 2.4); key.position.set(-4, 6, 8); scene.add(key);
  const rim = new THREE.DirectionalLight(0x3b8cff, 3); rim.position.set(6, 2, -6); scene.add(rim);

  const spinner = new THREE.Group(); scene.add(spinner);
  const model = new THREE.Group(); spinner.add(model);

  // Glass head: additive fresnel shell (bright edges, clear centre)
  const glass = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    uniforms: { c: { value: new THREE.Color(0x3d9bff) } },
    vertexShader: 'varying vec3 n; varying vec3 v; varying float yy; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); n = normalMatrix*normal; v = -mv.xyz; yy = position.y; gl_Position = projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 c; varying vec3 n; varying vec3 v; varying float yy; void main(){ vec3 nn = length(n) > 1e-5 ? normalize(n) : vec3(0.0,0.0,1.0); float f = pow(1.0-abs(dot(nn, normalize(v))), 3.2); float fade = smoothstep(-2.6, -0.6, yy); gl_FragColor = vec4(c*(f*1.5+0.015)*fade, 1.0); }'
  });
  model.add(new THREE.Mesh(src.geometry, glass));

  // Brain (model units: head spans y -4..4, face toward +z)
  const brainG = new THREE.Group(); model.add(brainG);
  const brain = new THREE.Mesh(brainGeometry(), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.38, metalness: 0.15, emissive: 0x1a5fc4, emissiveIntensity: 0.3 }));
  brain.rotation.y = Math.PI / 2; brain.scale.set(1.85, 1.2, 1.38); brain.position.set(0, 2.55, -0.3); brainG.add(brain);
  const cg = new THREE.SphereGeometry(1, 80, 56), cp = cg.attributes.position;
  for (let i = 0; i < cp.count; i++) { const y = cp.getY(i), k = 1 + Math.sin(y * 34 + Math.sin(cp.getX(i) * 6) * 1.5) * 0.02; cp.setXYZ(i, cp.getX(i) * k, y, cp.getZ(i) * k); }
  cg.computeVertexNormals();
  const stdBlue = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.4, metalness: 0.1, emissive: 0x0f4aa8, emissiveIntensity: 0.5 });
  const cer = new THREE.Mesh(cg, stdBlue(0x2c78d6)); cer.scale.set(0.95, 0.55, 0.7); cer.position.set(0, 1.4, -1.3); brainG.add(cer);
  // brainstem + spinal cord down the neck
  const cord = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 1.9, -0.55), new THREE.Vector3(0, 1.1, -0.72), new THREE.Vector3(0, 0, -0.95), new THREE.Vector3(0, -1.2, -1.05), new THREE.Vector3(0, -2.6, -1.0)]);
  brainG.add(new THREE.Mesh(new THREE.TubeGeometry(cord, 48, 0.2, 16), stdBlue(0x3585dc)));

  // Orange neural activity + sparks
  const orange = glowTexture('rgba(255,236,190,1)', 'rgba(255,150,50,.75)');
  const P = [[0, 3.1, 0.3], [0.5, 2.7, -0.6], [-0.5, 2.3, 0.6], [0.4, 2.0, -1.1], [-0.4, 2.9, -0.9], [0, 2.4, 1.1], [0, 1.5, -1.2]];
  const sprite = (s) => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: orange, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, transparent: true })); m.scale.setScalar(s); m.renderOrder = 5; return m; };
  const spots = P.map(([x, y, z], i) => { const s = sprite(1); s.position.set(x, y, z); s.userData = { base: 0.9 + (i % 3) * 0.35, ph: i * 1.7 }; brainG.add(s); return s; });
  const links = [[0, 1], [0, 2], [1, 3], [2, 5], [4, 0], [3, 6], [4, 1]];
  const lineMat = new THREE.LineBasicMaterial({ color: 0xffa24a, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthTest: false });
  links.forEach(([a, b]) => {
    const A = spots[a].position, B = spots[b].position, M = A.clone().add(B).multiplyScalar(0.5).multiplyScalar(1.08);
    brainG.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(new THREE.QuadraticBezierCurve3(A, M, B).getPoints(20)), lineMat));
  });
  const sparks = links.map(([a, b], i) => { const s = sprite(0.35); s.userData = { a: spots[a].position, b: spots[b].position, o: i / links.length }; brainG.add(s); return s; });
  const cordSpark = sprite(0.45); brainG.add(cordSpark);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('rgba(90,170,255,.5)', 'rgba(40,110,230,.2)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  halo.scale.set(7, 6, 1); halo.position.set(0, 2.3, -0.3); model.add(halo);

  // Floating dust around the head
  const dN = small ? 120 : 260, dp = new Float32Array(dN * 3);
  for (let i = 0; i < dN; i++) dp.set([(Math.random() - 0.5) * 18, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12], i * 3);
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ map: glowTexture('rgba(200,230,255,1)', 'rgba(120,190,255,.4)'), size: 0.14, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.7 }));
  scene.add(dust);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(256, 256), small ? 0.5 : 0.6, 0.5, 0.62));
  composer.addPass(new OutputPass());

  // Frame the bust (y -4..4.1) inside the box
  function fit() {
    const W = box.clientWidth, H = box.clientHeight; if (!W || !H) return;
    renderer.setSize(W, H, false); composer.setSize(W, H);
    camera.aspect = W / H;
    const tanV = Math.tan((camera.fov * Math.PI) / 360), needH = 7.2, needW = 6.4;
    const d = Math.max(needH / 2 / tanV, needW / 2 / (tanV * camera.aspect));
    camera.position.set(0, 0.7, d); camera.lookAt(0, 0.7, 0); camera.updateProjectionMatrix();
  }
  new ResizeObserver(fit).observe(box); fit();

  /* Rotation: auto-spin, drag (with momentum) to turn 360°; vertical drag tilts a little */
  let yaw = -Math.PI / 2, pitch = 0, vel = reduce ? 0 : 0.0045, drag = null, idleAt = 0;
  const AUTO = reduce ? 0 : 0.0045;
  canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, yaw, pitch, lx: e.clientX, t: performance.now() }; canvas.setPointerCapture(e.pointerId); box.classList.add('dragging'); });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const now = performance.now();
    yaw = drag.yaw + (e.clientX - drag.x) * 0.012;
    pitch = Math.max(-0.35, Math.min(0.35, drag.pitch + (e.clientY - drag.y) * 0.004));
    vel = ((e.clientX - drag.lx) * 0.012) / Math.max(1, (now - drag.t) / 16.7); drag.lx = e.clientX; drag.t = now;
  });
  const end = () => { if (!drag) return; drag = null; idleAt = performance.now(); box.classList.remove('dragging'); };
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') yaw -= 0.25; if (e.key === 'ArrowRight') yaw += 0.25; });
  canvas.tabIndex = 0;

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) requestAnimationFrame(loop); }).observe(box);
  const t0 = performance.now();
  function loop(now) {
    if (!visible || document.hidden) return;
    requestAnimationFrame(loop);
    const t = reduce ? 0 : Math.max(0, now - t0) / 1000;
    if (!drag) {
      vel += (AUTO - vel) * 0.03; // momentum eases back to the slow auto-spin
      yaw += vel;
      if (now - idleAt > 1500) pitch += (0 - pitch) * 0.04;
    }
    spinner.rotation.set(pitch, yaw, 0);
    spinner.position.y = Math.sin(t * 0.8) * 0.08;
    spots.forEach((s) => { const k = 0.65 + 0.35 * Math.sin(t * 1.6 + s.userData.ph); s.scale.setScalar(s.userData.base * (0.7 + k * 0.6)); s.material.opacity = 0.55 + k * 0.45; });
    sparks.forEach((s) => { const u = (t * 0.45 + s.userData.o) % 1; s.position.lerpVectors(s.userData.a, s.userData.b, u); s.material.opacity = Math.sin(u * Math.PI); });
    cordSpark.position.copy(cord.getPointAt((t * 0.3) % 1));
    dust.rotation.y = t * 0.02;
    composer.render();
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visible) requestAnimationFrame(loop); });
  box.classList.add('is-3d');
  requestAnimationFrame(loop);
}

if (box && webglOK()) start().catch((e) => console.warn('3D head unavailable, showing image', e));
