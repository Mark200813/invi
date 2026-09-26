'use client';

import { useEffect } from 'react';

/**
 * The way in. A black stage; the INVI wordmark is drawn out of the dark by a
 * sweep of light while the site (fonts, the hero render, the live 3D can)
 * gets ready behind it; then the dark lifts like a curtain and the hero's own
 * entrance, and the can's light coming on, play as it opens.
 *
 * Whether it shows at all is decided before first paint by the inline script
 * in app/layout.tsx (home page, first visit this session, no #anchor, motion
 * allowed), which sets `intro-on` on <html>. That script also carries the
 * failsafe: whatever happens here, the curtain is gone after 6 seconds.
 *
 * It lasts as long as the site needs, within limits: never under ~1.7s (the
 * sweep has to finish), never over 3.8s (a slow connection just continues
 * loading in the open). Any tap, click, key or wheel skips it.
 */
const MIN = 1700, MAX = 3800;

export default function Intro() {
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains('intro-on')) return;
    let done = false;

    // the curtain lifts through the one idempotent routine in the inline
    // script (app/layout.tsx), so a skip, the failsafe and this can never
    // lift it twice
    const finish = () => {
      if (done) return;
      done = true;
      (window as Window & { __inviIntroEnd?: () => void }).__inviIntroEnd?.();
    };

    // the live can: ready, or known not to be coming
    const can = new Promise<void>((resolve) => {
      // phones and modest machines don't wait for the 3D (see layout.tsx)
      if (html.dataset.can3d || html.dataset.canSkip || html.dataset.introLite) return resolve();
      const mo = new MutationObserver(() => { if (html.dataset.can3d) { mo.disconnect(); resolve(); } });
      mo.observe(html, { attributes: true, attributeFilter: ['data-can3d'] });
      addEventListener('invi:can-skip', () => { mo.disconnect(); resolve(); }, { once: true });
    });
    const poster = document.querySelector<HTMLImageElement>('[data-hero] img');
    const ready = Promise.all([
      document.fonts?.ready,
      poster?.decode ? poster.decode().catch(() => {}) : null,
      can,
    ]);
    // both limits count from arrival (navigation start), not from when this
    // script happened to run: a slow page must not make the intro longer
    const since = performance.now();
    const least = new Promise((r) => setTimeout(r, Math.max(0, MIN - since)));
    Promise.all([ready, least]).then(finish);
    const most = setTimeout(finish, Math.max(0, MAX - since));

    // skipping is handled by the inline script, from the very first paint
    return () => clearTimeout(most);
  }, []);

  return (
    <div className="intro" aria-hidden>
      <div className="intro-glow" />
      <div className="intro-inner">
        <span className="intro-mark" />
      </div>
    </div>
  );
}
