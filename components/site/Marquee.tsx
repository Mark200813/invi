'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { getLenis } from './SmoothScroll';
import s from './Marquee.module.css';

/**
 * An endless line of official copy. It drifts on its own, picks up speed with
 * the scroll and turns to follow the scroll's direction. It stops when off
 * screen, and under reduced motion it is simply a still line of type.
 */
export default function Marquee({ items, label }: { items: { text: string; serif?: boolean }[]; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current, box = root.current;
    if (!el || !box || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    box.dataset.moving = 'true';
    let x = 0, dir = -1, visible = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(box);
    const tick = (_t: number, dt: number) => {
      if (!visible) return;
      const v = getLenis()?.velocity ?? 0;
      if (Math.abs(v) > 0.2) dir = v > 0 ? -1 : 1;
      const speed = 0.7 + Math.min(Math.abs(v) * 0.4, 14);
      x += dir * speed * (dt / 16.67);
      const half = el.scrollWidth / 2;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); io.disconnect(); delete box.dataset.moving; el.style.transform = ''; };
  }, []);

  const run = (key: string) => (
    <span className={s.run} key={key}>
      {items.map((it, i) => (
        <span key={i} className={`${s.item} ${it.serif ? s.serif : ''}`}>
          {it.text}<span className={s.sep} aria-hidden />
        </span>
      ))}
    </span>
  );

  return (
    <div className={s.marquee} ref={root} role="img" aria-label={label} data-motion-skip>
      <div className={`display ${s.track}`} ref={track} aria-hidden data-no-split>
        {run('a')}{run('b')}
      </div>
    </div>
  );
}
