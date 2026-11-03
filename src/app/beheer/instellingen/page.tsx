import { getOrgContext, loadWaitlist } from '@/lib/org';
import Instellingen from '@/components/app/Instellingen';

export default async function InstellingenPagina() {
  const { org, member } = await getOrgContext();
  const data = await loadWaitlist(org.id);
  return <Instellingen org={org} actor={member.display_name ?? 'Medewerker'} {...data} />;
}
