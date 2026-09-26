import Link from 'next/link';
import { joinCta } from '@/lib/content';

export default function NotFound() {
  return (
    <section className="ground-stage" style={{ minHeight: '100svh', display: 'grid', alignItems: 'center' }}>
      <div className="wrap" style={{ display: 'grid', gap: '1.5rem', paddingBlock: 'calc(var(--nav-h) + 3rem) 4rem' }}>
        <p className="label" style={{ color: 'var(--text-2)' }}>404</p>
        {/* [COPY NEEDED] official wording for a missing page; this is a plain placeholder */}
        <h1 className="display t-xl">This page isn’t here.</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link href="/" className="btn"><span>Home</span><span className="arrow" aria-hidden>↗</span></Link>
          <Link href="/#join" className="btn btn--solid"><span>{joinCta}</span><span className="arrow" aria-hidden>↘</span></Link>
        </div>
      </div>
    </section>
  );
}
