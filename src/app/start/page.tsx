import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Na inloggen: medewerker → beheer, ouder → mijn overzicht, nieuw → onboarding.
export default async function Start() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: members } = await supabase.from('org_members').select('org_id').limit(1);
  if (members && members.length > 0) redirect('/beheer');

  const { data: entries } = await supabase.rpc('guardian_entries');
  if (entries && entries.length > 0) redirect('/mijn');

  redirect('/welkom');
}
