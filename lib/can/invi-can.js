/**
 * INVI — procedural 125ml aerosol can.
 *
 * Framework-agnostic: takes the THREE namespace, returns a Group of named
 * meshes sharing a small set of named materials. Used by both the vanilla
 * scene (INVI Can Studio.html) and the React Three Fiber component
 * (nextjs/InviCanScene.jsx).
 *
 * Every dimension is measured off the supplied label artwork (the can
 * silhouette in the source JPEGs) and expressed in metres, y-up, with the
 * base resting on y = 0. 170 artwork px = 22.5mm can radius.
 */

const PX = 0.0225 / 170;          // artwork pixel -> metres
const IMG_BASE = 1028;            // artwork row of the can's lowest pixel
const yAt = (py) => (IMG_BASE - py) * PX;
const rAt = (hw) => hw * PX;

export const CAN = {
  radius: rAt(170),               // 22.5mm  -> 45mm diameter
  filletTop: yAt(999),            // top of the base roll
  bodyTop: yAt(235),              // top of the straight, labelled section
  shoulderTop: yAt(186),
  capTop: yAt(28),
  height: yAt(28),
};

/** Silhouette of the shoulder, sampled from the artwork: [artwork row, half-width px]. */
const SHOULDER_PX = [
  [235, 170], [229, 166], [223, 161], [217, 153], [211, 144],
  [205, 136], [199, 127], [193, 119], [188, 111], [186, 104],
];

/** Silhouette of the cap barrel, sampled from the artwork. */
const CAP_PX = [
  [186, 102], [174, 102], [162, 101], [150, 101], [138, 99], [126, 99],
  [114, 98], [102, 97], [90, 96], [78, 93], [66, 88], [54, 85],
  [44, 80], [40, 77],
];

function arc(V2, cx, cy, radius, a0, a1, steps) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const a = a0 + (a1 - a0) * (i / steps);
    pts.push(new V2(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius));
  }
  return pts;
}

/** 64px-wide vertical streak map — reads as brushed aluminium under the key light. */
function brushedRoughness(THREE) {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 8;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#c8c8c8';
  ctx.fillRect(0, 0, c.width, c.height);
  for (let x = 0; x < c.width; x++) {
    const v = 190 + Math.round(Math.random() * 58);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(x, 0, 1, c.height);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 1);
  t.name = 'brushed-streaks';
  return t;
}

/** Soft elliptical blob used as the contact shadow under the can. */
function shadowTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(0,0,0,0.95)');
  g.addColorStop(0.28, 'rgba(0,0,0,0.62)');
  g.addColorStop(0.58, 'rgba(0,0,0,0.2)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.name = 'contact-shadow';
  return t;
}

/**
 * @param {object} THREE   the three namespace
 * @param {object} opts    { labelMap?: THREE.Texture, segments?: number }
 * @returns {{ group, materials, meshes, shadow, dispose }}
 */
