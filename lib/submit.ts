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
    // which fields would be sent, never their values: this runs on real
    // visitors' devices, some of them children
    const shape = Object.fromEntries(Object.entries(body).map(([k, v]) => [k, typeof v === 'string' ? (v ? `(${v.length} chars)` : '') : v]));
    console.log(`[INVI demo] ${kind} →`, shape);
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

// input rules live in lib/validate.ts
