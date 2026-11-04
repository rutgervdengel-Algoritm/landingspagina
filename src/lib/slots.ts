import type { Dag, Slot } from './matching/types';

// Gedeeld door server- en browsercode. Bewust NIET in een 'use client'-bestand:
// functies daaruit zijn op de server geen functies maar verwijzingen.

export const DAGEN: { key: Dag; kort: string; lang: string }[] = [
  { key: 'ma', kort: 'ma', lang: 'maandag' },
  { key: 'di', kort: 'di', lang: 'dinsdag' },
  { key: 'wo', kort: 'wo', lang: 'woensdag' },
  { key: 'do', kort: 'do', lang: 'donderdag' },
  { key: 'vr', kort: 'vr', lang: 'vrijdag' },
  { key: 'za', kort: 'za', lang: 'zaterdag' },
  { key: 'zo', kort: 'zo', lang: 'zondag' },
];

export function slotText(s: Slot) {
  const d = DAGEN.find((x) => x.key === s.dag)?.lang ?? s.dag;
  return s.van && s.tot ? `${d} ${s.van}–${s.tot}` : d;
}
