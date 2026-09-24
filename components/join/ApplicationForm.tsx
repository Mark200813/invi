'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { application as a } from '@/lib/content';
import { EMAIL_RE, submitApplication } from '@/lib/submit';
import { setCrew } from '@/lib/store';
import { Check, Field, Odometer } from './ui';
import s from './Join.module.css';

/** [site] ages, kept exactly as the programme form had them */
const AGES = ['Under 13', '13', '14', '15', '16', '17', '18 or over', 'I’m a parent'];
const NEEDS_GUARDIAN = new Set(['Under 13', '13', '14', '15', '16', '17']);

/**
 * INVI Build application, carried over from the previous build with the
 * same fields, rules and messages. Rendered only when APPLICATIONS_OPEN.
 */
export default function ApplicationForm() {
  const [v, setV] = useState({ name: '', email: '', age: '', guardian: '', why: '', consent: false });
  const [errs, setErrs] = useState<Record<string, string | undefined>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ first: string; ref: string } | null>(null);
  const needsGuardian = NEEDS_GUARDIAN.has(v.age);
  const whyLen = v.why.trim().length;

  const set = (k: keyof typeof v, val: string | boolean) => {
    setV((o) => ({ ...o, [k]: val }));
    setErrs((o) => ({ ...o, [k]: undefined }));
  };

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    const bad: Record<string, string> = {};
    if (!v.name.trim()) bad.name = a.errors.name;
    if (!EMAIL_RE.test(v.email.trim())) bad.email = a.errors.email;
    if (!v.age) bad.age = a.errors.age;
    if (needsGuardian && !EMAIL_RE.test(v.guardian.trim())) bad.guardian = a.errors.guardian;
    if (whyLen < 10) bad.why = a.errors.why;
    if (!v.consent) bad.consent = a.errors.consent;
    setErrs(bad);
    if (Object.keys(bad).length) { document.getElementById(`app-${Object.keys(bad)[0]}`)?.focus(); return; }
    setSending(true);
    await submitApplication({
      name: v.name.trim(), email: v.email.trim(), age: v.age,
      guardian_email: needsGuardian ? v.guardian.trim() : '', why: v.why.trim(),
    });
    setCrew({ applied: true });
    setDone({ first: v.name.trim().split(' ')[0] || 'Thanks', ref: String(Math.floor(Math.random() * 9000) + 1000) });
    setSending(false);
  }

  if (done) {
    return (
      <div className={`${s.panel} ${s.pass}`} role="status">
        <p className={`label ${s.passTag}`}>{a.doneTag}</p>
        <p className={`display ${s.passName}`}>{done.first}</p>
        <p className={`label ${s.passRef}`}>Ref INVI-{new Date().getFullYear()}-<Odometer value={done.ref} /></p>
        <p className="body">{a.doneMsg}</p>
      </div>
    );
  }

  return (
    <form className={`${s.panel} ${s.appForm}`} onSubmit={submit} noValidate aria-labelledby="app-title">
      <h3 id="app-title" className="display t-md">{a.title}</h3>
      <p className="body">{a.lede}</p>

      <fieldset className={s.fieldset}>
        <legend className={`label ${s.fieldLabel}`}>01 · {a.sections[0]}</legend>
        <Field id="app-name" label="Full name" placeholder="First and last" autoComplete="name"
          value={v.name} onChange={(e) => set('name', e.target.value)} error={errs.name} />
        <Field id="app-email" type="email" inputMode="email" autoComplete="email" label="Email" placeholder="you@example.com"
          value={v.email} onChange={(e) => set('email', e.target.value)} error={errs.email} />
        <div className={`${s.field} ${errs.age ? s.bad : ''}`}>
          <label htmlFor="app-age" className={`label ${s.fieldLabel}`}>Age</label>
          <select id="app-age" className={s.input} value={v.age} onChange={(e) => set('age', e.target.value)}
            aria-invalid={errs.age ? true : undefined} aria-describedby="app-age-err">
            <option value="" disabled>Select your age</option>
            {AGES.map((x) => <option key={x}>{x}</option>)}
          </select>
          <p id="app-age-err" className={s.err} aria-live="polite">{errs.age}</p>
        </div>
        {needsGuardian && (
          <Field id="app-guardian" type="email" inputMode="email" autoComplete="off" placeholder="their@email.com"
            label={<>Parent or guardian’s email <span className={s.optional}>Required under 18</span></>}
            value={v.guardian} onChange={(e) => set('guardian', e.target.value)} error={errs.guardian} />
        )}
      </fieldset>

      <fieldset className={s.fieldset}>
        <legend className={`label ${s.fieldLabel}`}>02 · {a.sections[1]}</legend>
        <div className={`${s.field} ${errs.why ? s.bad : ''}`}>
          <label htmlFor="app-why" className={s.ask}>{a.why}</label>
          <p id="app-why-help" className={s.help}>{a.whyHelp}</p>
          <textarea id="app-why" className={`${s.input} ${s.textarea}`} placeholder={a.whyPlaceholder}
            value={v.why} onChange={(e) => set('why', e.target.value)}
            aria-invalid={errs.why ? true : undefined} aria-describedby="app-why-help app-why-err app-why-count" />
          <p id="app-why-err" className={s.err} aria-live="polite">{errs.why}</p>
          <p id="app-why-count" className={s.help} aria-live="polite">{whyLen === 0 ? '' : whyLen < 10 ? a.whyShort : a.whyOk}</p>
        </div>
      </fieldset>

      <fieldset className={s.fieldset}>
        <legend className={`label ${s.fieldLabel}`}>03 · {a.sections[2]}</legend>
        <ul className={s.terms}>{a.terms.map((t) => <li key={t}>{t}</li>)}</ul>
        <Check id="app-consent" checked={v.consent} onChange={(x) => set('consent', x)} error={errs.consent}>
          {a.consent} <Link href="/privacy" target="_blank" className="link">Privacy</Link>.
        </Check>
      </fieldset>

      <div className={s.nav}>
        <p className={s.help}>{a.footNote}</p>
        <button type="submit" className="btn btn--solid" disabled={sending}>
          <span>{sending ? a.sending : a.submit}</span><span className="arrow" aria-hidden>→</span>
        </button>
      </div>
    </form>
  );
}
