/**
 * Every word on the site lives here.
 *
 * Official copy only. Sources, so nothing drifts:
 *   [site]  the previous INVI build (repo `main`, invi-eosin.vercel.app)
 *   [viv]   Viv's build, join-invi-community.vivpax.chatgpt.site (newer; wins
 *           where the two disagree on facts, e.g. the contact address)
 *   [mark]  wording Mark asked for directly
 *   [new]   written for the stress-test fixes (Sept 2026): a draft for Viv to
 *           approve, in the same voice
 * Anything still missing is written as [COPY NEEDED], never invented.
 */

export const CONTACT_EMAIL = 'hello@weareinvi.com'; // [viv]

export const meta = {
  title: 'INVI · Where scent, skin and mood meet.', // [site]
  description:
    'INVI brings scent, skin and mood together for teenage boys, from 13 up. Join the Crew and hear when applications open for the first INVI Build Programme.', // [viv]
  ogTitle: 'Where scent, skin and mood meet.', // [viv]
  ogDescription: 'Join the INVI Crew and help build what comes next.', // [viv]
};

export const proofLine = ['Built with boys.', 'Backed by science.', 'Inspired by culture.']; // [site][viv]

export const nav = [
  { label: 'The Product', href: '/#product' },
  { label: 'The Crew', href: '/#crew' },
  { label: 'Let’s Talk', href: '/lets-talk' },
  { label: 'For Parents', href: '/parents' },
];

export const joinCta = 'Join the Crew'; // [viv]

export const counter = {
  label: 'boys in the Crew', // [viv] "BOYS IN THE CREW"
  // [mark] a placeholder that reads as one, until the database is connected
  placeholder: 'XX',
  placeholderNote: 'Live count coming soon',
};

export const hero = {
  // the eyebrow "Body care for what's next" is gone: the opening keeps only
  // the headline, the can and the Founding Crew call [mark]; it also echoed
  // the footer's "Body care built with the next generation" [dedupe]
  titleLines: ['Where scent,', 'skin and mood'], // [site][viv]
  titleAccent: 'meet.',
  footnoteLead: 'Founding Crew now open.', // [viv]
  footnote:
    'Join now for product testing, selected samples, limited merch and first access to new opportunities.', // [viv]
};

export type ScentKey = 'origin' | 'rise' | 'after-dark';

export const moments = {
  intro: 'Three are coming, one for each part of the day.', // [site]
  // [viv] the hero lede, moved here from the opening [mark]. "Whatever comes
  // next." dropped: "next" was said eight times on the page [dedupe]
  lede: 'INVI brings scent that lasts, skin actives and mood technology together for real life. School. Sport. Going out.',
  items: [
    {
      key: 'origin' as ScentKey,
      name: 'Origin',
      kicker: 'First light',
      line: 'Before anyone’s asked anything of you. The quiet part of the day that belongs to you and nobody else.',
      desc: 'The moments that start it all.',
      colours: ['#3F7FA3', '#78BFD0', '#6F9B4B'],
      can: '/cans/can-origin-front.webp',
      canAngle: '/cans/can-origin-angle.webp',
      photo: { src: '/img/origin-hold.webp', w: 984, h: 1228, alt: 'A boy in morning light, holding an ORIGIN can against his forehead' },
    },
    {
      key: 'rise' as ScentKey,
      name: 'Rise',
      kicker: 'Full sun',
      line: 'Everything happening at once. Corridors, pitches, group chats, the bit where you have to show up as yourself.',
      desc: 'The moments in motion.',
      colours: ['#6B3A24', '#F28A32', '#F2C84B'],
      can: '/cans/can-rise-front.webp',
      canAngle: '/cans/can-rise-angle.webp',
      photo: { src: '/img/rise-court.webp', w: 1023, h: 1537, alt: 'A player crouched on a court, an INVI can beside the basketball' },
    },
    {
      key: 'after-dark' as ScentKey,
      name: 'After Dark',
      kicker: 'After sundown', // [mark] was 'After dark', which repeated the name
      line: 'When it counts and nobody needs it explained. The version of you that only comes out once the day’s done.',
      desc: 'Moments worth staying out for.', // [dedupe] the line already says nobody needs it explained
      colours: ['#49304A', '#84549A', '#D66BA0'],
      can: '/cans/can-after-dark-front.webp',
      canAngle: '/cans/can-after-dark-angle.webp',
      photo: { src: '/img/evening-crew.webp', w: 1536, h: 1024, alt: 'Four friends by a city court after dark, lit by the street lights' },
    },
  ],
};

