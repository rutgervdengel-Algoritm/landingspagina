'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { SECTORS } from '@/lib/matching/sectors';
import { rankCandidates } from '@/lib/matching/engine';
import type { CandidateResult, Slot } from '@/lib/matching/types';
import { formatDate, toEntry, toOffering, toRule, type EntryRow, type LocationRow, type OfferingRow, type OrgRow, type RuleRow } from '@/lib/db';
import SlotPicker, { slotText } from './SlotPicker';

interface Props {
  org: OrgRow;
  actor: string;
  today: string;
  locations: LocationRow[];
  offerings: OfferingRow[];
  entries: EntryRow[];
  rules: RuleRow[];
}

interface Gedaan { entryId: string; naam: string; email: string; bericht: string }

export default function PlekMatcher({ org, actor, today, offerings, entries, rules }: Props) {
  const router = useRouter();
  const cfg = SECTORS[org.sector];
  const [groepId, setGroepId] = useState(offerings[0]?.id ?? '');
  const groep = offerings.find((o) => o.id === groepId);
  const [slots, setSlots] = useState<Slot[]>(groep?.slots ?? []);
  const [start, setStart] = useState(today);
  const [aantal, setAantal] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [opengeklapt, setOpengeklapt] = useState<string | null>(null);
  const [toonUitgesloten, setToonUitgesloten] = useState(false);
  const [gedaan, setGedaan] = useState<Gedaan[]>([]);
  const [bezig, setBezig] = useState<string | null>(null);
  const [fout, setFout] = useState<string | null>(null);

  function kiesGroep(id: string) {
    setGroepId(id);
    setSlots(offerings.find((o) => o.id === id)?.slots ?? []);
    setOpenId(null);
    setGedaan([]);
  }

  const ranked = useMemo<CandidateResult[]>(() => {
    if (!groep) return [];
    return rankCandidates({
      sector: org.sector,
      opening: { id: 'nieuw', offering: toOffering(groep), slots, startDate: start },
      entries: entries.filter((e) => e.offering_id === groep.id).map(toEntry),
      rules: rules.map(toRule),
      today,
    });
  }, [groep, slots, start, entries, rules, org.sector, today]);

  const geschikt = ranked.filter((r) => r.eligible && !gedaan.some((g) => g.entryId === r.entryId));
  const uitgesloten = ranked.filter((r) => !r.eligible && entries.find((e) => e.id === r.entryId)?.status === 'wachtend');

  async function doeVoorstel(c: CandidateResult) {
    if (!groep) return;
    setBezig(c.entryId);
    setFout(null);
    const supabase = createClient();
    let opening = openId;
    if (!opening) {
      const { data, error } = await supabase
        .from('openings')
        .insert({ org_id: org.id, offering_id: groep.id, slots, start_date: start, num_spots: aantal })
        .select('id')
        .single();
      if (error) {
        setBezig(null);
        return setFout(`Plek vastleggen lukte niet: ${error.message}`);
      }
      opening = data.id;
      setOpenId(opening);
      await supabase.from('audit_log').insert({
        org_id: org.id, actor_label: actor, action: 'plek_vrijgekomen', entity: 'plek', entity_id: opening,
        metadata: { groep: groep.name, slots, start, aantal },
      });
    }
    const { error } = await supabase.rpc('staff_create_offer', {
      p_opening: opening,
      p_entry: c.entryId,
      p_score: c.score,
      p_breakdown: { parts: c.parts, summary: c.summary },
      p_reason: `Hoogste passende score (${Math.round(c.score)}%)`,
    });
    setBezig(null);
    if (error) return setFout(`Voorstel doen lukte niet: ${error.message}`);
    const e = entries.find((x) => x.id === c.entryId)!;
    const link = `${window.location.origin}/login`;
    const bericht =
      `Beste ${e.guardian_name},\n\n` +
      `Goed nieuws: er is een plek vrij in ${groep.name} voor ${e.participant_name}, ` +
      `vanaf ${formatDate(start)} op ${slots.map(slotText).join(', ')}.\n\n` +
      `Je hebt ${org.offer_response_days} dagen om te laten weten of je de plek wilt. ` +
      `Log in met ${e.guardian_email} via ${link} om het voorstel te bekijken en te accepteren. ` +
      `Daar zie je ook waarom ${e.participant_name} nu aan de beurt is.\n\nMet vriendelijke groet,\n${actor}\n${org.name}`;
    setGedaan([...gedaan, { entryId: c.entryId, naam: e.participant_name, email: e.guardian_email, bericht }]);
    router.refresh();
  }

  if (offerings.length === 0) {
    return <p className="text-kalk">Voeg eerst een {cfg.offering.enkelvoud} toe bij {cfg.offering.meervoud} en regels.</p>;
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-4xl font-extrabold">Plek vrijgekomen</h1>
      <p className="mt-1 max-w-2xl text-kalk">Vul in welke plek vrij is. De lijst hieronder past zich direct aan, met per persoon de uitleg waarom.</p>

      <section className="vlak mt-8 grid gap-5 p-5 sm:grid-cols-3 sm:p-6">
        <div>
          <label className="label" htmlFor="p-groep">{cfg.offering.enkelvoud[0].toUpperCase() + cfg.offering.enkelvoud.slice(1)}</label>
          <select id="p-groep" className="veld" value={groepId} onChange={(e) => kiesGroep(e.target.value)} disabled={!!openId}>
            {offerings.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="p-start">Startdatum</label>
          <input id="p-start" type="date" className="veld" value={start} onChange={(e) => setStart(e.target.value)} disabled={!!openId} />
        </div>
        <div>
          <label className="label" htmlFor="p-aantal">Aantal plekken</label>
          <input id="p-aantal" type="number" min={1} max={20} className="veld" value={aantal} onChange={(e) => setAantal(Math.max(1, Number(e.target.value)))} disabled={!!openId} />
        </div>
        <div className="sm:col-span-3">
          {cfg.slotMode === 'dagen' ? (
            <SlotPicker mode="dagen" value={slots} onChange={setSlots} label="Welke dagen komen vrij?" />
          ) : (
            <SlotPicker mode="tijdsloten" value={slots} onChange={setSlots} options={groep?.slots} label="Welk lesmoment komt vrij?" />
          )}
        </div>
      </section>

      {fout && <p className="mt-4 rounded-md bg-alarm-licht px-4 py-3 text-alarm" role="alert">{fout}</p>}

      {gedaan.length > 0 && (
        <section className="mt-8 grid gap-4" aria-live="polite">
          {gedaan.map((g) => (
            <div key={g.entryId} className="rounded-lg bg-zee-licht p-5">
              <h2 className="text-xl font-extrabold">Voorstel gedaan aan {g.naam}</h2>
              <p className="mt-1">De {cfg.guardian} ziet het voorstel na inloggen. Automatische e-mail volgt; stuur tot die tijd dit bericht naar {g.email}:</p>
              <textarea readOnly className="veld mt-3 h-44 text-sm" value={g.bericht} aria-label={`Bericht voor ${g.naam}`} />
              <button className="knop-rustig knop-klein mt-2" onClick={() => navigator.clipboard.writeText(g.bericht)}>Bericht kopiëren</button>
            </div>
          ))}
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-2xl font-extrabold">Aan de beurt</h2>
        {geschikt.length === 0 ? (
          <p className="vlak mt-3 p-6 text-kalk">Niemand op de lijst past bij deze plek.</p>
        ) : (
          <ol className="mt-3 grid gap-3">
            {geschikt.map((c, i) => {
              const open = opengeklapt === c.entryId;
              return (
                <li key={c.entryId} className={`vlak ${i === 0 ? 'border-inkt' : ''}`}>
                  <div className="flex flex-wrap items-center gap-4 p-4">
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md font-display text-2xl font-extrabold tabular-nums ${i === 0 ? 'bg-signaal' : 'bg-kalk-lichter'}`}>{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{c.participantName}</p>
                      <p className="text-sm text-kalk">{c.summary}</p>
                    </div>
                    <button className="knop-rustig knop-klein" onClick={() => setOpengeklapt(open ? null : c.entryId)} aria-expanded={open}>Waarom</button>
                    <button className={i === 0 ? 'knop-hoofd knop-klein' : 'knop-rustig knop-klein'} onClick={() => doeVoorstel(c)} disabled={bezig !== null}>
                      {bezig === c.entryId ? 'Bezig…' : 'Voorstel doen'}
                    </button>
                  </div>
                  {open && (
                    <dl className="grid gap-3 border-t border-kalk-lichter p-4">
                      {c.parts.map((p) => (
                        <div key={p.key} className="grid gap-1 sm:grid-cols-[12rem_1fr_5rem] sm:items-center sm:gap-4">
                          <dt className="font-bold">{p.label}</dt>
                          <dd>
                            <div className="scorebalk"><span style={{ width: `${p.max ? (p.score / p.max) * 100 : 0}%` }} /></div>
                            <p className="mt-1 text-sm text-kalk">{p.explanation}</p>
                          </dd>
                          <dd className="text-right tabular-nums text-kalk">{Math.round(p.score)} / {Math.round(p.max)}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </li>
              );
            })}
          </ol>
        )}

        {uitgesloten.length > 0 && (
          <div className="mt-6">
            <button className="font-bold underline" onClick={() => setToonUitgesloten(!toonUitgesloten)} aria-expanded={toonUitgesloten}>
              {uitgesloten.length} {uitgesloten.length === 1 ? cfg.participant.enkelvoud : cfg.participant.meervoud} {uitgesloten.length === 1 ? 'past' : 'passen'} niet bij deze plek
            </button>
            {toonUitgesloten && (
              <ul className="mt-3 divide-y divide-kalk-lichter rounded-lg border border-kalk-licht bg-white">
                {uitgesloten.map((c) => (
                  <li key={c.entryId} className="px-4 py-3">
                    <p className="font-bold">{c.participantName}</p>
                    <p className="text-sm text-kalk">{c.exclusions.map((e) => e.explanation).join('; ')}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
