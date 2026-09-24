import type { Metadata } from 'next';
import InfoPage from '@/components/site/InfoPage';
import { communityTerms } from '@/lib/content';

export const metadata: Metadata = { title: 'Community Terms | INVI' };

export default function Page() {
  return <InfoPage page={communityTerms}  />;
}
