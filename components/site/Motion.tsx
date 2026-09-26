'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { getLenis } from './SmoothScroll';

/**
 * Every scroll-linked effect on the site, in one place. Pages only carry
 * markers (data-hero, data-moments, data-parallax, data-count, data-clip...),
 * so the markup stays readable and the motion can be tuned here alone.
 *
 * Everything is built inside gsap.matchMedia, so reduced motion gets none of
 * it, and a route change or breakpoint change reverts it all cleanly.
 * Scrubbed effects are scroll-driven, never time-based: scrolling back
 * reverses them exactly.
 */
/* ── keeping the reader's place ─────────────────────────────────────────
 * Two things change the page's height under the reader: crossing the 900px
 * breakpoint (the whole motion setup is rebuilt) and a reload (the browser
 * restores the scroll before the moments pin has stretched the page). In
 * both cases we put them back in the same chapter, the same way through it.
 */
type Place = { key: string; frac: number };
let lastPlace: Place | null = null;
let firstLoad = true;   // a reload's restore applies to the first page only
let freezeUntil = 0;    // while a rebuild settles, its own scroll resets are not the reader's place
/** Re-apply a place a few times while the layout settles: ScrollTrigger's
 *  refresh scrolls to the top to measure, and Lenis can briefly chase that. */
function settleAt(p: Place | null, stillWanted: () => boolean = () => true) {
  if (!p) return;
  freezeUntil = performance.now() + 1400;
  [0, 120, 350, 700, 1100].forEach((ms) => setTimeout(() => { if (stillWanted()) goToPlace(p); }, ms));
}
const PLACE_KEY = 'invi.place';

function placeNow(): Place | null {
  const all = [...document.querySelectorAll<HTMLElement>('main [id], main [data-track], main > *')];
  let best: HTMLElement | null = null, bestH = Infinity;
  for (const el of all) {
    // fixed layers (the intro, the 3D stage) always cover the top: not a place
    if (getComputedStyle(el).position === 'fixed' || el.querySelector(':scope > .can-stage')) continue;
    const r = el.getBoundingClientRect();
    if (r.top <= 1 && r.bottom > 1 && r.height < bestH) { best = el; bestH = r.height; }
  }
  if (!best) return null;
  const r = best.getBoundingClientRect();
  const key = best.id ? '#' + best.id : best.hasAttribute('data-track') ? '[data-track]' : 'main>' + [...best.parentElement!.children].indexOf(best);
  return { key, frac: -r.top / Math.max(1, r.height) };
}
function findPlace(key: string): HTMLElement | null {
  if (key.startsWith('main>')) return (document.querySelector('main')?.children[Number(key.slice(5))] as HTMLElement) ?? null;
  return document.querySelector<HTMLElement>(key);
}
function goToPlace(p: Place | null) {
  const el = p && findPlace(p.key);
  if (!el) return;
  const r = el.getBoundingClientRect();
  const y = r.top + scrollY + p!.frac * r.height;
  const l = getLenis();
  if (l) l.scrollTo(y, { immediate: true, force: true }); else scrollTo(0, y);
}

