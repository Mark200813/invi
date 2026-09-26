'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { join } from '@/lib/content';
import { EMAIL_RE, MOBILE_RE, normaliseMobile, submitCrew } from '@/lib/submit';
import { newRef, setCrew, useCrew } from '@/lib/store';
import { flash } from '@/components/site/Toast';
import { scrollToEl } from '@/components/site/SmoothScroll';
import { Check, Field, Odometer } from './ui';
import s from './Join.module.css';

type Step = 'name' | 'email' | 'age' | 'guardian' | 'invited' | 'mobile' | 'consent';
type Values = {
  name: string; email: string; age: string; gName: string; gEmail: string;
  invited: string; mobile: string; whatsapp: boolean; consent: boolean; marketing: boolean;
};
const START: Values = { name: '', email: '', age: '', gName: '', gEmail: '', invited: '', mobile: '', whatsapp: false, consent: false, marketing: false };
const UNDER_18 = new Set(['13 to 15', '16 to 17']);
const f = join.fields;
const e = join.errors;

const TITLES: Record<Step, string> = {
  name: f.name.label, email: f.email.label, age: f.age.label, guardian: f.guardian.label,
  invited: f.invited.label, mobile: f.mobile.label, consent: join.submit,
};

/**
 * Join the Crew, one question per screen. Same rules as Viv's form, plus the
 * parent or guardian step her Safeguarding page promises for under 18s.
 * Enter moves forward, Back never loses anything, and every error is tied to
 * its field and receives focus.
 */
