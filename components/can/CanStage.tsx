'use client';

import * as THREE from 'three';
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { buildCan, buildStudioEnvironment, COLOURWAYS, MODES, CAN } from '@/lib/can/invi-can';

/**
 * The live INVI can. One transparent canvas fixed over the page; each chapter
 * that shows the can gets its own scene, camera and light rig, drawn by the
 * Compositor below into just the part of that chapter that is on screen. Geometry, materials and studio lighting come
 * straight from the INVI Can Studio model (lib/can/invi-can.js).
 *
 * The DOM stays in charge: every can mirrors the poster image it replaces.
 * The poster's box sets where it stands and how big it is, and the motion
 * Phase 2 put on that poster (lift, tilt, scale, fade) drives the 3D can.
 *
 * Built to be cheap on phones:
 * - it draws on demand: while the page scrolls, a finger or cursor moves, or
 *   something is still settling, plus a slow idle drift; never flat out;
 * - no layout is read per frame: boxes are measured on resize and refresh,
 *   and positions follow from the scroll offset;
 * - phones get half-resolution label art and a lower pixel ratio.
 */

const SMALL = typeof window !== 'undefined' && matchMedia('(max-width: 900px), (pointer: coarse)').matches;
const LABELS = ['origin', 'rise', 'after-dark'].map((k) => `/textures/label-${k}${SMALL ? '-1k' : ''}.webp`);
const VARIANT: Record<string, number> = { origin: 0, rise: 1, 'after-dark': 2 };
const FOV = 24, DIST = 1;
const VIS_H = 2 * DIST * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
/** In the poster renders the can fills 84% of the frame height, centred. */
const POSTER_FILL = 0.84;
const DRAG_K = 0.0085;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (x: number, a: number, b: number) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);

/* ── on-demand frames ──────────────────────────────────────────────────── */
let busyUntil = 0;
/** Ask for frames for the next `ms` milliseconds. */
const want = (ms: number) => { busyUntil = Math.max(busyUntil, performance.now() + ms); };