export function buildCan(THREE, opts = {}) {
  const { Vector2 } = THREE;
  const seg = opts.segments ?? 96;
  const roughnessMap = brushedRoughness(THREE);

  const materials = {
    // Soft-touch matte black over brushed aluminium: metallic enough to pick up
    // the rim light, far short of chrome.
    body: new THREE.MeshPhysicalMaterial({
      name: 'aluminium-softtouch',
      // starts black: the label wrap loads async, and a white cylinder must
      // never flash. The scene raises this to 1.0 as the map is bound.
      color: 0x000000,
      map: opts.labelMap ?? null,
      roughnessMap,
      roughness: 0.55,
      metalness: 0.22,
      clearcoat: 0.35,          // matte overprint varnish
      clearcoatRoughness: 0.45,
      envMapIntensity: 1.15,
    }),
    shell: new THREE.MeshPhysicalMaterial({
      name: 'aluminium-shell',
      color: 0x0d0d0d,
      roughnessMap,
      roughness: 0.56,
      metalness: 0.4,
      clearcoat: 0.35,
      clearcoatRoughness: 0.45,
      envMapIntensity: 1.1,
    }),
    // MYSTERY layer: a heavily defocused copy of the wrap, sitting a hair
    // outside the body. Lit only by the rim and the travelling sweep, so the
    // colourway surfaces as the can turns while the artwork never resolves.
    veil: new THREE.MeshPhysicalMaterial({
      name: 'label-veil',
      color: 0x000000,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      roughness: 0.5,
      metalness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.28,
      envMapIntensity: 0.6,
    }),
    cap: new THREE.MeshPhysicalMaterial({
      name: 'cap-gloss',
      color: 0x0d0e10,
      roughness: 0.5,
      metalness: 0.1,
      clearcoat: 0.35,
      clearcoatRoughness: 0.26,
      envMapIntensity: 1.3,
    }),
    nozzle: new THREE.MeshStandardMaterial({
      name: 'nozzle-matte',
      color: 0x0a0a0b,
      roughness: 0.62,
      metalness: 0.1,
      envMapIntensity: 0.7,
    }),
    valve: new THREE.MeshStandardMaterial({
      name: 'valve-steel',
      color: 0x3a3b3d,
      roughness: 0.38,
      metalness: 0.92,
      envMapIntensity: 1.1,
    }),
  };

  const group = new THREE.Group();
  group.name = 'invi-can';
  const meshes = {};
  const add = (name, geometry, material) => {
    const m = new THREE.Mesh(geometry, material);
    m.name = name;
    meshes[name] = m;
    group.add(m);
    return m;
  };

  // — base: flat disc + rolled edge into the body ————————————————
  const fillet = CAN.filletTop;
  add('base', new THREE.LatheGeometry([
    new Vector2(0.0001, 0),
    new Vector2(CAN.radius - fillet, 0),
    ...arc(Vector2, CAN.radius - fillet, fillet, fillet, -Math.PI / 2, 0, 7),
  ], seg), materials.shell);

  // — body: the straight, labelled section. thetaStart = PI puts u=0.5
  //   (the front artwork) on +Z, so the label faces camera at rotation 0.
  const bodyH = CAN.bodyTop - fillet;
  const body = add('body', new THREE.CylinderGeometry(
    CAN.radius, CAN.radius, bodyH, seg, 1, true, Math.PI, Math.PI * 2,
  ), materials.body);
  body.position.y = fillet + bodyH / 2;

  const veil = add('body-veil', new THREE.CylinderGeometry(
    CAN.radius * 1.0015, CAN.radius * 1.0015, bodyH, seg, 1, true, Math.PI, Math.PI * 2,
  ), materials.veil);
  veil.position.y = body.position.y;
  veil.renderOrder = 1;

  // — shoulder ————————————————————————————————————————————————
  add('shoulder', new THREE.LatheGeometry(
    SHOULDER_PX.map(([py, hw]) => new Vector2(rAt(hw), yAt(py))), seg,
  ), materials.shell);

  // — valve cup, mostly hidden under the cap skirt ————————————
  const valve = add('valve-cup', new THREE.CylinderGeometry(
    rAt(96), rAt(101), yAt(160) - yAt(188), 32, 1, true,
  ), materials.valve);
  valve.position.y = (yAt(160) + yAt(188)) / 2;

  // — cap: tapered barrel, rolled top edge, flat top face ————————
  const capPts = [
    new Vector2(0.0001, yAt(184)),
    new Vector2(rAt(101), yAt(184)),
    ...CAP_PX.map(([py, hw]) => new Vector2(rAt(hw), yAt(py))),
    ...arc(Vector2, rAt(71), yAt(34), rAt(6), 0, Math.PI / 2, 6),
    new Vector2(0.0001, yAt(28)),
  ];
  add('cap', new THREE.LatheGeometry(capPts, seg), materials.cap);

  // — nozzle: spray button set into the cap crown, with its orifice ——
  const btn = add('nozzle-button', new THREE.CylinderGeometry(
    rAt(34), rAt(36), 0.0007, 40,
  ), materials.nozzle);
  btn.position.y = CAN.capTop - 0.0002;
  const orifice = add('nozzle-orifice', new THREE.CylinderGeometry(
    rAt(9), rAt(7), 0.0016, 20,
  ), materials.nozzle);
  orifice.position.set(0, CAN.capTop - 0.0006, 0);

  // — soft contact shadow (a lit plane, not a shadow map: cheap + soft) ——
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(CAN.radius * 5.2, CAN.radius * 3.5),
    new THREE.MeshBasicMaterial({
      name: 'contact-shadow',
      map: shadowTexture(THREE),
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  shadow.name = 'contact-shadow';
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(CAN.radius * 0.34, 0.0006, CAN.radius * 0.1);
  shadow.renderOrder = -1;

  const dispose = () => {
    group.traverse((o) => o.geometry && o.geometry.dispose());
    Object.values(materials).forEach((m) => m.dispose());
    shadow.geometry.dispose();
    shadow.material.map.dispose();
    shadow.material.dispose();
    roughnessMap.dispose();
  };

  return { group, materials, meshes, shadow, dispose };
}

/**
 * Small procedural studio environment (one vertical gradient + two softboxes)
 * pre-filtered into a PMREM cubemap. Gives the metal something to reflect
 * without shipping an HDR.
 */
export function buildStudioEnvironment(THREE, renderer, tint = '#8ea0b4') {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 256;
  const ctx = c.getContext('2d');
  const sky = ctx.createLinearGradient(0, 0, 0, 256);
  sky.addColorStop(0, '#2b3038');
  sky.addColorStop(0.45, '#14161a');
  sky.addColorStop(1, '#050607');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 512, 256);
  const blob = (x, y, rx, ry, colour, alpha) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, rx);
    g.addColorStop(0, colour);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.scale(1, ry / rx);
    ctx.translate(-x, -y);
    ctx.fillStyle = g;
    ctx.fillRect(x - rx, y - rx, rx * 2, rx * 2);
    ctx.restore();
  };
  blob(150, 70, 150, 105, '#ffffff', 0.95);   // key softbox
  blob(400, 96, 120, 150, tint, 0.55);        // cool bounce card
  blob(300, 235, 200, 70, '#1a1c20', 1);      // floor
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(tex).texture;
  tex.dispose();
  pmrem.dispose();
  return env;
}

