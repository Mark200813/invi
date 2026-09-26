import Hero from '@/components/home/Hero';
import Moments from '@/components/home/Moments';
import Product from '@/components/home/Product';
import Editorial from '@/components/home/Editorial';
import Crew from '@/components/home/Crew';
import JoinSection from '@/components/join/JoinSection';
import Roadmap from '@/components/join/Roadmap';
import Note from '@/components/home/Note';
import CanLayer from '@/components/can/CanLayer';

/**
 * One continuous story: the can, the three moments, what it does, what we
 * believe, the crew, then join and vote. Everything the old /products and
 * /join-the-crew pages said lives in these chapters.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Moments />
      <Product />
      <Editorial />
      <Crew />
      <JoinSection />
      <Roadmap />
      <Note />
      <CanLayer />
    </>
  );
}
