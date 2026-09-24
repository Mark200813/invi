import Image from 'next/image';
import Link from 'next/link';
import { crew, build, joinCta } from '@/lib/content';
import { APPLICATIONS_OPEN } from '@/lib/config';
import Wordmark from '@/components/site/Wordmark';
import ApplicationForm from '@/components/join/ApplicationForm';
import s from './Crew.module.css';

export default function Crew() {
  return (
    <div className={`ground-stage ${s.crew}`}>
      <section id="crew" aria-labelledby="crew-title">
        <figure className={s.hero}>
          <Image src="/img/crew-wall.webp" alt={crew.photoAlt} width={1586} height={992} sizes="100vw" />
          <figcaption className={`wrap ${s.heroCopy}`}>
            <p className="label">{crew.eyebrow}</p>
            <h2 id="crew-title" className="display t-xl">
              {crew.title.map((l) => <span key={l} className={s.block}>{l}</span>)}
            </h2>
          </figcaption>
        </figure>

        <div className={`wrap ${s.closer}`}>
          <p className={`display t-md ${s.sub}`}>{crew.sub}</p>
          <div className={s.closerCopy}>
            <p className={`label ${s.eyebrow}`}>{crew.closer.eyebrow}</p>
            <h3 className={`display ${s.closerTitle}`}>{crew.closer.title}</h3>
            {crew.closer.body.map((p) => <p key={p} className="body">{p}</p>)}
          </div>
        </div>

        <ol className={`wrap ${s.benefits}`}>
          {crew.benefits.map((b) => (
            <li key={b.n} className={s.benefit}>
              <p className="index-n num">{b.n}</p>
              <h3 className={`display ${s.benefitTitle}`}>{b.t}</h3>
              <p className="body">{b.d}</p>
            </li>
          ))}
        </ol>

        <div className={`wrap ${s.founding}`}>
          <div className={s.foundingCopy}>
            <p className={`label ${s.eyebrow}`}>{crew.founding.eyebrow}</p>
            <h3 className="display t-lg">
              {crew.founding.title.map((l) => <span key={l} className={s.block}>{l}</span>)}
            </h3>
            <p className="body">{crew.founding.body}</p>
            <p className="body">{crew.founding.hoodie}</p>
            <Link href="/#join" className="btn btn--solid">
              <span>{joinCta}</span><span className="arrow" aria-hidden>↘</span>
            </Link>
          </div>
          {/* The Founder Card: an object, not a claim. No number is printed
              on it because none has been issued yet. */}
          <div className={s.card} aria-hidden>
            <div className={s.cardTop}>
              <Wordmark label={false} className={s.cardMark} />
              <span className="label">{crew.founding.cardLabel}</span>
            </div>
            <div className={s.cardNum}>
              <span className="label">Nº</span>
              <span className={`display ${s.cardDigits}`}>— / 100</span>
            </div>
          </div>
        </div>
      </section>

      <section id="build" className={s.build} aria-labelledby="build-title">
        <div className={`wrap ${s.buildGrid}`}>
          <div className={s.buildHead}>
            <p className={`label ${s.eyebrow}`}>{build.eyebrow}</p>
            <h2 id="build-title" className="display t-xl">
              {build.title.map((l) => <span key={l} className={s.block}>{l}</span>)}
            </h2>
          </div>
          <figure className={s.buildPhoto}>
            <Image src="/img/city-sunset.webp" alt="A boy walking down a city street at sunset" width={736} height={981}
              sizes="(max-width: 899px) 70vw, 28vw" />
          </figure>
          <div className={s.buildCopy}>
            <p className="lede">{build.body}</p>
            <div>
              <h3 className={`display ${s.liveTitle}`}>{build.live.title}</h3>
              <p className="body">{build.live.body}</p>
            </div>
          </div>
        </div>

        <ol className={`wrap ${s.steps}`}>
          {build.steps.map((st) => (
            <li key={st.n} className={s.step}>
              <p className="index-n num">{st.n}</p>
              <h3 className={`display ${s.benefitTitle}`}>{st.t}</h3>
              <p className="body">{st.d}</p>
            </li>
          ))}
        </ol>

        <div className={`wrap ${s.status}`}>
          <p className={s.safeguard}><b>{build.safeguardLead}</b> {build.safeguard}</p>
          {APPLICATIONS_OPEN ? (
            <ApplicationForm />
          ) : (
            <div className={s.closed}>
              <p className={`label ${s.closedTag}`}><span className={s.dot} aria-hidden />{build.closedTag}</p>
              <p className={`display t-md ${s.closedText}`}>{build.closed}</p>
              <Link href="/#join" className="btn btn--solid">
                <span>{joinCta}</span><span className="arrow" aria-hidden>↘</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
