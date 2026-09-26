import Image from 'next/image';
import { moments } from '@/lib/content';
import s from './Moments.module.css';

/**
 * The three moments, the centrepiece. With motion on, the section pins and
 * the day passes through one frame: the field shifts ORIGIN → RISE → AFTER
 * DARK, the can hands over to the next colourway, the name and the line swap.
 * All of it scrubbed by scroll (components/site/Motion.tsx), so scrolling back
 * plays it backwards. Without motion, or without JavaScript, the same markup
 * reads as three stacked chapters.
 *
 * Phase 3 hands the can in the middle to the live 3D model.
 */
export default function Moments() {
  const total = String(moments.items.length).padStart(2, '0');
  return (
    <section id="moments" className={`ground-stage ${s.moments}`} aria-label="The three moments" data-moments>
      <div className={`wrap ${s.intro}`}>
        <p className={`display t-md ${s.introLine}`}>{moments.intro}</p>
      </div>

      <div className={s.track} data-track data-motion-skip>
        <div className={s.pin} data-pin>
          {moments.items.map((m, i) => (
            <article key={m.key} className={s.act} aria-labelledby={`moment-${m.key}`} data-act={m.key}
              style={{ ['--c1' as string]: m.colours[0], ['--c2' as string]: m.colours[1], ['--c3' as string]: m.colours[2] }}>
              <div className={s.field} aria-hidden data-field />
              <div className={`wrap ${s.stage}`}>
                <header className={s.head} data-head>
                  <p className={`label ${s.index}`}><span className="num">{String(i + 1).padStart(2, '0')}</span> / <span className="num">{total}</span></p>
                  <p className={`label ${s.kicker}`}>{m.kicker}</p>
                </header>

                <div className={s.copy} data-copy>
                  <p className={s.line}>{m.line}</p>
                  <p className={`label ${s.desc}`}>{m.desc}</p>
                </div>

                <div className={s.can} data-can-slot="moment">
                  <div className={s.canInner} data-can>
                    <Image data-can-poster src={m.can} alt={`The INVI can in its ${m.name.toUpperCase()} colourway`} width={1100} height={1600}
                      sizes="(max-width: 899px) 60vw, 36vw" />
                  </div>
                </div>

                <figure className={s.photo} data-photo>
                  <Image src={m.photo.src} alt={m.photo.alt} width={m.photo.w} height={m.photo.h}
                    sizes="(max-width: 899px) 60vw, 22vw" />
                </figure>

                <h2 id={`moment-${m.key}`} className={`display ${s.word}`} data-no-split>
                  <span className={s.wordIn} data-word>{m.name}</span>
                </h2>
              </div>
            </article>
          ))}
          <span className={s.progress} aria-hidden><i data-progress /></span>
        </div>
      </div>
    </section>
  );
}
