import { getOrgContext, loadWaitlist } from '@/lib/org';
import { todayISO } from '@/lib/db';
import PlekMatcher from '@/components/app/PlekMatcher';

export default async function Plek() {
  const { org, member } = await getOrgContext();
  const data = await loadWaitlist(org.id);
  return <PlekMatcher org={org} actor={member.display_name ?? 'Medewerker'} today={todayISO()} {...data} />;
}
