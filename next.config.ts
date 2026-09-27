import type { NextConfig } from 'next';

// Launch guard: the public site must never run with forms that go nowhere.
// Set NEXT_PUBLIC_FORMS_LIVE=true on Vercel once the database is connected.
if (process.env.VERCEL_ENV === 'production' && process.env.NEXT_PUBLIC_FORMS_LIVE !== 'true') {
  throw new Error('INVI: production build with forms in demo mode. Connect the database and set NEXT_PUBLIC_FORMS_LIVE=true.');
}

const SECURITY_HEADERS = [
  // nobody may put the site (and its forms) inside their own page
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
];

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },
  images: { formats: ['image/avif', 'image/webp'] },
  // Viv's site had these as separate pages. Their content now lives in the
  // home page story, so old links land on the right chapter.
  async redirects() {
    return [
      { source: '/products', destination: '/#product', permanent: false },
      { source: '/join-the-crew', destination: '/#crew', permanent: false },
      { source: '/stories', destination: '/lets-talk', permanent: false },
    ];
  },
};

export default config;
