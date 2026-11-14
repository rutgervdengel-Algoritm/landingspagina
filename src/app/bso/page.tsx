import type { Metadata } from 'next';
import Landing from '@/components/landing/Landing';
import { LANDING } from '@/components/landing/content';

export const metadata: Metadata = {
  title: 'Eenplekje voor de BSO: een wachtlijst die je kunt uitleggen',
  description: LANDING.bso.intro,
};

export default function Page() {
  return <Landing sector="bso" ontwerp="warm" />;
}
