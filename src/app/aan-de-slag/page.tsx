'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { SECTORS } from '@/lib/matching/sectors';
import type { PriorityRule, Sector, Slot } from '@/lib/matching/types';
import SlotPicker from '@/components/app/SlotPicker';
import { BRAND } from '@/lib/brand';
import { totMaanden, vanafMaanden } from '@/lib/leeftijd';

const VOORBEELD: Record<Sector, { groep: string; van: number; tot: number; niveau?: string; slots: Slot[] }> = {
  kinderopvang: { groep: 'Babygroep', van: 0, tot: 1.5, slots: [{ dag: 'ma' }, { dag: 'di' }, { dag: 'do' }] },
  zwemles: { groep: 'Zwemles A, woensdag', van: 4, tot: 12, niveau: 'A', slots: [{ dag: 'wo', van: '15:00', tot: '15:45' }] },
  sport: { groep: 'Judo 6–8 jaar', van: 6, tot: 8, slots: [{ dag: 'za', van: '09:00', tot: '10:00' }] },
  overig: { groep: 'Groep 1', van: 0, tot: 18, slots: [{ dag: 'wo', van: '16:00', tot: '17:00' }] },
};

const STAPPEN = ['Branche', 'Organisatie', 'Eerste groep', 'Voorrang'];

