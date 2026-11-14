import { getOrgContext, loadOpenPlekken, loadWaitlist } from '@/lib/org';
import { todayISO } from '@/lib/db';
import PlekMatcher from '@/components/app/PlekMatcher';

export default async function Plek({ searchParams }: { searchParams: { plek?: string } }) {
  const { org, member } = await getOrgContext();
  const data = await loadWaitlist(org.id);
  // Verder met een plek die al openstaat (bijvoorbeeld na een afgewezen of verlopen voorstel).
  const bestaand = searchParams.plek ? (await loadOpenPlekken(org.id)).find((p) => p.id === searchParams.plek) : undefined;
  return <PlekMatcher key={bestaand?.id ?? 'nieuw'} org={org} actor={member.display_name ?? 'Medewerker'} today={todayISO()} bestaand={bestaand} {...data} />;
}
