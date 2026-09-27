'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { join } from '@/lib/content';
import { WHATSAPP_GROUP_URL } from '@/lib/config';
import { submitCrew } from '@/lib/submit';
import { cleanEmail, cleanName, cleanText, isValidEmail, isValidMobile, isValidName, NAME_MAX, normaliseMobile, sameMailbox } from '@/lib/validate';
import { clearCrew, newRef, setCrew, useCrew } from '@/lib/store';
import { flash } from '@/components/site/Toast';
import { scrollToEl } from '@/components/site/SmoothScroll';
import { Check, Field, Odometer } from './ui';
import s from './Join.module.css';

type Step = 'age' | 'name' | 'email' | 'guardian' | 'invited' | 'mobile' | 'consent';
type Values = {
  name: string; email: string; age: string; gName: string; gEmail: string;
  invited: string; mobile: string; whatsapp: boolean; consent: boolean; marketing: boolean;
};
const START: Values = { name: '', email: '', age: '', gName: '', gEmail: '', invited: '', mobile: '', whatsapp: false, consent: false, marketing: false };
const UNDER_13 = 'Under 13';
const UNDER_18 = new Set(['13 to 15', '16 to 17']);
/** 16 and over get the group chat link straight away; 13 to 15 need a parent or guardian first. */
const CHAT_NOW = new Set(['16 to 17', '18+']);
const INVITED_MAX = 60;
const f = join.fields;
const e = join.errors;
const w = join.whatsapp;

const TITLES: Record<Step, string> = {
  age: f.age.label, name: f.name.label, email: f.email.label, guardian: f.guardian.label,
  invited: f.invited.label, mobile: f.mobile.label, consent: join.submit,
};

/** The half-finished answers, kept in memory (never in storage) so going to
 *  another page and back doesn't lose them. Gone on reload or once joined. */
let draft: { v: Values; i: number } = { v: START, i: 0 };

/** Every rule for one step. Pure, so the final check can run them all. */
function validate(st: Step, v: Values): Record<string, string> {
  const out: Record<string, string> = {};
  if (st === 'age' && !v.age) out.age = e.age;
  if (st === 'name') {
    if (!cleanName(v.name)) out.name = e.name;
    else if (!isValidName(v.name)) out.name = e.nameChars;
  }
  if (st === 'email' && !isValidEmail(v.email)) out.email = e.email;
  if (st === 'guardian') {
    if (!cleanName(v.gName)) out.gName = e.guardianName;
    else if (!isValidName(v.gName)) out.gName = e.otherNameChars;
    if (!isValidEmail(v.gEmail)) out.gEmail = e.guardianEmail;
    else if (sameMailbox(v.gEmail, v.email)) out.gEmail = e.guardianSame;
  }
  if (st === 'invited' && cleanText(v.invited) && !isValidName(v.invited, INVITED_MAX)) out.invited = e.otherNameChars;
  if (st === 'mobile') {
    const m = normaliseMobile(v.mobile);
    if (m && !isValidMobile(v.mobile)) out.mobile = e.mobile;
    else if (v.whatsapp && !m) out.mobile = e.whatsapp;
  }
  if (st === 'consent' && !v.consent) out.consent = e.consent;
  return out;
}

/**
 * Join the Crew, one question per screen. Age comes first: under 13s are
 * stopped before anything else is asked. Under 18s get the parent or guardian
 * step her Safeguarding page promises. Enter moves forward, Back never loses
 * anything, every error is tied to its field and receives focus, and the
 * final submit re-checks every step, not just the last one.
 */
