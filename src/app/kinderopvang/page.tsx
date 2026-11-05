import type { Metadata } from 'next';
import Landing from '@/components/landing/Landing';
import { LANDING } from '@/components/landing/content';

export const metadata: Metadata = {
  title: 'Eenplekje voor opvangorganisaties',
  description: LANDING.kinderopvang.intro,
};

export default function Page() {
  return <Landing sector="kinderopvang" ontwerp="warm" />;
}
