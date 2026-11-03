import Link from 'next/link';
import { getOrgContext } from '@/lib/org';
import { BRAND } from '@/lib/brand';
import { SECTORS } from '@/lib/matching/sectors';
import BeheerNav from '@/components/app/BeheerNav';

export default async function BeheerLayout({ children }: { children: React.ReactNode }) {
  const { org, member } = await getOrgContext();
  const cfg = SECTORS[org.sector];
  return (
    <div className="app lg:flex">
      <aside className="border-b border-kalk-licht bg-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:block">
          <Link href="/beheer" className="font-display text-xl font-extrabold">{BRAND.name}</Link>
          <p className="text-sm text-kalk lg:mt-1">{org.name}</p>
        </div>
        <BeheerNav deelnemers={cfg.participant.meervoud} groepen={cfg.offering.meervoud} />
        <div className="hidden px-5 pb-5 text-sm text-kalk lg:absolute lg:bottom-0 lg:block">
          Ingelogd als {member.display_name ?? 'medewerker'}
          <form action="/auth/uitloggen" method="post" className="mt-1">
            <button className="underline hover:text-inkt">Uitloggen</button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}
