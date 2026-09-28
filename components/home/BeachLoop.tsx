'use client';

import { useEffect, useRef } from 'react';
import s from './Product.module.css';

/**
 * The beach clip: always playing, no controls [mark]. It is muted and inline,
 * which is what lets phones autoplay it. Nothing is fetched until it is two
 * screens away, and it only runs while on screen (off screen it pauses, to
 * spare the battery, and resumes as it comes back). Reduced motion, a
 * setting people turn on deliberately, keeps the still poster.
 */
export default function BeachLoop({ lines, label }: { lines: string[]; label: string }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    v.muted = true;
    const play = () => { v.play().catch(() => {}); };
    const warm = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      v.preload = 'auto';
      v.load();
      warm.disconnect();
    }, { rootMargin: '0px 0px 200% 0px' });
    const view = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) play(); else v.pause();
    }, { threshold: 0.15 });
    // iOS may hold autoplay until the page has been touched once
    const nudge = () => { if (v.paused && v.getBoundingClientRect().top < innerHeight) play(); };
    addEventListener('touchstart', nudge, { passive: true });
    warm.observe(v); view.observe(v);
    return () => { warm.disconnect(); view.disconnect(); removeEventListener('touchstart', nudge); };
  }, []);

  return (
    <figure className={s.loop}>
      <video ref={video} className={s.loopMedia} muted loop playsInline autoPlay preload="none"
        disablePictureInPicture disableRemotePlayback
        poster="/img/beach-loop-poster.webp" aria-label={label}>
        <source src="/img/beach-loop.mp4" type="video/mp4" />
      </video>
      <figcaption className={`display t-xl ${s.loopLine}`}>
        {lines.map((l) => <span key={l} className={s.block}>{l} </span>)}
      </figcaption>
    </figure>
  );
}
