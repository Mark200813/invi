import { DEMO_MODE } from './config';

/**
 * The one place form data leaves the page. In demo mode it is logged and
 * resolved after a short beat, exactly as the previous build did. To go live,
 * replace the body of `send` with a POST to the real endpoint. Field names
 * already match Viv's /api/waitlist payload where they overlap.
 */
async function send(kind: string, payload: Record<string, unknown>) {
  const body = { ...payload, ts: new Date().toISOString() };
  if (DEMO_MODE) {
    console.log(`[INVI demo] ${kind} →`, body);
    await new Promise((r) => setTimeout(r, 620));
    return { ok: true as const };
  }
  const res = await fetch(`/api/${kind}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${kind} failed: ${res.status}`);
  return { ok: true as const };
}

export type CrewPayload = {
  firstName: string;
  email: string;
  ageRange: string;
  guardianName: string;
  guardianEmail: string;
  invitedBy: string;
  mobile: string;
  whatsappInvite: boolean;
  joinConsent: boolean;
  marketingConsent: boolean;
};

export const submitCrew = (p: CrewPayload) => send('crew', p);
export const submitWaitlist = (p: { firstName: string; contact: string; consent: boolean }) => send('waitlist', p);
export const submitVote = (p: { vote: string; ref: number | null }) => send('vote', p);
export const submitApplication = (p: Record<string, unknown>) => send('application', p);

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** A number with its country code: +, then 8 to 15 digits (spaces allowed). */
export const MOBILE_RE = /^\+\d{8,15}$/;
export const normaliseMobile = (v: string) => v.replace(/[\s()-]/g, '');