export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    // remember where the reader is, a beat after they stop scrolling
    let t = 0;
    const note = () => {
      if (performance.now() < freezeUntil) return;
      clearTimeout(t); t = window.setTimeout(() => { if (performance.now() >= freezeUntil) lastPlace = placeNow(); }, 250);
    };
    addEventListener('scroll', note, { passive: true });
    // a resize can rebuild the layout (and briefly scroll to the top to
    // measure): hold on to the place from before it
    const hold = () => { freezeUntil = performance.now() + 1500; clearTimeout(t); };
    addEventListener('resize', hold);
    const save = () => {
      try {
        sessionStorage.setItem(PLACE_KEY, JSON.stringify({ path: location.pathname, ...(placeNow() ?? {}) }));
        // we restore it ourselves once the page is laid out; the browser's own
        // restore would land first, too high, and fight ours
        history.scrollRestoration = 'manual';
      } catch {}
    };
    addEventListener('pagehide', save);
    return () => { clearTimeout(t); removeEventListener('scroll', note); removeEventListener('resize', hold); removeEventListener('pagehide', save); };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    // phones: the address bar showing or hiding is not a real resize, and
    // re-measuring every trigger mid-scroll is a classic source of hitches
    ScrollTrigger.config({ ignoreMobileResize: true });
    getLenis()?.resize();

    const mm = gsap.matchMedia();
    let built = false;
    mm.add(
      { motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 900px)' },
      (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        // a rebuild (breakpoint crossed) keeps the reader where they were
        if (built) settleAt(lastPlace);
        built = true;
        if (!motion) return;
        const undo: (() => void)[] = [];
        // what is on screen at load, now; everything further down, when the
        // browser is idle, so none of it competes with the first paint
        undo.push(moments(desktop));
        hero();
        const rest = () => ctx.add(() => {
          reveals();
          parallax();
          undo.push(counts());
          if (desktop) clips();
          ScrollTrigger.refresh();
        });
        const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
        const id = w.requestIdleCallback ? w.requestIdleCallback(rest, { timeout: 1500 }) : window.setTimeout(rest, 300);
        return () => {
          if (w.cancelIdleCallback) w.cancelIdleCallback(id); else clearTimeout(id);
          undo.forEach((f) => f());
        };
      },
    );

    // Arriving on /#section from another page: the router jumps before the
    // moments pin and lengthen the page, so settle on the anchor again after.
    const hash = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    let userMoved = false;
    const moved = () => { userMoved = true; };
    const intents = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    intents.forEach((ev) => addEventListener(ev, moved, { passive: true, once: true }));
    const toHash = () => {
      if (!hash || userMoved) return;
      const y = hash.getBoundingClientRect().top + scrollY;
      const l = getLenis();
      if (l) l.scrollTo(y, { immediate: true, force: true }); else scrollTo(0, y);
    };
    requestAnimationFrame(toHash);

    // A reload restores the scroll before the pin lengthens the page: put
    // the reader back in their chapter once it has (unless they have moved).
    let restore: Place | null = null;
    try {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      const saved = JSON.parse(sessionStorage.getItem(PLACE_KEY) || 'null');
      if (firstLoad && !hash && (nav?.type === 'reload' || nav?.type === 'back_forward') && saved?.path === location.pathname && saved.key) restore = saved;
    } catch {}
    firstLoad = false;
    const toSaved = () => { if (restore && !userMoved) goToPlace(restore); };
    requestAnimationFrame(() => settleAt(restore, () => !userMoved));
    // back to the browser's own restoring for in-site Back and Forward
    setTimeout(() => { try { history.scrollRestoration = 'auto'; } catch {} }, 1500);

    const refresh = () => { ScrollTrigger.refresh(); toHash(); toSaved(); };
    document.fonts?.ready.then(refresh);
    addEventListener('load', refresh);
    return () => {
      intents.forEach((ev) => removeEventListener(ev, moved));
      removeEventListener('load', refresh);
      mm.revert();
    };
  }, [pathname]);

  return null;
}

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => gsap.utils.toArray<T>(root.querySelectorAll(sel));
/** Already on screen when the effect is set up: leave it alone, never flash it out and back. */
const onScreen = (el: Element) => el.getBoundingClientRect().top < innerHeight * 0.92;

/* ── hero: the page gives way as you start to scroll ───────────────────── */
function hero() {
  const h = $('[data-hero]');
  if (!h) return;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: h, start: 'top top', end: 'bottom top', scrub: true },
  });
  tl.to($('[data-hero-title]', h), { yPercent: -22, opacity: 0.1 }, 0)
    .to($('[data-hero-can]', h), { yPercent: -9, scale: 1.07 }, 0)
    .to($('[data-hero-bottom]', h), { y: -60, opacity: 0 }, 0)
    .to($('[data-hero-glow]', h), { opacity: 1, scale: 1.2 }, 0);
}

