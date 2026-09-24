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
  const btn = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const on = () => setStuck(scrollY > 24);
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    addEventListener('keydown', esc);
    document.documentElement.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', esc); document.documentElement.style.overflow = ''; };
  }, [open]);

  return (
    <header className={`${s.bar} ${stuck || pathname !== '/' ? s.stuck : ''} ${open ? s.open : ''}`}>
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
