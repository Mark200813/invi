import type { Metadata } from 'next';
import InfoPage from '@/components/site/InfoPage';
import { safeguarding } from '@/lib/content';

export const metadata: Metadata = { title: 'Safeguarding | INVI' };

export default function Page() {
  return <InfoPage page={safeguarding}  />;
}
