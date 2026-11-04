import Link from 'next/link';
import { getOrgContext, loadWaitlist } from '@/lib/org';
import { SECTORS } from '@/lib/matching/sectors';
import { rankCandidates } from '@/lib/matching/engine';
import { toEntry, toOffering, toRule, todayISO } from '@/lib/db';
import { leeftijdsbereik } from '@/lib/leeftijd';
import { slotText } from '@/lib/slots';
import VoorbeeldKnop from '@/components/app/VoorbeeldKnop';

export default async function Overzicht({ searchParams }: { searchParams: { welkom?: string } }) {
  const { org } = await getOrgContext();
  const { offerings, entries, rules } = await loadWaitlist(org.id);
  const cfg = SECTORS[org.sector];
  const today = todayISO();
  const wachtend = entries.filter((e) => e.status === 'wachtend');
  const heeftVoorbeeld = entries.some((e) => e.internal_notes === '[voorbeeld]');

  return (
    <div className="max-w-5xl">
      {searchParams.welkom && (
        <div className="mb-8 rounded-lg bg-zee-licht p-5" role="status">
          <h2 className="text-xl font-extrabold">Je wachtlijst staat klaar</h2>
          <p className="mt-1">
            Zet je bestaande lijst erin via <Link href="/beheer/inschrijvingen" className="font-bold underline">Wachtende {cfg.participant.meervoud}</Link>,
            of vul hem eerst met voorbeelddata om te zien hoe het werkt.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold">Overzicht</h1>
          <p className="mt-1 text-kalk">
            {wachtend.length} {wachtend.length === 1 ? cfg.participant.enkelvoud : cfg.participant.meervoud} wachtend in {offerings.length}{' '}
            {offerings.length === 1 ? cfg.offering.enkelvoud : cfg.offering.meervoud}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <VoorbeeldKnop orgId={org.id} sector={org.sector} offerings={offerings} heeftVoorbeeld={heeftVoorbeeld} />
          <Link href="/beheer/plek" className="knop-signaal">Plek vrijgekomen</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-5">
        {offerings.map((o) => {
          const inGroep = entries.filter((e) => e.offering_id === o.id);
          const ranked = rankCandidates({
            sector: org.sector,
            opening: { id: 'standaard', offering: toOffering(o), slots: o.slots, startDate: today },
            entries: inGroep.map(toEntry),
            rules: rules.map(toRule),
            today,
          });
          const geschikt = ranked.filter((r) => r.eligible);
          const voorstel = inGroep.filter((e) => e.status === 'voorstel').length;
          return (
            <section key={o.id} className="vlak p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-2xl font-extrabold">{o.name}</h2>
                <p className="text-sm text-kalk">
                  {leeftijdsbereik(o.min_age_months, o.max_age_months)}
                  {o.level ? `, niveau ${o.level}` : ''} · {o.slots.map(slotText).join(', ')}
                </p>
              </div>
              <dl className="mt-4 flex gap-8">
                <div>
                  <dt className="text-sm text-kalk">Wachtend</dt>
                  <dd className="font-display text-3xl font-extrabold tabular-nums">{inGroep.filter((e) => e.status === 'wachtend').length}</dd>
                </div>
                <div>
                  <dt className="text-sm text-kalk">Voorstel loopt</dt>
                  <dd className="font-display text-3xl font-extrabold tabular-nums">{voorstel}</dd>
                </div>
              </dl>
              {geschikt.length > 0 ? (
                <div className="mt-5">
                  <h3 className="text-sm font-bold">Bij een vrije plek nu aan de beurt</h3>
                  <ol className="mt-2 divide-y divide-kalk-lichter">
                    {geschikt.slice(0, 3).map((c, i) => (
                      <li key={c.entryId} className="flex items-start gap-4 py-2.5">
                        <span className="font-display text-2xl font-extrabold tabular-nums text-kalk">{i + 1}</span>
                        <div className="min-w-0">
                          <p className="font-bold">{c.participantName}</p>
                          <p className="text-sm text-kalk">{c.summary}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <p className="mt-5 text-kalk">Nog niemand die in deze {cfg.offering.enkelvoud} past.</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
