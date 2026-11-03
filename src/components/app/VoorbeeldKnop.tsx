'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { OfferingRow } from '@/lib/db';
import type { Sector, Slot } from '@/lib/matching/types';

const VOORNAMEN = ['Saar', 'Daan', 'Noor', 'Finn', 'Lieke', 'Sem', 'Julia', 'Bram', 'Fenna', 'Ties', 'Mila', 'Jesse', 'Roos', 'Luuk'];
const ACHTERNAMEN = ['de Wit', 'Bakker', 'Visser', 'Meijer', 'de Graaf', 'Mulder', 'Bos', 'Kok', 'Smit', 'Vos'];

function rnd<T>(a: T[], i: number) {
  return a[(i * 7 + 3) % a.length];
}

/** Vult de lijst met herkenbare, fictieve inschrijvingen. Altijd weer te verwijderen. */
export default function VoorbeeldKnop({ orgId, sector, offerings, heeftVoorbeeld }: { orgId: string; sector: Sector; offerings: OfferingRow[]; heeftVoorbeeld: boolean }) {
  const router = useRouter();
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  async function vul() {
    setBezig(true);
    setFout(null);
    const supabase = createClient();
    const nu = new Date();
    const rows = offerings.flatMap((o) =>
      Array.from({ length: 9 }, (_, i) => {
        const min = o.min_age_months ?? 6;
        const max = o.max_age_months ?? min + 60;
        // Leeftijd op vandaag binnen (of soms net buiten) het bereik van de groep.
        const ageMonths = i === 8 ? max + 4 : Math.round(min + ((max - min) * (i + 1)) / 9);
        const geb = new Date(nu);
        geb.setMonth(geb.getMonth() - ageMonths);
        const ingeschreven = new Date(nu);
        ingeschreven.setDate(ingeschreven.getDate() - (30 + i * 37));
        const slots: Slot[] =
          sector === 'kinderopvang'
            ? o.slots.filter((_, j) => (i + j) % 3 !== 0).slice(0, Math.max(1, (i % 3) + 1))
            : i % 4 === 0
              ? [{ dag: 'ma', van: '16:00', tot: '16:45' }]
              : o.slots;
        const naam = `${rnd(VOORNAMEN, i + offerings.indexOf(o) * 3)} ${rnd(ACHTERNAMEN, i * 3 + 1)}`;
        return {
          org_id: orgId,
          offering_id: o.id,
          location_id: o.location_id,
          participant_name: naam,
          participant_birthdate: geb.toISOString().slice(0, 10),
          guardian_name: `Ouder van ${naam.split(' ')[0]}`,
          guardian_email: `voorbeeld+${o.id.slice(0, 6)}${i}@example.com`,
          preferred_slots: slots.length ? slots : o.slots,
          level: o.level && i % 5 === 4 ? 'B' : o.level,
          priority_factors: { broer_zus: i % 4 === 2 },
          registered_at: ingeschreven.toISOString(),
          internal_notes: '[voorbeeld]',
        };
      }),
    );
    const { error } = await supabase.from('waitlist_entries').insert(rows);
    if (error) setFout(error.message);
    setBezig(false);
    router.refresh();
  }

  async function wis() {
    setBezig(true);
    const supabase = createClient();
    const { error } = await supabase.from('waitlist_entries').delete().eq('org_id', orgId).eq('internal_notes', '[voorbeeld]');
    if (error) setFout(error.message);
    setBezig(false);
    router.refresh();
  }

  if (offerings.length === 0) return null;
  return (
    <>
      {heeftVoorbeeld ? (
        <button className="knop-rustig" onClick={wis} disabled={bezig}>{bezig ? 'Bezig…' : 'Voorbeelddata verwijderen'}</button>
      ) : (
        <button className="knop-rustig" onClick={vul} disabled={bezig}>{bezig ? 'Bezig…' : 'Vul met voorbeelddata'}</button>
      )}
      {fout && <p className="w-full text-sm text-alarm" role="alert">{fout}</p>}
    </>
  );
}
