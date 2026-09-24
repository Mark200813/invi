'use client';

import { useEffect, useRef, useState } from 'react';
import { counter } from '@/lib/content';
import { CREW_COUNT } from '@/lib/config';

/**
 * Boys in the Crew. Shows the placeholder until a real figure is passed in;
 * when the figure changes it counts up from where it was, so a new join is
 * felt without ever inventing a number.
 */
export default function CrewCounter({ value = CREW_COUNT, className = '' }: { value?: number | null; className?: string }) {
  const [shown, setShown] = useState(value ?? 0);
  const from = useRef(value ?? 0);

  useEffect(() => {
    if (value == null) return;
    const start = from.current, end = value;
    from.current = value;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || start === end) { setShown(end); return; }
    const t0 = performance.now(), ms = 1100;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min((now - t0) / ms, 1), e = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(start + (end - start) * e));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const placeholder = value == null;
  return (
    <p className={`crew-count ${placeholder ? 'is-placeholder' : ''} ${className}`} title={placeholder ? counter.placeholderNote : undefined}>
      <span className="crew-count-n num" aria-hidden={placeholder || undefined}>
        {placeholder ? counter.placeholder : shown.toLocaleString('en-GB')}
      </span>
      <span className="crew-count-l">{counter.label}</span>
      {placeholder && <span className="vh">({counter.placeholderNote})</span>}
    </p>
  );
}
