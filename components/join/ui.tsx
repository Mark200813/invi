'use client';

import { forwardRef, useEffect, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import s from './Join.module.css';

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: ReactNode;
  error?: string;
  help?: ReactNode;
  optional?: string;
  big?: boolean;
};

/** A labelled text input. Errors are tied to the control with
 *  aria-describedby and mirrored onto aria-invalid. */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { id, label, error, help, optional, big = false, className = '', ...rest }, ref,
) {
  const describedBy = [help ? `${id}-help` : '', error ? `${id}-err` : ''].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`${s.field} ${error ? s.bad : ''} ${className}`}>
      <label htmlFor={id} className={`label ${s.fieldLabel}`}>
        {label}{optional && <span className={s.optional}>{optional}</span>}
      </label>
      <input ref={ref} id={id} className={`${s.input} ${big ? s.inputBig : ''}`}
        aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...rest} />
      {help && <p id={`${id}-help`} className={s.help}>{help}</p>}
      <p id={`${id}-err`} className={s.err} aria-live="polite">{error}</p>
    </div>
  );
});

export function Check({ id, checked, onChange, children, error }: {
  id: string; checked: boolean; onChange: (v: boolean) => void; children: ReactNode; error?: string;
}) {
  return (
    <div className={`${s.checkRow} ${error ? s.bad : ''}`}>
      <label className={s.check} htmlFor={id}>
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} />
        <span className={s.box} aria-hidden>
          <svg viewBox="0 0 14 14"><path d="M2 7.4l3.3 3.3L12 3.8" /></svg>
        </span>
        <span className={s.checkText}>{children}</span>
      </label>
      <p id={`${id}-err`} className={s.err} aria-live="polite">{error}</p>
    </div>
  );
}

/** Reference digits that roll into place. The real value sits in a visually
 *  hidden span, so it is what gets read aloud and what gets copied. */
export function Odometer({ value }: { value: string }) {
  const strip = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.querySelectorAll<HTMLElement>('i').forEach((d, i) => {
      d.style.transitionDelay = reduce ? '0ms' : `${i * 85}ms`;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        d.style.transform = `translateY(-${Number(value[i]) * 10}%)`;
      }));
    });
  }, [value]);
  return (
    <span className={s.odo}>
      <span className="vh">{value}</span>
      <span ref={strip} aria-hidden className={s.odoDigits}>
        {[...value].map((_, i) => (
          <span key={i} className={s.odoD}><i>{'0123456789'.split('').map((n) => <b key={n}>{n}</b>)}</i></span>
        ))}
      </span>
    </span>
  );
}
