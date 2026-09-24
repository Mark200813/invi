'use client';

import { useState, type FormEvent } from 'react';
import { waitlist } from '@/lib/content';
import { EMAIL_RE, MOBILE_RE, normaliseMobile, submitWaitlist } from '@/lib/submit';
import { setCrew, useCrew } from '@/lib/store';
import { Check, Field } from './ui';
import s from './Join.module.css';

/** The lighter door: first drop news without joining the community.
 *  `website` is a honeypot, as on Viv's form: people never see it. */
export default function Waitlist() {
  const crew = useCrew();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState('');
  const [errs, setErrs] = useState<Record<string, string | undefined>>({});
  const [sending, setSending] = useState(false);

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    const bad: Record<string, string> = {};
    if (!name.trim()) bad.name = waitlist.errors.name;
    const c = contact.trim();
    if (!(EMAIL_RE.test(c) || MOBILE_RE.test(normaliseMobile(c)))) bad.contact = waitlist.errors.contact;
    if (!consent) bad.consent = waitlist.errors.consent;
    setErrs(bad);
    if (Object.keys(bad).length) { document.getElementById(`wl-${Object.keys(bad)[0]}`)?.focus(); return; }
    if (trap) return; // bots fill every field
    setSending(true);
    await submitWaitlist({ firstName: name.trim(), contact: EMAIL_RE.test(c) ? c : normaliseMobile(c), consent });
    setCrew({ waitlisted: true });
    setSending(false);
  }

  return (
    <section className={s.waitlist} aria-labelledby="wl-title">
      <div className={s.waitlistCopy}>
        <p className={`label ${s.eyebrow}`}>{waitlist.eyebrow}</p>
        <h2 id="wl-title" className={`display ${s.waitlistTitle}`}>{waitlist.title}</h2>
        <p className="body">{waitlist.body}</p>
      </div>
      {crew.waitlisted ? (
        <p className={`display t-md ${s.waitlistDone}`} role="status">{waitlist.done}</p>
      ) : (
        <form className={s.waitlistForm} onSubmit={submit} noValidate>
          <div className={s.trap} aria-hidden>
            <label htmlFor="wl-website">Website</label>
            <input id="wl-website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
          </div>
          <Field id="wl-name" label={waitlist.name} autoComplete="given-name" value={name}
            onChange={(e) => { setName(e.target.value); setErrs((o) => ({ ...o, name: undefined })); }} error={errs.name} />
          <Field id="wl-contact" label={waitlist.contact} autoComplete="email" value={contact}
            onChange={(e) => { setContact(e.target.value); setErrs((o) => ({ ...o, contact: undefined })); }} error={errs.contact} />
          <Check id="wl-consent" checked={consent} onChange={(v) => { setConsent(v); setErrs((o) => ({ ...o, consent: undefined })); }} error={errs.consent}>
            {waitlist.consent}
          </Check>
          <div>
            <button type="submit" className="btn" disabled={sending}>
              <span>{sending ? waitlist.submitting : waitlist.submit}</span><span className="arrow" aria-hidden>↗</span>
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
