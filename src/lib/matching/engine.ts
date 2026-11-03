import { SECTORS, type SectorConfig } from './sectors';
import type {
  CandidateResult,
  Entry,
  ExclusionReason,
  Offering,
  Opening,
  PriorityRule,
  ScorePart,
  Sector,
  Slot,
} from './types';

/*
 * Matching-engine. Pure functies, geen database.
 *
 * Twee stappen:
 *   1. Harde criteria  — past iemand überhaupt? (status, leeftijd, niveau, sloten)
 *   2. Score 0..100    — sloten-fit + prioriteitsregels + startdatum,
 *                        gewogen volgens de branche-configuratie.
 *
 * De positie die een ouder te zien krijgt wordt met DEZELFDE functie berekend
 * (tegen een "standaardplek" in de groep). Zo kan de getoonde positie nooit
 * stilletjes afwijken van de volgorde waarin écht wordt voorgesteld.
 */

const DAG_NAAM: Record<Slot['dag'], string> = {
  ma: 'maandag', di: 'dinsdag', wo: 'woensdag', do: 'donderdag', vr: 'vrijdag', za: 'zaterdag', zo: 'zondag',
};

const MS_PER_DAG = 24 * 60 * 60 * 1000;

function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}

function parseDate(d: string): Date {
  // 'YYYY-MM-DD' als UTC-middernacht, zodat tijdzones niets verschuiven.
  return new Date(d.length === 10 ? `${d}T00:00:00Z` : d);
}

export function daysBetween(a: string, b: string): number {
  return Math.round((parseDate(b).getTime() - parseDate(a).getTime()) / MS_PER_DAG);
}

export function ageInMonths(birthdate: string, at: string): number {
  const b = parseDate(birthdate);
  const d = parseDate(at);
  let months = (d.getUTCFullYear() - b.getUTCFullYear()) * 12 + (d.getUTCMonth() - b.getUTCMonth());
  if (d.getUTCDate() < b.getUTCDate()) months -= 1;
  return months;
}

export function formatAge(months: number): string {
  if (months < 24) return `${months} maanden`;
  const jaar = Math.floor(months / 12);
  const rest = months % 12;
  return rest === 0 ? `${jaar} jaar` : `${jaar} jaar en ${rest} mnd`;
}

/** Overlappen twee sloten? Zonder tijden telt alleen de dag. */
export function slotsOverlap(a: Slot, b: Slot): boolean {
  if (a.dag !== b.dag) return false;
  if (!a.van || !a.tot || !b.van || !b.tot) return true;
  return toMinutes(a.van) < toMinutes(b.tot) && toMinutes(b.van) < toMinutes(a.tot);
}

