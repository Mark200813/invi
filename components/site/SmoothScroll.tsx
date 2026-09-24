'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Weighted, inertial scrolling. Off entirely under reduced motion, where the
 * browser's own scrolling is the right answer. In-page anchors are handled
 * by Lenis so they glide instead of jumping, and still move focus.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      anchors: { offset: 0 },
      autoRaf: true,
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    return () => lenis.destroy();
  }, []);
  return null;
}

/** Scroll to an element, through Lenis when it is running. */
export function scrollToEl(el: Element | null, offset = 0) {
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (lenis && !reduce) lenis.scrollTo(el as HTMLElement, { offset, duration: 1.2 });
  else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}
