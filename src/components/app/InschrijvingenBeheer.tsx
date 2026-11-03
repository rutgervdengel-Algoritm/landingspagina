'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { SECTORS } from '@/lib/matching/sectors';
import type { EntryRow, LocationRow, OfferingRow, OrgRow, RuleRow } from '@/lib/db';
import { formatDate } from '@/lib/db';
import type { Slot } from '@/lib/matching/types';
import { parseImport, type ImportResult } from '@/lib/import';
import SlotPicker, { slotText } from './SlotPicker';

const STATUS: Record<EntryRow['status'], string> = {
  wachtend: 'Wachtend',
  voorstel: 'Voorstel loopt',
  geplaatst: 'Geplaatst',
  teruggetrokken: 'Teruggetrokken',
  verlopen: 'Verlopen',
};

interface Props {
  org: OrgRow;
  actor: string;
  locations: LocationRow[];
  offerings: OfferingRow[];
  entries: EntryRow[];
  rules: RuleRow[];
}

const leeg = { naam: '', geb: '', ouder: '', email: '', tel: '', groep: '', niveau: '', start: '', min: '', notities: '', slots: [] as Slot[], factoren: {} as Record<string, boolean> };

export default function InschrijvingenBeheer({ org, actor, offerings, entries, rules }: Props) {
  const router = useRouter();
  const cfg = SECTORS[org.sector];
  const [filter, setFilter] = useState<string>('alle');
  const [paneel, setPaneel] = useState<'geen' | 'nieuw' | 'import'>('geen');
  const [form, setForm] = useState({ ...leeg, groep: offerings[0]?.id ?? '' });
  const [plak, setPlak] = useState('');
  const [importGroep, setImportGroep] = useState(offerings[0]?.id ?? '');
  const [bezig, setBezig] = useState(false);
  const [melding, setMelding] = useState<{ soort: 'goed' | 'fout'; tekst: string } | null>(null);

  const kenmerken = cfg.factors.filter((f) => rules.some((r) => r.type === 'kenmerk' && r.factor_key === f.key));
  const zichtbaar = useMemo(() => entries.filter((e) => (filter === 'alle' ? e.status !== 'teruggetrokken' : e.offering_id === filter)), [entries, filter]);
  const groepVan = (id: string | null) => offerings.find((o) => o.id === id);
  const gekozenGroep = groepVan(form.groep);
  const preview: ImportResult | null = plak.trim() ? parseImport(plak) : null;

  async function log(action: string, entity_id: string | null, metadata: Record<string, unknown> = {}) {
    await createClient().from('audit_log').insert({ org_id: org.id, actor_label: actor, action, entity: 'inschrijving', entity_id, metadata });
  }

  async function opslaan(e: React.FormEvent) {
    e.preventDefault();
    setBezig(true);
    setMelding(null);
    const g = groepVan(form.groep);
    const { data, error } = await createClient()
      .from('waitlist_entries')
      .insert({
        org_id: org.id,
        offering_id: g?.id ?? null,
        location_id: g?.location_id ?? null,
        participant_name: form.naam.trim(),
        participant_birthdate: form.geb || null,
        guardian_name: form.ouder.trim(),
        guardian_email: form.email.trim().toLowerCase(),
        guardian_phone: form.tel.trim() || null,
        preferred_slots: form.slots,
        min_slots: form.min ? Number(form.min) : null,
        level: form.niveau.trim() || null,
        desired_start_date: form.start || null,
        priority_factors: form.factoren,
        internal_notes: form.notities.trim() || null,
      })
      .select('id')
      .single();
    setBezig(false);
    if (error) return setMelding({ soort: 'fout', tekst: `Opslaan lukte niet: ${error.message}` });
    await log('inschrijving_toegevoegd', data.id);
    setMelding({ soort: 'goed', tekst: `${form.naam} staat op de wachtlijst.` });
    setForm({ ...leeg, groep: form.groep });
    router.refresh();
  }

  async function importeer() {
    if (!preview || preview.rows.length === 0) return;
    setBezig(true);
    setMelding(null);
    const rows = preview.rows.map((r) => {
      const g = offerings.find((o) => r.groep && o.name.toLowerCase() === r.groep.toLowerCase()) ?? groepVan(importGroep);
      return {
        org_id: org.id,
        offering_id: g?.id ?? null,
        location_id: g?.location_id ?? null,
        participant_name: r.participant_name,
        participant_birthdate: r.participant_birthdate,
        guardian_name: r.guardian_name,
        guardian_email: r.guardian_email,
        guardian_phone: r.guardian_phone,
        preferred_slots: r.dagen.length ? r.dagen : g?.slots ?? [],
        priority_factors: { broer_zus: r.broer_zus },
        ...(r.registered_at ? { registered_at: r.registered_at } : {}),
      };
    });
    const { error } = await createClient().from('waitlist_entries').insert(rows);
    setBezig(false);
    if (error) return setMelding({ soort: 'fout', tekst: `Importeren lukte niet: ${error.message}` });
    await log('inschrijvingen_geimporteerd', null, { aantal: rows.length });
    setMelding({ soort: 'goed', tekst: `${rows.length} inschrijvingen geïmporteerd.` });
    setPlak('');
    setPaneel('geen');
    router.refresh();
  }

  async function terugtrekken(e: EntryRow) {
    if (!confirm(`${e.participant_name} van de wachtlijst halen? Dit wordt vastgelegd in het log.`)) return;
    const { error } = await createClient().from('waitlist_entries').update({ status: 'teruggetrokken' }).eq('id', e.id);
    if (error) return setMelding({ soort: 'fout', tekst: error.message });
    await log('inschrijving_gewijzigd', e.id, { status: 'teruggetrokken' });
    router.refresh();
  }

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold">Wachtende {cfg.participant.meervoud}</h1>
          <p className="mt-1 text-kalk">{entries.filter((e) => e.status === 'wachtend').length} wachtend</p>
        </div>
        <div className="flex gap-2">
          <button className="knop-rustig" onClick={() => setPaneel(paneel === 'import' ? 'geen' : 'import')} aria-expanded={paneel === 'import'}>Lijst plakken uit Excel</button>
          <button className="knop-hoofd" onClick={() => setPaneel(paneel === 'nieuw' ? 'geen' : 'nieuw')} aria-expanded={paneel === 'nieuw'}>Inschrijving toevoegen</button>
        </div>
      </div>

      {melding && (
        <p className={`mt-6 rounded-md px-4 py-3 ${melding.soort === 'goed' ? 'bg-zee-licht text-zee' : 'bg-alarm-licht text-alarm'}`} role={melding.soort === 'fout' ? 'alert' : 'status'}>
          {melding.tekst}
        </p>
      )}

      {paneel === 'import' && (
        <section className="vlak mt-6 p-5 sm:p-6">
          <h2 className="text-2xl font-extrabold">Lijst plakken</h2>
          <p className="mt-1 max-w-2xl text-kalk">
            Selecteer in Excel of Google Sheets je hele lijst inclusief de kopregel, kopieer en plak hier. Kolommen worden herkend op naam:
            kind, geboortedatum, ouder, e-mail, telefoon, inschrijfdatum, groep, dagen, broer/zus.
          </p>
          <textarea className="veld mt-4 h-40 font-mono text-sm" value={plak} onChange={(e) => setPlak(e.target.value)} aria-label="Geplakte lijst" />
          <div className="mt-3 max-w-sm">
            <label className="label" htmlFor="igroep">{cfg.offering.enkelvoud[0].toUpperCase() + cfg.offering.enkelvoud.slice(1)} als de lijst geen groep noemt</label>
            <select id="igroep" className="veld" value={importGroep} onChange={(e) => setImportGroep(e.target.value)}>
              {offerings.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          {preview && (
            <div className="mt-4">
              {preview.rows.length > 0 && <p className="font-bold">{preview.rows.length} rijen klaar om te importeren. Herkende kolommen: {preview.herkend.join(', ')}.</p>}
              {preview.errors.length > 0 && (
                <ul className="mt-2 list-inside list-disc text-alarm">
                  {preview.errors.slice(0, 8).map((e) => <li key={e.regel + e.melding}>Regel {e.regel}: {e.melding}</li>)}
                  {preview.errors.length > 8 && <li>En nog {preview.errors.length - 8} meldingen</li>}
                </ul>
              )}
            </div>
          )}
          <button className="knop-hoofd mt-4" disabled={bezig || !preview || preview.rows.length === 0} onClick={importeer}>
            {bezig ? 'Bezig met importeren…' : `${preview?.rows.length ?? 0} inschrijvingen importeren`}
          </button>
        </section>
      )}

      {paneel === 'nieuw' && (
        <form onSubmit={opslaan} className="vlak mt-6 grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <h2 className="text-2xl font-extrabold sm:col-span-2">Nieuwe inschrijving</h2>
          <div><label className="label" htmlFor="f-naam">Naam {cfg.participant.enkelvoud}</label><input id="f-naam" required className="veld" value={form.naam} onChange={(e) => setForm({ ...form, naam: e.target.value })} /></div>
          <div><label className="label" htmlFor="f-geb">Geboortedatum</label><input id="f-geb" type="date" className="veld" value={form.geb} onChange={(e) => setForm({ ...form, geb: e.target.value })} /></div>
          <div><label className="label" htmlFor="f-ouder">Naam {cfg.guardian}</label><input id="f-ouder" required className="veld" value={form.ouder} onChange={(e) => setForm({ ...form, ouder: e.target.value })} /></div>
          <div><label className="label" htmlFor="f-email">E-mail {cfg.guardian}</label><input id="f-email" type="email" required className="veld" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><p className="hulp">Hiermee logt de {cfg.guardian} in om de positie te zien.</p></div>
          <div><label className="label" htmlFor="f-tel">Telefoon</label><input id="f-tel" className="veld" value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })} /></div>
          <div>
            <label className="label" htmlFor="f-groep">{cfg.offering.enkelvoud[0].toUpperCase() + cfg.offering.enkelvoud.slice(1)}</label>
            <select id="f-groep" className="veld" value={form.groep} onChange={(e) => setForm({ ...form, groep: e.target.value, slots: [] })}>
              {offerings.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <SlotPicker
              mode={cfg.slotMode}
              value={form.slots}
              onChange={(slots) => setForm({ ...form, slots })}
              options={cfg.slotMode === 'tijdsloten' ? gekozenGroep?.slots : undefined}
              label={cfg.slotMode === 'dagen' ? 'Gewenste dagen' : 'Welke lesmomenten passen? (meerdere mag)'}
            />
          </div>
          {cfg.slotMode === 'dagen' && form.slots.length > 1 && (
            <div>
              <label className="label" htmlFor="f-min">Minimaal aantal dagen dat ook goed is</label>
              <select id="f-min" className="veld" value={form.min} onChange={(e) => setForm({ ...form, min: e.target.value })}>
                <option value="">Alleen alle {form.slots.length} dagen</option>
                {Array.from({ length: form.slots.length - 1 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? 'dag' : 'dagen'}</option>)}
              </select>
            </div>
          )}
          {cfg.usesLevel && <div><label className="label" htmlFor="f-niv">Niveau</label><input id="f-niv" className="veld" value={form.niveau} onChange={(e) => setForm({ ...form, niveau: e.target.value })} /></div>}
          <div><label className="label" htmlFor="f-start">Gewenste startdatum</label><input id="f-start" type="date" className="veld" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></div>
          {kenmerken.length > 0 && (
            <fieldset className="sm:col-span-2">
              <legend className="label">Voorrang</legend>
              {kenmerken.map((k) => (
                <label key={k.key} className="mr-6 inline-flex items-center gap-2">
                  <input type="checkbox" className="h-5 w-5 accent-inkt" checked={!!form.factoren[k.key]} onChange={(e) => setForm({ ...form, factoren: { ...form.factoren, [k.key]: e.target.checked } })} />
                  {k.label}
                </label>
              ))}
            </fieldset>
          )}
          <div className="sm:col-span-2"><label className="label" htmlFor="f-not">Interne notitie</label><textarea id="f-not" className="veld" rows={2} value={form.notities} onChange={(e) => setForm({ ...form, notities: e.target.value })} /><p className="hulp">Alleen zichtbaar voor jullie organisatie, nooit voor de {cfg.guardian}.</p></div>
          <div className="sm:col-span-2"><button className="knop-hoofd" disabled={bezig}>{bezig ? 'Bezig met opslaan…' : 'Op de wachtlijst zetten'}</button></div>
        </form>
      )}

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter">
        {[{ id: 'alle', name: 'Alle' }, ...offerings].map((o) => (
          <button key={o.id} onClick={() => setFilter(o.id)} aria-pressed={filter === o.id} className={`rounded-full border px-4 py-1.5 text-sm font-bold ${filter === o.id ? 'border-inkt bg-inkt text-papier' : 'border-kalk-licht bg-white'}`}>{o.name}</button>
        ))}
      </div>

      {zichtbaar.length === 0 ? (
        <div className="vlak mt-4 p-8 text-center">
          <p className="text-lg font-bold">Nog geen inschrijvingen hier</p>
          <p className="mt-1 text-kalk">Plak je bestaande lijst uit Excel of voeg iemand toe.</p>
        </div>
      ) : (
        <div className="vlak mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-kalk-licht text-sm text-kalk">
              <tr>
                <th className="px-4 py-3 font-bold">{cfg.participant.enkelvoud[0].toUpperCase() + cfg.participant.enkelvoud.slice(1)}</th>
                <th className="px-4 py-3 font-bold">{cfg.offering.enkelvoud[0].toUpperCase() + cfg.offering.enkelvoud.slice(1)}</th>
                <th className="px-4 py-3 font-bold">Wil</th>
                <th className="px-4 py-3 font-bold">Ingeschreven</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3"><span className="sr-only">Acties</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kalk-lichter">
              {zichtbaar.map((e) => (
                <tr key={e.id}>
                  <td className="px-4 py-3">
                    <p className="font-bold">{e.participant_name}{e.internal_notes === '[voorbeeld]' && <span className="ml-2 rounded bg-kalk-lichter px-1.5 py-0.5 text-xs font-normal text-kalk">voorbeeld</span>}</p>
                    <p className="text-sm text-kalk">{e.guardian_name} · {e.guardian_email}</p>
                  </td>
                  <td className="px-4 py-3">{groepVan(e.offering_id)?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-sm capitalize">{e.preferred_slots.map(slotText).join(', ') || 'flexibel'}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">{formatDate(e.registered_at)}</td>
                  <td className="px-4 py-3 text-sm">{STATUS[e.status]}</td>
                  <td className="px-4 py-3 text-right">
                    {e.status === 'wachtend' && <button className="text-sm text-kalk underline hover:text-alarm" onClick={() => terugtrekken(e)}>Van lijst halen</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