export default function AanDeSlag() {
  const router = useRouter();
  const [stap, setStap] = useState(0);
  const [sector, setSector] = useState<Sector | null>(null);
  const [org, setOrg] = useState({ naam: '', jij: '', locatie: '', plaats: '' });
  const [groep, setGroep] = useState({ naam: '', van: '', tot: '', niveau: '', slots: [] as Slot[] });
  const [regels, setRegels] = useState<Omit<PriorityRule, 'id'>[]>([]);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  const cfg = sector ? SECTORS[sector] : null;
  const totaalGewicht = useMemo(() => regels.filter((r) => r.active).reduce((s, r) => s + r.weight, 0), [regels]);

  function kiesSector(s: Sector) {
    setSector(s);
    const v = VOORBEELD[s];
    setGroep({ naam: v.groep, van: String(v.van), tot: String(v.tot), niveau: v.niveau ?? '', slots: v.slots });
    setRegels(SECTORS[s].defaultRules.map((r) => ({ ...r })));
    setStap(1);
  }

  const kanVerder =
    (stap === 1 && org.naam.trim().length >= 2 && org.jij.trim() && org.locatie.trim()) ||
    (stap === 2 && groep.naam.trim() && groep.slots.length > 0) ||
    stap === 3;

  async function afronden() {
    if (!sector || !cfg) return;
    setBezig(true);
    setFout(null);
    const supabase = createClient();
    const { data: orgId, error } = await supabase.rpc('create_organization', {
      p_name: org.naam.trim(),
      p_sector: sector,
      p_location: org.locatie.trim(),
      p_city: org.plaats.trim() || null,
      p_rules: regels,
      p_display_name: org.jij.trim(),
    });
    if (error || !orgId) {
      setBezig(false);
      setFout(`Aanmaken lukte niet: ${error?.message ?? 'onbekende fout'}`);
      return;
    }
    const { data: loc } = await supabase.from('locations').select('id').eq('org_id', orgId).single();
    const { data: g, error: gErr } = await supabase
      .from('offerings')
      .insert({
        org_id: orgId,
        location_id: loc!.id,
        name: groep.naam.trim(),
        min_age_months: vanafMaanden(groep.van),
        // "t/m 8 jaar" = tot 9e verjaardag; "t/m 1,5 jaar" = 18 maanden.
        max_age_months: totMaanden(groep.tot),
        level: cfg.usesLevel && groep.niveau ? groep.niveau.trim() : null,
        slots: groep.slots,
      })
      .select('id')
      .single();
    if (gErr) {
      setBezig(false);
      setFout(`Groep opslaan lukte niet: ${gErr.message}`);
      return;
    }
    await supabase.from('audit_log').insert({
      org_id: orgId,
      actor_label: org.jij.trim(),
      action: 'groep_toegevoegd',
      entity: 'groep',
      entity_id: g!.id,
    });
    router.push('/beheer?welkom=1');
    router.refresh();
  }

  return (
    <main className="app px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-display text-2xl font-extrabold">{BRAND.name}</p>

        <ol className="mt-8 flex gap-2 text-sm" aria-label="Voortgang">
          {STAPPEN.map((s, i) => (
            <li key={s} className={`flex-1 border-t-4 pt-2 ${i <= stap ? 'border-inkt font-bold text-inkt' : 'border-kalk-licht text-kalk'}`} aria-current={i === stap ? 'step' : undefined}>
              {i + 1}. {s}
            </li>
          ))}
        </ol>

        {stap === 0 && (
          <section className="mt-10">
            <h1 className="text-4xl font-extrabold">Waar heb je een wachtlijst voor?</h1>
            <p className="mt-3 text-kalk">Dit bepaalt de woorden, de standaard voorrangsregels en of je met dagen of lesmomenten werkt. Je kunt alles later aanpassen.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {(Object.keys(SECTORS) as Sector[]).map((s) => (
                <button key={s} type="button" onClick={() => kiesSector(s)} className="vlak p-5 text-left hover:border-inkt">
                  <span className="font-display text-xl font-extrabold">{SECTORS[s].label}</span>
                  <span className="mt-1 block text-sm text-kalk">
                    {SECTORS[s].slotMode === 'dagen' ? 'Plaatsing per dag' : 'Plaatsing per lesmoment'}
                    {SECTORS[s].usesLevel ? ', met niveaus' : ''}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {stap === 1 && cfg && (
          <section className="mt-10">
            <h1 className="text-4xl font-extrabold">Over je organisatie</h1>
            <div className="mt-8 grid gap-5">
              <div>
                <label className="label" htmlFor="naam">Naam organisatie</label>
                <input id="naam" className="veld" value={org.naam} onChange={(e) => setOrg({ ...org, naam: e.target.value })} placeholder={sector === 'zwemles' ? 'Zwemschool De Golf' : sector === 'kinderopvang' ? 'Kinderopvang Het Nest' : 'Judoclub Muiden'} />
              </div>
              <div>
                <label className="label" htmlFor="jij">Je naam</label>
                <input id="jij" className="veld" value={org.jij} onChange={(e) => setOrg({ ...org, jij: e.target.value })} />
                <p className="hulp">Komt in het beslissingslog bij alles wat jij doet.</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="loc">Naam locatie</label>
                  <input id="loc" className="veld" value={org.locatie} onChange={(e) => setOrg({ ...org, locatie: e.target.value })} placeholder="Hoofdlocatie" />
                </div>
                <div>
                  <label className="label" htmlFor="plaats">Plaats</label>
                  <input id="plaats" className="veld" value={org.plaats} onChange={(e) => setOrg({ ...org, plaats: e.target.value })} />
                </div>
              </div>
            </div>
          </section>
        )}

        {stap === 2 && cfg && (
          <section className="mt-10">
            <h1 className="text-4xl font-extrabold">Je eerste {cfg.offering.enkelvoud}</h1>
            <p className="mt-3 text-kalk">Waar wachten mensen op? Meer {cfg.offering.meervoud} voeg je later toe.</p>
            <div className="mt-8 grid gap-5">
              <div>
                <label className="label" htmlFor="gnaam">Naam</label>
                <input id="gnaam" className="veld" value={groep.naam} onChange={(e) => setGroep({ ...groep, naam: e.target.value })} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="van">Leeftijd vanaf (jaar)</label>
                  <input id="van" inputMode="decimal" className="veld" value={groep.van} onChange={(e) => setGroep({ ...groep, van: e.target.value })} />
                </div>
                <div>
                  <label className="label" htmlFor="tot">Leeftijd tot en met (jaar)</label>
                  <input id="tot" inputMode="decimal" className="veld" value={groep.tot} onChange={(e) => setGroep({ ...groep, tot: e.target.value })} />
                  <p className="hulp">Gebruik 1,5 voor anderhalf jaar. Leeg = geen grens.</p>
                </div>
              </div>
              {cfg.usesLevel && (
                <div>
                  <label className="label" htmlFor="niv">Niveau</label>
                  <input id="niv" className="veld" value={groep.niveau} onChange={(e) => setGroep({ ...groep, niveau: e.target.value })} placeholder={sector === 'zwemles' ? 'A' : 'beginners'} />
                </div>
              )}
              <SlotPicker mode={cfg.slotMode} value={groep.slots} onChange={(slots) => setGroep({ ...groep, slots })} label={cfg.slotMode === 'dagen' ? 'Op welke dagen is deze groep open?' : 'Lesmomenten'} />
            </div>
          </section>
        )}

        {stap === 3 && cfg && (
          <section className="mt-10">
            <h1 className="text-4xl font-extrabold">Wie gaat voor?</h1>
            <p className="mt-3 text-kalk">
              Bij een vrije plek telt eerst of iemand past (leeftijd{cfg.usesLevel ? ', niveau' : ''} en {cfg.slotMode === 'dagen' ? 'dagen' : 'lesmoment'}).
              Daarna bepalen deze regels de volgorde. Ouders zien precies deze uitleg.
            </p>
            <ul className="mt-8 grid gap-3">
              {regels.map((r, i) => (
                <li key={r.label} className="vlak p-4">
                  <div className="flex items-center justify-between gap-4">
                    <label className="flex items-center gap-3 font-bold">
                      <input type="checkbox" className="h-5 w-5 accent-inkt" checked={r.active} onChange={() => setRegels(regels.map((x, j) => (j === i ? { ...x, active: !x.active } : x)))} />
                      {r.label}
                    </label>
                    <span className="tabular-nums text-kalk">{r.active && totaalGewicht > 0 ? `${Math.round((r.weight / totaalGewicht) * 100)}%` : 'uit'}</span>
                  </div>
                  {r.active && (
                    <input
                      type="range"
                      min={5}
                      max={100}
                      step={5}
                      value={r.weight}
                      aria-label={`Gewicht ${r.label}`}
                      className="mt-3 w-full accent-inkt"
                      onChange={(e) => setRegels(regels.map((x, j) => (j === i ? { ...x, weight: Number(e.target.value) } : x)))}
                    />
                  )}
                </li>
              ))}
            </ul>
            {fout && <p className="mt-4 rounded-md bg-alarm-licht px-3 py-2 text-sm text-alarm" role="alert">{fout}</p>}
          </section>
        )}

        {stap > 0 && (
          <div className="mt-10 flex items-center justify-between">
            <button type="button" className="knop-rustig" onClick={() => setStap(stap - 1)} disabled={bezig}>Terug</button>
            {stap < 3 ? (
              <button type="button" className="knop-hoofd" disabled={!kanVerder} onClick={() => setStap(stap + 1)}>Volgende</button>
            ) : (
              <button type="button" className="knop-signaal" disabled={bezig} onClick={afronden}>{bezig ? 'Bezig met inrichten…' : 'Wachtlijst inrichten'}</button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