export function formatSlot(s: Slot): string {
  return s.van && s.tot ? `${DAG_NAAM[s.dag]} ${s.van}–${s.tot}` : DAG_NAAM[s.dag];
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

// ---------- Stap 1: harde criteria --------------------------------------

interface SlotFit {
  matched: Slot[];
  needed: number;
  fit: number; // 0..1
}

function slotFit(opening: Opening, entry: Entry, cfg: SectorConfig): SlotFit {
  const wanted = entry.preferredSlots;
  // Geen voorkeur opgegeven = flexibel.
  if (wanted.length === 0) return { matched: opening.slots, needed: 0, fit: 1 };

  const matched = wanted.filter((w) => opening.slots.some((o) => slotsOverlap(w, o)));

  if (cfg.slotMode === 'dagen') {
    // Kinderopvang: gewenste dagen zijn samen één wens (bv. ma+wo+vr).
    const needed = entry.minSlots ?? wanted.length;
    return { matched, needed, fit: matched.length / wanted.length };
  }
  // Lessen: gewenste tijdsloten zijn alternatieven; één passend slot volstaat.
  const needed = entry.minSlots ?? 1;
  return { matched, needed, fit: matched.length >= needed ? 1 : 0 };
}

function exclusions(
  opening: Opening,
  entry: Entry,
  cfg: SectorConfig,
  fit: SlotFit,
): { reason: ExclusionReason; explanation: string }[] {
  const out: { reason: ExclusionReason; explanation: string }[] = [];
  const o = opening.offering;

  if (entry.status !== 'wachtend') {
    out.push({ reason: 'status', explanation: `Staat niet (meer) op de wachtlijst (status: ${entry.status})` });
  }

  if (o.minAgeMonths != null || o.maxAgeMonths != null) {
    if (!entry.birthdate) {
      out.push({ reason: 'leeftijd', explanation: 'Geboortedatum ontbreekt, leeftijd kan niet worden gecontroleerd' });
    } else {
      const age = ageInMonths(entry.birthdate, opening.startDate);
      if (o.minAgeMonths != null && age < o.minAgeMonths) {
        out.push({ reason: 'leeftijd', explanation: `Op de startdatum ${formatAge(age)}, ${o.name} is vanaf ${formatAge(o.minAgeMonths)}` });
      }
      if (o.maxAgeMonths != null && age > o.maxAgeMonths) {
        out.push({ reason: 'leeftijd', explanation: `Op de startdatum ${formatAge(age)}, ${o.name} is tot ${formatAge(o.maxAgeMonths)}` });
      }
    }
  }

  if (cfg.usesLevel && o.level && entry.level && o.level.toLowerCase() !== entry.level.toLowerCase()) {
    out.push({ reason: 'niveau', explanation: `Niveau ${entry.level}, deze plek is voor niveau ${o.level}` });
  }

  if (fit.matched.length < fit.needed) {
    out.push({
      reason: 'sloten',
      explanation:
        fit.matched.length === 0
          ? 'Geen van de gewenste momenten past bij deze plek'
          : `Maar ${fit.matched.length} van de minimaal ${fit.needed} gewenste momenten passen`,
    });
  }
  return out;
}

// ---------- Stap 2: score -------------------------------------------------

function priorityParts(
  entry: Entry,
  rules: PriorityRule[],
  pool: Entry[],
  today: string,
  atDate: string,
  maxPoints: number,
): ScorePart[] {
  const active = rules.filter((r) => r.active && r.weight > 0);
  const totalWeight = active.reduce((s, r) => s + r.weight, 0);
  if (totalWeight === 0) return [];

  const waits = pool.map((e) => Math.max(0, daysBetween(e.registeredAt.slice(0, 10), today)));
  const maxWait = Math.max(1, ...waits);
  const ages = pool.filter((e) => e.birthdate).map((e) => ageInMonths(e.birthdate!, atDate));
  const minAge = Math.min(...ages);
  const maxAge = Math.max(...ages);

  return active.map((rule) => {
    const max = (rule.weight / totalWeight) * maxPoints;
    let factor = 0;
    let explanation = '';

    switch (rule.type) {
      case 'wachttijd': {
        const wait = Math.max(0, daysBetween(entry.registeredAt.slice(0, 10), today));
        factor = wait / maxWait;
        explanation = wait === maxWait ? `Wacht ${wait} dagen, het langst van iedereen die past` : `Wacht ${wait} dagen (wie het langst wacht: ${maxWait} dagen)`;
        break;
      }
      case 'kenmerk': {
        const v = entry.priorityFactors[rule.factorKey ?? ''];
        factor = v === true || v === 'ja' || v === 1 ? 1 : 0;
        explanation = `${rule.label}: ${factor ? 'ja' : 'nee'}`;
        break;
      }
      case 'leeftijd_oudst':
      case 'leeftijd_jongst': {
        if (!entry.birthdate || ages.length === 0) {
          explanation = 'Leeftijd onbekend';
          break;
        }
        const age = ageInMonths(entry.birthdate, atDate);
        const span = maxAge - minAge;
        const rel = span === 0 ? 1 : (age - minAge) / span;
        factor = rule.type === 'leeftijd_oudst' ? rel : 1 - rel;
        explanation = `Leeftijd ${formatAge(age)}`;
        break;
      }
    }
    return { key: `${rule.type === 'kenmerk' ? 'kenmerk' : 'regel'}:${rule.id}`, label: rule.label, score: round1(factor * max), max: round1(max), explanation };
  });
}

function startDatePart(opening: Opening, entry: Entry, maxPoints: number): ScorePart {
  if (!entry.desiredStartDate) {
    return { key: 'startdatum', label: 'Startdatum', score: maxPoints, max: maxPoints, explanation: 'Geen voorkeur voor startdatum' };
  }
  // Positief = plek start later dan gewenst.
  const diff = daysBetween(entry.desiredStartDate, opening.startDate);
  let factor: number;
  let explanation: string;
  if (Math.abs(diff) <= 30) {
    factor = 1;
    explanation = diff === 0 ? 'Start precies op de gewenste datum' : `Start ${Math.abs(diff)} dagen ${diff > 0 ? 'later' : 'eerder'} dan gewenst`;
  } else if (diff > 0) {
    // Later dan gewenst: na 30 dagen tolerantie lineair af tot 0 na nog 70 dagen.
    factor = Math.max(0, 1 - (diff - 30) / 70);
    explanation = `Start ${diff} dagen later dan gewenst`;
  } else {
    // Veel eerder dan gewenst is ook minder passend, maar weegt lichter.
    factor = Math.max(0.3, 1 - (-diff - 30) / 180);
    explanation = `Start ${-diff} dagen eerder dan gewenst`;
  }
  return { key: 'startdatum', label: 'Startdatum', score: round1(factor * maxPoints), max: maxPoints, explanation };
}

// ---------- Publieke API ----------------------------------------------

export interface RankInput {
  sector: Sector;
  opening: Opening;
  entries: Entry[];
  rules: PriorityRule[];
  /** 'YYYY-MM-DD'; in tests vast, in de app vandaag. */
  today: string;
}

/**
 * Alle inschrijvingen beoordelen voor één vrijgekomen plek.
 * Geschikte kandidaten staan bovenaan, gesorteerd op score; bij gelijke
 * score gaat wie het langst wacht voor. Ongeschikten komen erna, mét reden.
 */
export function rankCandidates({ sector, opening, entries, rules, today }: RankInput): CandidateResult[] {
  const cfg = SECTORS[sector];
  const w = cfg.weights;

  const prepared = entries.map((entry) => {
    const fit = slotFit(opening, entry, cfg);
    return { entry, fit, excl: exclusions(opening, entry, cfg, fit) };
  });
  // Relatieve regels (wachttijd, leeftijd) vergelijken alleen met wie echt in aanmerking komt.
  const pool = prepared.filter((p) => p.excl.length === 0).map((p) => p.entry);

  const results: (CandidateResult & { registeredAt: string })[] = prepared.map(({ entry, fit, excl }) => {
    const eligible = excl.length === 0;
    const slotPart: ScorePart = {
      key: 'sloten',
      label: cfg.slotMode === 'dagen' ? 'Dagen' : 'Lesmoment',
      score: round1(fit.fit * w.sloten),
      max: w.sloten,
      explanation:
        entry.preferredSlots.length === 0
          ? 'Flexibel, geen voorkeur opgegeven'
          : cfg.slotMode === 'dagen'
            ? `${fit.matched.length} van ${entry.preferredSlots.length} gewenste dagen (${fit.matched.map(formatSlot).join(', ') || 'geen'})`
            : fit.matched.length > 0
              ? `Past: ${fit.matched.map(formatSlot).join(', ')}`
              : 'Geen gewenst lesmoment past',
    };
    const prio = eligible ? priorityParts(entry, rules, pool, today, opening.startDate, w.prioriteit) : [];
    const start = startDatePart(opening, entry, w.startdatum);
    const parts = [slotPart, ...prio, start];
    const score = eligible ? round1(parts.reduce((s, p) => s + p.score, 0)) : 0;

    const toepasselijk = prio.filter((p) => p.score > 0 && p.key.startsWith('kenmerk:'));
    const summary = eligible
      ? `${Math.round(score)}% passend. ${slotPart.explanation}.${toepasselijk.length ? ' Voorrang: ' + toepasselijk.map((p) => p.label.toLowerCase()).join(', ') + '.' : ''}`
      : `Komt niet in aanmerking: ${excl.map((e) => e.explanation).join('; ')}`;

    return {
      entryId: entry.id,
      participantName: entry.participantName,
      eligible,
      exclusions: excl,
      score,
      parts,
      summary,
      registeredAt: entry.registeredAt,
    };
  });

  results.sort((a, b) => {
    if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
    if (b.score !== a.score) return b.score - a.score;
    if (a.registeredAt !== b.registeredAt) return a.registeredAt < b.registeredAt ? -1 : 1;
    return a.entryId < b.entryId ? -1 : 1;
  });

  return results.map((r) => {
    const { registeredAt, ...rest } = r;
    void registeredAt;
    return rest;
  });
}

export interface PositionResult {
  /** 1-based; null als de inschrijving nu niet in aanmerking komt. */
  position: number | null;
  total: number;
  /** Aantal dat vóór staat, per reden (voor de uitleg aan ouders). */
  ahead: { reden: string; aantal: number }[];
  explanation: string;
  candidate: CandidateResult;
}

/**
 * Positie van één inschrijving in een groep, berekend met precies dezelfde
 * ranking als bij een echte plek: een "standaardplek" met alle vaste
 * momenten van de groep, startend op `today`.
 */
export function positionInOffering(params: {
  sector: Sector;
  offering: Offering;
  entryId: string;
  entries: Entry[];
  rules: PriorityRule[];
  today: string;
}): PositionResult {
  const { sector, offering, entryId, entries, rules, today } = params;
  const cfg = SECTORS[sector];
  const opening: Opening = { id: 'standaard', offering, slots: offering.slots, startDate: today };
  const ranked = rankCandidates({ sector, opening, entries, rules, today });
  const eligible = ranked.filter((r) => r.eligible);
  const me = ranked.find((r) => r.entryId === entryId);
  if (!me) throw new Error('Inschrijving niet gevonden');

  if (!me.eligible) {
    return {
      position: null,
      total: eligible.length,
      ahead: [],
      explanation: `Op dit moment nog niet in aanmerking voor ${offering.name}: ${me.exclusions.map((e) => e.explanation).join('; ')}`,
      candidate: me,
    };
  }

  const idx = eligible.findIndex((r) => r.entryId === entryId);
  const aheadOf = eligible.slice(0, idx);
  const ahead: { reden: string; aantal: number }[] = [];
  for (const part of me.parts) {
    const n = aheadOf.filter((o) => (o.parts.find((p) => p.key === part.key)?.score ?? 0) > part.score).length;
    if (n > 0) ahead.push({ reden: part.label, aantal: n });
  }

  const p = cfg.participant;
  return {
    position: idx + 1,
    total: eligible.length,
    ahead,
    explanation:
      idx === 0
        ? `Komt er nu een plek vrij in ${offering.name}, dan ben jij als eerste aan de beurt.`
        : `Bij een plek in ${offering.name} ${idx === 1 ? 'staat 1 ' + p.enkelvoud : `staan ${idx} ${p.meervoud}`} voor je.`,
    candidate: me,
  };
}
