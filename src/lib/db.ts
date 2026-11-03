import type { Entry, Offering, PriorityRule, Sector, Slot } from './matching/types';

// Rijen zoals ze uit Supabase komen.
export interface OrgRow {
  id: string;
  name: string;
  sector: Sector;
  offer_response_days: number;
}
export interface LocationRow { id: string; name: string; city: string | null }
export interface OfferingRow {
  id: string;
  location_id: string;
  name: string;
  min_age_months: number | null;
  max_age_months: number | null;
  level: string | null;
  slots: Slot[];
  capacity: number | null;
  active: boolean;
}
export interface EntryRow {
  id: string;
  offering_id: string | null;
  location_id: string | null;
  participant_name: string;
  participant_birthdate: string | null;
  guardian_name: string;
  guardian_email: string;
  guardian_phone: string | null;
  preferred_slots: Slot[];
  min_slots: number | null;
  level: string | null;
  desired_start_date: string | null;
  priority_factors: Record<string, boolean>;
  internal_notes: string | null;
  status: Entry['status'];
  registered_at: string;
  last_confirmed_at: string;
}
export interface RuleRow {
  id: string;
  type: PriorityRule['type'];
  label: string;
  factor_key: string | null;
  weight: number;
  active: boolean;
  explanation: string | null;
}
export interface AuditRow {
  id: number;
  actor_label: string;
  action: string;
  entity: string;
  entity_id: string | null;
  reason: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export const toOffering = (o: OfferingRow): Offering => ({
  id: o.id,
  name: o.name,
  minAgeMonths: o.min_age_months,
  maxAgeMonths: o.max_age_months,
  level: o.level,
  slots: o.slots ?? [],
});

export const toEntry = (e: EntryRow): Entry => ({
  id: e.id,
  participantName: e.participant_name,
  birthdate: e.participant_birthdate,
  preferredSlots: e.preferred_slots ?? [],
  minSlots: e.min_slots,
  level: e.level,
  desiredStartDate: e.desired_start_date,
  priorityFactors: e.priority_factors ?? {},
  registeredAt: e.registered_at,
  status: e.status,
});

export const toRule = (r: RuleRow): PriorityRule => ({
  id: r.id,
  type: r.type,
  label: r.label,
  factorKey: r.factor_key,
  weight: r.weight,
  active: r.active,
});

export function todayISO(): string {
  // Datum in Nederland, ongeacht de serverlocatie.
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Amsterdam' }).format(new Date());
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Amsterdam' }).format(
    new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso),
  );
}

export const ACTION_LABEL: Record<string, string> = {
  organisatie_aangemaakt: 'Organisatie aangemaakt',
  inschrijving_toegevoegd: 'Inschrijving toegevoegd',
  inschrijvingen_geimporteerd: 'Inschrijvingen geïmporteerd',
  inschrijving_gewijzigd: 'Inschrijving gewijzigd',
  groep_toegevoegd: 'Groep toegevoegd',
  regels_gewijzigd: 'Voorrangsregels gewijzigd',
  plek_vrijgekomen: 'Plek vrijgekomen',
  voorstel_gedaan: 'Voorstel gedaan',
  voorstel_geaccepteerd: 'Voorstel geaccepteerd',
  voorstel_afgewezen: 'Voorstel afgewezen',
  voorstel_verlopen: 'Voorstel verlopen',
  interesse_bevestigd: 'Interesse bevestigd',
};
