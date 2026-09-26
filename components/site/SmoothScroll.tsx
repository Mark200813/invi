'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type LenisWindow = Window & { __lenis?: Lenis };

/**
 * Weighted, inertial scrolling, driven by GSAP's ticker so Lenis and every
 * ScrollTrigger read the same frame. Off entirely under reduced motion, where
 * the browser's own scrolling is the right answer. In-page anchors glide.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: { offset: 0 }, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    (window as LenisWindow).__lenis = lenis;
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as LenisWindow).__lenis;
    };
  }, []);
  return null;
}

export const getLenis = () => (typeof window === 'undefined' ? undefined : (window as LenisWindow).__lenis);

/** Scroll to an element, through Lenis when it is running. */
export function scrollToEl(el: Element | null, offset = 0) {
  if (!el) return;
  const lenis = getLenis();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (lenis && !reduce) lenis.scrollTo(el as HTMLElement, { offset, duration: 1.2 });
  else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}
