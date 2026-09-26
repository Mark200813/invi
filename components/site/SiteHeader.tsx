'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { nav, joinCta } from '@/lib/content';
import Wordmark from './Wordmark';
import CrewCounter from './CrewCounter';
import s from './SiteHeader.module.css';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [away, setAway] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let last = scrollY;
    const on = () => {
      const y = scrollY;
      setStuck(y > 24);
      // tuck away while reading down, come back the moment you scroll up
      if (Math.abs(y - last) > 6) { setAway(y > last && y > innerHeight * 0.6); last = y; }
    };
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);
  // in-page links are handled before React sees the click (SmoothScroll),
  // so the menu hears about them here
  useEffect(() => {
    const close = () => setOpen(false);
    addEventListener('invi:anchor', close);
    return () => removeEventListener('invi:anchor', close);
  }, []);

  useEffect(() => {
    if (!open) return;
    const menu = document.getElementById('menu');
    const focusables = () => [btn.current, ...(menu?.querySelectorAll<HTMLElement>('a, button') ?? [])].filter(Boolean) as HTMLElement[];
    requestAnimationFrame(() => menu?.querySelector<HTMLElement>('a')?.focus());
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); return; }
      // keep Tab inside the open menu (the toggle included, so it can be closed)
      if (e.key !== 'Tab') return;
      const f = focusables(), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    addEventListener('keydown', esc);
    document.documentElement.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', esc); document.documentElement.style.overflow = ''; };
  }, [open]);

  return (
    <header className={`${s.bar} ${stuck || pathname !== '/' ? s.stuck : ''} ${open ? s.open : ''} ${away && !open ? s.away : ''}`}>
      <div className={s.inner}>
        <Link href="/" className={s.mark} aria-label="INVI, home">
          <Wordmark label={false} className={s.wm} />
        </Link>

        <nav className={s.nav} aria-label="Main">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={s.navLink}
              aria-current={pathname === n.href ? 'page' : undefined}>{n.label}</Link>
          ))}
        </nav>

        <div className={s.right}>
          <CrewCounter className={s.count} />
          <Link href="/#join" className={`btn btn--solid ${s.cta}`}>
            <span>{joinCta}</span><span className="arrow" aria-hidden>↘</span>
          </Link>
          <button ref={btn} type="button" className={s.toggle} aria-expanded={open} aria-controls="menu"
            onClick={() => setOpen((o) => !o)}>
            <span className={s.bars} aria-hidden />
            <span>Menu</span>
          </button>
        </div>
      </div>

      <div id="menu" className={s.menu} hidden={!open}>
        <nav aria-label="Menu" className={s.menuNav}>
          {nav.map((n, i) => (
            <Link key={n.href} href={n.href} className={`display ${s.menuLink}`} style={{ ['--i' as string]: i }}
              onClick={() => setOpen(false)}>{n.label}</Link>
          ))}
        </nav>
        <div className={s.menuFoot}>
          <CrewCounter />
          <Link href="/#join" className="btn btn--solid" onClick={() => setOpen(false)}>
            <span>{joinCta}</span><span className="arrow" aria-hidden>↘</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
