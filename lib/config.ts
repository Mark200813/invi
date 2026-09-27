/**
 * Switches that change what the site shows. Flip these, redeploy.
 */

/** INVI Build applications. While false, the form stays hidden and the
 *  section says "Join the crew to hear when applications open." */
export const APPLICATIONS_OPEN = false;

/** Boys in the Crew. `null` shows the placeholder. When the database is
 *  connected, fetch the real figure and pass it to <CrewCounter value={n} />.
 *  Never seed or estimate this number. */
export const CREW_COUNT: number | null = null;

/** Demo mode: forms validate and complete, but nothing leaves the browser.
 *  Turned off only by setting NEXT_PUBLIC_FORMS_LIVE=true on Vercel, once the
 *  database and /api routes exist. A production build refuses to run in
 *  demo mode (next.config.ts), so the site can never launch with forms that
 *  quietly go nowhere. */
export const DEMO_MODE = process.env.NEXT_PUBLIC_FORMS_LIVE !== 'true';

/** The INVI Crew WhatsApp group. Shown only after joining, and only to
 *  members 16 and over: the site promises under-16s that a parent or
 *  guardian approves before they are added (see join.fields.mobile.whatsapp).
 *  Recommended in WhatsApp: turn on "Approve new members" for this group. */
export const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/FyLg13RfyGlByPlHIKNg8H';
