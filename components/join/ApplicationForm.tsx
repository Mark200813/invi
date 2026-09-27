'use client';

import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { application as a } from '@/lib/content';
import { submitApplication } from '@/lib/submit';
import { cleanEmail, cleanName, cleanText, isValidEmail, isValidName, sameMailbox } from '@/lib/validate';
import { setCrew, useCrew } from '@/lib/store';
import { Check, Field, Odometer } from './ui';
import s from './Join.module.css';

/** [site] ages, kept exactly as the programme form had them */
const AGES = ['Under 13', '13', '14', '15', '16', '17', '18 or over', 'I’m a parent'];
const NEEDS_GUARDIAN = new Set(['13', '14', '15', '16', '17']);
/** ages the programme can't take an application from, with the reason */
const STOP: Record<string, string> = { 'Under 13': a.under13, 'I’m a parent': a.parent };
const FULL_NAME_MAX = 80;
const WHY_MAX = 2000;

/**
 * INVI Build application, carried over from the previous build with the
 * same fields, rules and messages. Rendered only when APPLICATIONS_OPEN.
 */
export default function ApplicationForm() {
  const crew = useCrew();
  const [v, setV] = useState({ name: '', email: '', age: '', gName: '', guardian: '', why: '', consent: false });
  const [errs, setErrs] = useState<Record<string, string | undefined>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ first: string; ref: string } | null>(null);
  const busy = useRef(false);
  const needsGuardian = NEEDS_GUARDIAN.has(v.age);
  const stop = STOP[v.age];
  const whyLen = cleanText(v.why).length;

  const set = (k: keyof typeof v, val: string | boolean) => {
    setV((o) => ({ ...o, [k]: val }));
    setErrs((o) => ({ ...o, [k]: undefined }));
  };

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    if (busy.current || stop) return;
    const bad: Record<string, string> = {};
    if (!cleanName(v.name)) bad.name = a.errors.name;
    else if (!isValidName(v.name, FULL_NAME_MAX)) bad.name = a.errors.nameChars;
    if (!isValidEmail(v.email)) bad.email = a.errors.email;
    if (!v.age) bad.age = a.errors.age;
    if (needsGuardian) {
      if (!cleanName(v.gName)) bad.gName = a.errors.guardianName;
      else if (!isValidName(v.gName, FULL_NAME_MAX)) bad.gName = a.errors.guardianNameChars;
      if (!isValidEmail(v.guardian)) bad.guardian = a.errors.guardian;
      else if (sameMailbox(v.guardian, v.email)) bad.guardian = a.errors.guardianSame;
    }
    if (whyLen < 10) bad.why = a.errors.why;
    else if (whyLen > WHY_MAX) bad.why = a.errors.whyLong;
    if (!v.consent) bad.consent = a.errors.consent;
    setErrs(bad);
    if (Object.keys(bad).length) { document.getElementById(`app-${Object.keys(bad)[0]}`)?.focus(); return; }
    busy.current = true;
    setSending(true);
    try {
      const name = cleanName(v.name);
      await submitApplication({
        name, email: cleanEmail(v.email), age: v.age,
        guardian_name: needsGuardian ? cleanName(v.gName) : '',
        guardian_email: needsGuardian ? cleanEmail(v.guardian) : '',
        why: v.why.trim().slice(0, WHY_MAX), consent: v.consent,
      });
      setCrew({ applied: true });
      setDone({ first: name.split(' ')[0] || 'Thanks', ref: String(Math.floor(Math.random() * 9000) + 1000) });
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  if (done || crew.applied) {
    return (
      <div className={`${s.panel} ${s.pass}`} role="status">
        <p className={`label ${s.passTag}`}>{a.doneTag}</p>
        {done && <p className={`display ${s.passName}`}>{done.first}</p>}
        {done && <p className={`label ${s.passRef}`}>Ref INVI-{new Date().getFullYear()}-<Odometer value={done.ref} /></p>}
        <p className="body">{a.doneMsg}</p>
      </div>
    );
  }

  return (
    <form data-motion-skip className={`${s.panel} ${s.appForm}`} onSubmit={submit} noValidate aria-labelledby="app-title">
      <h3 id="app-title" className="display t-md">{a.title}</h3>
      <p className="body">{a.lede}</p>

      <fieldset className={s.fieldset}>
        <legend className={`label ${s.fieldLabel}`}>01 · {a.sections[0]}</legend>
        <Field id="app-name" label="Full name" placeholder="First and last" autoComplete="name" maxLength={FULL_NAME_MAX}
          value={v.name} onChange={(e) => set('name', e.target.value)} error={errs.name} />
        <Field id="app-email" type="email" inputMode="email" autoComplete="email" spellCheck={false} autoCapitalize="none"
          label="Email" placeholder="you@example.com" maxLength={254}
          value={v.email} onChange={(e) => set('email', e.target.value)} error={errs.email} />
        <div className={`${s.field} ${errs.age ? s.bad : ''}`}>
          <label htmlFor="app-age" className={`label ${s.fieldLabel}`}>Age</label>
          <select id="app-age" className={s.input} value={v.age} onChange={(e) => set('age', e.target.value)}
            aria-invalid={errs.age ? true : undefined} aria-describedby="app-age-err app-age-stop">
            <option value="" disabled>Select your age</option>
            {AGES.map((x) => <option key={x}>{x}</option>)}
          </select>
          <p id="app-age-err" className={s.err} aria-live="polite">{errs.age}</p>
          <div id="app-age-stop" aria-live="polite">
            {stop && (
              <div className={s.stop}>
                <p className={s.help}>{stop}</p>
                {v.age === 'I’m a parent' && <Link href="/parents" className="link">For Parents</Link>}
              </div>
            )}
          </div>
        </div>
        {needsGuardian && (
          <>
            <Field id="app-gName" autoComplete="off" maxLength={FULL_NAME_MAX}
              label={<>Parent or guardian’s name <span className={s.optional}>Required under 18</span></>}
              value={v.gName} onChange={(e) => set('gName', e.target.value)} error={errs.gName} />
            <Field id="app-guardian" type="email" inputMode="email" autoComplete="off" spellCheck={false} autoCapitalize="none"
              placeholder="their@email.com" maxLength={254}
              label={<>Parent or guardian’s email <span className={s.optional}>Required under 18</span></>}
              value={v.guardian} onChange={(e) => set('guardian', e.target.value)} error={errs.guardian} />
          </>
        )}
      </fieldset>

      {!stop && (
        <>
          <fieldset className={s.fieldset}>
            <legend className={`label ${s.fieldLabel}`}>02 · {a.sections[1]}</legend>
            <div className={`${s.field} ${errs.why ? s.bad : ''}`}>
              <label htmlFor="app-why" className={s.ask}>{a.why}</label>
              <p id="app-why-help" className={s.help}>{a.whyHelp}</p>
              <textarea id="app-why" className={`${s.input} ${s.textarea}`} placeholder={a.whyPlaceholder} maxLength={WHY_MAX}
                value={v.why} onChange={(e) => set('why', e.target.value)}
                aria-invalid={errs.why ? true : undefined} aria-describedby="app-why-help app-why-err app-why-count" />
              <p id="app-why-err" className={s.err} aria-live="polite">{errs.why}</p>
              <p id="app-why-count" className={s.help} aria-live="polite">{whyLen === 0 ? '' : whyLen < 10 ? a.whyShort : a.whyOk}</p>
            </div>
          </fieldset>

          <fieldset className={s.fieldset}>
            <legend className={`label ${s.fieldLabel}`}>03 · {a.sections[2]}</legend>
            <ul className={s.terms}>{a.terms.map((t) => <li key={t}>{t}</li>)}</ul>
            <Check id="app-consent" checked={v.consent} onChange={(x) => set('consent', x)} error={errs.consent}
              after={<Link href="/privacy" target="_blank" className="link">Privacy</Link>}>
              {a.consent}
            </Check>
          </fieldset>

          <div className={s.nav}>
            <p className={s.help}>{a.footNote}</p>
            <button type="submit" className="btn btn--solid" disabled={sending}>
              <span>{sending ? a.sending : a.submit}</span><span className="arrow" aria-hidden>→</span>
            </button>
          </div>
        </>
      )}
    </form>
  );
}
