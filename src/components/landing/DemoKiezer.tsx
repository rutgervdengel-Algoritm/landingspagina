'use client';

import { useState } from 'react';
import RijDemo from './RijDemo';
import { LANDING, type LandingSector } from './content';

export default function DemoKiezer({ start }: { start: LandingSector }) {
  const [sector, setSector] = useState<LandingSector>(start);
  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Voorbeeld kiezen">
        {(Object.keys(LANDING) as LandingSector[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSector(s)}
            aria-pressed={sector === s}
            className={`rounded-full border px-4 py-1.5 font-bold ${sector === s ? 'border-inkt bg-inkt text-papier' : 'border-kalk-licht bg-white hover:border-inkt'}`}
          >
            {LANDING[s].naam}
          </button>
        ))}
      </div>
      <RijDemo key={sector} sector={sector} />
    </div>
  );
}