function Driver({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    // going idle: draw one last (empty) frame so nothing stale stays on screen
    if (!active) { invalidate(); return; }
    let raf = 0;
    const loop = () => { if (performance.now() < busyUntil) invalidate(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    // scrubbed motion keeps easing a little after the scroll itself stops
    const onScroll = () => { invalidate(); want(700); };
    const onPointer = () => { invalidate(); want(300); };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('pointermove', onPointer, { passive: true });
    addEventListener('resize', onScroll);
    const drift = setInterval(invalidate, 50); // idle float at 20fps
    want(1500);
    return () => {
      cancelAnimationFrame(raf); clearInterval(drift);
      removeEventListener('scroll', onScroll); removeEventListener('pointermove', onPointer); removeEventListener('resize', onScroll);
    };
  }, [active, invalidate]);
  return null;
}

/* ── geometry, measured rarely ─────────────────────────────────────────── */
type Box = { top: number; left: number; w: number; h: number };
type Frame = {
  /** the container's box in the viewport right now, from cached offsets */
  box: () => Box;
  /** the poster slot's box relative to the container */
  slot: { x: number; y: number; w: number; h: number };
  /** radians of turn contributed by scroll */
  spin: () => number;
};

type Mirror = { el: HTMLElement; variant: number };
type RigProps = {
  frame: Frame;
  container: HTMLElement;
  slotEl: HTMLElement;
  mirrors: Mirror[];
  fit: 'full' | 'cap';
  labels: THREE.Texture[];
  env: THREE.Texture;
  intro?: boolean;
  onFirstFrame?: () => void;
};

const inlineOpacity = (el: HTMLElement) => {
  if (el.style.visibility === 'hidden') return 0;
  const o = el.style.opacity;
  return o === '' ? 1 : Number(o);
};

function CanRig({ frame, container, slotEl, mirrors, fit, labels, env, intro, onFirstFrame }: RigProps) {
  const scene = useThree((s) => s.scene);
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const compiled = useRef(false);
  const can = useMemo(() => buildCan(THREE, { segments: SMALL ? 64 : 96 }), []);
  const outer = useRef<THREE.Group>(null);
  const turn = useRef<THREE.Group>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const kick = useRef<THREE.DirectionalLight>(null);
  const amb = useRef<THREE.HemisphereLight>(null);
  const st = useRef({
    variant: -1, drag: null as null | { x: number; t: number; v: number }, dragAngle: 0, vel: 0,
    lean: { x: 0, z: 0, vx: 0, vz: 0 }, target: { x: 0, z: 0 }, t0: -1, first: true,
  });
  const mats = useMemo(() => [can.materials.body, can.materials.shell, can.materials.cap, can.materials.nozzle, can.materials.valve], [can]);

  // Environment and materials. Every surface can fade, because the moments
  // hand the can over by lifting it away; depthWrite stays on so the can
  // never sorts against itself.
  useEffect(() => {
    scene.environment = env;
    scene.environmentIntensity = MODES.reveal.env;
    can.materials.veil.visible = false;
    for (const m of mats) { m.transparent = true; m.depthWrite = true; m.needsUpdate = true; }
    // Build the shader programs in the background (parallel compile where the
    // GPU supports it) with the real map and environment bound, so the first
    // frame that draws the can does not freeze the page doing it.
    can.materials.body.map = labels[mirrors[0].variant];
    let alive = true;
    const g = outer.current;
    if (g) g.visible = true;
    gl.compileAsync(scene, camera).catch(() => {}).finally(() => { if (alive) { compiled.current = true; want(2600); } });
    if (g) g.visible = false;
    return () => { alive = false; scene.environment = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- first colourway only
  }, [scene, env, can, gl, camera, labels]);
  useEffect(() => () => can.dispose(), [can]);

  // Pointer: the can leans toward the cursor on a spring; grabbing it spins
  // it, and it keeps its momentum before friction settles it. Touch drags
  // are horizontal only, so vertical swipes still scroll the page.
  useEffect(() => {
    const s = st.current;
    const prevTouch = container.style.touchAction;
    container.style.touchAction = 'pan-y';
    slotEl.style.pointerEvents = 'auto';
    slotEl.style.cursor = 'grab';
    const inSlot = (e: PointerEvent) => {
      const r = slotEl.getBoundingClientRect();
      return e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom;
    };
    const down = (e: PointerEvent) => {
      if (!inSlot(e) || e.button > 0) return;
      if (e.pointerType === 'mouse') e.preventDefault();
      s.drag = { x: e.clientX, t: performance.now(), v: 0 };
      slotEl.style.cursor = 'grabbing';
      want(400);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || s.drag) {
        const r = slotEl.getBoundingClientRect();
        const nx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width * 1.6), -1, 1);
        const ny = clamp((e.clientY - (r.top + r.height / 2)) / (r.height * 0.9), -1, 1);
        s.target.z = -nx * 0.16;
        s.target.x = ny * 0.1;
      }
      const d = s.drag;
      if (!d) return;
      const now = performance.now(), dt = Math.max(0.008, (now - d.t) / 1000);
      const dx = (e.clientX - d.x) * DRAG_K;
      s.dragAngle += dx;
      d.v = d.v + (dx / dt - d.v) * 0.4;
      d.x = e.clientX; d.t = now;
    };
    const up = () => {
      if (!s.drag) return;
      s.vel = clamp(s.drag.v, -16, 16);
      s.drag = null;
      slotEl.style.cursor = 'grab';
      want(1500);
    };
    const leave = () => { s.target.x = 0; s.target.z = 0; want(1200); };
    container.addEventListener('pointerdown', down);
    addEventListener('pointermove', move, { passive: true });
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
    container.addEventListener('pointerleave', leave);
    return () => {
      container.style.touchAction = prevTouch;
      slotEl.style.pointerEvents = ''; slotEl.style.cursor = '';
      container.removeEventListener('pointerdown', down);
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      removeEventListener('pointercancel', up);
      container.removeEventListener('pointerleave', leave);
    };
  }, [container, slotEl]);

  useFrame((state, delta) => {
    const s = st.current, g = outer.current, tg = turn.current;
    if (!g || !tg) return;
    if (!compiled.current) { g.visible = false; return; }
    const cb = frame.box(), sl = frame.slot;
    const vh = innerHeight;
    // off screen: nothing to do (the Compositor will not draw it either)
    if (cb.h < 1 || sl.h < 1 || cb.top > vh + 40 || cb.top + cb.h < -40) { g.visible = false; return; }
    const dt = Math.min(0.05, delta);
    const u = VIS_H / cb.h;

    // which poster is live, and how it is moving (GSAP's cached values and
    // inline styles only: nothing here makes the browser recalculate)
    let m = mirrors[0], op = -1;
    for (const x of mirrors) { const o = inlineOpacity(x.el); if (o > op) { op = o; m = x; } }
    const yP = Number(gsap.getProperty(m.el, 'yPercent')) || 0;
    const rot = Number(gsap.getProperty(m.el, 'rotation')) || 0;
    const sc = Number(gsap.getProperty(m.el, 'scale')) || 1;

    // the colourway follows the live poster
    if (m.variant !== s.variant) {
      s.variant = m.variant;
      const c = COLOURWAYS[m.variant];
      can.materials.body.map = labels[m.variant];
      can.materials.body.needsUpdate = true;
      key.current?.color.set(c.key); fill.current?.color.set(c.fill);
      rim.current?.color.set(c.rim); kick.current?.color.set(c.rim); amb.current?.color.set(c.env);
    }

    // placement: stand exactly where the poster's can stands
    const canPx = fit === 'cap' ? sl.h * 2.3 : sl.h * POSTER_FILL;
    const cx = sl.x + sl.w / 2 - cb.w / 2;
    const cyTop = fit === 'cap' ? sl.y + sl.h * 0.12 + canPx / 2 : sl.y + sl.h / 2;
    const cy = cyTop - cb.h / 2 + (yP / 100) * sl.h;
    const scale = ((canPx * u) / CAN.height) * sc;
    g.position.set(cx * u, -cy * u, 0);
    g.scale.setScalar(scale);

    // lean: a spring toward the pointer, slightly under-damped so it settles
    const L = s.lean, k = 90, c = 2 * Math.sqrt(k) * 0.72;
    L.vx += ((s.target.x - L.x) * k - L.vx * c) * dt; L.x += L.vx * dt;
    L.vz += ((s.target.z - L.z) * k - L.vz * c) * dt; L.z += L.vz * dt;
    g.rotation.set(L.x, 0, L.z - THREE.MathUtils.degToRad(rot));

    // spin: scroll turns it; a drag adds momentum that friction wears off
    if (!s.drag) { s.dragAngle += s.vel * dt; s.vel *= Math.exp(-dt * 2.2); }
    // while the intro curtain is down the clock stands still, so the light
    // comes on as the curtain lifts, not unseen behind it
    if (s.t0 < 0 || (intro && document.documentElement.classList.contains('intro-on'))) s.t0 = state.clock.elapsedTime;
    const age = state.clock.elapsedTime - s.t0;
    const introTwist = intro ? (1 - easeOut(age / 2.2)) * -1.1 : 0;
    const float = Math.sin(state.clock.elapsedTime * 0.62) * 0.0028;
    tg.rotation.y = frame.spin() + s.dragAngle + introTwist;
    tg.position.y = float - CAN.height / 2;

    // the intro: a rim-lit silhouette first, then the light comes on
    const rimK = intro ? smooth(age, 0.05, 0.6) : 1;
    const mainK = intro ? smooth(age, 0.45, 1.9) : 1;
    const R = MODES.reveal;
    if (key.current) key.current.intensity = R.key * mainK;
    if (fill.current) fill.current.intensity = R.fill * mainK;
    if (rim.current) rim.current.intensity = R.rim * rimK * (intro ? 1 + (1 - mainK) * 2.2 : 1);
    if (kick.current) kick.current.intensity = (rim.current?.intensity ?? 0) * 0.4;
    if (amb.current) amb.current.intensity = R.ambient * mainK;
    scene.environmentIntensity = R.env * (0.25 + 0.75 * mainK);
    can.materials.body.color.setScalar(R.label * mainK);

    const a = clamp(op, 0, 1);
    g.visible = a > 0.01;
    for (const mat of mats) mat.opacity = a;
    (can.shadow.material as THREE.MeshBasicMaterial).opacity = R.shadow * a * mainK;

    // keep frames coming while anything is still in motion
    const moving = s.drag || Math.abs(s.vel) > 0.02 || Math.abs(L.vx) + Math.abs(L.vz) > 0.002
      || Math.abs(s.target.x - L.x) + Math.abs(s.target.z - L.z) > 0.002 || (intro && age < 2.4) || (a > 0.01 && a < 0.99);
    if (moving) want(120);

    if (s.first) { s.first = false; onFirstFrame?.(); }
  });

  return (
    <>
      <group ref={outer} visible={false}>
        <group ref={turn}>
          <primitive object={can.group} />
        </group>
        <primitive object={can.shadow} position={[CAN.radius * 0.34, 0.0006 - CAN.height / 2, CAN.radius * 0.1]} />
      </group>
      <directionalLight ref={key} position={[-0.3, 0.34, 0.62]} intensity={0} />
      <directionalLight ref={fill} position={[0.58, 0.02, 0.46]} intensity={0} />
      <directionalLight ref={rim} position={[0.42, 0.22, -0.78]} intensity={0} />
      <directionalLight ref={kick} position={[-0.42, 0.14, -0.74]} intensity={0} />
      <hemisphereLight ref={amb} groundColor={0x000000} intensity={0} />
    </>
  );
}

