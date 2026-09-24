import Image from 'next/image';
import Link from 'next/link';
import { hero, proofLine } from '@/lib/content';
import s from './Hero.module.css';

/**
 * Phase 1: the can is a still rendered from the Can Studio model. In Phase 3
 * the live 3D can takes this exact slot, and this image stays as the poster
 * it fades in over (and the fallback without WebGL or with reduced motion).
 */
export default function Hero() {
  return (
    <section className={`ground-stage ${s.hero}`} aria-labelledby="hero-title">
      <div className={s.glow} aria-hidden />
      <div className={`wrap ${s.grid}`}>
        <p className={`label ${s.eyebrow}`}>{hero.eyebrow}</p>

        <h1 id="hero-title" className={`display ${s.title}`}>
          {hero.titleLines.map((l) => <span key={l} className={s.line}>{l}</span>)}
          <span className={s.line}><em>{hero.titleAccent}</em></span>
        </h1>

        <div className={s.can}>
          <Image src="/cans/can-origin-front.webp" alt="The INVI can in its ORIGIN colourway" width={1100} height={1600}
            priority sizes="(max-width: 899px) 90vw, 46vw" />
        </div>

        <div className={s.bottom}>
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