/* ── the three moments: one pinned frame the day passes through ────────── */
function moments(desktop: boolean) {
  const sec = $('[data-moments]');
  if (!sec) return () => {};
  sec.dataset.pinned = 'true';
  ScrollTrigger.refresh();

  const parts = $$('[data-act]', sec).map((a) => ({
    field: $('[data-field]', a),
    can: $('[data-can]', a),
    word: $('[data-word]', a),
    copy: [$('[data-head]', a), $('[data-copy]', a)].filter(Boolean),
    photo: $('[data-photo]', a),
  }));

  // opacity, not visibility: every world's words stay in the accessibility
  // tree, so a screen reader hears all three, not just the one on screen
  parts.slice(1).forEach((p) => {
    gsap.set(p.field, { opacity: 0 });
    gsap.set(p.can, { opacity: 0, yPercent: 22, rotation: 8 });
    gsap.set(p.word, { yPercent: 115 });
    gsap.set(p.copy, { opacity: 0, y: 28 });
    gsap.set(p.photo, { opacity: 0, y: 60 });
  });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    // under a finger, easing behind the scroll reads as lag; with the mouse
    // wheel (already smoothed by Lenis) a little weight feels right
    scrollTrigger: { trigger: $('[data-track]', sec), start: 'top top', end: 'bottom bottom', scrub: matchMedia('(pointer: coarse)').matches ? 0.15 : 0.5 },
  });
  const HOLD = 1, T = 0.7;
  let t = 0;
  parts.forEach((p, i) => {
    // while a world holds, the can breathes toward you and the photo drifts
    tl.to(p.can, { scale: 1.045, duration: HOLD }, t);
    if (desktop) tl.to(p.photo, { y: -40, duration: HOLD }, t);
    t += HOLD;
    const n = parts[i + 1];
    if (!n) return;
    tl.to(n.field, { opacity: 1, duration: T, ease: 'power1.inOut' }, t)
      .to(p.can, { opacity: 0, yPercent: -22, rotation: -8, duration: T * 0.45, ease: 'power2.in' }, t)
      .to(n.can, { opacity: 1, yPercent: 0, rotation: 0, duration: T * 0.55, ease: 'power3.out' }, t + T * 0.45)
      .to(p.word, { yPercent: -115, duration: T * 0.6, ease: 'power2.in' }, t)
      .to(n.word, { yPercent: 0, duration: T * 0.6, ease: 'power3.out' }, t + T * 0.4)
      .to(p.copy, { opacity: 0, y: -28, duration: T * 0.45, ease: 'power1.in' }, t)
      .to(n.copy, { opacity: 1, y: 0, duration: T * 0.5, ease: 'power2.out', stagger: 0.05 }, t + T * 0.5)
      .to(p.photo, { opacity: 0, duration: T * 0.4 }, t)
      .to(n.photo, { opacity: 1, y: 0, duration: T * 0.6, ease: 'power2.out' }, t + T * 0.4);
    t += T;
  });
  const bar = $('[data-progress]', sec);
  if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: t }, 0);

  return () => { delete sec.dataset.pinned; };
}

/* ── headlines rise line by line from behind a mask; the rest fades up ── */
function reveals() {
  $$('main .display').forEach((el) => {
    if (el.closest('[data-motion-skip]') || el.hasAttribute('data-no-split') || onScreen(el)) return;
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      // the heading keeps its own text for assistive tech; the line wrappers
      // are presentational, so no aria-label is added to a <p> or <h2>
      aria: 'none',
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 110,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.085,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }),
    });
  });

  const candidates = $$('main :is(.lede, .body, .small, .label, .index-n, .btn, .rule, figure, blockquote, [data-reveal])')
    .filter((el) => !el.closest('[data-motion-skip]') && !el.closest('.display') && !onScreen(el));
  const fades = candidates.filter((el) => !candidates.some((p) => p !== el && p.contains(el)));
  // opacity only: text waiting to fade in is still read out and still labels
  // its form field; visibility:hidden would take it out of the page for
  // screen readers until it scrolled into view
  if (!fades.length) return;
  gsap.set(fades, { opacity: 0, y: 30 });
  ScrollTrigger.batch(fades, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.07, overwrite: true }),
  });
}

/* ── depth: photographs move a little slower than the page ─────────────── */
function parallax() {
  $$('[data-parallax]').forEach((fig) => {
    const img = $('img, video', fig);
    if (!img) return;
    const amt = Number(fig.dataset.parallax || 14);
    gsap.fromTo(img, { yPercent: -amt / 2, scale: 1.16 }, {
      yPercent: amt / 2, scale: 1.16, ease: 'none',
      scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
  $$('[data-speed]').forEach((el) => {
    const sp = Number(el.dataset.speed);
    gsap.fromTo(el, { y: sp * 90 }, {
      y: -sp * 90, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ── stats count up the first time they arrive ─────────────────────────── */
function counts() {
  const els = $$('[data-count]');
  els.forEach((el) => {
    if (onScreen(el)) return;
    const to = Number(el.dataset.count), suffix = el.dataset.suffix ?? '';
    const o = { v: 0 };
    el.textContent = `0${suffix}`;
    gsap.to(o, {
      v: to, duration: 1.8, ease: 'expo.out',
      onUpdate: () => { el.textContent = `${Math.round(o.v)}${suffix}`; },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
  return () => els.forEach((el) => { el.textContent = `${el.dataset.count}${el.dataset.suffix ?? ''}`; });
}

/* ── bone chapters open out of the dark, like a page being turned to ───── */
function clips() {
  $$('[data-clip]').forEach((el) => {
    gsap.fromTo(el,
      { clipPath: 'inset(4% 3.5% 0% 3.5% round 28px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 30%', scrub: true },
      });
  });
}
