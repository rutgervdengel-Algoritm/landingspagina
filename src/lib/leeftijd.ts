// Leeftijden invoeren in jaren (zoals mensen erover praten), opslaan in maanden.

function parse(j: string): number | null {
  if (j.trim() === '') return null;
  const n = parseFloat(j.replace(',', '.'));
  return Number.isNaN(n) || n < 0 ? null : n;
}

/** "vanaf 4 jaar" = 48 maanden; "vanaf 1,5 jaar" = 18 maanden. */
export function vanafMaanden(j: string): number | null {
  const n = parse(j);
  return n === null ? null : Math.round(n * 12);
}

/** "t/m 8 jaar" = tot de 9e verjaardag (107 mnd); "t/m 1,5 jaar" = 18 maanden. */
export function totMaanden(j: string): number | null {
  const n = parse(j);
  if (n === null) return null;
  return Number.isInteger(n) ? n * 12 + 11 : Math.round(n * 12);
}

export function leeftijdsbereik(min: number | null, max: number | null): string {
  const jaar = (m: number) => (m % 12 === 0 ? `${m / 12}` : (m / 12).toFixed(1).replace('.', ','));
  const tm = (m: number) => ((m + 1) % 12 === 0 ? `${(m + 1) / 12 - 1}` : jaar(m));
  if (min == null && max == null) return 'alle leeftijden';
  if (max == null) return `vanaf ${jaar(min!)} jaar`;
  if (min == null || min === 0) return `t/m ${tm(max)} jaar`;
  return `${jaar(min)} t/m ${tm(max)} jaar`;
}
