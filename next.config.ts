import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
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
