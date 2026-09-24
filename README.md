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
2. **Motion**: masked text reveals, parallax, the pinned three-moments chapter.
3. **3D**: the live can (from `INVI Can Studio`), scroll-driven rotation, cursor physics, loader.
4. **Polish**: performance, accessibility audit, fallbacks.

Brand references: `docs/PRODUCT.md`, `docs/BRAND-V12.md` (visual-direction rules there are superseded by the rebuild brief).
