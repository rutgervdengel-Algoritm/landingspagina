import type { PriorityRule, Sector } from './types';

/**
 * Branche-configuratie: woorden, welke criteria meetellen en welke regels
 * standaard aan staan. Een nieuwe branche toevoegen = hier een blok erbij.
 */
export interface SectorConfig {
  label: string;
  participant: { enkelvoud: string; meervoud: string };
  guardian: string;
  offering: { enkelvoud: string; meervoud: string };
  /** Hele dagen (kinderopvang) of tijdsloten (lessen). */
  slotMode: 'dagen' | 'tijdsloten';
  usesLevel: boolean;
  /** Weging van de onderdelen van de score; samen 100. */
  weights: { sloten: number; prioriteit: number; startdatum: number };
  defaultRules: Omit<PriorityRule, 'id'>[];
  /** Kenmerken die een aanbieder kan laten aanvinken. */
  factors: { key: string; label: string }[];
}

export const SECTORS: Record<Sector, SectorConfig> = {
  kinderopvang: {
    label: 'Kinderopvang',
    participant: { enkelvoud: 'kind', meervoud: 'kinderen' },
    guardian: 'ouder',
    offering: { enkelvoud: 'groep', meervoud: 'groepen' },
    slotMode: 'dagen',
    usesLevel: false,
    weights: { sloten: 40, prioriteit: 40, startdatum: 20 },
    defaultRules: [
      { type: 'wachttijd', label: 'Inschrijfdatum', weight: 50, active: true },
      { type: 'kenmerk', label: 'Broertje of zusje op de locatie', factorKey: 'broer_zus', weight: 30, active: true },
      { type: 'kenmerk', label: 'Kind van medewerker', factorKey: 'personeel', weight: 20, active: false },
    ],
    factors: [
      { key: 'broer_zus', label: 'Broertje of zusje op de locatie' },
      { key: 'personeel', label: 'Kind van medewerker' },
    ],
  },
  zwemles: {
    label: 'Zwemles',
    participant: { enkelvoud: 'zwemmer', meervoud: 'zwemmers' },
    guardian: 'ouder',
    offering: { enkelvoud: 'lesgroep', meervoud: 'lesgroepen' },
    slotMode: 'tijdsloten',
    usesLevel: true,
    weights: { sloten: 45, prioriteit: 45, startdatum: 10 },
    defaultRules: [
      { type: 'wachttijd', label: 'Inschrijfdatum', weight: 60, active: true },
      { type: 'leeftijd_oudst', label: 'Oudere kinderen eerst', weight: 30, active: true },
      { type: 'kenmerk', label: 'Broertje of zusje zwemt al', factorKey: 'broer_zus', weight: 10, active: true },
    ],
    factors: [{ key: 'broer_zus', label: 'Broertje of zusje zwemt al' }],
  },
  sport: {
    label: 'Sport',
    participant: { enkelvoud: 'sporter', meervoud: 'sporters' },
    guardian: 'ouder',
    offering: { enkelvoud: 'groep', meervoud: 'groepen' },
    slotMode: 'tijdsloten',
    usesLevel: true,
    weights: { sloten: 45, prioriteit: 45, startdatum: 10 },
    defaultRules: [
      { type: 'wachttijd', label: 'Inschrijfdatum', weight: 60, active: true },
      { type: 'kenmerk', label: 'Broertje of zusje is lid', factorKey: 'broer_zus', weight: 20, active: true },
      { type: 'kenmerk', label: 'Woont in de gemeente', factorKey: 'inwoner', weight: 20, active: false },
    ],
    factors: [
      { key: 'broer_zus', label: 'Broertje of zusje is lid' },
      { key: 'inwoner', label: 'Woont in de gemeente' },
    ],
  },
  overig: {
    label: 'Overig',
    participant: { enkelvoud: 'deelnemer', meervoud: 'deelnemers' },
    guardian: 'contactpersoon',
    offering: { enkelvoud: 'groep', meervoud: 'groepen' },
    slotMode: 'tijdsloten',
    usesLevel: false,
    weights: { sloten: 40, prioriteit: 50, startdatum: 10 },
    defaultRules: [{ type: 'wachttijd', label: 'Inschrijfdatum', weight: 100, active: true }],
    factors: [],
  },
};
