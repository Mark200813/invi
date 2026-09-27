'use client';

import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { waitlist } from '@/lib/content';
import { submitWaitlist } from '@/lib/submit';
import { cleanEmail, cleanName, cleanText, isValidEmail, isValidMobile, isValidName, NAME_MAX, normaliseMobile } from '@/lib/validate';
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
  const busy = useRef(false);

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    if (busy.current) return;
    const bad: Record<string, string> = {};
    if (!cleanName(name)) bad.name = waitlist.errors.name;
    else if (!isValidName(name)) bad.name = waitlist.errors.nameChars;
    // an @ means an email; anything else is read as a phone number
    const isEmail = cleanText(contact).includes('@');
    if (!(isEmail ? isValidEmail(contact) : isValidMobile(contact))) bad.contact = waitlist.errors.contact;
    if (!consent) bad.consent = waitlist.errors.consent;
    setErrs(bad);
    if (Object.keys(bad).length) { document.getElementById(`wl-${Object.keys(bad)[0]}`)?.focus(); return; }
    busy.current = true;
    setSending(true);
    try {
      // bots fill every field: they get the same "you're on the list", and nothing is sent
      if (!trap) await submitWaitlist({ firstName: cleanName(name), contact: isEmail ? cleanEmail(contact) : normaliseMobile(contact), consent });
      setCrew({ waitlisted: true });
      setName(''); setContact(''); setConsent(false);
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  function restart() {
    setCrew({ waitlisted: false });
    requestAnimationFrame(() => document.getElementById('wl-name')?.focus({ preventScroll: true }));
  }

  return (
    <section id="waitlist" className={s.waitlist} aria-labelledby="wl-title">
      <div className={s.waitlistCopy}>
        <p className={`label ${s.eyebrow}`}>{waitlist.eyebrow}</p>
        <h2 id="wl-title" className={`display ${s.waitlistTitle}`} data-no-split>{waitlist.title}</h2>
        <p className="body">{waitlist.body}</p>
        <p className="small">{waitlist.under13}</p>
      </div>
      {crew.waitlisted ? (
        <div className={s.waitlistDone}>
          <p className="display t-md" role="status" data-no-split>{waitlist.done}</p>
          <button type="button" className={s.back} onClick={restart}>{waitlist.restart}</button>
        </div>
      ) : (
        <form className={s.waitlistForm} onSubmit={submit} noValidate>
          <div className={s.trap} aria-hidden>
            <label htmlFor="wl-website">Website</label>
            <input id="wl-website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
          </div>
          <Field id="wl-name" label={waitlist.name} autoComplete="given-name" maxLength={NAME_MAX} value={name}
            onChange={(e) => { setName(e.target.value); setErrs((o) => ({ ...o, name: undefined })); }} error={errs.name} />
          <Field id="wl-contact" label={waitlist.contact} autoComplete="email" spellCheck={false} autoCapitalize="none" maxLength={254} value={contact}
            onChange={(e) => { setContact(e.target.value); setErrs((o) => ({ ...o, contact: undefined })); }} error={errs.contact} />
          <Check id="wl-consent" checked={consent} onChange={(v) => { setConsent(v); setErrs((o) => ({ ...o, consent: undefined })); }} error={errs.consent}
            after={<Link href="/privacy" target="_blank" className="link">{waitlist.privacy}</Link>}>
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
