import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { EntryRow, LocationRow, OfferingRow, OrgRow, RuleRow } from '@/lib/db';

/** Haalt de organisatie van de ingelogde medewerker op, of stuurt door. */
export async function getOrgContext() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: member } = await supabase
    .from('org_members')
    .select('org_id, role, display_name')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();
  if (!member) redirect('/welkom');

  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, sector, offer_response_days')
    .eq('id', member.org_id)
    .single();

  return {
    supabase,
    user,
    member: member as { org_id: string; role: string; display_name: string | null },
    org: org as OrgRow,
  };
}

export async function loadWaitlist(orgId: string) {
  const supabase = createClient();
  const [locations, offerings, entries, rules] = await Promise.all([
    supabase.from('locations').select('id, name, city').eq('org_id', orgId).order('created_at'),
    supabase.from('offerings').select('*').eq('org_id', orgId).order('created_at'),
    supabase.from('waitlist_entries').select('*').eq('org_id', orgId).order('registered_at'),
    supabase.from('priority_rules').select('*').eq('org_id', orgId).order('weight', { ascending: false }),
  ]);
  return {
    locations: (locations.data ?? []) as LocationRow[],
    offerings: (offerings.data ?? []) as OfferingRow[],
    entries: (entries.data ?? []) as EntryRow[],
    rules: (rules.data ?? []) as RuleRow[],
  };
}
