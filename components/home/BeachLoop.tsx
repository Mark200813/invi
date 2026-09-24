'use client';

import { useEffect, useRef, useState } from 'react';
import s from './Product.module.css';

/**
 * The beach clip. Nothing is fetched until it is two screens away, it plays
 * only while on screen, and there is always a control to stop it (the loop
 * runs past five seconds, so WCAG 2.2.2 applies). Once stopped by hand it
 * stays stopped. Reduced motion gets the poster.
 */
export default function BeachLoop({ lines, label }: { lines: string[]; label: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(reduce);
    if (reduce) return;
    v.muted = true;
    const warm = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      v.preload = 'auto';
      warm.disconnect();
    }, { rootMargin: '0px 0px 200% 0px' });
    const view = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !userPaused.current) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.2 });
    warm.observe(v); view.observe(v);
    const on = () => setPlaying(!v.paused);
    v.addEventListener('play', on); v.addEventListener('pause', on);
    return () => { warm.disconnect(); view.disconnect(); v.removeEventListener('play', on); v.removeEventListener('pause', on); };
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { userPaused.current = false; v.play().catch(() => {}); }
    else { userPaused.current = true; v.pause(); }
  };

  return (
    <figure className={s.loop}>
      <video ref={video} className={s.loopMedia} muted loop playsInline preload="none"
        poster="/img/beach-loop-poster.webp" aria-label={label}>
        <source src="/img/beach-loop.mp4" type="video/mp4" />
      </video>
      <figcaption className={`display t-xl ${s.loopLine}`}>
        {lines.map((l) => <span key={l} className={s.block}>{l}</span>)}
      </figcaption>
      {!reduced && (
        <button type="button" className={s.loopBtn} onClick={toggle}
          aria-label={`${playing ? 'Pause' : 'Play'} the background clip`}>
          {playing ? 'Pause' : 'Play'}
        </button>
      )}
    </figure>
  );
}