export const product = {
  eyebrow: 'Engineered to perform', // [viv]
  title: ['Made for', 'every moment', 'in between.'], // [dedupe] was 'Built for', also the philosophy title
  body: 'Developed with master perfumers in Japan. Manufactured in the UK. Shaped by the Crew.', // [dedupe] the scent/skin/mood trio is said in the moments intro and the features
  subEyebrow: 'Body spray. Reimagined.', // [viv /products]
  subTitle: ['Smells good.', 'Does more.'],
  subBody: ['All of it in one seriously smart spray.'], // [dedupe] the trio and the perfumers were each said three times
  features: [
    { n: '01', k: 'Scent', t: 'Made to last', d: 'Long-lasting fragrance, tuned to different moments, moods and plans.' }, // [dedupe] 'Smells incredible' echoed 'Smells good.'
    { n: '02', k: 'Skin', t: 'Kind to skin', d: 'Skin-focused actives meet premium scent in one easy everyday spray.' }, // [dedupe] was 'Built for skin'
    { n: '03', k: 'Performance', t: 'Fresh, not covered up', d: 'Advanced fragrance technology is designed to help stop odour before it starts, rather than simply masking it.' },
    { n: '04', k: 'Mood', t: 'Match your moment', d: 'Scent and mood technology designed to help you feel ready for anything.' }, // [dedupe] 'whatever comes next'
  ],
  air: {
    eyebrow: 'Air powered technology',
    title: ['A better way', 'to spray.'],
    body: [
      'Our air-powered spray system delivers a fine pressurised mist without traditional aerosol propellants.',
      'It is designed to protect the integrity of the fragrance and elevate the spray experience.',
    ],
  },
  moment: ['For the moments', 'you don’t want to end.'], // [viv]
  momentVideoLabel: 'A group on the beach as the sun goes down', // [site]
};

export const belief = {
  eyebrow: 'Our philosophy', // [viv]
  title: ['Built for the', 'years that', 'shape you.'],
  body: [
    'INVI is inspired by the Latin word *Invictus*. Unconquered. Grounded, and true to yourself.', // [dedupe] 'who you are' was said five times
    'Our belief is simple. Body care should meet you where you are, not tell you who to be. That’s why we’re building INVI with you.', // [dedupe]
  ],
  // [site] the creed
  creed: [
    'Not about becoming someone else.',
    'Not about fitting in.',
    'About the confidence to become *more of who you already are.*',
    'Built for *every version of you.*', // [dedupe] 'every moment' is the product title
  ],
  shorthand: ['Scent.', 'Skin.', 'Mood.'], // [site] locked shorthand
  photoAlt: 'A next-generation boy wearing the INVI wordmark', // [viv]
};

export const proof = {
  eyebrow: 'What we heard', // [site]
  title: 'A generation is redefining confidence, and few brands have moved with them.',
  quote: 'People always say what masculinity shouldn’t be, but don’t say what it is.',
  quoteBy: 'Male Allies UK',
  stats: [
    { v: 81, s: '%', t: 'don’t feel there are enough spaces to be a boy today' },
    { v: 79, s: '%', t: 'aren’t clear what masculinity means' },
    { v: 72, s: '%', t: 'don’t have more than one person who knows them well' },
    { v: 85, s: '%', t: 'want to help shape a brand built for them' },
  ],
  source: 'Independent research by Male Allies UK with 1,032 teenage boys, plus 62 boys who told us directly.',
};

export const building = {
  eyebrow: 'How we’re building it', // [site]
  title: 'We launch culture, before we launch anything else.',
  comingSoon: ['Coming soon.', 'A new world of body care, built around what you need.'], // [viv], trimmed [dedupe]
  pillars: [
    { k: 'Co-created', t: 'Not marketed to them', d: 'Our founding community of 62 boys already influences everything from development to brand and content.' }, // [dedupe] 'Built with boys' is in the footer
    { k: 'Credible role models', t: 'Belief, not noise', d: 'We don’t build community through creators alone. We build it through culture, credible role models, and our own community of boys.' },
    { k: 'A brand that grows', t: 'Here for the duration', d: 'Designed to grow up alongside boys, rather than showing up once and moving on.' }, // [dedupe] 'the years that shape' is the philosophy title
  ],
};

