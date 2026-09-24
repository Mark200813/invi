/**
 * Every word on the site lives here.
 *
 * Official copy only. Sources, so nothing drifts:
 *   [site]  the previous INVI build (repo `main`, invi-eosin.vercel.app)
 *   [viv]   Viv's build, join-invi-community.vivpax.chatgpt.site (newer; wins
 *           where the two disagree on facts, e.g. the contact address)
 *   [mark]  wording Mark asked for directly
 * Anything still missing is written as [COPY NEEDED], never invented.
 */

export const CONTACT_EMAIL = 'hello@weareinvi.com'; // [viv]

export const meta = {
  title: 'INVI · Where scent, skin and mood meet.', // [site]
  description:
    'INVI brings scent, skin and mood together for teenage boys aged 13 to 18. Join the crew and hear when applications open for the first INVI Build Programme.', // [viv]
  ogTitle: 'Where scent, skin and mood meet.', // [viv]
  ogDescription: 'Join the INVI crew and help build what comes next.', // [viv]
};

export const proofLine = ['Built with boys.', 'Backed by science.', 'Inspired by culture.']; // [site][viv]

export const nav = [
  { label: 'The Product', href: '/#product' },
  { label: 'The Crew', href: '/#crew' },
  { label: "Let's Talk", href: '/lets-talk' },
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
  eyebrow: "Body care for what's next", // [viv]
  titleLines: ['Where scent,', 'skin and mood'], // [site][viv]
  titleAccent: 'meet.',
  lede: 'INVI brings scent that lasts, skin actives and mood technology together for real life. School. Sport. Going out. Whatever comes next.', // [viv]
  primary: 'Join the Crew', // [viv]
  secondary: 'Scroll through the day', // [site]
  footnoteLead: 'Founding crew now open.', // [viv]
  footnote:
    'Join now for product testing, selected samples, limited merch and first access to new opportunities.', // [viv]
};

export type ScentKey = 'origin' | 'rise' | 'after-dark';

export const moments = {
  intro: 'Three are coming, one for each part of the day.', // [site]
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
      kicker: 'After dark',
      line: 'When it counts and nobody needs it explained. The version of you that only comes out once the day’s done.',
      desc: 'Moments that need no explanation.',
      colours: ['#49304A', '#84549A', '#D66BA0'],
      can: '/cans/can-after-dark-front.webp',
      canAngle: '/cans/can-after-dark-angle.webp',
      photo: { src: '/img/evening-crew.webp', w: 1536, h: 1024, alt: 'Four friends by a city court after dark, lit by the street lights' },
    },
  ],
};