/* ── the compositor ────────────────────────────────────────────────────
 * Draws each chapter's scene into the part of that chapter that is actually
 * on screen. The viewport and scissor are always clipped to the drawing
 * surface; the camera's view offset keeps a half-visible chapter rendering
 * exactly as if it were whole. (A general-purpose multi-view helper set its
 * boxes wherever the element sat, off the edges included, and at 2x pixel
 * density that took the GPU process down as a chapter scrolled into view.)
 */
type Port = { scene: THREE.Scene; camera: THREE.PerspectiveCamera; box: () => Box };
const Ports = createContext<{ add: (p: Port) => () => void } | null>(null);

function Compositor({ children }: { children: ReactNode }) {
  const ports = useRef<Port[]>([]);
  const api = useMemo(() => ({
    add: (p: Port) => { ports.current.push(p); return () => { ports.current = ports.current.filter((x) => x !== p); }; },
  }), []);
  useFrame(({ gl, size }) => {
    gl.autoClear = false;
    gl.setScissorTest(false);
    gl.clear(true, true, true);
    gl.setScissorTest(true);
    for (const p of ports.current) {
      const b = p.box();
      const x0 = Math.max(0, b.left), y0 = Math.max(0, b.top);
      const x1 = Math.min(size.width, b.left + b.w), y1 = Math.min(size.height, b.top + b.h);
      const w = x1 - x0, h = y1 - y0;
      if (w < 1 || h < 1 || b.w < 1 || b.h < 1) continue;
      const yGL = size.height - y1;                 // GL counts from the bottom
      gl.setViewport(x0, yGL, w, h);
      gl.setScissor(x0, yGL, w, h);
      p.camera.aspect = b.w / b.h;
      p.camera.setViewOffset(b.w, b.h, x0 - b.left, y0 - b.top, w, h);
      p.camera.updateProjectionMatrix();
      gl.render(p.scene, p.camera);
    }
    gl.setScissorTest(false);
  }, 1);
  return <Ports.Provider value={api}>{children}</Ports.Provider>;
}

