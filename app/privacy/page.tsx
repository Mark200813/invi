import type { Metadata } from 'next';
import InfoPage from '@/components/site/InfoPage';
import { privacy } from '@/lib/content';

export const metadata: Metadata = { title: 'Privacy Notice | INVI' };

export default function Page() {
  return <InfoPage page={privacy}  />;
}
