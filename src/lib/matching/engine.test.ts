import { describe, expect, it } from 'vitest';
import { ageInMonths, positionInOffering, rankCandidates, slotsOverlap } from './engine';
import { SECTORS } from './sectors';
import type { Entry, Offering, Opening, PriorityRule } from './types';

const TODAY = '2026-11-01';

function entry(p: Partial<Entry> & { id: string }): Entry {
  return {
    participantName: p.id,
    preferredSlots: [],
    priorityFactors: {},
    registeredAt: '2026-01-01T10:00:00Z',
    status: 'wachtend',
    ...p,
  };
}

const wachttijd: PriorityRule = { id: 'r1', type: 'wachttijd', label: 'Inschrijfdatum', weight: 50, active: true };
const broerZus: PriorityRule = { id: 'r2', type: 'kenmerk', label: 'Broertje/zusje', factorKey: 'broer_zus', weight: 50, active: true };

describe('branche-configuratie', () => {
  it('weging telt per branche op tot 100', () => {
    for (const cfg of Object.values(SECTORS)) {
      const w = cfg.weights;
      expect(w.sloten + w.prioriteit + w.startdatum).toBe(100);
    }
  });
});

describe('hulpfuncties', () => {
  it('berekent leeftijd in maanden correct rond de verjaardag', () => {
    expect(ageInMonths('2025-03-15', '2026-03-14')).toBe(11);
    expect(ageInMonths('2025-03-15', '2026-03-15')).toBe(12);
  });

  it('herkent overlappende tijdsloten', () => {
    expect(slotsOverlap({ dag: 'wo', van: '15:00', tot: '15:45' }, { dag: 'wo', van: '15:30', tot: '16:15' })).toBe(true);
    expect(slotsOverlap({ dag: 'wo', van: '15:00', tot: '15:45' }, { dag: 'wo', van: '15:45', tot: '16:30' })).toBe(false);
    expect(slotsOverlap({ dag: 'wo' }, { dag: 'wo', van: '09:00', tot: '10:00' })).toBe(true);
    expect(slotsOverlap({ dag: 'ma' }, { dag: 'wo' })).toBe(false);
  });
});

describe('kinderopvang', () => {
  const babygroep: Offering = { id: 'g1', name: 'Babygroep', minAgeMonths: 0, maxAgeMonths: 18, slots: [{ dag: 'ma' }, { dag: 'di' }] };
  const plek: Opening = { id: 'p1', offering: babygroep, slots: [{ dag: 'ma' }, { dag: 'di' }], startDate: '2027-01-04' };

  it('stelt een babyplek nooit voor aan een kind dat te oud is', () => {
    const r = rankCandidates({
      sector: 'kinderopvang', opening: plek, rules: [wachttijd], today: TODAY,
      entries: [
        entry({ id: 'peuter', birthdate: '2024-01-01', preferredSlots: [{ dag: 'ma' }], registeredAt: '2025-01-01T00:00:00Z' }),
        entry({ id: 'baby', birthdate: '2026-06-01', preferredSlots: [{ dag: 'ma' }] }),
      ],
    });
    expect(r[0].entryId).toBe('baby');
    const peuter = r.find((x) => x.entryId === 'peuter')!;
    expect(peuter.eligible).toBe(false);
    expect(peuter.exclusions[0].reason).toBe('leeftijd');
  });

  it('sluit uit bij ontbrekende geboortedatum als de groep een leeftijdsgrens heeft', () => {
    const [r] = rankCandidates({ sector: 'kinderopvang', opening: plek, rules: [], today: TODAY, entries: [entry({ id: 'x' })] });
    expect(r.eligible).toBe(false);
    expect(r.exclusions[0].explanation).toMatch(/Geboortedatum ontbreekt/);
  });

  it('respecteert het minimum aantal dagen (deelplaatsing)', () => {
    const wil3 = { birthdate: '2026-06-01', preferredSlots: [{ dag: 'ma' as const }, { dag: 'di' as const }, { dag: 'wo' as const }] };
    const r = rankCandidates({
      sector: 'kinderopvang', opening: plek, rules: [], today: TODAY,
      entries: [entry({ id: 'streng', ...wil3 }), entry({ id: 'flexibel', ...wil3, minSlots: 2 })],
    });
    expect(r.find((x) => x.entryId === 'streng')!.eligible).toBe(false);
    const flex = r.find((x) => x.entryId === 'flexibel')!;
    expect(flex.eligible).toBe(true);
    expect(flex.parts[0].explanation).toBe('2 van 3 gewenste dagen (maandag, dinsdag)');
  });

  it('geeft voorrang op broertje/zusje en daarna op wachttijd', () => {
    const base = { birthdate: '2026-06-01', preferredSlots: [{ dag: 'ma' as const }, { dag: 'di' as const }] };
    const r = rankCandidates({
      sector: 'kinderopvang', opening: plek, rules: [wachttijd, broerZus], today: TODAY,
      entries: [
        entry({ id: 'lang', ...base, registeredAt: '2026-02-01T00:00:00Z' }),
        entry({ id: 'kort', ...base, registeredAt: '2026-09-01T00:00:00Z' }),
        entry({ id: 'zus', ...base, registeredAt: '2026-09-01T00:00:00Z', priorityFactors: { broer_zus: true } }),
      ],
    });
    expect(r.map((x) => x.entryId)).toEqual(['zus', 'lang', 'kort']);
  });

  it('beslist bij gelijke score op inschrijfdatum, altijd hetzelfde', () => {
    const base = { birthdate: '2026-06-01', preferredSlots: [{ dag: 'ma' as const }] };
    const input = {
      sector: 'kinderopvang' as const, opening: plek, rules: [broerZus], today: TODAY,
      entries: [entry({ id: 'b', ...base, registeredAt: '2026-05-02T00:00:00Z' }), entry({ id: 'a', ...base, registeredAt: '2026-05-01T00:00:00Z' })],
    };
    expect(rankCandidates(input).map((x) => x.entryId)).toEqual(['a', 'b']);
    expect(rankCandidates({ ...input, entries: [...input.entries].reverse() }).map((x) => x.entryId)).toEqual(['a', 'b']);
  });
});

