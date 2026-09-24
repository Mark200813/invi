import Link from 'next/link';
import { footer, proofLine, nav } from '@/lib/content';
import { DEMO_MODE } from '@/lib/config';
import Wordmark from './Wordmark';
import s from './SiteFooter.module.css';

export default function SiteFooter() {
  return (
    <footer className={s.foot}>
      <div className="wrap">
        <div className={s.top}>
          <p className={`display ${s.proof}`}>
            {proofLine.map((l) => <span key={l}>{l}</span>)}
          </p>
          <div className={s.cols}>
            <nav aria-label="Site">
              <ul className={s.list}>
                <li><Link href="/">Home</Link></li>
                {nav.map((n) => <li key={n.href}><Link href={n.href}>{n.label}</Link></li>)}
              </ul>
            </nav>
            <nav aria-label="Legal and contact">
              <ul className={s.list}>
                {footer.links.map((l) => (
                  <li key={l.href}>{l.href.startsWith('mailto:') ? <a href={l.href}>{l.label}</a> : <Link href={l.href}>{l.label}</Link>}</li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <Wordmark className={s.big} label={false} />
        <div className={s.legal}>
          <p>{footer.legal}</p>
          <p>{footer.preSale}</p>
          {DEMO_MODE && <p className={s.demo}>Preview build. Forms run in demo mode: nothing you enter is sent anywhere.</p>}
        </div>
      </div>
    </footer>
  );
}