export const crew = {
  eyebrow: 'The Founding Crew', // [viv]
  title: ['Be there', 'from day one.'],
  sub: 'New people. New skills. A seat at the table.', // [dedupe]
  photoAlt: 'Four friends on a sea wall at dusk, laughing together',
  closer: {
    eyebrow: 'More than a waitlist', // [viv /join-the-crew]
    title: 'Get closer to the action.',
    body: [
      'Meet and learn from some of the UK’s leading entrepreneurs, creators and industry experts.',
    ], // second line dropped [dedupe]: the samples-merch-events list appeared five times
  },
  benefits: [
    { n: '01', t: 'Make your mark', d: 'Your ideas could shape a real product, campaign or piece of content. No pretend briefs. This is the real thing.' },
    { n: '02', t: 'Meet your people', d: 'Connect with other Crew members, swap ideas, make new friends and build something together.' },
    { n: '03', t: 'Learn from the best', d: 'Pick up skills you won’t learn in class, from people who’ve done it for real.' }, // [dedupe]
    { n: '04', t: 'Get first dibs', d: 'Try products before they launch, and hear first about internships, paid roles and events.' }, // [dedupe]
  ],
  founding: {
    eyebrow: 'First 100 only', // [dedupe] was 'The Founding 100', the same as the title
    title: ['Be one of the', 'Founding 100.'],
    // [mark] the first 100 get the card AND the hoodie. Viv's version tied the
    // hoodie to a Crew challenge: CONFIRM WITH VIV which is right.
    body: 'The first 100 approved INVI Crew members receive a numbered Founder Card and limited INVI merch: the Founding hoodie.',
    hoodie: 'Made for them alone, with the INVI marks embossed in 3D.', // [new]
    hoodieAlt: { front: 'The Founding hoodie, front', back: 'The Founding hoodie, back' },
    cardLabel: 'Founder Card',
  },
};

export const build = {
  eyebrow: 'INVI Build. Cohort 01', // [viv], 'Founding' trimmed [dedupe]
  title: ['The first Crew.', 'Real mentors.', 'A real launch.'],
  body: 'Not work experience. Not a focus group. Make decisions, test ideas, create content and see how a real brand gets built, alongside the INVI team and its mentors.', // [dedupe]
  live: {
    title: 'Hands on from the start.', // [dedupe] 'Real' was said five times in this chapter
    body: 'Work on live briefs across scent, product, packaging, content and campaigns.',
  },
  // [site] the programme steps
  steps: [
    { n: '01', t: 'Apply', d: 'Tell us who you are and why you want in. No CV, no experience needed.' },
    { n: '02', t: 'Get selected', d: 'Twelve places. We’re looking for people with something to say, not the loudest ones.' },
    { n: '03', t: 'Get mentored', d: 'Sessions led by leading UK entrepreneurs, showing what confidence and ambition actually look like.' },
    { n: '04', t: 'Build it', d: 'You shape the brand itself, from what gets made to how it shows up in the world.' },
  ],
  safeguardLead: 'Worth knowing first.',
  safeguard: 'The programme is filmed, and under 18s need a parent or guardian’s consent to take part.',
  closed: 'Join the Crew to hear when applications open. For boys from 13 up.', // [viv], age as a guide [mark]
  closedTag: 'Applications not open yet',
};

/** [site] programme application: hidden until APPLICATIONS_OPEN (lib/config). */
export const application = {
  title: 'Put your name forward.',
  lede: 'Applications are read by the team. We’ll come back to everyone either way.',
  sections: ['Who you are', 'Why you', 'Before you send'],
  why: 'What would you bring to the twelve?',
  whyHelp: 'No right answer and no word count to hit. A few lines in your own words beats a paragraph in someone else’s.',
  whyPlaceholder: 'Start anywhere.',
  whyShort: 'A little more and it’s ready to send.',
  whyOk: 'That’s enough to send.',
  terms: [
    'The programme is filmed as a documentary series.',
    'Under 18s need a parent or guardian’s consent, and we contact them directly.',
    'Filming follows clear protocols and community spaces are moderated throughout.',
  ],
  consent: 'I’ve read the three points above and I’m putting my name forward.',
  submit: 'Send application',
  sending: 'Sending',
  footNote: 'Read by the team. We come back to everyone either way.',
  doneTag: 'Application received',
  // [new] ages the programme can't take
  under13: 'The programme is for 13 and up, so we can’t take an application yet. We’d love to hear from you when you’re 13.',
  parent: 'Applications come from the young person themselves. Share this page with them, and you can read how it works on our For Parents page.',
  doneMsg: 'Your application is in. We read every one and come back to everybody either way, so keep an eye on your inbox.',
  errors: {
    name: 'We need your name.',
    nameChars: 'Use letters only, as you’d write your name.', // [new]
    email: 'That email doesn’t look right.',
    age: 'Pick your age.',
    guardianName: 'We need their name.', // [new]
    guardianNameChars: 'Use letters only, as you’d write a name.', // [new]
    guardian: 'Under 18s need a parent or guardian’s email.',
    guardianSame: 'Use your parent or guardian’s own email, not yours.', // [new]
    whyLong: 'That’s a lot. Keep it under 2,000 characters.', // [new]
    why: 'Give us a couple of lines at least.',
    consent: 'You’ll need to tick this to apply.',
  },
};

