# INVI: pre-launch site (rebuild)

Next.js (App Router) + TypeScript, deployed on Vercel. Every push to a branch
gets its own Vercel preview. `main` stays on the previous static build until
the rebuild is approved.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Where things live

| | |
|---|---|
| `lib/content.ts` | **Every word on the site.** Official copy only; sources are noted inline. |
| `lib/config.ts` | Switches: `APPLICATIONS_OPEN`, `CREW_COUNT` (null = placeholder), `DEMO_MODE`. |
| `lib/submit.ts` | The one place form data leaves the page. Demo mode logs the payload. |
| `lib/store.ts` | What this browser remembers (joined, reference, locked vote). |
| `components/home/*` | Home page chapters: hero, three moments, product, belief, crew. |
| `components/join/*` | Join the Crew (one question per screen), roadmap vote, waitlist, application. |
| `app/*/page.tsx` | Let's Talk, For Parents, Safeguarding, Privacy, Community Terms. |
| `public/cans/*` | Stills rendered from the INVI Can Studio model (poster + fallback for the 3D). |

## Going live with data

1. Build the endpoints (`/api/crew`, `/api/waitlist`, `/api/vote`, `/api/application`).
2. Set `DEMO_MODE = false` in `lib/config.ts`.
3. Feed the real crew count to `<CrewCounter value={n} />`. It counts up on change. Never seed it.

## Phases

1. **Foundation** (this build): type system, all content, join + vote + waitlist working in demo mode.
2. **Motion** (done): masked line reveals, parallax, pinned three-moments scene, count-ups, marquee. All in `components/site/Motion.tsx`.
3. **3D** (done): the live can from the INVI Can Studio model (`lib/can/invi-can.js`, `components/can/*`). It mirrors the poster renders, which stay as first paint and fallback.
4. **Polish** (done): mobile performance, Lighthouse, accessibility audit, fallbacks, share image, 404.

## Keeping it fast (read before adding motion or 3D)

- The 3D starts on the first pointer, touch, key or scroll, then waits for a
  pause (`components/can/CanLayer.tsx`). A page load alone never pays for it.
- It renders on demand (`want(ms)` in `CanStage.tsx`). Anything new that moves
  the can must ask for frames, or it will freeze between scrolls.
- Nothing per frame may read layout (`getBoundingClientRect`, `getComputedStyle`,
  `scrollWidth`...). Measure on resize / `ScrollTrigger` refresh and cache.
- Reveals fade with `opacity`, never `autoAlpha`: hidden text drops out of the
  accessibility tree, and labels stop labelling their fields.
- The hero can poster must never start transparent: it is the page's LCP image.
- Phones get `label-*-1k.webp`, a 1.25 pixel ratio and 64-segment geometry.

Last measured (Lighthouse mobile, local production build): home performance
86-89, accessibility 100, best practices 100. SEO reads low only because the
pre-launch site is `noindex`; remove that in `app/layout.tsx` at launch.

Brand references: `docs/PRODUCT.md`, `docs/BRAND-V12.md` (visual-direction rules there are superseded by the rebuild brief).
