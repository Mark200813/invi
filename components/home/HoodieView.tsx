'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import s from './Crew.module.css';

const SRC = '/img/founding-hoodie.webp';
const W = 1254, H = 858;       // the image's own pixels (front and back side by side)
const LOUPE = 170;             // the magnifier's diameter, CSS px

/**
 * The Founding hoodie, front and back. The designs are embossed, which a
 * flat photo at page size can't show, so on a desktop a loupe follows the
 * cursor and shows the fabric at the photo's full resolution: the raised
 * INVI marks and the contour lines read as relief up close. Phones and
 * touch screens get the photo on its own.
 */
export default function HoodieView({ alt, hint, labels }: { alt: string; hint: string; labels: [string, string] }) {
  const box = useRef<HTMLDivElement>(null);
  const loupe = useRef<HTMLDivElement>(null);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = matchMedia('(hover: hover) and (pointer: fine)');
    const set = () => setFine(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  useEffect(() => {
    const el = box.current, lp = loupe.current;
    if (!fine || !el || !lp) return;
    let raf = 0, x = 0, y = 0, r: DOMRect | null = null;
    const draw = () => {
      raf = 0;
      if (!r) return;
      // 1:1 with the photo's own pixels (never upscaled past them)
      const z = Math.max(1.5, W / r.width);
      lp.style.transform = `translate3d(${x - LOUPE / 2}px, ${y - LOUPE / 2}px, 0)`;
      lp.style.backgroundSize = `${r.width * z}px ${r.height * z}px`;
      lp.style.backgroundPosition = `${-(x * z - LOUPE / 2)}px ${-(y * z - LOUPE / 2)}px`;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      r = el.getBoundingClientRect();
      x = e.clientX - r.left; y = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const enter = (e: PointerEvent) => { if (e.pointerType === 'mouse') { el.dataset.loupe = 'on'; move(e); } };
    const leave = () => { delete el.dataset.loupe; };
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [fine]);

  return (
    <figure className={s.hoodie}>
      <figcaption className={s.hoodieLabels}>
        <span className="label">{labels[0]}</span>
        <span className="label">{labels[1]}</span>
      </figcaption>
      <div ref={box} className={s.hoodieBox} style={fine ? { cursor: 'zoom-in' } : undefined}>
        <Image src={SRC} alt={alt} width={W} height={H} sizes="(max-width: 899px) 100vw, 56vw" />
        {fine && <div ref={loupe} className={s.loupe} aria-hidden style={{ backgroundImage: `url(${SRC})`, width: LOUPE, height: LOUPE }} />}
      </div>
      {fine && <p className={`small ${s.hoodieHint}`}>{hint}</p>}
    </figure>
  );
}
