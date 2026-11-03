import { getOrgContext, loadWaitlist } from '@/lib/org';
import InschrijvingenBeheer from '@/components/app/InschrijvingenBeheer';

export default async function Inschrijvingen() {
  const { org, member } = await getOrgContext();
  const data = await loadWaitlist(org.id);
  return <InschrijvingenBeheer org={org} actor={member.display_name ?? 'Medewerker'} {...data} />;
}
