'use client';

import { useState } from 'react';
import { letsTalk as t } from '@/lib/content';
import s from './lets-talk.module.css';

export default function Topics() {
  const [cat, setCat] = useState<string | null>(null);
  const shown = t.topics.map((x, i) => ({ ...x, n: String(i + 1).padStart(2, '0') }))
    .filter((x) => !cat || x.c.includes(cat));

  return (
    <>
      <div className={s.filters} role="group" aria-label="Filter topics">
        {[null, ...t.categories].map((c) => (
          <button key={c ?? 'all'} type="button" aria-pressed={cat === c}
            className={`${s.filter} ${cat === c ? s.filterOn : ''}`} onClick={() => setCat(c)}>
            {c ?? t.all}
          </button>
        ))}
      </div>
      <p className="vh" aria-live="polite">{shown.length} topics</p>
      <ol className={s.list}>
        {shown.map((x) => (
          <li key={x.t} className={s.topic}>
            <p className="index-n num">{x.n}</p>
            <p className={`label ${s.cats}`}>{x.c.join(' · ')}</p>
            <h3 className={`display ${s.topicTitle}`}>{x.t}</h3>
            <p className={`label ${s.soon}`}>{t.soon}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
