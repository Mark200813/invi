import Image from 'next/image';
import { moments } from '@/lib/content';
import s from './Moments.module.css';

/**
 * The three moments. Phase 1 stacks them as three full-screen chapters, each
 * owning its scent's field. Phase 2 pins them into one frame that the day
 * passes through; Phase 3 hands the can in the middle to the live model.
 */
export default function Moments() {
  const total = String(moments.items.length).padStart(2, '0');
  return (
    <section id="moments" className={`ground-stage ${s.moments}`} aria-label="The three moments">
      <div className={`wrap ${s.intro}`}>
        <p className={`display t-md ${s.introLine}`}>{moments.intro}</p>
      </div>

      {moments.items.map((m, i) => (
        <article key={m.key} className={s.act} aria-labelledby={`moment-${m.key}`}
          style={{ ['--c1' as string]: m.colours[0], ['--c2' as string]: m.colours[1], ['--c3' as string]: m.colours[2] }}>
          <div className={s.field} aria-hidden />
          <div className={`wrap ${s.stage}`}>
            <header className={s.head}>
              <p className={`label ${s.index}`}><span className="num">{String(i + 1).padStart(2, '0')}</span> / <span className="num">{total}</span></p>
              <p className={`label ${s.kicker}`}>{m.kicker}</p>
            </header>

            <div className={s.copy}>
              <p className={s.line}>{m.line}</p>
              <p className={`label ${s.desc}`}>{m.desc}</p>
            </div>

            <div className={s.can}>
              <Image src={m.can} alt={`The INVI can in its ${m.name.toUpperCase()} colourway`} width={1100} height={1600}
                sizes="(max-width: 899px) 80vw, 36vw" />
            </div>

            <figure className={s.photo}>
              <Image src={m.photo.src} alt={m.photo.alt} width={m.photo.w} height={m.photo.h}
                sizes="(max-width: 899px) 60vw, 22vw" />
            </figure>

            <h2 id={`moment-${m.key}`} className={`display ${s.word}`}>{m.name}</h2>
          </div>
        </article>
      ))}
    </section>
  );
}