export default function JoinFlow() {
  const crew = useCrew();
  const [v, setV] = useState<Values>(START);
  const [errs, setErrs] = useState<Partial<Record<string, string>>>({});
  const [i, setI] = useState(0);
  const [sending, setSending] = useState(false);
  const [fresh, setFresh] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const passRef = useRef<HTMLDivElement>(null);

  // A fresh join moves focus to the pass, so keyboard and screen-reader
  // users land on the result rather than on a form that has gone.
  useEffect(() => {
    if (fresh && crew.joined) passRef.current?.focus({ preventScroll: true });
  }, [fresh, crew.joined]);

  const steps = useMemo<Step[]>(() => {
    const all: Step[] = ['name', 'email', 'age', 'guardian', 'invited', 'mobile', 'consent'];
    return UNDER_18.has(v.age) ? all : all.filter((x) => x !== 'guardian');
  }, [v.age]);
  const step = steps[Math.min(i, steps.length - 1)];

  // Focus the first control of each new step (not on first render).
  useEffect(() => {
    if (!moved.current) return;
    const el = panel.current?.querySelector<HTMLElement>('input:not([type=hidden]), button[role=radio]');
    el?.focus({ preventScroll: true });
  }, [i]);

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    setV((o) => ({ ...o, [k]: val }));
    if (errs[k as string]) setErrs((o) => ({ ...o, [k]: undefined }));
  };

  function validate(st: Step): Record<string, string> {
    const out: Record<string, string> = {};
    if (st === 'name' && !v.name.trim()) out.name = e.name;
    if (st === 'email' && !EMAIL_RE.test(v.email.trim())) out.email = e.email;
    if (st === 'age' && !v.age) out.age = e.age;
    if (st === 'guardian') {
      if (!v.gName.trim()) out.gName = e.guardianName;
      if (!EMAIL_RE.test(v.gEmail.trim())) out.gEmail = e.guardianEmail;
    }
    if (st === 'mobile') {
      const m = normaliseMobile(v.mobile);
      if (m && !MOBILE_RE.test(m)) out.mobile = e.mobile;
      else if (v.whatsapp && !m) out.mobile = e.whatsapp;
    }
    if (st === 'consent' && !v.consent) out.consent = e.consent;
    return out;
  }

  async function next(ev?: FormEvent) {
    ev?.preventDefault();
    const bad = validate(step);
    setErrs(bad);
    if (Object.keys(bad).length) {
      const first = Object.keys(bad)[0];
      const target = first === 'age'
        ? panel.current?.querySelector<HTMLElement>('button[role=radio]')
        : document.getElementById(`join-${first}`);
      target?.focus();
      return;
    }
    if (step !== 'consent') { moved.current = true; setI((n) => n + 1); return; }

    setSending(true);
    const minor = UNDER_18.has(v.age);
    await submitCrew({
      firstName: v.name.trim(), email: v.email.trim(), ageRange: v.age,
      guardianName: minor ? v.gName.trim() : '', guardianEmail: minor ? v.gEmail.trim() : '',
      invitedBy: v.invited.trim(), mobile: normaliseMobile(v.mobile),
      whatsappInvite: v.whatsapp && !!v.mobile, joinConsent: v.consent, marketingConsent: v.marketing,
    });
    setCrew({ joined: true, name: v.name.trim(), ref: crew.ref ?? newRef() });
    setSending(false);
    setFresh(true);
    flash(`${join.done.tag}. ${join.done.vote}.`);
  }

  function back() {
    moved.current = true;
    setErrs({});
    setI((n) => Math.max(0, n - 1));
  }

  async function share() {
    const text = join.done.shareText;
    const url = location.origin;
    try {
      if (navigator.share) { await navigator.share({ title: 'INVI', text, url }); return; }
      await navigator.clipboard.writeText(`${text} ${url}`);
      flash(join.done.copied);
    } catch { flash(join.done.copyFail); }
  }

  // ── joined: the pass ──────────────────────────────────────────────────
  if (crew.joined) {
    const ref = String(crew.ref ?? 0).padStart(4, '0');
    return (
      <div className={`${s.panel} ${s.pass}`} tabIndex={-1} ref={passRef} data-motion-skip>
        <p className={`label ${s.passTag}`}>{fresh ? join.done.tag : join.already}</p>
        <p className={`display ${s.passName}`}>{crew.name || join.done.tag}</p>
        <p className={`label ${s.passRef}`}>{join.done.ref} INVI-<Odometer value={ref} /></p>
        <div className={s.passActions}>
          <Link href="/#roadmap" className="btn btn--solid"
            onClick={(ev) => { ev.preventDefault(); scrollToEl(document.getElementById('roadmap')); }}>
            <span>{join.done.vote}</span><span className="arrow" aria-hidden>↘</span>
          </Link>
          <button type="button" className="btn" onClick={share}><span>{join.done.share}</span></button>
        </div>
      </div>
    );
  }

  // ── the questions ─────────────────────────────────────────────────────
  const n = steps.indexOf(step) + 1;
  return (
    <div className={s.panel} ref={panel} data-motion-skip>
      <div className={s.progress}>
        <p className={`label ${s.stepCount}`} aria-live="polite">
          <span className="num">{String(n).padStart(2, '0')}</span>
          <span className={s.of}> / {String(steps.length).padStart(2, '0')}</span>
          <span className="vh">: {TITLES[step]}</span>
        </p>
        <span className={s.bar} aria-hidden><i style={{ transform: `scaleX(${n / steps.length})` }} /></span>
      </div>

      <form className={s.form} onSubmit={next} noValidate key={step}>
        {step === 'name' && (
          <Field id="join-name" big label={f.name.label} placeholder={f.name.placeholder} autoComplete="given-name"
            value={v.name} onChange={(x) => set('name', x.target.value)} error={errs.name} enterKeyHint="next" />
        )}

        {step === 'email' && (
          <Field id="join-email" big type="email" inputMode="email" autoComplete="email" spellCheck={false}
            label={f.email.label} placeholder={f.email.placeholder}
            value={v.email} onChange={(x) => set('email', x.target.value)} error={errs.email} enterKeyHint="next" />
        )}

        {step === 'age' && (
          <fieldset className={`${s.fieldset} ${errs.age ? s.bad : ''}`} aria-describedby="join-age-note join-age-err">
            <legend className={`label ${s.fieldLabel}`}>{f.age.label}</legend>
            <div className={s.options} role="radiogroup" aria-label={f.age.label}>
              {f.age.options.map((o, k) => (
                <button key={o} type="button" role="radio" aria-checked={v.age === o}
                  tabIndex={v.age ? (v.age === o ? 0 : -1) : (k === 0 ? 0 : -1)}
                  className={`${s.option} ${v.age === o ? s.optionOn : ''}`}
                  onClick={() => set('age', o)}
                  onKeyDown={(ev) => {
                    const dir = ev.key === 'ArrowDown' || ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowUp' || ev.key === 'ArrowLeft' ? -1 : 0;
                    if (!dir) return;
                    ev.preventDefault();
                    const nx = f.age.options[(k + dir + f.age.options.length) % f.age.options.length];
                    set('age', nx);
                    (ev.currentTarget.parentElement?.children[f.age.options.indexOf(nx)] as HTMLElement)?.focus();
                  }}>
                  <span className={`display ${s.optionText}`}>{o}</span>
                  <span className={s.radio} aria-hidden />
                </button>
              ))}
            </div>
            <p id="join-age-note" className={s.help}>{f.age.note}</p>
            <p id="join-age-err" className={s.err} aria-live="polite">{errs.age}</p>
          </fieldset>
        )}

        {step === 'guardian' && (
          <div className={s.group}>
            <p className={`label ${s.fieldLabel}`}>{f.guardian.label}</p>
            <p className={s.help}>{f.guardian.note}</p>
            <Field id="join-gName" label={f.guardian.nameLabel} autoComplete="off"
              value={v.gName} onChange={(x) => set('gName', x.target.value)} error={errs.gName} />
            <Field id="join-gEmail" type="email" inputMode="email" autoComplete="off" spellCheck={false}
              label={f.guardian.emailLabel} placeholder={f.guardian.emailPlaceholder}
              value={v.gEmail} onChange={(x) => set('gEmail', x.target.value)} error={errs.gEmail} />
          </div>
        )}

        {step === 'invited' && (
          <Field id="join-invited" big label={f.invited.label} optional={f.invited.optional} autoComplete="off"
            value={v.invited} onChange={(x) => set('invited', x.target.value)} enterKeyHint="next" />
        )}

        {step === 'mobile' && (
          <div className={s.group}>
            <Field id="join-mobile" big type="tel" inputMode="tel" autoComplete="tel" placeholder="+44"
              label={f.mobile.label} optional={f.mobile.optional} help={f.mobile.help}
              value={v.mobile} onChange={(x) => set('mobile', x.target.value)} error={errs.mobile} />
            <Check id="join-whatsapp" checked={v.whatsapp} onChange={(x) => set('whatsapp', x)}>{f.mobile.whatsapp}</Check>
          </div>
        )}

        {step === 'consent' && (
          <div className={s.group}>
            <Check id="join-consent" checked={v.consent} onChange={(x) => set('consent', x)} error={errs.consent}>
              {f.consent}{' '}<Link href="/privacy" target="_blank" className="link">{join.privacy}</Link>.
            </Check>
            <Check id="join-marketing" checked={v.marketing} onChange={(x) => set('marketing', x)}>{f.marketing}</Check>
            <ul className={s.notes}>{join.notes.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        )}

        <div className={s.nav}>
          {n > 1 ? (
            <button type="button" className={s.back} onClick={back}><span aria-hidden>←</span> {join.back}</button>
          ) : <span />}
          <div className={s.navRight}>
            {(step === 'invited' || (step === 'mobile' && !v.mobile && !v.whatsapp)) && (
              <button type="submit" className={s.back}>{join.skip}</button>
            )}
            <button type="submit" className="btn btn--solid" disabled={sending}>
              <span>{step === 'consent' ? (sending ? join.submitting : join.submit) : join.next}</span>
              <span className="arrow" aria-hidden>{step === 'consent' ? '↗' : '→'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
