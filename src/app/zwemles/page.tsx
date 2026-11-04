import type { Metadata } from 'next';
import Landing from '@/components/landing/Landing';
import { LANDING } from '@/components/landing/content';

export const metadata: Metadata = {
  title: 'Eenplekje voor zwemscholen',
  description: LANDING.zwemles.intro,
};

export default function Page() {
  return <Landing sector="zwemles" />;
}