/** One chapter: its own scene and camera, drawn by the Compositor. */
function Port({ box, children }: { box: () => Box; children: ReactNode }) {
  const ctx = useContext(Ports)!;
  const scene = useMemo(() => new THREE.Scene(), []);
  const camera = useMemo(() => {
    const c = new THREE.PerspectiveCamera(FOV, 1, 0.05, 10);
    c.position.set(0, 0, DIST);
    return c;
  }, []);
  useEffect(() => ctx.add({ scene, camera, box }), [ctx, scene, camera, box]);
  return <>{createPortal(children, scene, { camera })}</>;
}

/**
 * The studio reflections. The prefilter (PMREM) compiles two heavy shaders,
 * which done synchronously freezes the page for a few hundred milliseconds,
 * far longer on a phone. So its materials are built and compiled in the
 * background first; the real build then finds its programs already cached.
 * (Private PMREM fields, pinned to three 0.184; any failure falls back to the
 * plain synchronous build.)
 */
async function buildEnvAsync(gl: THREE.WebGLRenderer): Promise<THREE.Texture> {
  type PM = THREE.PMREMGenerator & {
    _setSize(n: number): void; _allocateTargets(): THREE.WebGLRenderTarget;
    _ggxMaterial: THREE.Material | null; _blurMaterial: THREE.Material | null;
  };
  let warm: PM | null = null;
  try {
    warm = new THREE.PMREMGenerator(gl) as PM;
    warm._setSize(512 / 4);               // the studio canvas is 512 wide
    warm._allocateTargets().dispose();
    warm.compileEquirectangularShader();
    const sc = new THREE.Scene(), geo = new THREE.BufferGeometry();
    [warm._ggxMaterial, warm._blurMaterial].forEach((m) => m && sc.add(new THREE.Mesh(geo, m)));
    await gl.compileAsync(sc, new THREE.OrthographicCamera());
    await new Promise((r) => requestAnimationFrame(r));
  } catch { /* fall through to the plain build */ }
  const env = buildStudioEnvironment(THREE, gl);
  warm?.dispose();
  return env;
}

