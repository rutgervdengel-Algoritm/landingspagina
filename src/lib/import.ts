import type { Dag, Slot } from './matching/types';

/*
 * Plakken vanuit Excel/Google Sheets/CSV. Herkent kolommen op naam, zodat
 * een bestaande lijst zonder omzetten kan worden overgenomen.
 */

export interface ImportRow {
  participant_name: string;
  participant_birthdate: string | null;
  guardian_name: string;
  guardian_email: string;
  guardian_phone: string | null;
  registered_at: string | null;
  groep: string | null;
  dagen: Slot[];
  broer_zus: boolean;
}

export interface ImportResult {
  rows: ImportRow[];
  errors: { regel: number; melding: string }[];
  herkend: string[];
}

const KOLOMMEN: Record<keyof Omit<ImportRow, 'dagen' | 'broer_zus'> | 'dagen' | 'broer_zus', string[]> = {
  participant_name: ['kind', 'naam kind', 'naam', 'deelnemer', 'zwemmer', 'leerling', 'voornaam kind'],
  participant_birthdate: ['geboortedatum', 'geb datum', 'geb. datum', 'geboren'],
  guardian_name: ['ouder', 'naam ouder', 'verzorger', 'contactpersoon', 'ouder/verzorger'],
  guardian_email: ['email', 'e-mail', 'emailadres', 'e-mailadres', 'mail'],
  guardian_phone: ['telefoon', 'tel', 'mobiel', 'telefoonnummer'],
  registered_at: ['inschrijfdatum', 'ingeschreven', 'datum inschrijving', 'aangemeld'],
  groep: ['groep', 'les', 'lesgroep', 'klas', 'aanbod'],
  dagen: ['dagen', 'gewenste dagen', 'voorkeur', 'dag'],
  broer_zus: ['broer/zus', 'broertje/zusje', 'broer zus', 'sibling'],
};

const DAGMAP: Record<string, Dag> = {
  ma: 'ma', maandag: 'ma', di: 'di', dinsdag: 'di', wo: 'wo', woensdag: 'wo', do: 'do', donderdag: 'do',
  vr: 'vr', vrijdag: 'vr', za: 'za', zaterdag: 'za', zo: 'zo', zondag: 'zo',
};

function splitLine(line: string, sep: string): string[] {
  const out: string[] = [];
  let cur = '';
  let q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === sep && !q) {
      out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

/** Accepteert 15-06-2023, 15/6/2023, 2023-06-15. */
export function parseDatum(s: string): string | null {
  const t = s.trim();
  if (!t) return null;
  let m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  m = t.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (m) {
    const d = Number(m[1]);
    const mo = Number(m[2]);
    if (d > 31 || mo > 12) return null;
    return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  }
  return null;
}

export function parseImport(text: string): ImportResult {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
  if (lines.length < 2) return { rows: [], errors: [{ regel: 1, melding: 'Plak minimaal een kopregel en één rij' }], herkend: [] };
  const sep = lines[0].includes('\t') ? '\t' : lines[0].split(';').length > lines[0].split(',').length ? ';' : ',';
  const kop = splitLine(lines[0], sep).map((h) => h.toLowerCase().trim());

  const idx: Partial<Record<keyof typeof KOLOMMEN, number>> = {};
  for (const [veld, namen] of Object.entries(KOLOMMEN) as [keyof typeof KOLOMMEN, string[]][]) {
    const i = kop.findIndex((h) => namen.includes(h));
    if (i >= 0) idx[veld] = i;
  }
  const herkend = Object.keys(idx);
  const errors: ImportResult['errors'] = [];
  if (idx.participant_name === undefined) errors.push({ regel: 1, melding: 'Geen kolom voor de naam gevonden (bijv. "Kind" of "Naam")' });
  if (idx.guardian_email === undefined) errors.push({ regel: 1, melding: 'Geen kolom voor e-mail gevonden (bijv. "E-mail")' });
  if (errors.length) return { rows: [], errors, herkend };

  const rows: ImportRow[] = [];
  lines.slice(1).forEach((line, n) => {
    const c = splitLine(line, sep);
    const get = (k: keyof typeof KOLOMMEN) => (idx[k] !== undefined ? c[idx[k]!] ?? '' : '');
    const regel = n + 2;
    const naam = get('participant_name');
    const email = get('guardian_email').toLowerCase();
    if (!naam) return errors.push({ regel, melding: 'Naam ontbreekt' });
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return errors.push({ regel, melding: `Ongeldig e-mailadres "${email}"` });
    const gebRaw = get('participant_birthdate');
    const geb = parseDatum(gebRaw);
    if (gebRaw && !geb) return errors.push({ regel, melding: `Geboortedatum "${gebRaw}" niet herkend` });
    const insRaw = get('registered_at');
    const ins = parseDatum(insRaw);
    if (insRaw && !ins) return errors.push({ regel, melding: `Inschrijfdatum "${insRaw}" niet herkend` });
    const dagen = get('dagen')
      .toLowerCase()
      .split(/[\s,/+]+/)
      .map((d) => DAGMAP[d])
      .filter(Boolean)
      .map((dag) => ({ dag }));
    const bz = get('broer_zus').toLowerCase();
    rows.push({
      participant_name: naam,
      participant_birthdate: geb,
      guardian_name: get('guardian_name') || 'Onbekend',
      guardian_email: email,
      guardian_phone: get('guardian_phone') || null,
      registered_at: ins ? `${ins}T12:00:00Z` : null,
      groep: get('groep') || null,
      dagen,
      broer_zus: ['ja', 'j', 'x', '1', 'true', 'yes'].includes(bz),
    });
  });
  return { rows, errors, herkend };
}
