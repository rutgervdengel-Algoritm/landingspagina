// Generieke types voor de matching-engine. Bewust los van de database,
// zodat de logica volledig testbaar is zonder Supabase.

export type Sector = 'kinderopvang' | 'zwemles' | 'sport' | 'overig';

export type Dag = 'ma' | 'di' | 'wo' | 'do' | 'vr' | 'za' | 'zo';

/** Een tijdslot. Zonder van/tot is het een hele dag (kinderopvang). */
export interface Slot {
  dag: Dag;
  van?: string; // 'HH:MM'
  tot?: string;
}

export interface Offering {
  id: string;
  name: string;
  minAgeMonths?: number | null;
  maxAgeMonths?: number | null;
  level?: string | null;
  slots: Slot[];
}

export interface Opening {
  id: string;
  offering: Offering;
  slots: Slot[];      // de sloten die vrijkomen
  startDate: string;  // 'YYYY-MM-DD'
}

export interface Entry {
  id: string;
  participantName: string;
  birthdate?: string | null;
  preferredSlots: Slot[];
  /** Minimaal aantal sloten dat nog passend is. Default: alle gewenste. */
  minSlots?: number | null;
  level?: string | null;
  desiredStartDate?: string | null;
  priorityFactors: Record<string, boolean | string | number | null | undefined>;
  registeredAt: string; // ISO
  status: 'wachtend' | 'voorstel' | 'geplaatst' | 'teruggetrokken' | 'verlopen';
}

export type RuleType = 'wachttijd' | 'kenmerk' | 'leeftijd_oudst' | 'leeftijd_jongst';

export interface PriorityRule {
  id: string;
  type: RuleType;
  label: string;
  factorKey?: string | null;
  weight: number; // 0..100
  active: boolean;
}

export type ExclusionReason = 'leeftijd' | 'niveau' | 'sloten' | 'status';

export interface ScorePart {
  key: string;
  label: string;
  score: number;
  max: number;
  explanation: string;
}

export interface CandidateResult {
  entryId: string;
  participantName: string;
  eligible: boolean;
  exclusions: { reason: ExclusionReason; explanation: string }[];
  score: number; // 0..100
  parts: ScorePart[];
  summary: string;
}
