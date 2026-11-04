'use client';

import type { Dag, Slot } from '@/lib/matching/types';
import { DAGEN, slotText } from '@/lib/slots';

export { DAGEN, slotText };

interface Props {
  mode: 'dagen' | 'tijdsloten';
  value: Slot[];
  onChange: (slots: Slot[]) => void;
  /** Bij lessen: welke momenten kun je kiezen (van de groep)? Leeg = vrij invoeren. */
  options?: Slot[];
  label?: string;
}

const eq = (a: Slot, b: Slot) => a.dag === b.dag && (a.van ?? '') === (b.van ?? '') && (a.tot ?? '') === (b.tot ?? '');

export default function SlotPicker({ mode, value, onChange, options, label }: Props) {
  if (mode === 'dagen') {
    return (
      <fieldset>
        {label && <legend className="label">{label}</legend>}
        <div className="flex flex-wrap gap-2">
          {DAGEN.slice(0, 5).map((d) => {
            const on = value.some((s) => s.dag === d.key);
            return (
              <button
                key={d.key}
                type="button"
                aria-pressed={on}
                onClick={() => onChange(on ? value.filter((s) => s.dag !== d.key) : [...value, { dag: d.key }])}
                className={`h-12 w-14 rounded-md border font-bold capitalize ${on ? 'border-inkt bg-inkt text-papier' : 'border-kalk-licht bg-white text-inkt hover:border-inkt'}`}
              >
                {d.kort}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (options && options.length > 0) {
    return (
      <fieldset>
        {label && <legend className="label">{label}</legend>}
        <div className="flex flex-col gap-2">
          {options.map((o) => {
            const on = value.some((s) => eq(s, o));
            return (
              <label key={slotText(o)} className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 ${on ? 'border-inkt bg-white' : 'border-kalk-licht bg-white'}`}>
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-inkt"
                  checked={on}
                  onChange={() => onChange(on ? value.filter((s) => !eq(s, o)) : [...value, o])}
                />
                <span className="capitalize">{slotText(o)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  // Vrij invoeren van tijdsloten (bij het aanmaken van een groep).
  return (
    <fieldset>
      {label && <legend className="label">{label}</legend>}
      <div className="flex flex-col gap-2">
        {value.map((s, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Dag"
              className="veld w-auto"
              value={s.dag}
              onChange={(e) => onChange(value.map((v, j) => (j === i ? { ...v, dag: e.target.value as Dag } : v)))}
            >
              {DAGEN.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.lang}
                </option>
              ))}
            </select>
            <input aria-label="Van" type="time" className="veld w-auto" value={s.van ?? ''} onChange={(e) => onChange(value.map((v, j) => (j === i ? { ...v, van: e.target.value } : v)))} />
            <span className="text-kalk">tot</span>
            <input aria-label="Tot" type="time" className="veld w-auto" value={s.tot ?? ''} onChange={(e) => onChange(value.map((v, j) => (j === i ? { ...v, tot: e.target.value } : v)))} />
            <button type="button" className="knop-rustig knop-klein" onClick={() => onChange(value.filter((_, j) => j !== i))}>
              Verwijderen
            </button>
          </div>
        ))}
        <button
          type="button"
          className="knop-rustig knop-klein self-start"
          onClick={() => onChange([...value, { dag: 'wo', van: '15:00', tot: '15:45' }])}
        >
          Lesmoment toevoegen
        </button>
      </div>
    </fieldset>
  );
}
