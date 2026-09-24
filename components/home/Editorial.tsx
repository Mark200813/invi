import Image from 'next/image';
import { belief, proof, building } from '@/lib/content';
import { Rich } from '@/lib/rich';
import s from './Editorial.module.css';

/** Belief, proof and how we're building it: the part of the page that is
 *  words first. Bone ground, one idea per screen. */
export default function Editorial() {
  return (
    <div className={`ground-bone ${s.editorial}`}>
      <section id="about" className={`wrap ${s.belief}`} aria-labelledby="belief-title">
        <div className={s.beliefCopy}>
          <p className={`label ${s.eyebrow}`}>{belief.eyebrow}</p>
          <h2 id="belief-title" className="display t-xl">
            {belief.title.map((l) => <span key={l} className={s.block}>{l}</span>)}
          </h2>
          <div className={s.beliefBody}>
            {belief.body.map((p) => <p key={p} className="body"><Rich text={p} /></p>)}
          </div>
        </div>
        <figure className={s.beliefPhoto}>
          <Image src="/img/portrait-hoodie.webp" alt={belief.photoAlt} width={900} height={880}
            sizes="(max-width: 899px) 100vw, 40vw" />
        </figure>
      </section>

      <section className={`wrap ${s.creed}`} aria-label="What we believe">
        <hr className="rule" />
        <ul className={s.creedList}>
          {belief.creed.map((c) => <li key={c} className={s.creedLine}><Rich text={c} /></li>)}
        </ul>
      </section>

      <section className={s.shorthand} aria-label={belief.shorthand.join(' ')}>
        <p className={`display ${s.shorthandLine}`} aria-hidden>
          {belief.shorthand.map((w, i) => <span key={w} className={i === 0 ? s.first : undefined}>{w}</span>)}
        </p>
      </section>

      <section className={`wrap ${s.proof}`} aria-labelledby="proof-title">
        <div className={s.proofHead}>
          <p className={`label ${s.eyebrow}`}>{proof.eyebrow}</p>
          <h2 id="proof-title" className="display t-lg">{proof.title}</h2>
        </div>
        <blockquote className={s.quote}>
          <p className="serif">“{proof.quote}”</p>
          <cite className="label">{proof.quoteBy}</cite>
        </blockquote>
        <ul className={s.stats}>
          {proof.stats.map((st) => (
            <li key={st.t} className={s.stat}>
              <p className={`display num ${s.statN}`} data-count={st.v}>{st.v}{st.s}</p>
              <p className={s.statT}>{st.t}</p>
            </li>
          ))}
        </ul>
        <p className="small">{proof.source}</p>
      </section>

      <section className={`wrap ${s.building}`} aria-labelledby="building-title">
        <hr className="rule" />
        <div className={s.buildingHead}>
          <p className={`label ${s.eyebrow}`}>{building.eyebrow}</p>
          <h2 id="building-title" className="display t-lg">{building.title}</h2>
          <p className={s.soon}><b>{building.comingSoon[0]}</b> {building.comingSoon[1]}</p>
        </div>
        <ol className={s.pillars}>
          {building.pillars.map((p) => (
            <li key={p.k} className={s.pillar}>
              <p className="index-n">{p.k}</p>
              <h3 className={`display ${s.pillarTitle}`}>{p.t}</h3>
              <p className="body">{p.d}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