/** Loads the three label wraps once; the rigs share them. */
function useLabels() {
  const gl = useThree((s) => s.gl);
  const [tex, setTex] = useState<THREE.Texture[] | null>(null);
  useEffect(() => {
    let alive = true;
    // ImageBitmap decodes off the main thread; plain images are the fallback
    // WebKit (every iOS browser, and Safari) has shipped createImageBitmap
    // without honouring imageOrientation, which would hang the labels upside
    // down; it gets the plain loader.
    const ua = navigator.userAgent;
    const webkit = /iPad|iPhone|iPod/.test(ua) || (/Safari/.test(ua) && !/Chrome|Chromium|Edg|Android/.test(ua));
    const load = async (u: string): Promise<THREE.Texture> => {
      if (!webkit && typeof createImageBitmap === 'function') {
        try {
          const l = new THREE.ImageBitmapLoader();
          l.setOptions({ imageOrientation: 'flipY', premultiplyAlpha: 'none' });
          const bmp = await l.loadAsync(u);
          const t = new THREE.Texture(bmp);
          t.flipY = false;
          return t;
        } catch { /* fall through */ }
      }
      return new THREE.TextureLoader().loadAsync(u);
    };
    Promise.all(LABELS.map(load)).then((ts) => {
      if (!alive) return;
      ts.forEach((t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = Math.min(SMALL ? 4 : 8, gl.capabilities.getMaxAnisotropy());
        t.needsUpdate = true;
      });
      setTex(ts);
      // upload the two colourways not yet on screen when the browser is idle
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
      ts.slice(1).forEach((t, i) => idle(() => { if (alive) setTimeout(() => gl.initTexture(t), i * 120); }));
    }).catch(() => {});
    return () => { alive = false; };
  }, [gl]);
  return tex;
}

type Els = {
  hero?: { container: HTMLElement; slot: HTMLElement; mirror: HTMLElement };
  moments?: { container: HTMLElement; slot: HTMLElement; mirrors: Mirror[]; track: HTMLElement };
  closeup?: { container: HTMLElement; slot: HTMLElement };
};

const markReady = () => { document.documentElement.dataset.can3d = 'ready'; };

/** Cached document geometry, refreshed on resize, ScrollTrigger refresh and
 *  font load; everything per frame is arithmetic on scrollY. */
