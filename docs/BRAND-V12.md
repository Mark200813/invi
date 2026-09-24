# INVI V12 master brand system: what is locked

Extracted from `INVI_Brand_Guidelines_V12_Master_Brand_System.pdf`, August 2026.
Reference only. Nothing here is wired into the site yet.

A note on reading the PDF: individual page footers still say V8 through V11
under the V12 master, and older text sits underneath newer text on several
pages. Where the two disagree, the rendered page is what counts.

## Locked, per the master handoff

| | |
|---|---|
| Position | WHERE SCENT, SKIN AND MOOD MEET. |
| Proof | BUILT WITH BOYS. BACKED BY SCIENCE. INSPIRED BY CULTURE. |
| Shorthand | SCENT. SKIN. MOOD. |
| Category | HYBRID BODY SPRAY |
| Technology | SKIN + MOOD ACTIVES |
| Pack | AIR POWERED TECHNOLOGY |
| Character | Confident · Together · Grounded |

## The logo

An asset, never a type treatment. Never retype, redraw or regenerate it, and
never alter the N. Clear space 0.5x the wordmark height on all sides. Minimum
width 72px digital.

Approved: ink on bone, stone or light photography. Bone or white on dusk, ink
or dark photography. Tonal emboss, deboss and stitching.

**Blocked on `01_LOGOS` vector.** The mark's N is custom drawn: its diagonal
meets the right stem partway up with asymmetric angled cuts. No grotesque
reproduces it, so the current Archivo version cannot be corrected by choosing a
closer font.

## Colour

Full values and measured contrast live in `tokens-v12.css`. The shape of it:
bone, stone and concrete carry the page, dusk appears only in selected impact
sections, ink is for copy and never the dominant page colour. Roughly 60%
foundation, 25% expressive colour, 15% scent gradient.

Digital colour may run brighter than the pack. Product depiction may not.

## Scent worlds

| | Feel | Gradient |
|---|---|---|
| ORIGIN | fresh / ozonic / alive | mineral blue > open sky > fresh green |
| RISE | citrus / woody / energetic | deep brown > tangerine > sun yellow |
| AFTER DARK | spicy / rich / expressive | aubergine > violet > mood pink |

Open Sky, Deep Brown and Violet are bridge tones inside the gradients, not
standalone colours.

The rule that matters: use these to build recognisable scent worlds, but never
turn every section into a gradient. One colour field, crop or light effect is
usually enough.

## Typography

Inter, and only Inter, for live type. Regular for body, Medium or SemiBold for
headings, navigation and CTAs. Campaign condensed type is approved only as
supplied artwork; substituting a lookalike is called out explicitly.

Scale: H1 72/72, H2 48/52, H3 28/34, body 18/28, eyebrow 12/16 at +0.12em.
Mobile: H1 44/46, H2 34/38, body 17/26. Reach for scale and space before extra
weights.

## Layout

12 columns desktop, 8 tablet, 4 mobile. Max content 1280px. Outer margins
64-80px. Section spacing 120-160px desktop, 72-96px mobile. Build mobile first
and test at 390, 768 and 1440.

## Components and motion

Buttons rectangular, calm, direct. No pill shapes. States change by subtle tone
shift, underline, or 2-4% opacity. Focus must stay visible.

Motion is reveal, drift, fade, crop, light. Slow image reveals, small text
movement, restrained transitions. No bounce, spin, scale, app-style
micro-interactions, excessive parallax, or permanently animated gradients.

Gradients are for scent, product and campaign moments. Not default UI.

## Accessibility and safeguarding

WCAG AA for body text, links and controls. Ink or dusk for small text on bone
or stone. Visible keyboard focus everywhere. Respect reduced motion. Comfortable
tap targets.

Capture age clearly wherever participation depends on it. Provide a guardian
consent route. Plain English privacy for boys and parents. No dark-pattern
consent, no manufactured urgency, no fear-based fixing language. Keep
safeguarding and privacy links easy to find, and keep marketing opt-in separate
from participation consent.

The current build already satisfies this section.

## Recommended landing page anatomy

One page, three jobs: establish the idea, recruit community and programme,
capture the first-drop waitlist. Not an ecommerce site yet.

1. Hero. Where scent, skin and mood meet. One primary CTA.
2. Brand idea. Scent. Skin. Mood. Minimal copy, strong imagery.
3. Built with boys. Community invitation and what taking part means.
4. Entrepreneur programme. Short explanation, application CTA.
5. First drop. Email capture. No price, no catalogue.
6. Close and footer. Proof line, socials, privacy, safeguarding, terms.

## Open questions for Viv

1. Light versus dark. The guidelines ask for bone first; the site is dark
   throughout. Confirm before rebuilding.
2. The hero line is prescribed as "Where scent, skin and mood meet" (p16, and
   repeated on the cover, the p9 mock and the p10 "WE SAY" list). It contains
   "scent", which the site bans outright, so that ban has to lift.
   The cryptic approach itself is NOT overruled. The PDF has no instance of
   mystery, cryptic, tease, secret, withhold, intrigue, curiosity or
   pre-launch, so it never addresses the strategy, and the prescribed line is
   evocative rather than explanatory: it shows no pack and no function.
   "Hybrid body spray" is not landing page copy. Its three appearances are the
   handoff list (p17), the front-of-pack hierarchy (p19) and the message
   architecture (p22). p10 and p22 both restrict category language to
   "clarity, retail or SEO", and p22 assigns it to retail. Keep it off.
3. The scent gradients clash with the day-cycle concept. Origin is blue to
   green, our icon is a sunrise. If the gradients are locked, the day cycle and
   its three icons go.
4. The scrolling sky is a permanent full-page gradient, which the motion rules
   exclude.
5. Photography. The PDF does not say to use its own images; the ones on p7-8
   are mood-board references (two are mockups with example ad copy baked in,
   not licensed shots). It does specify a style (candid, unstaged, "everyday
   epic", p7) and layout rules for whatever photography is used (large
   format, full-bleed, specific crops, p9/13/14). p17 requires rights
   clearance before publication and p23 names a `07_RIGHTS_AND_RELEASES`
   folder. Since subjects would be boys aged 13-17, this cannot be sourced
   independently: need `04_PHOTOGRAPHY` and `07_RIGHTS_AND_RELEASES` from Viv.

## Asset pack still needed

`01_LOGOS` (blocking), `03_SCENT_GRADIENTS`, `04_PHOTOGRAPHY`,
`06_FONTS_AND_LICENSES`. Naming convention is `INVI_[ASSET]_[VARIANT]_V12.ext`.
