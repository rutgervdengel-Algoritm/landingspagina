import type { PositionResult } from '@/lib/matching/engine';

/** Het volgnummer-ticket: het ene moment waar de ouder voor komt. */
export default function Volgnummer({ pos, meervoud }: { pos: PositionResult; meervoud: string }) {
  if (pos.position === null) {
    return (
      <div className="vlak mt-5 p-5">
        <p className="font-bold">Nog geen plek in de rij</p>
        <p className="mt-1 text-kalk">{pos.explanation}</p>
      </div>
    );
  }
  return (
    <div className="ticket mt-5 px-6 pb-6 pt-5 sm:px-8">
      <p className="font-bold">Jouw plek in de rij</p>
      <p className="mt-2 flex items-baseline gap-3" aria-label={`Plek ${pos.position} van ${pos.total}`}>
        <span className="volgnummer">{pos.position}</span>
        <span className="font-bold opacity-75">van {pos.total} wachtende {meervoud}</span>
      </p>
      <p className="mt-3 max-w-sm font-bold">{pos.explanation}</p>

      <div className="ticket-scheur" aria-hidden />

      <p className="font-bold">Zo is je plek bepaald</p>
      <ul className="mt-3 grid gap-3 text-sm">
        {pos.candidate.parts.map((p) => (
          <li key={p.key}>
            <div className="flex justify-between gap-4">
              <span>{p.explanation}</span>
            </div>
            <div className="ticket-balk mt-1 h-1.5 overflow-hidden rounded-full" aria-hidden>
              <span className="block h-full rounded-full bg-current" style={{ width: `${p.max ? (p.score / p.max) * 100 : 0}%` }} />
            </div>
          </li>
        ))}
      </ul>
      {pos.ahead.length > 0 && (
        <p className="mt-4 text-sm">
          Waarom anderen voor je gaan: {pos.ahead.map((a) => `${a.reden.toLowerCase()} (${a.aantal})`).join(', ')}.
        </p>
      )}
    </div>
  );
}
