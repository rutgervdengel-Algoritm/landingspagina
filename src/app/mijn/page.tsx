import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { positionInOffering, type PositionResult } from '@/lib/matching/engine';
import { SECTORS } from '@/lib/matching/sectors';
import type { Entry, Offering, PriorityRule, Sector, Slot } from '@/lib/matching/types';
import { formatDate, todayISO } from '@/lib/db';
import { BRAND } from '@/lib/brand';
import { slotText } from '@/components/app/SlotPicker';
import Volgnummer from '@/components/app/Volgnummer';
import VoorstelKaart from '@/components/app/VoorstelKaart';
import BevestigKnop from '@/components/app/BevestigKnop';

interface GEntry {
  entry_id: string; org_name: string; sector: Sector; location_name: string | null; offering_name: string | null;
  participant_name: string; preferred_slots: Slot[]; desired_start_date: string | null; status: Entry['status'];
  registered_at: string; last_confirmed_at: string;
}
interface GOffer {
  offer_id: string; entry_id: string; participant_name: string; org_name: string; offering_name: string;
  slots: Slot[]; start_date: string; expires_at: string; breakdown: { summary?: string; parts?: { label: string; explanation: string }[] };
}
interface Inputs { sector: Sector; offering: Offering; rules: PriorityRule[]; entries: Entry[] }

export default async function Mijn() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?volgende=/mijn');

  const [{ data: entries }, { data: offers }] = await Promise.all([supabase.rpc('guardian_entries'), supabase.rpc('guardian_offers')]);
  const lijst = (entries ?? []) as GEntry[];
  const voorstellen = (offers ?? []) as GOffer[];
  const today = todayISO();

  const posities = new Map<string, PositionResult | null>();
  await Promise.all(
    lijst.filter((e) => e.status === 'wachtend').map(async (e) => {
      const { data } = await supabase.rpc('guardian_position_inputs', { p_entry: e.entry_id });
      const inp = data as Inputs | null;
      posities.set(
        e.entry_id,
        inp ? positionInOffering({ sector: inp.sector, offering: inp.offering, entryId: e.entry_id, entries: inp.entries, rules: inp.rules, today }) : null,
      );
    }),
  );

  return (
    <main className="app px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between">
          <p className="font-display text-xl font-extrabold">{BRAND.name}</p>
          <form action="/auth/uitloggen" method="post"><button className="text-sm text-kalk underline">Uitloggen</button></form>
        </div>

        {voorstellen.map((v) => <VoorstelKaart key={v.offer_id} voorstel={v} />)}

        {lijst.length === 0 && (
          <div className="mt-12">
            <h1 className="text-3xl font-extrabold">Geen inschrijvingen gevonden</h1>
            <p className="mt-2 text-kalk">Er staat niets op naam van {user.email}. Klopt het e-mailadres? Vraag het anders na bij de organisatie.</p>
          </div>
        )}

        {lijst.map((e) => {
          const cfg = SECTORS[e.sector];
          const pos = posities.get(e.entry_id);
          const dagenSindsBevestigd = Math.floor((Date.now() - new Date(e.last_confirmed_at).getTime()) / 86400000);
          return (
            <section key={e.entry_id} className="mt-10" aria-labelledby={`k-${e.entry_id}`}>
              <h1 id={`k-${e.entry_id}`} className="text-3xl font-extrabold">{e.participant_name}</h1>
              <p className="text-kalk">{e.org_name}{e.offering_name ? `, ${e.offering_name}` : ''}</p>

              {e.status === 'wachtend' && pos && <Volgnummer pos={pos} meervoud={cfg.participant.meervoud} />}
              {e.status === 'wachtend' && !pos && <p className="vlak mt-5 p-5">Je staat op de wachtlijst. De organisatie heeft nog geen {cfg.offering.enkelvoud} gekoppeld, daarom is er nog geen positie.</p>}
              {e.status === 'voorstel' && <p className="mt-5 rounded-lg bg-signaal-licht p-5 font-bold">Er loopt een voorstel voor {e.participant_name}. Bekijk het hierboven.</p>}
              {e.status === 'geplaatst' && <p className="mt-5 rounded-lg bg-zee-licht p-5 font-bold text-zee">{e.participant_name} is geplaatst. Gefeliciteerd!</p>}

              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-kalk">Ingeschreven</dt><dd className="font-bold">{formatDate(e.registered_at)}</dd></div>
                <div><dt className="text-kalk">Gewenst</dt><dd className="font-bold capitalize">{e.preferred_slots.map(slotText).join(', ') || 'flexibel'}</dd></div>
                {e.desired_start_date && <div><dt className="text-kalk">Gewenste start</dt><dd className="font-bold">{formatDate(e.desired_start_date)}</dd></div>}
              </dl>

              {e.status === 'wachtend' && (
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <BevestigKnop entryId={e.entry_id} />
                  <span className="text-sm text-kalk">Laatst bevestigd {dagenSindsBevestigd === 0 ? 'vandaag' : `${dagenSindsBevestigd} dagen geleden`}</span>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