export const product = {
  eyebrow: 'Engineered to perform', // [viv]
  title: ['Built for', 'every moment', 'in between.'],
  body: 'Scent that lasts. Skin focused actives. Mood technology. Developed with master perfumers in Japan. Manufactured in the UK. Built with you.',
  subEyebrow: 'Body spray. Reimagined.', // [viv /products]
  subTitle: ['Smells good.', 'Does more.'],
  subBody: [
    'Long lasting scent, skin focused actives and mood technology in one seriously smart spray.',
    'Created with master perfumers in Japan and designed for every version of your day.',
  ],
  features: [
    { n: '01', k: 'Scent', t: 'Smells incredible', d: 'Long lasting fragrance created with master perfumers in Japan. Made to match different moments, moods and plans.' },
    { n: '02', k: 'Skin', t: 'Built for skin', d: 'Skin focused actives meet premium scent in one easy everyday spray.' },
    { n: '03', k: 'Performance', t: 'Fresh, not covered up', d: 'Advanced fragrance technology is designed to help stop odour before it starts, rather than simply masking it.' },
    { n: '04', k: 'Mood', t: 'Match your moment', d: 'Scent and mood technology designed to help you make more of whatever comes next.' },
  ],
  air: {
    eyebrow: 'Air powered technology',
    title: ['A better way', 'to spray.'],
    body: [
      'Our air powered spray system delivers a fine pressurised mist without traditional aerosol propellants.',
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
    'INVI is inspired by the Latin word *Invictus*. Unconquered. Meaning to be grounded in who you are.',
    'Our belief is simple. Body care should meet you where you are. It should respect who you are, not tell you who to be. That’s why we’re building INVI with you, bringing scent, skin and mood together.',
  ],
  // [site] the creed
  creed: [
    'Not about becoming someone else.',
    'Not about fitting in.',
    'About the confidence to become *more of who you already are.*',
    'Built for every moment. Built for *every version of you.*',
  ],
  shorthand: ['Scent.', 'Skin.', 'Mood.'], // [site] locked shorthand
  photoAlt: 'A next generation boy wearing the INVI wordmark', // [viv]
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
  comingSoon: ['Built with boys.', 'Coming soon. A new world of body care built around what you need for every moment.'], // [viv]
  pillars: [
    { k: 'Built with boys', t: 'Not marketed to them', d: 'Our founding community of 62 boys already influences everything from development to brand and content.' },
    { k: 'Credible role models', t: 'Belief, not noise', d: 'We don’t build community through creators alone. We build it through culture, credible role models, and our own community of boys.' },
    { k: 'A brand that grows', t: 'Here for the duration', d: 'Designed to evolve alongside boys through the years that shape them, rather than showing up once and moving on.' },
  ],
};

export const crew = {
  eyebrow: 'The founding crew', // [viv]
  title: ['Be there', 'from day one.'],
  sub: 'New people. New skills. First dibs on what’s next.',
  photoAlt: 'Four friends on a sea wall at dusk, laughing together',
  closer: {
    eyebrow: 'More than a waitlist', // [viv /join-the-crew]
    title: 'Get closer to the action.',
    body: [
      'Meet and learn from some of the UK’s leading entrepreneurs, creators and industry experts.',
      'Build practical skills, test products before launch and get access to selected samples, limited INVI merch, events and opportunities.',
    ],
  },
  benefits: [
    { n: '01', t: 'Make your mark', d: 'Your ideas could shape a real product, campaign or piece of content. No pretend briefs. This is the real thing.' },
    { n: '02', t: 'Meet your people', d: 'Connect with other Crew members, swap ideas, make new friends and build something together.' },
    { n: '03', t: 'Learn from the best', d: 'Meet founders, creators and industry insiders. Pick up new skills and see how a brand really comes to life.' },
    { n: '04', t: 'Get first dibs', d: 'Test products, receive selected samples and hear about limited merch, events, internships and paid opportunities first.' },
  ],
  founding: {
    eyebrow: 'The Founding 100',
    title: ['Be one of the', 'Founding 100.'],
    body: 'The first 100 approved INVI Crew members will receive a numbered Founder Card, unlocking product testing, selected samples, special drops, events and opportunities.',
    hoodie: 'Complete your first Crew challenge to earn a limited edition INVI hoodie.',
    cardLabel: 'Founder Card',
  },
};

export const build = {
  eyebrow: 'INVI Build. Founding cohort 01', // [viv]
  title: ['The first crew.', 'Real mentors.', 'A real launch.'],
  body: 'Not work experience. Not a focus group. Work alongside the INVI team, brilliant entrepreneurs, creators and industry experts. Make decisions, test ideas, create content and see how a real brand gets built.',
  live: {
    title: 'Real skills. Real opportunities.', // [viv /join-the-crew]
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
  closed: 'Join the crew to hear when applications open. For boys aged 13 to 18.', // [viv]
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
  doneMsg: 'Your application is in. We read every one and come back to everybody either way, so keep an eye on your inbox.',
  errors: {
    name: 'We need your name.',
    email: 'That email doesn’t look right.',
    age: 'Pick your age.',
    guardian: 'Under 18s need a parent or guardian’s email.',
    why: 'Give us a couple of lines at least.',
    consent: 'You’ll need to tick this to apply.',
  },
};

export type RoadmapKey = 'hair-reset' | 'body-mist' | 'shaving-skin' | 'body-wash';

export const roadmap = {
  eyebrow: 'The product roadmap', // [viv /products]
  title: 'What should we make next?',
  body: 'INVI is being built with you. Join the Crew, cast your vote and help choose what comes next.',
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
  closing: 'Your vote shapes what comes next.', // [viv]
};

export const join = {
  eyebrow: 'Be there from day one', // [viv]
  gift: 'Join now for your exclusive launch gift', // [viv]
  title: 'Your place in what’s next.',
  body: 'Join now for product testing, selected samples, limited merch, experiences and opportunities.',
  community: 'The INVI community is open to ages 13 and over. For members under 18, parent or guardian permission is required before participation in activities beyond receiving email updates, including filming, product testing, events and selected INVI Build activities.',
  already: 'Already in the crew? You’re counted.',
  fields: {
    name: { label: 'First name', placeholder: 'What do people call you?' },
    email: { label: 'Email address', placeholder: 'you@example.com' },
    age: { label: 'Age range', options: ['13 to 15', '16 to 17', '18+'] as const, note: 'The INVI community is open to ages 13 and over.' },
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
    consent: 'I agree to join the crew and first drop list. If I’m under 16, I have permission from my parent or guardian.',
    marketing: 'Send me occasional news, opportunities and launch updates.',
  },
  submit: 'I’m in',
  submitting: 'Adding you',
  next: 'Next',
  back: 'Back',
  skip: 'Skip',
  privacy: 'Privacy',
  notes: [
    'If you’re under 18, we may ask for permission from a parent or guardian before you take part in INVI activities or receive a launch gift.',
    'Your details stay with us. Phone numbers are only used for requested WhatsApp invites. No spam. No selling your data.',
  ],
  // Error wording: [site] where the field existed before; the rest is the
  // plainest statement of the rule, in the same voice.
  errors: {
    name: 'We need something to call you.', // [site]
    email: 'That email doesn’t look right.', // [site]
    age: 'Pick your age range.',
    guardianName: 'We need their name.',
    guardianEmail: 'Under 18s need a parent or guardian’s email.', // [site]
    mobile: 'That number doesn’t look right. Include your country code.',
    whatsapp: 'Add your mobile number to get a WhatsApp invite.',
    consent: 'Tick the box to join the crew.',
  },
  done: {
    tag: 'You’re in', // [site]
    ref: 'Ref',
    vote: 'Cast your vote',
    share: 'Send to a friend', // [site]
    shareText: 'Join the INVI crew and help build what comes next.', // [viv] og description
    copied: 'Link copied.', // [site]
    copyFail: 'Copy the link from the address bar.', // [site]
  },
};

export const waitlist = {
  eyebrow: 'First drop waitlist', // [viv]
  title: 'Not ready for the Crew?',
  body: 'Join the waitlist instead. We’ll let you know when the first INVI drop is ready.',
  name: 'First name',
  contact: 'Email or mobile number',
  consent: 'Yes, INVI can contact me about the first drop and occasional launch news. If I’m under 16, I have permission from a parent or guardian.',
  submit: 'Join the waitlist',
  submitting: 'Adding you',
  done: 'You’re on the list.',
  errors: {
    name: 'We need something to call you.',
    contact: 'Add an email address or a mobile number with its country code.',
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
    body: 'Paid internships are coming up for sign up. Go behind the scenes, bring your ideas and help create content for a brand being built with you.',
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

export type InfoSection = { n?: string; title: string; body: string[] };
export type InfoPage = {
  eyebrow: string;
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
        'Our fragrances are developed in Japan using a neuroscience informed approach that explores how scent can influence emotional response. Our formulation also uses advanced fragrance technology designed to help prevent malodour by managing the microbiome associated with its development.',
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
  intro: ['The INVI community is open to ages 13 and over.'],
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

export const privacy: InfoPage = {
  eyebrow: 'Your information',
  title: ['Privacy notice'],
  intro: ['A clear summary of how INVI handles community information.'],
  sections: [
    { n: '01', title: 'What we collect', body: ['When someone joins the INVI community, we may collect their first name, email address, age range and information connected with their membership. For members under 18, we may also collect a parent or guardian’s name and email address. Where someone chooses to join a WhatsApp community, apply for an opportunity or take part in another activity, we may process the contact, application and consent information required to provide that service. We also record marketing consent and any referral information used.'] },
    { n: '02', title: 'Why we collect it', body: ['We use this information to run the INVI community, provide updates members and waitlist subscribers have requested, review applications, manage participation in INVI activities and contact a parent or guardian where permission is required.'] },
    { n: '03', title: 'Who we share it with', body: ['We use trusted email, community and data platforms that process information on our instructions. First drop waitlist submissions are stored securely and may be added to INVI’s email or messaging platform so we can send the updates requested. We do not sell personal information or share it with third parties for their own advertising purposes.'] },
    { n: '04', title: 'How long we keep it', body: ['We keep information for as long as it is needed to provide the community or service someone has requested. Members can unsubscribe or request deletion of their information at any time.'] },
  ],
  closing: {
    title: 'Your rights',
    body: [
      `Members and parents or guardians can request access, correction or deletion of personal information by contacting ${CONTACT_EMAIL}.`,
      'Marketing emails include an unsubscribe link.',
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
    { n: '04', title: 'Pre launch', body: ['INVI is currently in pre launch. Nothing is currently sold through the community website. There is no checkout or payment required to join the community. Any future purchases will be governed by separate product and sales terms.'] },
  ],
};
