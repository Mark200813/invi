import type { Metadata } from 'next';
import Image from 'next/image';
import { letsTalk as t } from '@/lib/content';
import Topics from './Topics';
import s from './lets-talk.module.css';

export const metadata: Metadata = { title: 'Let’s Talk | INVI' };

export default function LetsTalk() {
  return (
    <div className={`ground-stage ${s.page}`}>
      <header className={`wrap ${s.head}`}>
        <p className={`label ${s.eyebrow}`}>{t.eyebrow}</p>
        <h1 className="display t-mega">
          {t.title.map((l, i) => <span key={l} className={s.block}>{i === 1 ? <em>{l}</em> : l}</span>)}
        </h1>
        <p className={`lede ${s.lede}`}>{t.body}</p>
      </header>

      <section className={`wrap ${s.intern}`} aria-labelledby="intern-title">
        <figure className={s.internPhoto}>
          <Image src="/img/crew-court.webp" alt="Four friends on a coastal basketball court at sunset" width={1440} height={810}
            sizes="(max-width: 899px) 100vw, 55vw" priority />
        </figure>
        <div className={s.internCopy}>
          <p className={`label ${s.eyebrow}`}>{t.internship.eyebrow}</p>
          <h2 id="intern-title" className="display t-lg">
            {t.internship.title.map((l) => <span key={l} className={s.block}>{l}</span>)}
          </h2>
          <p className="body">{t.internship.body}</p>
          <ul className={s.tags}>{t.internship.tags.map((x) => <li key={x} className="label">{x}</li>)}</ul>
          <button type="button" className="btn" aria-disabled="true" disabled>
            <span>{t.internship.cta}</span>
          </button>
        </div>
      </section>

      <section className={`wrap ${s.topics}`} aria-labelledby="topics-title">
        <div className={s.topicsHead}>
          <h2 id="topics-title" className="display t-lg">{t.topicsTitle}</h2>
          <p className="body">{t.topicsBody}</p>
        </div>
        <Topics />
      </section>
    </div>
  );
}
