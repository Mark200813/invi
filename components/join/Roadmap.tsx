'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { roadmap, type RoadmapKey } from '@/lib/content';
import { readCrew, setCrew, useCrew } from '@/lib/store';
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
  const closingRef = useRef<HTMLParagraphElement>(null);
  const justLocked = useRef(false);
  const busy = useRef(false);
  const chosen = crew.confirmed ? crew.vote : pick;

  useEffect(() => { if (pick) confirmBtn.current?.focus({ preventScroll: true }); }, [pick]);
  // "Start again" here or in another tab: an unconfirmed pick goes with it
  useEffect(() => { if (!crew.joined) setPick(null); }, [crew.joined]);
  // the Confirm button goes away once the vote locks: focus moves to the result
  useEffect(() => {
    if (crew.confirmed && justLocked.current) { justLocked.current = false; closingRef.current?.focus({ preventScroll: true }); }
  }, [crew.confirmed]);

  function choose(k: RoadmapKey) {
    if (crew.confirmed || busy.current) return;
    if (!crew.joined) {
      flash(roadmap.joinFirst);
      scrollToEl(document.getElementById('join'));
      // the join flow's current question (age first, or wherever they left off)
      setTimeout(() => document.querySelector<HTMLElement>('#join form input:not([type=hidden]), #join form [role=radio]')?.focus({ preventScroll: true }), 900);
      return;
    }
    setPick(k);
  }

  async function confirm() {
    if (!pick || crew.confirmed || busy.current) return;
    // another tab may have voted a moment ago
    const latest = readCrew();
    if (latest.confirmed || !latest.joined) return;
    busy.current = true;
    setLocking(true);
    try {
      await submitVote({ vote: pick, ref: crew.ref });
      justLocked.current = true;
      setCrew({ vote: pick, confirmed: true });
      flash(`${LABEL[pick]}. ${roadmap.lockedIn}`);
    } finally {
      busy.current = false;
      setLocking(false);
    }
  }

  return (
    <section id="roadmap" className={`ground-stage ${s.roadmap}`} aria-labelledby="roadmap-title">
      <div className={`wrap ${s.roadmapHead}`}>
        <div className={s.roadmapTitle}>
          <p className={`label ${s.eyebrow}`}>{roadmap.eyebrow}</p>
          <h2 id="roadmap-title" className="display t-xl" data-no-split>{roadmap.title}</h2>
        </div>
        <div className={s.roadmapAside}>
          <p className="lede">{roadmap.body}</p>
          <p className={`label ${s.eyebrow}`}>{roadmap.oneVote}</p>
        </div>
        <figure className={s.roadmapPhoto} data-parallax="14">
          <Image src="/img/go-try.webp" alt="A boy crossing a city street holding a hand-written sign that reads GO TRY INVI"
            width={1122} height={1402} sizes="(max-width: 899px) 60vw, 22vw" />
        </figure>
      </div>

      {/* one box for the cards and the confirm bar, so the bar can stick
          to the bottom of the screen for as long as the cards are in view */}
      <div className={s.voteArea}>
      <ol className={`wrap ${s.votes}`} aria-label={roadmap.title}>
        {roadmap.items.map((r) => {
          const mine = chosen === r.key;
          const locked = crew.confirmed && !mine;
          return (
            <li key={r.key}>
              <button type="button"
                className={`${s.vote} ${mine ? s.voteOn : ''} ${locked ? s.voteOff : ''} ${crew.confirmed && mine ? s.voteLocked : ''}`}
                aria-pressed={crew.joined ? mine : undefined}
                aria-disabled={locked || locking || undefined}
                disabled={locked || locking}
                onClick={() => choose(r.key)}>
                <span className="index-n num">{r.n}</span>
                <span className={`display ${s.voteTitle}`} data-no-split>{r.t}</span>
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

      <div className={s.after}>
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
          <p ref={closingRef} tabIndex={-1} className={`display t-md ${s.closing}`} role="status" data-no-split>
            {roadmap.closing}
          </p>
        )}
      </div>
      </div>
    </section>
  );
}
