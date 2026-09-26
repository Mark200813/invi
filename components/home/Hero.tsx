import Image from 'next/image';
import Link from 'next/link';
import { hero, proofLine } from '@/lib/content';
import s from './Hero.module.css';

/**
 * The opening. The headline rises line by line and the can surfaces out of
 * the dark, in CSS so it runs before any script and never holds text back.
 * Scrolling then hands the frame on (components/site/Motion.tsx).
 *
 * Phase 3 puts the live 3D can in the [data-hero-can] slot; this still stays
 * as the poster it fades in over, and as the fallback.
 */
export default function Hero() {
  const lines = [...hero.titleLines];
  return (
    <section className={`ground-stage ${s.hero}`} aria-labelledby="hero-title" data-hero data-motion-skip>
      <div className={s.glow} aria-hidden data-hero-glow />
      <div className={`wrap ${s.grid}`}>
        <p className={`label ${s.eyebrow}`}>{hero.eyebrow}</p>

        <h1 id="hero-title" className={`display ${s.title}`} data-hero-title>
          {lines.map((l, i) => (
            <span key={l} className={s.line}><span className={s.lineIn} style={{ ['--i' as string]: i }}>{l}</span></span>
          ))}
          <span className={s.line}><span className={s.lineIn} style={{ ['--i' as string]: lines.length }}><em>{hero.titleAccent}</em></span></span>
        </h1>

        <div className={s.can} data-can-slot="hero">
          <div className={s.canInner} data-hero-can>
            <Image data-can-poster className={s.canImg} src="/cans/can-origin-front.webp" alt="The INVI can in its ORIGIN colourway" width={1100} height={1600}
              loading="eager" fetchPriority="high" sizes="(max-width: 899px) 64vw, 46vw" />
          </div>
        </div>

        <div className={s.bottom} data-hero-bottom>
          <p className={`label ${s.proof}`}>
            {proofLine.map((l) => <span key={l}>{l}</span>)}
          </p>
          <div className={s.aside}>
            <p className="lede">{hero.lede}</p>
            <div className={s.actions}>
              <Link href="/#join" className="btn btn--solid">
                <span>{hero.primary}</span><span className="arrow" aria-hidden>↘</span>
              </Link>
              <Link href="/#moments" className={s.cue}>
                <span className={s.cueLine} aria-hidden />{hero.secondary}
              </Link>
            </div>
          </div>
        </div>

        <p className={`small ${s.foot}`}><b>{hero.footnoteLead}</b> {hero.footnote}</p>
      </div>
    </section>
  );
}
