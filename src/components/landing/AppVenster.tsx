import { rankCandidates } from '@/lib/matching/engine';
import { slotText } from '@/lib/slots';
import { DEMO_TODAY, LANDING, type LandingSector } from './content';

/*
 * Een echt beeld van het scherm "Plek vrijgekomen", in een browservenster.
 * Berekend met dezelfde rekenregel als de app, met verzonnen namen.
 */
export default function AppVenster({ sector }: { sector: LandingSector }) {
  const { demo } = LANDING[sector];
  const opening = { id: 'venster', offering: demo.offering, slots: demo.offering.slots, startDate: DEMO_TODAY };
  const rij = rankCandidates({ sector, opening, entries: demo.entries, rules: demo.rules, today: DEMO_TODAY }).filter((c) => c.eligible);
  const eerste = rij[0];
  const momenten = demo.offering.slots.map(slotText).join(' en ');

  return (
    <figure className="l-vlak overflow-hidden shadow-xl" style={{ boxShadow: '0 24px 48px -24px rgba(45, 90, 74, 0.35)' }}>
      <div className="flex items-center gap-2 border-b border-l-lijn px-4 py-3">
        <span className="h-3 w-3 rounded-full" style={{ background: '#D9956A' }} aria-hidden />
        <span className="h-3 w-3 rounded-full" style={{ background: '#ECB892' }} aria-hidden />
        <span className="h-3 w-3 rounded-full" style={{ background: '#6BB8AD' }} aria-hidden />
        <span className="ml-2 truncate text-sm text-l-zacht">Eenplekje, plek vrijgekomen</span>
      </div>
      <div className="p-5">
        <p className="text-sm text-l-zacht">Plek vrij in</p>
        <p className="font-lkop text-2xl">{demo.offering.name}</p>
        <p className="text-sm text-l-zacht">{momenten.charAt(0).toUpperCase() + momenten.slice(1)}</p>

        <ol className="mt-4 grid gap-2">
          {rij.slice(0, 4).map((c, i) => (
            <li key={c.entryId} className="rounded-xl px-3 py-2.5" style={{ background: i === 0 ? '#EEF7F5' : '#FDFBF7', border: `1px solid ${i === 0 ? '#ABDBD4' : '#F0EADF'}` }}>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: i === 0 ? '#5BA89D' : '#F0EADF', color: i === 0 ? '#FFFFFF' : '#2D5A4A' }}>
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate font-bold">{c.participantName}</span>
                <span className="shrink-0 text-sm tabular-nums text-l-zacht">{Math.round(c.score)}%</span>
              </div>
              {i === 0 && (
                <ul className="mt-2 grid gap-1.5 pl-11 text-xs text-l-zacht">
                  {eerste.parts.filter((p) => p.score > 0).slice(0, 3).map((p) => (
                    <li key={p.key}>
                      <span className="block">{p.explanation}</span>
                      <span className="mt-0.5 block h-1 overflow-hidden rounded-full" style={{ background: '#D5EDEA' }}>
                        <span className="block h-full rounded-full" style={{ width: `${p.max ? (p.score / p.max) * 100 : 0}%`, background: '#5BA89D' }} />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs text-l-zacht">Namen verzonnen</span>
          <span className="rounded-full px-4 py-2 text-sm font-bold text-white" style={{ background: '#B56A3B' }}>Voorstel doen</span>
        </div>
      </div>
      <figcaption className="sr-only">Voorbeeld van het scherm Plek vrijgekomen in Eenplekje, met de volgorde en de uitleg voor de eerste kandidaat.</figcaption>
    </figure>
  );
}
