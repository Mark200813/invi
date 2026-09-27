import Image from 'next/image';
import Link from 'next/link';
import { hero } from '@/lib/content';
import s from './Hero.module.css';

/**
 * The opening, kept to what matters: the headline, the can, and the one call
 * that is time-sensitive, the Founding Crew being open. The headline rises
 * line by line and the can surfaces out of the dark, in CSS so it runs before
 * any script and never holds text back. Scrolling then hands the frame on
 * (components/site/Motion.tsx).
 *
 * The live 3D can takes over the [data-hero-can] slot; this still stays as
 * the poster it fades in over, and as the fallback.
 */
export default function Hero() {
  const lines = [...hero.titleLines];
  return (
    <section className={`ground-stage ${s.hero}`} aria-labelledby="hero-title" data-hero data-motion-skip>
      <div className={s.glow} aria-hidden data-hero-glow />
      <div className={`wrap ${s.grid}`}>
        <h1 id="hero-title" className={`display ${s.title}`} data-hero-title>
          {lines.map((l, i) => (
            <span key={l} className={s.line}><span className={s.lineIn} style={{ ['--i' as string]: i }}>{l} </span></span>
          ))}
          <span className={s.line}><span className={s.lineIn} style={{ ['--i' as string]: lines.length }}><em>{hero.titleAccent}</em></span></span>
        </h1>

        <div className={s.can} data-can-slot="hero">
          <div className={s.canInner} data-hero-can>
            <Image data-can-poster className={s.canImg} src="/cans/can-origin-front.webp" alt="The INVI can in its ORIGIN colourway" width={1100} height={1600}
              loading="eager" fetchPriority="high" sizes="(max-width: 899px) 64vw, 46vw" />
          </div>
        </div>

        {/* The Founding Crew call: a live status, not a footnote. The whole
            card is the link, so it needs no second "Join the Crew" button. */}
        <Link href="/#join" className={s.founding} data-hero-bottom>
          <span className={s.foundingTag}>
            <span className={s.live} aria-hidden />
            <span className="label">{hero.footnoteLead.replace(/\.$/, '')}</span>
          </span>
          <span className={s.foundingText}>{hero.footnote}</span>
          <span className={s.foundingGo} aria-hidden>↘</span>
        </Link>
      </div>
    </section>
  );
}
