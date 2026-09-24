import Image from 'next/image';
import Link from 'next/link';
import type { InfoPage as Info } from '@/lib/content';
import { joinCta } from '@/lib/content';
import s from './InfoPage.module.css';

/** The calm pages parents read: For Parents, Safeguarding, Privacy, Terms. */
export default function InfoPage({ page, photo }: { page: Info; photo?: { src: string; w: number; h: number; alt: string } }) {
  return (
    <div className={`ground-bone ${s.page}`}>
      <header className={`wrap ${s.head}`}>
        <p className={`label ${s.eyebrow}`}>{page.eyebrow}</p>
        <h1 className={`display t-xl ${s.title}`}>
          {page.title.map((l) => <span key={l} className={s.block}>{l}</span>)}
        </h1>
        {page.intro.map((p) => <p key={p} className={`lede ${s.intro}`}>{p}</p>)}
      </header>

      {photo && (
        <figure className={`wrap ${s.photo}`}>
          <Image src={photo.src} alt={photo.alt} width={photo.w} height={photo.h} sizes="(max-width: 899px) 100vw, 40vw" priority />
        </figure>
      )}

      <div className={`wrap ${s.sections}`}>
        {page.sections.map((sec) => (
          <section key={sec.title} className={s.section} aria-labelledby={slug(sec.title)}>
            {sec.n && <p className={`index-n ${s.n}`}>{sec.n}</p>}
            <h2 id={slug(sec.title)} className={`display ${s.secTitle}`}>{sec.title}</h2>
            <div className={s.secBody}>
              {sec.body.map((p) => <p key={p} className="body">{p}</p>)}
            </div>
          </section>
        ))}

        {page.closing && (
          <section className={`${s.section} ${s.closing}`} aria-labelledby="closing">
            <h2 id="closing" className={`display ${s.secTitle}`}>{page.closing.title}</h2>
            <div className={s.secBody}>
              {page.closing.body.map((p) => <p key={p} className="body">{linkify(p)}</p>)}
            </div>
          </section>
        )}

        <div className={s.foot}>
          {page.link && (
            <Link href={page.link.href} className="btn">
              <span>{page.link.label}</span><span className="arrow" aria-hidden>↗</span>
            </Link>
          )}
          <Link href="/#join" className="btn btn--solid">
            <span>{joinCta}</span><span className="arrow" aria-hidden>↘</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-');

/** Turns the contact address in a line of copy into a mailto link. */
function linkify(text: string) {
  const m = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
  if (!m) return text;
  const [before, after] = [text.slice(0, m.index), text.slice((m.index ?? 0) + m[0].length)];
  return <>{before}<a className="link" href={`mailto:${m[0]}`}>{m[0]}</a>{after}</>;
}