export type RoadmapKey = 'hair-reset' | 'body-mist' | 'shaving-skin' | 'body-wash';

export const roadmap = {
  eyebrow: 'The product roadmap', // [viv /products]
  title: 'What should we make next?',
  body: 'Join the Crew, cast your vote and help decide which one we make.', // [dedupe]
  items: [
    { key: 'hair-reset' as RoadmapKey, n: '01', t: 'Hair Reset', d: 'A refreshing spray for hair between washes, after sport or whenever it needs a reset.' },
    { key: 'body-mist' as RoadmapKey, n: '02', t: 'Body Mist', d: 'A lighter fragrance layer for your scent wardrobe.' },
    { key: 'shaving-skin' as RoadmapKey, n: '03', t: 'Shaving + Skin', d: 'Products designed around the first years of shaving and changing skin.' },
    { key: 'body-wash' as RoadmapKey, n: '04', t: 'Body Wash', d: 'Everyday cleansing built around scent, skin and the INVI routine.' },
  ],
  locked: 'Join the Crew to vote', // [viv]
  // [site] the locked-vote wording, carried over from the scent vote
  joinFirst: 'Join first, then vote. Takes ten seconds.',
  oneVote: 'You get one vote. Once it’s in, it’s locked.',
  picked: 'You’ve picked',
  warn: 'Once you confirm, it’s locked. You can’t change it later.',
  confirm: 'Confirm',
  yourPick: 'Your pick',
  lockedIn: 'Locked in.',
  closing: 'Your vote helps decide what we make.', // [viv], reworded [dedupe]
};

export const join = {
  eyebrow: 'Sign up', // [dedupe] 'Be there from day one' is the Crew title
  gift: 'Early members get an exclusive launch gift', // [viv], reworded [dedupe]: 'Join now for' opens the hero card
  title: 'Save your place.', // [dedupe]
  community: 'INVI is made for teenage boys, from 13 up. For members under 18, parent or guardian permission is required before participation in activities beyond receiving email updates, including filming, product testing, events and selected INVI Build activities.',
  already: 'Already in the Crew? You’re counted.',
  fields: {
    name: { label: 'First name', placeholder: 'What do people call you?' },
    email: { label: 'Email address', placeholder: 'you@example.com' },
    age: { label: 'Age range', options: ['Under 13', '13 to 15', '16 to 17', '18+'] as const, note: 'We only ask for what fits your age.' }, // Under 13 [mark]; note [dedupe]
    guardian: {
      label: 'Parent or guardian',
      nameLabel: 'Their name',
      emailLabel: 'Their email',
      emailPlaceholder: 'their@email.com',
      note: 'When someone under 18 signs up, we ask for a parent or guardian’s name and email address. We contact that adult before the young person takes part in anything beyond receiving email updates.',
    },
    invited: { label: 'Who invited you?', optional: 'Optional' },
    mobile: {
      label: 'Mobile number',
      optional: 'Optional',
      help: 'Only needed if you want a WhatsApp Community invite. Include your country code.',
      whatsapp: 'Send me an invite to the INVI WhatsApp Community. I understand my number is visible to community admins and may be visible to people in groups I join. If I’m under 16, a parent or guardian must approve before I’m added.',
    },
    consent: 'I agree to join the Crew and first drop list. If I’m under 16, I have permission from my parent or guardian.',
    marketing: 'Send me occasional news, opportunities and launch updates.',
  },
  submit: 'I’m in',
  submitting: 'Adding you',
  next: 'Next',
  back: 'Back',
  skip: 'Skip',
  privacy: 'Privacy',
  notes: [
    // the under-18 permission note is already said beside the form [dedupe]
    'Your details stay with us. Phone numbers are only used for requested WhatsApp invites. No spam. No selling your data.',
  ],
  // Error wording: [site] where the field existed before; the rest is the
  // plainest statement of the rule, in the same voice.
  errors: {
    name: 'We need something to call you.', // [site]
    nameChars: 'Use letters only, as you’d write your name.', // [new]
    otherNameChars: 'Use letters only, as you’d write a name.', // [new]
    email: 'That email doesn’t look right.', // [site]
    age: 'Pick your age range.',
    guardianName: 'We need their name.',
    guardianEmail: 'Under 18s need a parent or guardian’s email.', // [site]
    mobile: 'That number doesn’t look right. Try 07… or +44…', // [new]
    whatsapp: 'Add your mobile number to get a WhatsApp invite.',
    guardianSame: 'Use your parent or guardian’s own email, not yours.',
    consent: 'Tick the box to join the Crew.',
    missed: 'One answer needs another look.', // [new]
  },
  // [new] Under 13: nothing else is asked, nothing is stored (UK: 13 is the
  // age of digital consent, DPA 2018 s9; WhatsApp's UK minimum is also 13).
  under13: {
    title: 'Not just yet.',
    body: 'INVI is made for 13 and up, so we can’t take your details yet. A parent or guardian can join the first drop waitlist for you, and we’ll see you when you’re 13.',
    cta: 'Show a parent the waitlist',
  },
  // [new] the Crew group chat, offered on the pass once someone has joined
  whatsapp: {
    eyebrow: 'The Crew group chat',
    title: 'Come say hello.',
    body: 'Where the Crew talks first: drops, votes and what’s happening behind the scenes.',
    cta: 'Join the group chat',
    note: 'Opens WhatsApp. Group admins can see your number, and other members may too.',
    approvalTitle: 'The group chat comes next.',
    approval: 'For under 16s, a parent or guardian approves first. We’ll be in touch with them, then send your invite.',
  },
  restart: 'Not you? Start again', // [new]
  done: {
    tag: 'You’re in', // [site]
    ref: 'Ref',
    vote: 'Cast your vote',
    share: 'Send to a friend', // [site]
    shareText: 'Join the INVI Crew and help build what comes next.', // [viv] og description
    copied: 'Link copied.', // [site]
    copyFail: 'Copy the link from the address bar.', // [site]
  },
  noscript: 'Joining needs JavaScript switched on. You can also email us at', // [new]
};

