'use client';

import { useMemo, useState } from 'react';
import { positionInOffering, rankCandidates } from '@/lib/matching/engine';
import { SECTORS } from '@/lib/matching/sectors';
import Volgnummer from '@/components/app/Volgnummer';
import { DEMO_TODAY, LANDING, type LandingSector } from './content';

/*
 * Interactieve rij: dezelfde rekenregel als in de app. Links wat de
 * organisatie ziet (de volgorde bij een vrije plek), rechts wat de
 * geselecteerde ouder ziet. Schuiven aan een regel herschikt beide.
 */
function kleineBeginletter(t: string) {
  return t.charAt(0).toLowerCase() + t.slice(1);
}

export default function RijDemo({ sector }: { sector: LandingSector }) {
  const { demo } = LANDING[sector];
  const cfg = SECTORS[sector];
  const start = useMemo(() => Object.fromEntries(demo.rules.map((r) => [r.id, r.weight])), [demo.rules]);
  const [gewicht, setGewicht] = useState<Record<string, number>>(start);
  const [gekozen, setGekozen] = useState(demo.uitgelicht);

  const opening = { id: 'demo', offering: demo.offering, slots: demo.offering.slots, startDate: DEMO_TODAY };
  const regels = demo.rules.map((r) => ({ ...r, weight: gewicht[r.id], active: gewicht[r.id] > 0 }));
  const totaal = regels.reduce((s, r) => s + (r.active ? r.weight : 0), 0);

  const beginvolgorde = useMemo(
    () =>
      rankCandidates({ sector, opening, entries: demo.entries, rules: demo.rules, today: DEMO_TODAY })
        .filter((c) => c.eligible)
        .map((c) => c.entryId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sector],
  );
  const rij = rankCandidates({ sector, opening, entries: demo.entries, rules: regels, today: DEMO_TODAY });
  const past = rij.filter((c) => c.eligible);
  const pastNiet = rij.filter((c) => !c.eligible);
  const keuze = past.some((c) => c.entryId === gekozen) ? gekozen : past[0]?.entryId;
  const positie = keuze ? positionInOffering({ sector, offering: demo.offering, entryId: keuze, entries: demo.entries, rules: regels, today: DEMO_TODAY }) : null;
  const gewijzigd = demo.rules.some((r) => gewicht[r.id] !== r.weight);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10">
      <div className="min-w-0">
        <div className="l-vlak p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg font-extrabold">Jouw voorrangsregels</h3>
            {gewijzigd && (
              <button className="text-sm font-bold underline" onClick={() => setGewicht(start)}>
                Terugzetten
              </button>
            )}
          </div>
          <div className="mt-4 grid gap-4">
            {demo.rules.map((r) => (
              <div key={r.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <label htmlFor={`regel-${sector}-${r.id}`} className="font-bold">{r.label}</label>
                  <span className="shrink-0 text-sm tabular-nums text-l-zacht">
                    {gewicht[r.id] === 0 ? 'telt niet mee' : `${Math.round((gewicht[r.id] / totaal) * 100)}%`}
                  </span>
                </div>
                <input
                  id={`regel-${sector}-${r.id}`}
                  type="range"
                  min={0}
                  max={100}
                  step={10}
                  value={gewicht[r.id]}
                  onChange={(e) => setGewicht({ ...gewicht, [r.id]: Number(e.target.value) })}
                  className="mt-1 w-full" style={{ accentColor: 'var(--l-sterk)' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-lg font-extrabold">Plek vrij in {demo.offering.name}: wie is aan de beurt?</h3>
          <ol className="mt-3 grid gap-2" aria-live="polite">
            {past.map((c, i) => {
              const was = beginvolgorde.indexOf(c.entryId);
              const verschil = was - i;
              const actief = c.entryId === keuze;
              return (
                <li key={c.entryId}>
                  <button
                    type="button"
                    onClick={() => setGekozen(c.entryId)}
                    aria-pressed={actief}
                    className={`flex w-full items-center gap-3 border bg-l-vlak px-3 py-2.5 text-left transition-colors ${actief ? 'border-l-tekst' : 'border-l-lijn hover:border-l-tekst'}`} style={{ borderRadius: 'calc(var(--l-radius) * 0.75)' }}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md font-lkop text-lg font-extrabold tabular-nums ${i === 0 ? 'bg-l-accent text-l-accent-tekst' : 'bg-l-zacht2'}`}>
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold">{c.participantName}</span>
                      <span className="block text-sm text-l-zacht">{Math.round(c.score)}% passend</span>
                    </span>
                    {gewijzigd && verschil !== 0 && (
                      <span className={`shrink-0 text-sm font-bold tabular-nums ${verschil > 0 ? 'text-l-op' : 'text-l-neer'}`}>
                        {verschil > 0 ? `${verschil} omhoog` : `${-verschil} omlaag`}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
          {pastNiet.length > 0 && (
            <ul className="mt-3 grid gap-1 text-sm text-l-zacht">
              {pastNiet.map((c) => (
                <li key={c.entryId}>
                  <span className="font-bold text-l-tekst">{c.participantName}</span> past niet: {kleineBeginletter(c.exclusions[0]?.explanation ?? '')}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <p className="text-sm font-bold text-l-zacht">Wat de ouder van {positie?.candidate.participantName.split(' ')[0]} ziet</p>
        {positie && <Volgnummer pos={positie} meervoud={cfg.participant.meervoud} />}
        <p className="mt-3 text-sm text-l-zacht">Tik op een naam in de rij om te zien wat die ouder ziet. De namen zijn verzonnen; de rekenregel is dezelfde als in de app.</p>
      </div>
    </div>
  );
}
