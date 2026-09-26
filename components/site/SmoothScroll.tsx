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
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    (window as LenisWindow).__lenis = lenis;
    // nothing moves under the intro curtain
    const release = () => lenis.start();
    if (document.documentElement.classList.contains('intro-on')) {
      lenis.stop();
      addEventListener('invi:intro-done', release, { once: true });
    }

    // Same-page links (#join, /#product...) glide through Lenis. Left to the
    // router, its native jump and the smooth scroll fight and land short.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank') return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      // keep the router out of it too, or its own jump lands on top of ours
      e.stopPropagation();
      history.pushState(null, '', url.hash);
      window.dispatchEvent(new CustomEvent('invi:anchor', { detail: url.hash }));
      lenis.scrollTo(absTop(el), { duration: 1.4 });
      // move focus with the view, without a second jump
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    };
    document.addEventListener('click', onClick, true);
    return () => {
      removeEventListener('invi:intro-done', release);
      document.removeEventListener('click', onClick, true);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as LenisWindow).__lenis;
    };
  }, []);
  return null;
}

/** Where an element sits in the document, measured against the real scroll
 *  position: Lenis's own figure can lag a native scroll by a frame. */
const absTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

export const getLenis = () => (typeof window === 'undefined' ? undefined : (window as LenisWindow).__lenis);

/** Scroll to an element, through Lenis when it is running. */
export function scrollToEl(el: Element | null, offset = 0) {
  if (!el) return;
  const lenis = getLenis();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (lenis && !reduce) lenis.scrollTo(absTop(el) + offset, { duration: 1.2 });
  else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}
