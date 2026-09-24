'use client';

import { useEffect, useState } from 'react';

/** One polite status line for the whole site. Call flash() from anywhere. */
const EVT = 'invi:flash';

export function flash(message: string, ms = 3200) {
  window.dispatchEvent(new CustomEvent(EVT, { detail: { message, ms } }));
}

export default function Toast() {
  const [msg, setMsg] = useState('');
  const [on, setOn] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const h = (e: Event) => {
      const { message, ms } = (e as CustomEvent).detail;
      setMsg(message); setOn(true);
      clearTimeout(t); t = setTimeout(() => setOn(false), ms);
    };
    window.addEventListener(EVT, h);
    return () => { window.removeEventListener(EVT, h); clearTimeout(t); };
  }, []);
  return (
    <div className={`toast ${on ? 'is-on' : ''}`} role="status" aria-live="polite">
      <span>{msg}</span>
    </div>
  );
}
