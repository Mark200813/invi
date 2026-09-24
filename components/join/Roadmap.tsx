'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { roadmap, type RoadmapKey } from '@/lib/content';
import { setCrew, useCrew } from '@/lib/store';
import { submitVote } from '@/lib/submit';
import { flash } from '@/components/site/Toast';
import { scrollToEl } from '@/components/site/SmoothScroll';
import s from './Join.module.css';

const LABEL = Object.fromEntries(roadmap.items.map((r) => [r.key, r.t])) as Record<RoadmapKey, string>;

/**
 * What should we make next? One vote per member, and once it's in it's
 * locked: the same rule the scent vote had. No tally is shown until a real
 * one exists; the page only ever states the reader's own pick.
 */
export default function Roadmap() {
  const crew = useCrew();
  const [pick, setPick] = useState<RoadmapKey | null>(null);
  const [locking, setLocking] = useState(false);
  const confirmBtn = useRef<HTMLButtonElement>(null);
  const chosen = crew.confirmed ? crew.vote : pick;

  useEffect(() => { if (pick) confirmBtn.current?.focus({ preventScroll: true }); }, [pick]);

  function choose(k: RoadmapKey) {
    if (crew.confirmed) return;
    if (!crew.joined) {
      flash(roadmap.joinFirst);
      scrollToEl(document.getElementById('join'));
      setTimeout(() => document.getElementById('join-name')?.focus({ preventScroll: true }), 900);
      return;
    }
    setPick(k);
  }

  async function confirm() {
    if (!pick || crew.confirmed) return;
    setLocking(true);
    await submitVote({ vote: pick, ref: crew.ref });
    setCrew({ vote: pick, confirmed: true });
    setLocking(false);
    flash(`${LABEL[pick]}. ${roadmap.lockedIn}`);
  }

  return (
    <section id="roadmap" className={`ground-stage ${s.roadmap}`} aria-labelledby="roadmap-title">
      <div className={`wrap ${s.roadmapHead}`}>
        <div className={s.roadmapTitle}>
          <p className={`label ${s.eyebrow}`}>{roadmap.eyebrow}</p>
          <h2 id="roadmap-title" className="display t-xl">{roadmap.title}</h2>
        </div>
        <div className={s.roadmapAside}>
          <p className="lede">{roadmap.body}</p>
          <p className={`label ${s.eyebrow}`}>{roadmap.oneVote}</p>
        </div>
        <figure className={s.roadmapPhoto}>
          <Image src="/img/go-try.webp" alt="A boy crossing a city street holding a hand-written sign that reads GO TRY INVI"
            width={1122} height={1402} sizes="(max-width: 899px) 60vw, 22vw" />
        </figure>
      </div>

      <ol className={`wrap ${s.votes}`} aria-label={roadmap.title}>
        {roadmap.items.map((r) => {
          const mine = chosen === r.key;
          const locked = crew.confirmed && !mine;
          return (
            <li key={r.key}>
              <button type="button"
                className={`${s.vote} ${mine ? s.voteOn : ''} ${locked ? s.voteOff : ''}`}
                aria-pressed={crew.joined ? mine : undefined}
                aria-disabled={locked || undefined}
                disabled={locked}
                onClick={() => choose(r.key)}>
                <span className="index-n num">{r.n}</span>
                <span className={`display ${s.voteTitle}`}>{r.t}</span>
                <span className={s.voteDesc}>{r.d}</span>
                <span className={`label ${s.voteCta}`}>
                  {crew.confirmed
                    ? (mine ? `${roadmap.yourPick} · ${roadmap.lockedIn}` : '')
                    : crew.joined
                      ? (mine ? roadmap.yourPick : '')
                      : <>{roadmap.locked} <span aria-hidden>↗</span></>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="wrap">
        {pick && !crew.confirmed && (
          <div className={s.confirm} role="group" aria-label={roadmap.confirm}>
            <div>
              <p className={s.confirmPick}>{roadmap.picked} <b>{LABEL[pick]}</b>.</p>
              <p className={s.help}>{roadmap.warn}</p>
            </div>
            <button ref={confirmBtn} type="button" className="btn btn--solid" onClick={confirm} disabled={locking}>
              <span>{roadmap.confirm}</span><span className="arrow" aria-hidden>→</span>
            </button>
          </div>
        )}
        {crew.confirmed && crew.vote && (
          <p className={`display t-md ${s.closing}`} role="status">
            {roadmap.closing}
          </p>
        )}
      </div>
    </section>
  );
}