export const waitlist = {
  eyebrow: 'First drop waitlist', // [viv]
  title: 'Not ready for the Crew?',
  body: 'Join the waitlist instead. We’ll let you know when the first INVI drop is ready.',
  under13: 'Under 13? Ask a parent or guardian to sign up here with their own name and email.', // [new]
  name: 'First name',
  contact: 'Email or mobile number',
  consent: 'Yes, INVI can contact me about the first drop and occasional launch news. If I’m under 16, I have permission from a parent or guardian.',
  submit: 'Join the waitlist',
  submitting: 'Adding you',
  done: 'You’re on the list.',
  privacy: 'How we use your details', // [new]
  restart: 'Not you? Start again', // [new]
  errors: {
    name: 'We need something to call you.',
    nameChars: 'Use letters only, as you’d write your name.', // [new]
    contact: 'Add an email address, or a mobile number like 07… or +44…', // [new]
    consent: 'Tick the box so we’re allowed to contact you.', // [site], adapted
  },
};

export const note = {
  eyebrow: 'A note from us', // [viv]
  body: 'Our hope is that INVI becomes your trusted companion. A brand that invites you to feel confident in who you are, explore who you are becoming and make more of every moment.',
  signoff: ['From your', 'team'],
};

export const footer = {
  links: [
    { label: 'For Parents', href: '/parents' },
    { label: 'Safeguarding', href: '/safeguarding' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Community Terms', href: '/community-terms' },
    { label: 'Contact', href: `mailto:${CONTACT_EMAIL}` },
  ],
  legal: '© 2026 INVI. Body care built with the next generation.', // [viv]
  preSale: 'Nothing for sale yet.', // [site]
};

export const letsTalk = {
  eyebrow: 'Real answers. No awkwardness.', // [viv /stories]
  title: ['Let’s', 'talk.'],
  body: 'Skin, sweat, fragrance, style, confidence, food, fitness and all the things nobody really explains properly.',
  internship: {
    eyebrow: 'Internships', // [mark] time-sensitive details removed
    title: ['Make content.', 'Get paid.'],
    body: 'Paid internships are coming up, with sign-up opening soon. Go behind the scenes, bring your ideas and help create content for a brand being built with you.',
    tags: ['Paid internships'],
    cta: 'Coming Soon', // [mark]
  },
  topicsTitle: 'The stuff you actually want to know.',
  topicsBody: 'Useful answers, honest conversations and zero judgement. Built around the questions boys are already asking.',
  all: 'All',
  soon: 'Coming soon',
  categories: [
    'Skin + Spots', 'Hygiene + Body', 'Growing Up', 'Health + Food', 'Mind + Confidence',
    'Fragrance + Self Expression', 'Fashion + Style', 'Sport + Recovery', 'Relationships + Life', 'Digital Life',
  ],
  topics: [
    { t: 'Why does your skin suddenly get oilier?', c: ['Skin + Spots', 'Growing Up'] },
    { t: 'Sweat, smell and deodorant. What actually works?', c: ['Hygiene + Body', 'Growing Up'] },
    { t: 'How often should you actually shower?', c: ['Hygiene + Body'] },
    { t: 'First shave. Fewer mistakes.', c: ['Growing Up', 'Hygiene + Body'] },
    { t: 'Protein, energy and what your body actually needs', c: ['Health + Food', 'Sport + Recovery'] },
    { t: 'Sleep, training and why recovery counts', c: ['Health + Food', 'Sport + Recovery'] },
    { t: 'Why does scent change how you feel?', c: ['Fragrance + Self Expression', 'Mind + Confidence'] },
    { t: 'Confidence without pretending', c: ['Mind + Confidence'] },
    { t: 'Friends, pressure and knowing when to speak', c: ['Relationships + Life', 'Mind + Confidence'] },
    { t: 'Social media without the spiral', c: ['Digital Life', 'Mind + Confidence'] },
    { t: 'Fresh after sport. What actually works?', c: ['Sport + Recovery', 'Hygiene + Body'] },
    { t: 'What should your first fragrance smell like?', c: ['Fragrance + Self Expression'] },
    { t: 'How fragrance becomes part of your style', c: ['Fragrance + Self Expression', 'Fashion + Style'] },
    { t: 'Finding your style without copying everyone else', c: ['Fashion + Style', 'Mind + Confidence'] },
  ],
};

export type InfoSection = { n?: string; title: string; body: string[]; list?: string[]; after?: string[] };
export type InfoPage = {
  eyebrow: string;
  /** a visible "this is a draft" notice at the top of the page */
  draft?: { title: string; body: string[] };
  title: string[];
  intro: string[];
  sections: InfoSection[];
  closing?: { title: string; body: string[] };
  link?: { label: string; href: string };
};

export const parents: InfoPage = {
  eyebrow: 'For parents and guardians',
  title: ['What INVI is.', 'How it works.', 'How we keep it safe.'],
  intro: ['INVI is a UK body care brand built with and for teenage boys.'],
  sections: [
    {
      n: 'The product',
      title: 'Scent. Skin. Mood. Performance.',
      body: [
        'INVI’s first product is a hybrid body spray designed around scent, skin, mood and performance.',
        'Our fragrances are developed in Japan using a neuroscience-informed approach that explores how scent can influence emotional response. Our formulation also uses advanced fragrance technology designed to help prevent malodour by managing the microbiome associated with its development.',
      ],
    },
    {
      n: 'Built with boys',
      title: 'Their voice from day one.',
      body: [
        'Teenage boys help us test ideas and shape what INVI becomes.',
        'Depending on the activity, this can include product testing, fragrance feedback, packaging, content, campaigns and selected INVI Build opportunities.',
      ],
    },
    {
      n: 'Safeguarding',
      title: 'Clear permission. Active moderation.',
      body: [
        'For members under 18, parent or guardian permission is required before participation in activities beyond receiving email updates, including filming, product testing, events and selected programmes.',
        'All community activity and content is moderated by the INVI team.',
      ],
    },
  ],
  link: { label: 'Read our safeguarding approach', href: '/safeguarding' },
};

export const safeguarding: InfoPage = {
  eyebrow: 'Our commitment',
  title: ['Safeguarding'],
  intro: ['The INVI community is for ages 13 and up.'],
  sections: [
    { n: '01', title: 'Parent or guardian permission', body: ['When someone under 18 signs up, we ask for a parent or guardian’s name and email address. We contact that adult before the young person takes part in anything beyond receiving email updates, including filming, product testing, events and selected INVI Build activities.'] },
    { n: '02', title: 'Community moderation', body: ['All INVI community activity and content is moderated by the INVI team.'] },
    { n: '03', title: 'Events, filming and product testing', body: ['Sessions and shoots involving anyone under 18 are run by named INVI team members, with parent or guardian permission recorded in advance.'] },
    { n: '04', title: 'Personal information', body: ['We do not ask young people to share home addresses, school details or financial information as part of joining the INVI community. Where additional information is genuinely required for an event or activity, we explain why it is needed and how it will be used.'] },
  ],
  closing: {
    title: 'Raising a concern',
    body: [
      `Parents, guardians and community members can raise a safeguarding concern at any time by contacting ${CONTACT_EMAIL}.`,
      'We aim to respond within five working days.',
    ],
  },
};

/**
 * Privacy. Sections 01 to 04 and "Your rights" are Viv's summary [viv];
 * everything else is a DRAFT policy for this website only [new], to be
 * checked by Viv and a legal adviser before launch. [TO CONFIRM] marks facts
 * nobody has confirmed yet: they must all be resolved before it goes live.
 */
export const privacy: InfoPage = {
  eyebrow: 'Your information',
  title: ['Privacy notice'],
  intro: ['A clear summary of how INVI handles community information.'],
  draft: {
    title: 'Draft for review',
    body: [
      'The detailed policy below (sections 05 to 14) is a working draft for this website. It has not yet been approved by INVI or checked by a legal adviser, and anything marked [TO CONFIRM] is still being checked.',
      'Until it is final, the summary in sections 01 to 04 describes how we handle information.',
    ],
  },
  sections: [
    { n: '01', title: 'What we collect', body: ['When someone joins the INVI community, we may collect their first name, email address, age range and information connected with their membership. For members under 18, we may also collect a parent or guardian’s name and email address. Where someone chooses to join a WhatsApp community, apply for an opportunity or take part in another activity, we may process the contact, application and consent information required to provide that service. We also record marketing consent and any referral information used.'] },
    { n: '02', title: 'Why we collect it', body: ['We use this information to run the INVI community, provide updates members and waitlist subscribers have requested, review applications, manage participation in INVI activities and contact a parent or guardian where permission is required.'] },
    { n: '03', title: 'Who we share it with', body: ['We use trusted email, community and data platforms that process information on our instructions. First drop waitlist submissions are stored securely and may be added to INVI’s email or messaging platform so we can send the updates requested. We do not sell personal information or share it with third parties for their own advertising purposes.'] },
    { n: '04', title: 'How long we keep it', body: ['We keep information for as long as it is needed to provide the community or service someone has requested. Members can unsubscribe or request deletion of their information at any time.'] },
    // ── the draft policy for this website [new] ──────────────────────────
    {
      n: '05', title: 'Who we are',
      body: [
        'This policy covers the INVI community website and the forms on it: Join the Crew, the first drop waitlist, the product roadmap vote and, when open, INVI Build applications. It does not cover INVI products or any future shop.',
        `INVI is run by INVI WORLD LTD [TO CONFIRM: company name and number], 41a Marylands Road, London W9 2DU [TO CONFIRM], which is responsible for your information (the “controller”). You can reach us about anything in this policy at ${CONTACT_EMAIL}.`,
      ],
    },
    {
      n: '06', title: 'What this website collects',
      body: ['We only ask for what each form needs.'],
      list: [
        'Join the Crew: your age range, first name and email address; for under 18s, a parent or guardian’s name and email address; who invited you and a mobile number, if you choose to give them; whether you asked for a WhatsApp invite; and your consent choices, with the date you gave them.',
        'Under 13: if you tell us you are under 13, the form stops there. Nothing else is asked for and nothing is kept.',
        'First drop waitlist: your first name, an email address or mobile number, and your consent.',
        'Roadmap vote: the product you vote for, linked to your Crew membership so each member votes once.',
        'INVI Build applications (when open): your full name, email address, age, a parent or guardian’s name and email address if you are under 18, your answer, and your consent.',
        'Emails you send us: your address and whatever you choose to write.',
      ],
      after: ['We do not ask for home addresses, school details, photos, location or payment information, and we never use your information to profile you or show you advertising.'],
    },
    {
      n: '07', title: 'Why we use it, and our lawful basis',
      body: ['UK data protection law asks us to say which lawful basis we rely on. [TO CONFIRM with a legal adviser]'],
      list: [
        'Consent: to send you news, opportunities and launch updates, to send a WhatsApp invite, and to review an application. You can withdraw consent at any time, and it does not affect anything done before.',
        'Legitimate interests: to run the Crew, count one vote per member, keep the community safe and moderated, and contact a parent or guardian where their permission is needed.',
        'Legal obligations: where the law requires us to keep or share information, for example for safeguarding.',
      ],
      after: ['We only send marketing emails or messages to people who have said yes, and every one includes a way to stop them.'],
    },
    {
      n: '08', title: 'Children and young people',
      body: [
        'INVI is made for teenage boys from 13 up, and the UK age of digital consent is 13. We do not knowingly collect information from anyone under 13. If we learn that we have, we delete it.',
        'For members under 18, a parent or guardian’s permission is needed before they take part in anything beyond receiving email updates, including filming, product testing, events and selected INVI Build activities. We contact that adult directly.',
        'We design the website around the ICO’s Children’s Code: high privacy by default, plain language, no profiling, no location tracking and no selling of data.',
      ],
    },
    {
      n: '09', title: 'The Crew WhatsApp group',
      body: [
        'After joining, members aged 16 and over are offered a link to the INVI Crew group chat on WhatsApp. For under 16s, a parent or guardian approves first, and we send the invite after that.',
        'WhatsApp is run by WhatsApp Ireland Limited, part of Meta. Once you join the group, WhatsApp’s own terms and privacy policy apply. Group admins can see your phone number, and other members may be able to see it too. You can leave the group at any time.',
      ],
    },
    {
      n: '10', title: 'Who processes information for us',
      body: ['We use a small number of trusted providers who process information only on our instructions and under a written contract:'],
      list: [
        'Website hosting: Vercel Inc. [TO CONFIRM]',
        'Where sign-ups are stored: [TO CONFIRM: database provider and region]',
        'Email updates: [TO CONFIRM: email platform]',
        'Group chat: WhatsApp (Meta), for members who choose to join.',
      ],
      after: [
        'Some providers may process information outside the UK, for example in the United States. Where they do, we rely on the safeguards UK law requires, such as the UK International Data Transfer Agreement or the UK Extension to the EU-US Data Privacy Framework. [TO CONFIRM]',
        'We never sell personal information, and never share it with anyone for their own marketing.',
      ],
    },
    {
      n: '11', title: 'Retention periods',
      body: ['We keep information only for as long as it is needed. [TO CONFIRM: proposed periods]'],
      list: [
        'Crew membership: while you are a member. When you leave, we delete your details within 30 days.',
        'Waitlist: until the first drop, then for up to 12 months unless you join the Crew or unsubscribe sooner.',
        'Applications: for 12 months after the programme decision.',
        'Parent or guardian details: for as long as the young person they gave permission for is a member and under 18.',
        'Consent records: for as long as we rely on that consent, so we can show when it was given.',
      ],
    },
    {
      n: '12', title: 'Cookies and your browser',
      body: ['This website does not use advertising or analytics cookies, and it does not track you across other sites. It keeps three small items in your own browser so the site works as you would expect:'],
      list: [
        'invi.state.v5 (local storage): whether you have joined on this device, your first name, your member reference, your vote, and whether you are on the waitlist or have applied. It never holds your email, phone number, age or a parent’s details.',
        'invi.intro (session storage): so the opening animation plays once per visit.',
        'invi.place (session storage): your place on the page, so a reload brings you back to it.',
      ],
      after: ['These stay on your device. You can clear them at any time in your browser settings, or with “Not you? Start again” after joining.'],
    },
    {
      n: '13', title: 'Keeping it secure',
      body: [
        'Everything you send is encrypted in transit (HTTPS), access is limited to the INVI team members who need it, and our providers are chosen for their security standards. No system is perfectly secure, so if a breach ever puts your information at risk, we will tell you and, where required, the ICO.',
      ],
    },
    {
      n: '14', title: 'Changes and complaints',
      body: [
        'If we change this policy, we will update this page and, if the change matters, tell members by email. Last updated: draft, September 2026.',
        'If you are unhappy with how we have handled your information, please tell us first so we can put it right. You can also complain to the Information Commissioner’s Office (ICO) at ico.org.uk/make-a-complaint or on 0303 123 1113.',
      ],
    },
  ],
  closing: {
    title: 'Your rights',
    body: [
      `Members and parents or guardians can request access, correction or deletion of personal information by contacting ${CONTACT_EMAIL}.`,
      'Marketing emails include an unsubscribe link.',
      // [new]
      'You can also ask us to limit how we use your information, object to it, or send you a copy to take elsewhere, and you can withdraw any consent at any time. A parent or guardian can make a request for a child. We reply within one month.',
    ],
  },
};

export const communityTerms: InfoPage = {
  eyebrow: 'How we show up',
  title: ['Community terms'],
  intro: ['INVI community membership is free and voluntary.'],
  sections: [
    { n: '01', title: 'Respectful participation', body: ['By joining, members agree to participate respectfully.', 'Harassment, discrimination, bullying, threatening behaviour or sharing another member’s personal information without permission is not acceptable.'] },
    { n: '02', title: 'Moderation', body: ['The INVI team may moderate content or remove members who breach these standards or put other community members at risk.'] },
    { n: '03', title: 'Leaving the community', body: ['Members can leave the community at any time. They can also unsubscribe from marketing communications or request deletion of their information.'] },
    { n: '04', title: 'Pre-launch', body: ['INVI is currently in pre-launch. Nothing is currently sold through the community website. There is no checkout or payment required to join the community. Any future purchases will be governed by separate product and sales terms.'] },
  ],
};
