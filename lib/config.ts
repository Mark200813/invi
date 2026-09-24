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
 *  The payload each form would send is logged to the console instead. */
export const DEMO_MODE = true;
