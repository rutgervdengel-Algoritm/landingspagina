'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { SECTORS } from '@/lib/matching/sectors';
import type { EntryRow, LocationRow, OfferingRow, OrgRow, RuleRow } from '@/lib/db';
import type { Slot } from '@/lib/matching/types';
import { leeftijdsbereik, totMaanden, vanafMaanden } from '@/lib/leeftijd';
import SlotPicker, { slotText } from './SlotPicker';

interface Props {
  org: OrgRow;
  actor: string;
  locations: LocationRow[];
  offerings: OfferingRow[];
  entries: EntryRow[];
  rules: RuleRow[];
}

export default function Instellingen({ org, actor, locations, offerings, rules }: Props) {
  const router = useRouter();
  const cfg = SECTORS[org.sector];
  const [nieuw, setNieuw] = useState({ naam: '', van: '', tot: '', niveau: '', loc: locations[0]?.id ?? '', slots: [] as Slot[] });
  const [regels, setRegels] = useState(rules);
  const [melding, setMelding] = useState<string | null>(null);
  const [bezig, setBezig] = useState(false);
  const totaal = regels.filter((r) => r.active).reduce((s, r) => s + r.weight, 0);
  const gewijzigd = JSON.stringify(regels) !== JSON.stringify(rules);

  async function groepToevoegen(e: React.FormEvent) {
    e.preventDefault();
    setBezig(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('offerings')
      .insert({
        org_id: org.id,
        location_id: nieuw.loc,
        name: nieuw.naam.trim(),
        min_age_months: vanafMaanden(nieuw.van),
        max_age_months: totMaanden(nieuw.tot),
        level: cfg.usesLevel ? nieuw.niveau.trim() || null : null,
        slots: nieuw.slots,
      })
      .select('id')
      .single();
    setBezig(false);
    if (error) return setMelding(`Opslaan lukte niet: ${error.message}`);
    await supabase.from('audit_log').insert({ org_id: org.id, actor_label: actor, action: 'groep_toegevoegd', entity: 'groep', entity_id: data.id, metadata: { naam: nieuw.naam } });
    setNieuw({ ...nieuw, naam: '', van: '', tot: '', niveau: '', slots: [] });
    setMelding(`${nieuw.naam} toegevoegd.`);
    router.refresh();
  }

  async function regelsOpslaan() {
    setBezig(true);
    const supabase = createClient();
    for (const r of regels) {
      const oud = rules.find((x) => x.id === r.id)!;
      if (oud.weight !== r.weight || oud.active !== r.active) {
        const { error } = await supabase.from('priority_rules').update({ weight: r.weight, active: r.active }).eq('id', r.id);
        if (error) {
          setBezig(false);
          return setMelding(`Opslaan lukte niet: ${error.message}`);
        }
      }
    }
    await supabase.from('audit_log').insert({
      org_id: org.id, actor_label: actor, action: 'regels_gewijzigd', entity: 'regels',
      metadata: { regels: regels.map((r) => ({ label: r.label, gewicht: r.weight, actief: r.active })) },
    });
    setBezig(false);
    setMelding('Voorrangsregels opgeslagen en vastgelegd in het log.');
    router.refresh();
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-extrabold">{cfg.offering.meervoud[0].toUpperCase() + cfg.offering.meervoud.slice(1)} en regels</h1>
      {melding && <p className="mt-6 rounded-md bg-zee-licht px-4 py-3 text-zee" role="status">{melding}</p>}

      <section className="mt-8">
        <h2 className="text-2xl font-extrabold">{cfg.offering.meervoud[0].toUpperCase() + cfg.offering.meervoud.slice(1)}</h2>
        <ul className="mt-3 divide-y divide-kalk-lichter rounded-lg border border-kalk-licht bg-white">
          {offerings.map((o) => (
            <li key={o.id} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
              <span className="font-bold">{o.name}</span>
              <span className="text-sm capitalize text-kalk">
                {leeftijdsbereik(o.min_age_months, o.max_age_months)}{o.level ? `, niveau ${o.level}` : ''}, {o.slots.map(slotText).join(', ')}
              </span>
            </li>
          ))}
        </ul>

        <form onSubmit={groepToevoegen} className="vlak mt-4 grid gap-4 p-5 sm:grid-cols-2">
          <h3 className="text-lg font-extrabold sm:col-span-2">{cfg.offering.enkelvoud[0].toUpperCase() + cfg.offering.enkelvoud.slice(1)} toevoegen</h3>
          <div><label className="label" htmlFor="g-naam">Naam</label><input id="g-naam" required className="veld" value={nieuw.naam} onChange={(e) => setNieuw({ ...nieuw, naam: e.target.value })} /></div>
          {locations.length > 1 && (
            <div><label className="label" htmlFor="g-loc">Locatie</label><select id="g-loc" className="veld" value={nieuw.loc} onChange={(e) => setNieuw({ ...nieuw, loc: e.target.value })}>{locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
          )}
          <div><label className="label" htmlFor="g-van">Leeftijd vanaf (jaar)</label><input id="g-van" inputMode="decimal" className="veld" value={nieuw.van} onChange={(e) => setNieuw({ ...nieuw, van: e.target.value })} /></div>
          <div><label className="label" htmlFor="g-tot">Leeftijd tot en met (jaar)</label><input id="g-tot" inputMode="decimal" className="veld" value={nieuw.tot} onChange={(e) => setNieuw({ ...nieuw, tot: e.target.value })} /></div>
          {cfg.usesLevel && <div><label className="label" htmlFor="g-niv">Niveau</label><input id="g-niv" className="veld" value={nieuw.niveau} onChange={(e) => setNieuw({ ...nieuw, niveau: e.target.value })} /></div>}
          <div className="sm:col-span-2"><SlotPicker mode={cfg.slotMode} value={nieuw.slots} onChange={(slots) => setNieuw({ ...nieuw, slots })} label={cfg.slotMode === 'dagen' ? 'Open op' : 'Lesmomenten'} /></div>
          <div className="sm:col-span-2"><button className="knop-hoofd" disabled={bezig || nieuw.slots.length === 0}>Toevoegen</button></div>
        </form>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold">Voorrangsregels</h2>
        <p className="mt-1 max-w-2xl text-kalk">Wijzigingen gelden direct voor nieuwe plekken en voor de positie die {cfg.guardian}s zien. Elke wijziging komt in het beslissingslog.</p>
        <ul className="mt-4 grid gap-3">
          {regels.map((r, i) => (
            <li key={r.id} className="vlak p-4">
              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-3 font-bold">
                  <input type="checkbox" className="h-5 w-5 accent-inkt" checked={r.active} onChange={() => setRegels(regels.map((x, j) => (j === i ? { ...x, active: !x.active } : x)))} />
                  {r.label}
                </label>
                <span className="tabular-nums text-kalk">{r.active && totaal ? `${Math.round((r.weight / totaal) * 100)}% van de voorrang` : 'uit'}</span>
              </div>
              {r.active && (
                <input type="range" min={5} max={100} step={5} value={r.weight} aria-label={`Gewicht ${r.label}`} className="mt-3 w-full accent-inkt" onChange={(e) => setRegels(regels.map((x, j) => (j === i ? { ...x, weight: Number(e.target.value) } : x)))} />
              )}
            </li>
          ))}
        </ul>
        <button className="knop-hoofd mt-4" disabled={!gewijzigd || bezig} onClick={regelsOpslaan}>Regels opslaan</button>
      </section>
    </div>
  );
}
