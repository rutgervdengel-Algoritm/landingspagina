'use client';

import { useState } from 'react';
import RijDemo from './RijDemo';

const TABS = [
  { key: 'kinderopvang', label: 'Dagopvang', uitleg: 'Babygroep, plek op maandag en dinsdag.' },
  { key: 'bso', label: 'BSO', uitleg: 'BSO 4 t/m 7 jaar, plek op dinsdag en donderdag.' },
] as const;

/** De interactieve rij, met een keuze tussen het voorbeeld voor dagopvang en dat voor BSO. */
export default function DemoWissel() {
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('kinderopvang');
  const actief = TABS.find((t) => t.key === tab)!;
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label="Voorbeeld" className="inline-flex rounded-full border border-l-lijn bg-l-vlak p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-5 py-2 font-semibold transition-colors ${tab === t.key ? 'bg-l-sterk text-l-sterk-tekst' : 'hover:bg-l-zacht2'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-l-zacht">{actief.uitleg}</p>
      </div>
      <div className="mt-6" role="tabpanel">
        <RijDemo key={tab} sector={tab} />
      </div>
    </div>
  );
}
