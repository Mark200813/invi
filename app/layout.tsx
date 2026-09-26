import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { meta } from '@/lib/content';
import SmoothScroll from '@/components/site/SmoothScroll';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import Toast from '@/components/site/Toast';
import Motion from '@/components/site/Motion';

// Mona Sans: a variable grotesk with a width axis, so one 98KB file covers
// the condensed display cuts, the text face and the expanded labels.
const sans = localFont({
  src: './fonts/MonaSans.woff2',
  variable: '--font-sans',
  weight: '200 900',
  display: 'swap',
  preload: true,
});

// Instrument Serif Italic, only for the words the copy already stresses.
const serif = localFont({
  src: './fonts/InstrumentSerif-Italic.woff2',
  variable: '--font-serif',
  style: 'italic',
  weight: '400',
  display: 'swap',
  preload: true,
});

const siteUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: meta.title,
  description: meta.description,
  robots: { index: false, follow: false }, // pre-launch
  openGraph: {
    title: meta.ogTitle,
    description: meta.ogDescription,
    type: 'website',
    siteName: 'INVI',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'INVI: where scent, skin and mood meet. The three INVI cans.' }],
  },
  twitter: { card: 'summary_large_image', title: meta.ogTitle, description: meta.ogDescription, images: ['/og.jpg'] },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' }],
    apple: '/apple-touch-icon.png',
  },
};

const INTRO_SCRIPT = `(function(){try{
var d=document.documentElement;
if(location.pathname!=='/'||location.hash||sessionStorage.getItem('invi.intro')||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
sessionStorage.setItem('invi.intro','1');
d.classList.add('intro-on');
setTimeout(function(){if(d.classList.contains('intro-on')){d.classList.remove('intro-on');dispatchEvent(new Event('invi:intro-done'));}},6000);
}catch(e){}})();`;

export const viewport: Viewport = {
  themeColor: '#070708',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        {/* Decides the intro before first paint (see components/site/Intro.tsx),
            and guarantees it can never keep anyone out for more than 6s. */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <SmoothScroll />
        <SiteHeader />
        <main id="main" tabIndex={-1}>{children}</main>
        <SiteFooter />
        <Toast />
        <Motion />
      </body>
    </html>
  );
}
