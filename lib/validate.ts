/**
 * Input rules, shared by every form (and to be mirrored on the server when
 * the database is connected: the browser can always be bypassed).
 *
 * The aim is clean, honest data without ever rejecting a real person:
 * names in any language pass (O'Brien, Anne-Marie, José, Zoë, Łukasz, 李,
 * Nguyễn); symbols-only, markup, emoji and invisible characters do not.
 */

/** Zero-width, bidirectional-override and other invisible format characters. */
const INVISIBLE = /\p{Cf}/gu;
const CONTROL = /[\u0000-\u001F\u007F]/g;

/** Normalise any free text: composed form, no invisible or control characters, single spaces, trimmed. */
export function cleanText(v: string): string {
  return v.normalize('NFC').replace(INVISIBLE, '').replace(CONTROL, ' ').replace(/\s+/g, ' ').trim();
}

/* ── names ─────────────────────────────────────────────────────────────── */
export const NAME_MAX = 50;
/** Starts with a letter; then letters, marks, spaces, apostrophes, hyphens, full stops. */
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}' ’.-]*$/u;

export const cleanName = cleanText;
export function isValidName(v: string, max = NAME_MAX): boolean {
  const n = cleanName(v);
  return n.length >= 1 && n.length <= max && NAME_RE.test(n) && /\p{L}/u.test(n);
}

/* ── email ─────────────────────────────────────────────────────────────── */
const LOCAL = "[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*";
const LABEL = '(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?|xn--[A-Za-z0-9-]{1,59})';
const EMAIL_STRICT = new RegExp(`^${LOCAL}@(?:${LABEL}\\.)+[A-Za-z]{2,24}$`);

/** Trimmed, invisible characters removed, lower-cased (one person, one address). */
export function cleanEmail(v: string): string {
  let e = cleanText(v).replace(/\s/g, '').toLowerCase();
  // international domains: keep the ASCII (punycode) form the browser uses
  const at = e.lastIndexOf('@');
  if (at > 0) {
    try { e = e.slice(0, at + 1) + new URL(`http://${e.slice(at + 1)}`).hostname; } catch { /* left as is; will fail validation */ }
  }
  return e;
}
export function isValidEmail(v: string): boolean {
  const e = cleanEmail(v);
  const at = e.lastIndexOf('@');
  return e.length <= 254 && at > 0 && at <= 64 && EMAIL_STRICT.test(e);
}
/** The same mailbox, ignoring +tags and letter case (for the guardian-is-not-you check). */
export function sameMailbox(a: string, b: string): boolean {
  const key = (v: string) => {
    const e = cleanEmail(v).replace(/\.$/, '');
    const at = e.lastIndexOf('@');
    if (at < 0) return e;
    let local = e.slice(0, at).replace(/\+.*$/, '');
    let domain = e.slice(at + 1);
    if (domain === 'googlemail.com') domain = 'gmail.com';
    if (domain === 'gmail.com') local = local.replace(/\./g, '');
    return `${local}@${domain}`;
  };
  return key(a) === key(b);
}

/* ── mobile ────────────────────────────────────────────────────────────── */
/**
 * Accepts numbers the way people write them: 07700 900123, +44 7700 900123,
 * +44 (0) 7700 900123, 0044 7700 900123. Returns E.164 (+447700900123), or ''
 * for an empty field. Anything that is not a plausible number comes back
 * unchanged (with its junk), so it fails isValidMobile.
 */
export function normaliseMobile(v: string): string {
  const raw = cleanText(v);
  if (!raw) return '';
  let n = raw.replace(/[\s().-]/g, '');
  if (n.startsWith('00')) n = '+' + n.slice(2);
  n = n.replace(/^\+440/, '+44');                  // +44 (0)7700 ... drops the trunk 0
  if (/^07\d{9}$/.test(n)) n = '+44' + n.slice(1);  // UK mobile written locally
  return n;
}
export const isValidMobile = (v: string) => /^\+[1-9]\d{7,14}$/.test(normaliseMobile(v));
