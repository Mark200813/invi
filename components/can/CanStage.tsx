'use client';

import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { View, PerspectiveCamera, PerformanceMonitor } from '@react-three/drei';
import { gsap } from 'gsap';
import { buildCan, buildStudioEnvironment, COLOURWAYS, MODES, CAN } from '@/lib/can/invi-can';

/**
 * The live INVI can. One transparent canvas fixed over the page; each chapter
 * that shows the can gets a View, scissored to that chapter, with its own
 * scene, camera and light rig. Geometry, materials and studio lighting come
 * straight from the INVI Can Studio model (lib/can/invi-can.js).
 *
 * The DOM stays in charge: every can mirrors the poster image it replaces:
 * the poster's box sets where it stands and how big it is, and the motion
 * Phase 2 put on that poster (lift, tilt, scale, fade) drives the 3D can
 * frame by frame. So the scroll choreography lives in one place, and the
 * poster stays underneath as the instant first paint and the fallback.
 */

const LABELS = ['/textures/label-origin.webp', '/textures/label-rise.webp', '/textures/label-after-dark.webp'];
const VARIANT: Record<string, number> = { origin: 0, rise: 1, 'after-dark': 2 };
const FOV = 24, DIST = 1;
const VIS_H = 2 * DIST * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
/** In the poster renders the can fills 84% of the frame height, centred. */
const POSTER_FILL = 0.84;
const DRAG_K = 0.0085;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (x: number, a: number, b: number) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);

type Mirror = { el: HTMLElement; variant: number };
type RigProps = {
  container: HTMLElement;
  slot: HTMLElement;
  mirrors: Mirror[];
  fit: 'full' | 'cap';
  /** radians of turn contributed by scroll, from the container's position */
  spin: (container: HTMLElement) => number;
  labels: THREE.Texture[];
  env: THREE.Texture;
  intro?: boolean;
  onFirstFrame?: () => void;
};

