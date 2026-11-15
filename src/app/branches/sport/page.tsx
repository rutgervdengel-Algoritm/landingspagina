import type { Metadata } from 'next';
import Landing from '@/components/landing/Landing';
import { LANDING } from '@/components/landing/content';

export const metadata: Metadata = {
  title: 'Eenplekje voor sportclubs',
  description: LANDING.sport.intro,
  // Staat los van de opvangsite en hoort voorlopig niet in zoekmachines.
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Landing sector="sport" />;
}