describe('zwemles', () => {
  const zwemA: Offering = { id: 'z1', name: 'Zwemles A', level: 'A', minAgeMonths: 48, slots: [{ dag: 'wo', van: '15:00', tot: '15:45' }] };
  const plek: Opening = { id: 'p2', offering: zwemA, slots: [{ dag: 'wo', van: '15:00', tot: '15:45' }], startDate: '2027-01-06' };

  it('sluit verkeerd niveau uit en accepteert één passend alternatief tijdslot', () => {
    const r = rankCandidates({
      sector: 'zwemles', opening: plek, rules: [wachttijd], today: TODAY,
      entries: [
        entry({ id: 'niveauB', birthdate: '2021-01-01', level: 'B', preferredSlots: [{ dag: 'wo', van: '15:00', tot: '15:45' }] }),
        entry({ id: 'alternatief', birthdate: '2021-01-01', level: 'A', preferredSlots: [{ dag: 'ma', van: '16:00', tot: '16:45' }, { dag: 'wo', van: '15:00', tot: '15:45' }] }),
        entry({ id: 'teJong', birthdate: '2024-01-01', preferredSlots: [{ dag: 'wo', van: '15:00', tot: '15:45' }] }),
      ],
    });
    expect(r[0].entryId).toBe('alternatief');
    expect(r[0].eligible).toBe(true);
    expect(r.find((x) => x.entryId === 'niveauB')!.exclusions[0].reason).toBe('niveau');
    expect(r.find((x) => x.entryId === 'teJong')!.exclusions[0].reason).toBe('leeftijd');
  });
});

describe('positie voor ouders', () => {
  it('is precies gelijk aan de volgorde van een echte plek in die groep', () => {
    const groep: Offering = { id: 'g', name: 'Judo 6-8', minAgeMonths: 72, maxAgeMonths: 107, slots: [{ dag: 'za', van: '09:00', tot: '10:00' }] };
    const za = [{ dag: 'za' as const, van: '09:00', tot: '10:00' }];
    const entries = [
      entry({ id: 'e1', birthdate: '2019-05-01', preferredSlots: za, registeredAt: '2026-03-01T00:00:00Z' }),
      entry({ id: 'e2', birthdate: '2019-05-01', preferredSlots: za, registeredAt: '2026-01-01T00:00:00Z' }),
      entry({ id: 'e3', birthdate: '2019-05-01', preferredSlots: za, registeredAt: '2026-06-01T00:00:00Z', priorityFactors: { broer_zus: true } }),
    ];
    const rules = [wachttijd, broerZus];
    const echt = rankCandidates({ sector: 'sport', opening: { id: 'x', offering: groep, slots: groep.slots, startDate: TODAY }, entries, rules, today: TODAY });
    for (const [i, c] of Array.from(echt.entries())) {
      const pos = positionInOffering({ sector: 'sport', offering: groep, entryId: c.entryId, entries, rules, today: TODAY });
      expect(pos.position).toBe(i + 1);
    }
    const laatste = positionInOffering({ sector: 'sport', offering: groep, entryId: echt[2].entryId, entries, rules, today: TODAY });
    expect(laatste.explanation).toBe('Bij een plek in Judo 6-8 staan 2 sporters voor je.');
  });
});
