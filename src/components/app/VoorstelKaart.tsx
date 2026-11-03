'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/db';
import type { Slot } from '@/lib/matching/types';
import { slotText } from './SlotPicker';

interface Voorstel {
  offer_id: string; participant_name: string; org_name: string; offering_name: string;
  slots: Slot[]; start_date: string; expires_at: string;
  breakdown: { parts?: { key?: string; label: string; explanation: string }[] };
}

const UITKOMST: Record<string, string> = {
  geaccepteerd: 'Geaccepteerd. De organisatie neemt contact met je op over de start.',
  afgewezen: 'Afgewezen. Je blijft op de wachtlijst staan.',
  verlopen: 'Dit voorstel is verlopen. Je staat weer op de wachtlijst.',
  vergeven: 'Deze plek is net aan iemand anders vergeven. Je staat weer op de wachtlijst.',
  niet_open: 'Dit voorstel staat niet meer open.',
};

export default function VoorstelKaart({ voorstel: v }: { voorstel: Voorstel }) {
  const router = useRouter();
  const [stap, setStap] = useState<'keuze' | 'afwijzen' | 'klaar'>('keuze');
  const [reden, setReden] = useState('');
  const [uitkomst, setUitkomst] = useState<string | null>(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  async function reageer(accept: boolean) {
    setBezig(true);
    setFout(null);
    const { data, error } = await createClient().rpc('guardian_respond_offer', { p_offer: v.offer_id, p_accept: accept, p_reason: accept ? undefined : reden || undefined });
    setBezig(false);
    if (error) return setFout(error.message);
    setUitkomst(String(data));
    setStap('klaar');
    router.refresh();
  }

  const dagenOver = Math.max(0, Math.ceil((new Date(v.expires_at).getTime() - Date.now()) / 86400000));

  return (
    <section className="mt-8 rounded-xl border-2 border-inkt bg-white p-6" aria-live="polite">
      <p className="inline-block rounded bg-signaal px-2 py-0.5 text-sm font-bold">Er is een plek voor {v.participant_name}</p>
      <h2 className="mt-3 text-2xl font-extrabold">{v.offering_name}</h2>
      <p className="mt-1 capitalize">{v.slots.map(slotText).join(', ')}, vanaf {formatDate(v.start_date)}</p>
      <p className="mt-1 text-sm text-kalk">{v.org_name}. Reageer binnen {dagenOver} {dagenOver === 1 ? 'dag' : 'dagen'}.</p>

      {v.breakdown.parts && (
        <details className="mt-4">
          <summary className="cursor-pointer font-bold">Waarom {v.participant_name} nu aan de beurt is</summary>
          <ul className="mt-2 list-inside list-disc text-sm text-kalk">
            {v.breakdown.parts.map((p) => <li key={p.label}>{p.explanation}</li>)}
          </ul>
        </details>
      )}

      {stap === 'keuze' && (
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="knop-signaal" onClick={() => reageer(true)} disabled={bezig}>{bezig ? 'Bezig…' : 'Plek accepteren'}</button>
          <button className="knop-rustig" onClick={() => setStap('afwijzen')} disabled={bezig}>Niet nu</button>
        </div>
      )}
      {stap === 'afwijzen' && (
        <div className="mt-6">
          <label className="label" htmlFor={`r-${v.offer_id}`}>Waarom past het niet? (niet verplicht)</label>
          <textarea id={`r-${v.offer_id}`} className="veld" rows={2} value={reden} onChange={(e) => setReden(e.target.value)} />
          <p className="hulp">Je blijft gewoon op de wachtlijst staan.</p>
          <div className="mt-3 flex gap-3">
            <button className="knop-hoofd" onClick={() => reageer(false)} disabled={bezig}>{bezig ? 'Bezig…' : 'Plek afwijzen'}</button>
            <button className="knop-rustig" onClick={() => setStap('keuze')}>Terug</button>
          </div>
        </div>
      )}
      {stap === 'klaar' && uitkomst && <p className="mt-6 rounded-md bg-zee-licht px-4 py-3 font-bold text-zee">{UITKOMST[uitkomst] ?? uitkomst}</p>}
      {fout && <p className="mt-4 rounded-md bg-alarm-licht px-4 py-3 text-alarm" role="alert">{fout}</p>}
    </section>
  );
}
