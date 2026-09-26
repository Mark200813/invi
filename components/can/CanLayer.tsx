'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// three.js and the scene arrive in their own chunk, after the page is up
const CanStage = dynamic(() => import('./CanStage'), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

/**
 * Gate for the live can. Text and the poster renders paint first; the 3D is
 * fetched once the browser is idle. Reduced motion keeps the still renders,
 * as does any browser without WebGL: nothing on the page depends on it.
 */
export default function CanLayer() {
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !hasWebGL()) {
      // a flag, not just an event: the intro may start listening after this
      document.documentElement.dataset.canSkip = '1';
      dispatchEvent(new Event('invi:can-skip'));
      return;
    }
    // Behind the intro curtain nobody is scrolling yet, and preparing the can
    // is exactly what the intro is for: start straight away.
    if (document.documentElement.classList.contains('intro-on')) { setGo(true); return; }
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    // The one-off start-up (parsing three.js, first upload to the GPU) is the
    // only heavy moment, so it waits for the page to be idle and for the
    // reader to be between scrolls: it never lands on top of a gesture.
    let lastScroll = 0, poll = 0, idleId = 0;
    const onScroll = () => { lastScroll = performance.now(); };
    addEventListener('scroll', onScroll, { passive: true });
    const settled = () => {
      const lenis = (window as Window & { __lenis?: { isScrolling: boolean | string } }).__lenis;
      if (!lenis?.isScrolling && performance.now() - lastScroll > 350) setGo(true);
      else poll = window.setTimeout(settled, 200);
    };
    // ...and only once someone is actually there: a pointer, a touch, a key,
    // a scroll. A page load alone never pays for it.
    const intents = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'keydown', 'scroll'] as const;
    let armed = false;
    const arm = () => {
      if (armed) return;
      armed = true;
      intents.forEach((ev) => removeEventListener(ev, arm));
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(settled, { timeout: 1200 });
      else poll = window.setTimeout(settled, 400);
    };
    intents.forEach((ev) => addEventListener(ev, arm, { passive: true }));
    return () => {
      intents.forEach((ev) => removeEventListener(ev, arm));
      removeEventListener('scroll', onScroll);
      clearTimeout(poll);
      if (idleId) w.cancelIdleCallback?.(idleId);
    };
  }, []);
  return go ? <CanStage /> : null;
}