export default function JoinFlow() {
  const crew = useCrew();
  const [v, setV] = useState<Values>(() => draft.v);
  const [errs, setErrs] = useState<Partial<Record<string, string>>>({});
  const [i, setI] = useState(() => draft.i);
  const [sending, setSending] = useState(false);
  const [fresh, setFresh] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const busy = useRef(false);
  const focusNext = useRef<string | null>(null);
  const passRef = useRef<HTMLDivElement>(null);

  useEffect(() => { draft = { v, i }; }, [v, i]);

  // A fresh join moves focus to the pass, so keyboard and screen-reader
  // users land on the result rather than on a form that has gone.
  useEffect(() => {
    if (fresh && crew.joined) passRef.current?.focus({ preventScroll: true });
  }, [fresh, crew.joined]);

  const steps = useMemo<Step[]>(() => {
    const all: Step[] = ['age', 'name', 'email', 'guardian', 'invited', 'mobile', 'consent'];
    return UNDER_18.has(v.age) ? all : all.filter((x) => x !== 'guardian');
  }, [v.age]);
  const step = steps[Math.min(i, steps.length - 1)];
  const under13 = v.age === UNDER_13;

  // Focus each new step's first control, or the field that needs fixing
  // (not on first render).
  useEffect(() => {
    if (!moved.current) return;
    const id = focusNext.current;
    focusNext.current = null;
    const el = (id && document.getElementById(id))
      || panel.current?.querySelector<HTMLElement>(id === 'join-age' ? 'button[role=radio]' : 'input:not([type=hidden]), button[role=radio]');
    el?.focus({ preventScroll: true });
  }, [i]);

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    setV((o) => ({ ...o, [k]: val }));
    const key = k === 'whatsapp' ? 'mobile' : (k as string); // the WhatsApp tick's error sits on the number
    if (errs[key]) setErrs((o) => ({ ...o, [key]: undefined }));
  };

  function pickAge(age: string) {
    // under 13: keep nothing else that may have been typed
    if (age === UNDER_13) { setV({ ...START, age }); setErrs({}); return; }
    set('age', age);
  }

  const fieldFor = (key: string) => (key === 'age' ? 'join-age' : `join-${key}`);
  function focusField(key: string) {
    const el = key === 'age'
      ? panel.current?.querySelector<HTMLElement>('button[role=radio]')
      : document.getElementById(fieldFor(key));
    el?.focus();
  }

  async function next(ev?: FormEvent) {
    ev?.preventDefault();
    if (busy.current || under13) return;
    const at = steps.indexOf(step);

    if (step !== 'consent') {
      const bad = validate(step, v);
      setErrs(bad);
      if (Object.keys(bad).length) { focusField(Object.keys(bad)[0]); return; }
      moved.current = true;
      setI(at + 1); // a fixed index, so a double press can't skip a step
      return;
    }

    // the last step: re-check everything, then go back to the first problem
    for (const [k, st] of steps.entries()) {
      const bad = validate(st, v);
      if (!Object.keys(bad).length) continue;
      setErrs(bad);
      if (k === at) { focusField(Object.keys(bad)[0]); return; }
      moved.current = true;
      focusNext.current = fieldFor(Object.keys(bad)[0]);
      setI(k);
      flash(e.missed);
      return;
    }

    busy.current = true;
    setSending(true);
    const minor = UNDER_18.has(v.age);
    const mobile = normaliseMobile(v.mobile);
    const name = cleanName(v.name);
    try {
      await submitCrew({
        firstName: name, email: cleanEmail(v.email), ageRange: v.age,
        guardianName: minor ? cleanName(v.gName) : '', guardianEmail: minor ? cleanEmail(v.gEmail) : '',
        invitedBy: cleanName(v.invited), mobile,
        whatsappInvite: v.whatsapp && !!mobile, joinConsent: v.consent, marketingConsent: v.marketing,
      });
      setCrew({ joined: true, name, ref: crew.ref ?? newRef(), whatsapp: CHAT_NOW.has(v.age) ? 'link' : 'approval' });
      draft = { v: START, i: 0 };
      setV(START); setI(0); setErrs({});
      setFresh(true);
      flash(`${join.done.tag}. ${join.done.vote}.`);
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  function back() {
    moved.current = true;
    setErrs({});
    setI(Math.max(0, steps.indexOf(step) - 1));
  }

  function skip(k: 'invited' | 'mobile') {
    // skipping means "not this one": nothing half-typed goes with it
    setV((o) => ({ ...o, [k]: '', ...(k === 'mobile' ? { whatsapp: false } : {}) }));
    setErrs({});
    moved.current = true;
    setI(steps.indexOf(step) + 1);
  }

  function toWaitlist() {
    scrollToEl(document.getElementById('waitlist'));
    setTimeout(() => document.getElementById('wl-name')?.focus({ preventScroll: true }), 900);
  }

  function restart() {
    clearCrew();
    draft = { v: START, i: 0 };
    setV(START); setI(0); setErrs({}); setFresh(false);
    moved.current = true;
    requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>('button[role=radio]')?.focus({ preventScroll: true }));
  }

  async function share() {
    const text = join.done.shareText;
    const url = location.origin;
    try {
      if (navigator.share) { await navigator.share({ title: 'INVI', text, url }); return; }
      await navigator.clipboard.writeText(`${text} ${url}`);
      flash(join.done.copied);
    } catch (err) {
      if ((err as DOMException)?.name === 'AbortError') return; // closed the share sheet
      flash(join.done.copyFail);
    }
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

        {crew.whatsapp && (
          <section className={s.chat} aria-labelledby="chat-title">
            <p className={`label ${s.chatTag}`}>
              <svg viewBox="0 0 16 16" aria-hidden><path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z" /></svg>
              {w.eyebrow}
            </p>
            {crew.whatsapp === 'link' ? (
              <>
                <h3 id="chat-title" className={`display ${s.chatTitle}`}>{w.title}</h3>
                <p className={s.help}>{w.body}</p>
                <a className="btn" href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer" aria-describedby="chat-note">
                  <span>{w.cta}</span><span className="arrow" aria-hidden>↗</span>
                </a>
                <p id="chat-note" className={s.chatNote}>{w.note}</p>
              </>
            ) : (
              <>
                <h3 id="chat-title" className={`display ${s.chatTitle}`}>{w.approvalTitle}</h3>
                <p className={s.help}>{w.approval}</p>
              </>
            )}
          </section>
        )}

        <button type="button" className={`${s.back} ${s.restart}`} onClick={restart}>{join.restart}</button>
      </div>
    );
  }

  // ── the questions ─────────────────────────────────────────────────────
  const n = steps.indexOf(step) + 1;
  const ageDescribed = ['join-age-note', errs.age ? 'join-age-err' : '', under13 ? 'join-age-stop' : ''].filter(Boolean).join(' ');
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
        {step === 'age' && (
          <fieldset className={`${s.fieldset} ${errs.age ? s.bad : ''}`}>
            <legend className={`label ${s.fieldLabel}`}>{f.age.label}</legend>
            <div className={s.options} role="radiogroup" aria-label={f.age.label}
              aria-invalid={errs.age ? true : undefined} aria-describedby={ageDescribed}>
              {f.age.options.map((o, k) => (
                <button key={o} type="button" role="radio" aria-checked={v.age === o}
                  tabIndex={v.age ? (v.age === o ? 0 : -1) : (k === 0 ? 0 : -1)}
                  className={`${s.option} ${v.age === o ? s.optionOn : ''}`}
                  onClick={() => pickAge(o)}
                  onKeyDown={(ev) => {
                    // Enter picks this range and moves on, like every other step
                    if (ev.key === 'Enter') {
                      ev.preventDefault();
                      pickAge(o);
                      const form = ev.currentTarget.form;
                      if (o !== UNDER_13) setTimeout(() => form?.requestSubmit(), 30);
                      return;
                    }
                    const dir = ev.key === 'ArrowDown' || ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowUp' || ev.key === 'ArrowLeft' ? -1 : 0;
                    if (!dir) return;
                    ev.preventDefault();
                    const nx = f.age.options[(k + dir + f.age.options.length) % f.age.options.length];
                    pickAge(nx);
                    (ev.currentTarget.parentElement?.children[f.age.options.indexOf(nx)] as HTMLElement)?.focus();
                  }}>
                  <span className={`display ${s.optionText}`}>{o}</span>
                  <span className={s.radio} aria-hidden />
                </button>
              ))}
            </div>
            <p id="join-age-note" className={s.help}>{f.age.note}</p>
            <p id="join-age-err" className={s.err} aria-live="polite">{errs.age}</p>
            <div id="join-age-stop" aria-live="polite">
              {under13 && (
                <div className={s.stop}>
                  <p className={`display ${s.chatTitle}`}>{join.under13.title}</p>
                  <p className={s.help}>{join.under13.body}</p>
                  <button type="button" className="btn" onClick={toWaitlist}>
                    <span>{join.under13.cta}</span><span className="arrow" aria-hidden>↘</span>
                  </button>
                </div>
              )}
            </div>
          </fieldset>
        )}

        {step === 'name' && (
          <Field id="join-name" big label={f.name.label} placeholder={f.name.placeholder} autoComplete="given-name"
            maxLength={NAME_MAX} value={v.name} onChange={(x) => set('name', x.target.value)} error={errs.name} enterKeyHint="next" />
        )}

        {step === 'email' && (
          <Field id="join-email" big type="email" inputMode="email" autoComplete="email" spellCheck={false} autoCapitalize="none"
            label={f.email.label} placeholder={f.email.placeholder} maxLength={254}
            value={v.email} onChange={(x) => set('email', x.target.value)} error={errs.email} enterKeyHint="next" />
        )}

        {step === 'guardian' && (
          <div className={s.group}>
            <p className={`label ${s.fieldLabel}`}>{f.guardian.label}</p>
            <p className={s.help}>{f.guardian.note}</p>
            <Field id="join-gName" label={f.guardian.nameLabel} autoComplete="off" maxLength={NAME_MAX}
              value={v.gName} onChange={(x) => set('gName', x.target.value)} error={errs.gName} />
            <Field id="join-gEmail" type="email" inputMode="email" autoComplete="off" spellCheck={false} autoCapitalize="none"
              label={f.guardian.emailLabel} placeholder={f.guardian.emailPlaceholder} maxLength={254}
              value={v.gEmail} onChange={(x) => set('gEmail', x.target.value)} error={errs.gEmail} />
          </div>
        )}

        {step === 'invited' && (
          <Field id="join-invited" big label={f.invited.label} optional={f.invited.optional} autoComplete="off" maxLength={INVITED_MAX}
            value={v.invited} onChange={(x) => set('invited', x.target.value)} error={errs.invited} enterKeyHint="next" />
        )}

        {step === 'mobile' && (
          <div className={s.group}>
            <Field id="join-mobile" big type="tel" inputMode="tel" autoComplete="tel" placeholder="+44" maxLength={24}
              label={f.mobile.label} optional={f.mobile.optional} help={f.mobile.help}
              value={v.mobile} onChange={(x) => set('mobile', x.target.value)} error={errs.mobile} />
            <Check id="join-whatsapp" checked={v.whatsapp} onChange={(x) => set('whatsapp', x)}>{f.mobile.whatsapp}</Check>
          </div>
        )}

        {step === 'consent' && (
          <div className={s.group}>
            <Check id="join-consent" checked={v.consent} onChange={(x) => set('consent', x)} error={errs.consent}
              after={<Link href="/privacy" target="_blank" className="link">{join.privacy}</Link>}>
              {f.consent}
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
              <button type="button" className={s.back} onClick={() => skip(step as 'invited' | 'mobile')}>{join.skip}</button>
            )}
            {!under13 && (
              <button type="submit" className="btn btn--solid" disabled={sending}>
                <span>{step === 'consent' ? (sending ? join.submitting : join.submit) : join.next}</span>
                <span className="arrow" aria-hidden>{step === 'consent' ? '↗' : '→'}</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