function CanRig({ container, slot, mirrors, fit, spin, labels, env, intro, onFirstFrame }: RigProps) {
  const scene = useThree((s) => s.scene);
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const compiled = useRef(false);
  const can = useMemo(() => buildCan(THREE, { segments: 96 }), []);
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

  // Environment and materials. Every surface can fade, because the moments
  // hand the can over by lifting it away; depthWrite stays on so the can
  // never sorts against itself.
  useEffect(() => {
    scene.environment = env;
    scene.environmentIntensity = MODES.reveal.env;
    can.materials.veil.visible = false;
    for (const m of [can.materials.body, can.materials.shell, can.materials.cap, can.materials.nozzle, can.materials.valve]) {
      m.transparent = true; m.depthWrite = true; m.needsUpdate = true;
    }
    // Build the shader programs in the background (parallel compile where the
    // GPU supports it) with the real map and environment bound, so the first
    // frame that draws the can does not freeze the page doing it.
    can.materials.body.map = labels[mirrors[0].variant];
    let alive = true;
    const g = outer.current;
    if (g) g.visible = true;
    gl.compileAsync(scene, camera).catch(() => {}).finally(() => { if (alive) compiled.current = true; });
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
    slot.style.pointerEvents = 'auto';
    slot.style.cursor = 'grab';
    const inSlot = (e: PointerEvent) => {
      const r = slot.getBoundingClientRect();
      return e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom;
    };
    const down = (e: PointerEvent) => {
      if (!inSlot(e) || e.button > 0) return;
      if (e.pointerType === 'mouse') e.preventDefault();
      s.drag = { x: e.clientX, t: performance.now(), v: 0 };
      slot.style.cursor = 'grabbing';
    };
    const move = (e: PointerEvent) => {
      const r = slot.getBoundingClientRect();
      if (e.pointerType === 'mouse' || s.drag) {
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
      slot.style.cursor = 'grab';
    };
    const leave = () => { s.target.x = 0; s.target.z = 0; };
    container.addEventListener('pointerdown', down);
    addEventListener('pointermove', move, { passive: true });
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
    container.addEventListener('pointerleave', leave);
    return () => {
      container.style.touchAction = prevTouch;
      slot.style.pointerEvents = ''; slot.style.cursor = '';
      container.removeEventListener('pointerdown', down);
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      removeEventListener('pointercancel', up);
      container.removeEventListener('pointerleave', leave);
    };
  }, [container, slot]);

  useFrame((state, delta) => {
    const s = st.current, g = outer.current, tg = turn.current;
    if (!g || !tg) return;
    if (!compiled.current) { g.visible = false; return; }
    const dt = Math.min(0.05, delta);
    const cr = container.getBoundingClientRect();
    const sr = slot.getBoundingClientRect();
    if (cr.height < 1 || sr.height < 1) { g.visible = false; return; }
    const u = VIS_H / cr.height;

    // which poster is live, and how it is moving
    let m = mirrors[0], op = -1;
    for (const x of mirrors) {
      const o = Number(gsap.getProperty(x.el, 'opacity'));
      const v = getComputedStyle(x.el).visibility === 'hidden' ? 0 : o;
      if (v > op) { op = v; m = x; }
    }
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
    const canPx = fit === 'cap' ? sr.height * 2.3 : sr.height * POSTER_FILL;
    const cx = sr.left + sr.width / 2 - (cr.left + cr.width / 2);
    const cyTop = fit === 'cap' ? sr.top + sr.height * 0.12 + canPx / 2 : sr.top + sr.height / 2;
    const cy = cyTop - (cr.top + cr.height / 2) + (yP / 100) * sr.height;
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
    if (s.t0 < 0) s.t0 = state.clock.elapsedTime;
    const age = state.clock.elapsedTime - s.t0;
    const introTwist = intro ? (1 - easeOut(age / 2.2)) * -1.1 : 0;
    const float = Math.sin(state.clock.elapsedTime * 0.62) * 0.0028;
    tg.rotation.y = spin(container) + s.dragAngle + introTwist;
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
    for (const mat of [can.materials.body, can.materials.shell, can.materials.cap, can.materials.nozzle, can.materials.valve]) mat.opacity = a;
    (can.shadow.material as THREE.MeshBasicMaterial).opacity = R.shadow * a * mainK;

    if (s.first) { s.first = false; onFirstFrame?.(); }
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={FOV} position={[0, 0, DIST]} near={0.05} far={10} />
      <group ref={outer}>
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

/** Views each clear only their own box; this wipes the whole layer first,
 *  so a can that has scrolled on never leaves a trace behind. */
function ClearLayer() {
  useFrame(({ gl }) => { gl.setScissorTest(false); gl.clear(true, true, true); }, 0.5);
  return null;
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
    const load = async (u: string): Promise<THREE.Texture> => {
      if (typeof createImageBitmap === 'function') {
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
        t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
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

function Views({ els, intro }: { els: Els; intro: boolean }) {
  const gl = useThree((s) => s.gl);
  const labels = useLabels();
  const [env, setEnv] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let alive = true, made: THREE.Texture | null = null;
    buildEnvAsync(gl).then((e) => { made = e; if (alive) setEnv(e); else e.dispose(); });
    return () => { alive = false; made?.dispose(); };
  }, [gl]);
  const refs = {
    hero: useRef<HTMLElement>(els.hero?.container ?? null),
    moments: useRef<HTMLElement>(els.moments?.container ?? null),
    closeup: useRef<HTMLElement>(els.closeup?.container ?? null),
  };
  if (!labels || !env) return null;

  const heroSpin = (c: HTMLElement) => -0.18 + clamp(-c.getBoundingClientRect().top / innerHeight, -1, 2) * 1.5;
  const momentsSpin = () => {
    const t = els.moments!.track.getBoundingClientRect();
    const p = clamp(-t.top / Math.max(1, t.height - innerHeight), 0, 1);
    return Math.sin(p * Math.PI * 2.5) * 0.5;
  };
  const closeSpin = (c: HTMLElement) => {
    const r = c.getBoundingClientRect();
    return -0.4 + clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1) * 1.4;
  };

  return (
    <>
      {els.hero && (
        <View track={refs.hero as RefObject<HTMLElement>} index={1}>
          <CanRig container={els.hero.container} slot={els.hero.slot} mirrors={[{ el: els.hero.mirror, variant: 0 }]}
            fit="full" spin={heroSpin} labels={labels} env={env} intro={intro} onFirstFrame={markReady} />
        </View>
      )}
      {els.moments && (
        <View track={refs.moments as RefObject<HTMLElement>} index={2}>
          <CanRig container={els.moments.container} slot={els.moments.slot} mirrors={els.moments.mirrors}
            fit="full" spin={momentsSpin} labels={labels} env={env} onFirstFrame={markReady} />
        </View>
      )}
      {els.closeup && (
        <View track={refs.closeup as RefObject<HTMLElement>} index={3}>
          <CanRig container={els.closeup.container} slot={els.closeup.slot} mirrors={[{ el: els.closeup.slot, variant: 2 }]}
            fit="cap" spin={closeSpin} labels={labels} env={env} onFirstFrame={markReady} />
        </View>
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

export default function CanStage() {
  const [els, setEls] = useState<Els | null>(null);
  const [dpr, setDpr] = useState(1);
  const [active, setActive] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);
  // the materialise intro only plays if we are in time for it: if the poster
  // has long since finished its own entrance, the 3D simply takes over
  const intro = useMemo(() => typeof performance !== 'undefined' && performance.now() < 2600 && scrollY < innerHeight * 0.3, []);

  useEffect(() => {
    // wait a frame so Motion has pinned the moments before we measure
    const id = requestAnimationFrame(() => setEls(findEls()));
    const coarse = matchMedia('(pointer: coarse)').matches;
    setDpr(Math.min(devicePixelRatio || 1, coarse ? 1.5 : 2));
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
  return (
    <div ref={wrap} className="can-stage" aria-hidden style={{ visibility: active ? 'visible' : 'hidden' }}>
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={dpr}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
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
        <ClearLayer />
        <Views els={els} intro={intro} />
      </Canvas>
    </div>
  );
}
