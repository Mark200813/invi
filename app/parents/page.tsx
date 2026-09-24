import type { Metadata } from 'next';
import InfoPage from '@/components/site/InfoPage';
import { parents } from '@/lib/content';

export const metadata: Metadata = { title: 'For Parents | INVI' };

export default function Page() {
  return <InfoPage page={parents} photo={{ src: '/img/hoodie-smile.webp', w: 680, h: 878, alt: 'A boy in an INVI hoodie, smiling, one hand on his hood' }} />;
}