/** The three colourways: label artwork + how the room is lit for each. */
export const COLOURWAYS = [
  {
    id: 'ocean',
    index: '01',
    name: 'Low Key',
    notes: 'Berry & Mandarin',
    format: 'All Day Spray',
    colourway: 'Ocean',
    mood: 'Clean · fresh · aquatic',
    map: 'textures/can-lowkey.jpg',
    veil: 'textures/veil-lowkey.jpg',
    mystery: '#39a290',          // MYSTERY-only tint
    mysteryRim: '#8fd8c8',
    key: '#f0f6ff', fill: '#9aacc0', rim: '#e8f2ff',
    env: '#8296a8',
    bg: ['#0d1822', '#05080c'],
    accent: '#bcd8ef',
  },
  {
    id: 'terracotta',
    index: '02',
    name: 'Bounce Back',
    notes: 'Citrus & Mint',
    format: 'All Day Spray',
    colourway: 'Terracotta',
    mood: 'Bold · dark · intense',
    map: 'textures/can-bounce.jpg',
    veil: 'textures/veil-bounce.jpg',
    mystery: '#834f28',
    mysteryRim: '#e0a06a',
    key: '#fff0e2', fill: '#b39586', rim: '#ffd9c2',
    env: '#938075',
    bg: ['#150b06', '#070403'],
    accent: '#f0a075',
  },
  {
    id: 'sage',
    index: '03',
    name: 'Stop Out',
    notes: 'Spice & Amber',
    format: 'All Night Spray',
    colourway: 'Sage',
    mood: 'Warm · woody · amber',
    map: 'textures/can-stopout.jpg',
    veil: 'textures/veil-stopout.jpg',
    mystery: '#4b3270',
    mysteryRim: '#a98fd8',
    key: '#fff5e6', fill: '#a6ab9d', rim: '#ffe9c8',
    env: '#8d8b7a',
    bg: ['#12180f', '#060806'],
    accent: '#d8c79a',
  },
];

/** Light rig intensities for the two display modes. */
export const MODES = {
  reveal: {
    key: 4.6, fill: 1.35, rim: 1.5, ambient: 0.3, env: 1.05,
    label: 1.0, metalness: 0.22, roughness: 0.55,
    clearcoat: 0.35, coatRoughness: 0.35, shadow: 1.0,
    veil: 0.0, sweep: 0.0,
  },
  // No key, no fill: a hard rim traces the silhouette and a slow sweep light
  // orbits the can. The sharp wrap is fully suppressed (label: 0) and the
  // defocused veil carries the colourway's MYSTERY tint instead — hue and
  // mood, never text. The veil map is luminance only; hue comes from the tint.
  mystery: {
    key: 0.0, fill: 0.0, rim: 6.2, ambient: 0.012, env: 0.26,
    label: 0.0, metalness: 0.0, roughness: 0.55,
    clearcoat: 1.0, coatRoughness: 0.3, shadow: 0.5,
    veil: 1.0, sweep: 1.5,
  },
};