function useFrames(els: Els) {
  return useMemo(() => {
    const g = {
      hero: { docTop: 0, left: 0, w: 0, h: 0, slot: { x: 0, y: 0, w: 0, h: 0 } },
      moments: { trackTop: 0, trackH: 0, left: 0, w: 0, h: 0, slot: { x: 0, y: 0, w: 0, h: 0 } },
      closeup: { docTop: 0, left: 0, w: 0, h: 0, slot: { x: 0, y: 0, w: 0, h: 0 } },
    };
    const rel = (s: DOMRect, c: DOMRect) => ({ x: s.left - c.left, y: s.top - c.top, w: s.width, h: s.height });
    const measure = () => {
      const y = scrollY;
      if (els.hero) {
        const c = els.hero.container.getBoundingClientRect();
        Object.assign(g.hero, { docTop: c.top + y, left: c.left, w: c.width, h: c.height });
        Object.assign(g.hero.slot, rel(els.hero.slot.getBoundingClientRect(), c));
      }
      if (els.moments) {
        const t = els.moments.track.getBoundingClientRect(), c = els.moments.container.getBoundingClientRect();
        Object.assign(g.moments, { trackTop: t.top + y, trackH: t.height, left: c.left, w: c.width, h: c.height });
        Object.assign(g.moments.slot, rel(els.moments.slot.getBoundingClientRect(), c));
      }
      if (els.closeup) {
        const c = els.closeup.container.getBoundingClientRect();
        Object.assign(g.closeup, { docTop: c.top + y, left: c.left, w: c.width, h: c.height });
        Object.assign(g.closeup.slot, { x: 0, y: 0, w: c.width, h: c.height });
      }
      want(300);
    };
    measure();

    const heroBox = (): Box => ({ top: g.hero.docTop - scrollY, left: g.hero.left, w: g.hero.w, h: g.hero.h });
    // the pin is sticky: in its track it holds at the top of the viewport
    const pinTop = () => {
      const t = g.moments.trackTop - scrollY;
      return t > 0 ? t : Math.min(0, t + g.moments.trackH - g.moments.h);
    };
    const momentsBox = (): Box => ({ top: pinTop(), left: g.moments.left, w: g.moments.w, h: g.moments.h });
    const closeBox = (): Box => ({ top: g.closeup.docTop - scrollY, left: g.closeup.left, w: g.closeup.w, h: g.closeup.h });

    const frames = {
      hero: { box: heroBox, slot: g.hero.slot, spin: () => -0.18 + clamp(-heroBox().top / innerHeight, -1, 2) * 1.5 } as Frame,
      moments: {
        box: momentsBox, slot: g.moments.slot,
        spin: () => {
          const p = clamp((scrollY - g.moments.trackTop) / Math.max(1, g.moments.trackH - g.moments.h), 0, 1);
          return Math.sin(p * Math.PI * 2.5) * 0.5;
        },
      } as Frame,
      closeup: {
        box: closeBox, slot: g.closeup.slot,
        spin: () => { const b = closeBox(); return -0.4 + clamp((innerHeight - b.top) / (innerHeight + b.h), 0, 1) * 1.4; },
      } as Frame,
    };
    return { frames, measure };
  }, [els]);
}

function Views({ els, intro }: { els: Els; intro: boolean }) {
  const gl = useThree((s) => s.gl);
  const labels = useLabels();
  const [env, setEnv] = useState<THREE.Texture | null>(null);
  const { frames, measure } = useFrames(els);
  useEffect(() => {
    let alive = true, made: THREE.Texture | null = null;
    buildEnvAsync(gl).then((e) => { made = e; if (alive) setEnv(e); else e.dispose(); });
    return () => { alive = false; made?.dispose(); };
  }, [gl]);
  useEffect(() => {
    addEventListener('resize', measure);
    ScrollTrigger.addEventListener('refresh', measure);
    document.fonts?.ready.then(measure);
    const late = setTimeout(measure, 1200);
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);
    return () => {
      removeEventListener('resize', measure);
      ScrollTrigger.removeEventListener('refresh', measure);
      clearTimeout(late); ro.disconnect();
    };
  }, [measure]);
  if (!labels || !env) return null;

  return (
    <>
      {els.hero && (
        <Port box={frames.hero.box}>
          <CanRig frame={frames.hero} container={els.hero.container} slotEl={els.hero.slot}
            mirrors={[{ el: els.hero.mirror, variant: 0 }]} fit="full" labels={labels} env={env} intro={intro} onFirstFrame={markReady} />
        </Port>
      )}
      {els.moments && (
        <Port box={frames.moments.box}>
          <CanRig frame={frames.moments} container={els.moments.container} slotEl={els.moments.slot}
            mirrors={els.moments.mirrors} fit="full" labels={labels} env={env} onFirstFrame={markReady} />
        </Port>
      )}
      {els.closeup && (
        <Port box={frames.closeup.box}>
          <CanRig frame={frames.closeup} container={els.closeup.container} slotEl={els.closeup.slot}
            mirrors={[{ el: els.closeup.slot, variant: 2 }]} fit="cap" labels={labels} env={env} onFirstFrame={markReady} />
        </Port>
      )}
    </>
  );
}

function findEls(): Els {
  const q = <T extends HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s) ?? undefined;
  const els: Els = {};
  const hero = q('[data-hero]'), heroSlot = q('[data-can-slot="hero"]'), heroMirror = q('[data-hero-can]');
  if (hero && heroSlot && heroMirror) els.hero = { container: hero, slot: heroSlot, mirror: heroMirror };
  const pin = q('[data-moments] [data-pin]'), track = q('[data-moments] [data-track]');
  const acts = [...document.querySelectorAll<HTMLElement>('[data-moments] [data-act]')];
  if (pin && track && acts.length && document.querySelector<HTMLElement>('[data-moments]')?.dataset.pinned) {
    const slot = q('[data-can-slot="moment"]', acts[0]);
    const mirrors = acts.map((a) => ({ el: q('[data-can]', a)!, variant: VARIANT[a.dataset.act || 'origin'] ?? 0 })).filter((m) => m.el);
    if (slot) els.moments = { container: pin, slot, mirrors, track };
  }
  const close = q('[data-can-slot="closeup"]');
  if (close) els.closeup = { container: close, slot: close };
  return els;
}

/**
 * Graphics memory. The layer covers the viewport, so its cost grows with the
 * screen: at 2x on a large monitor, with 4x multisampling, it needed ~250MB
 * and the GPU dropped the context mid-scroll. So the pixel ratio is capped
 * (1.5 desktop, 1.25 phones; the can is soft-edged and reads the same) and
 * multisampling is only used while it stays within a fixed budget.
 */
function renderBudget() {
  const dpr = Math.min(devicePixelRatio || 1, SMALL ? 1.25 : 1.5);
  const samples = innerWidth * innerHeight * dpr * dpr * 4;
  return { dpr, antialias: samples <= 12e6 };
}

export default function CanStage() {
  const [els, setEls] = useState<Els | null>(null);
  const budget = useMemo(renderBudget, []);
  const [dpr, setDpr] = useState(budget.dpr);
  const [active, setActive] = useState(true);
  // The materialise plays when there is an entrance to play it in: behind the
  // intro curtain, or if the 3D is in time for the poster's own entrance.
  const intro = useMemo(() => document.documentElement.classList.contains('intro-on')
    || (performance.now() < 2600 && scrollY < innerHeight * 0.3), []);

  useEffect(() => {
    // wait a frame so Motion has pinned the moments before we measure
    const id = requestAnimationFrame(() => setEls(findEls()));
    return () => { cancelAnimationFrame(id); delete document.documentElement.dataset.can3d; };
  }, []);

  // Only draw while a chapter with a can is on screen.
  useEffect(() => {
    if (!els) return;
    const targets = [els.hero?.container, els.moments?.track, els.closeup?.container].filter(Boolean) as HTMLElement[];
    const seen = new Set<Element>();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      setActive(seen.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [els]);

  if (!els) return null;
  // The layer stays allocated for the life of the page. It used to be hidden
  // between chapters, and bringing a full-screen buffer back mid-scroll is
  // exactly when the GPU ran out. Idle, it simply stops drawing.
  return (
    <div className="can-stage" aria-hidden>
      <Canvas
        frameloop="demand"
        dpr={dpr}
        gl={{ antialias: budget.antialias, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl, invalidate }) => {
          // Safety net: if the GPU ever drops the context, the poster renders
          // come straight back (they sit underneath), and when the context is
          // restored the 3D takes over again.
          const c = gl.domElement;
          c.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            delete document.documentElement.dataset.can3d;
          });
          c.addEventListener('webglcontextrestored', () => {
            want(2000); invalidate();
            setTimeout(() => { document.documentElement.dataset.can3d = 'ready'; }, 400);
          });
          gl.toneMapping = THREE.NeutralToneMapping;
          gl.toneMappingExposure = 1.12;
          gl.setClearColor(0x000000, 0);
          // Error checking reads the link status, which forces the page to
          // wait for the GPU driver and undoes the background compile.
          gl.debug.checkShaderErrors = process.env.NODE_ENV !== 'production';
        }}
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <Driver active={active} />
        <Compositor>
          <Views els={els} intro={intro} />
        </Compositor>
      </Canvas>
    </div>
  );
}
