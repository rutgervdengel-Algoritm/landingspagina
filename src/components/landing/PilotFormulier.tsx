'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { LandingSector } from './content';

export default function PilotFormulier({ sector }: { sector: LandingSector | null }) {
  const [f, setF] = useState({ naam: '', organisatie: '', branche: sector ?? '', email: '', telefoon: '', wachtlijst: '', bericht: '', website: '' });
  const [status, setStatus] = useState<'invoer' | 'bezig' | 'klaar'>('invoer');
  const [fout, setFout] = useState<string | null>(null);

  async function verstuur(e: React.FormEvent) {
    e.preventDefault();
    if (f.website) return setStatus('klaar'); // honeypot: bots vullen dit veld in
    setStatus('bezig');
    setFout(null);
    const { error } = await createClient()
      .from('pilot_aanmeldingen')
      .insert({
        naam: f.naam.trim(),
        organisatie: f.organisatie.trim(),
        branche: f.branche,
        email: f.email.trim().toLowerCase(),
        telefoon: f.telefoon.trim() || null,
        wachtlijst: f.wachtlijst || null,
        bericht: f.bericht.trim() || null,
        bron: sector ?? 'home',
      });
    if (error) {
      setStatus('invoer');
      setFout('Versturen lukte niet. Controleer je e-mailadres en probeer het opnieuw.');
      return;
    }
    setStatus('klaar');
  }

  if (status === 'klaar') {
    return (
      <div className="l-vlak p-6 sm:p-8" role="status">
        <h3 className="text-2xl font-extrabold">Bedankt, {f.naam.split(' ')[0] || 'we hebben je aanmelding'}.</h3>
        <p className="mt-2 text-l-zacht">We nemen binnen een paar werkdagen contact met je op om kennis te maken en te kijken of de pilot bij jullie past.</p>
      </div>
    );
  }

  return (
    <form onSubmit={verstuur} className="l-vlak grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
      <div>
        <label className="label" htmlFor="p-naam">Je naam</label>
        <input id="p-naam" required minLength={2} maxLength={120} autoComplete="name" className="veld" value={f.naam} onChange={(e) => setF({ ...f, naam: e.target.value })} />
      </div>
      <div>
        <label className="label" htmlFor="p-org">Organisatie</label>
        <input id="p-org" required minLength={2} maxLength={160} autoComplete="organization" className="veld" value={f.organisatie} onChange={(e) => setF({ ...f, organisatie: e.target.value })} />
      </div>
      <div>
        <label className="label" htmlFor="p-email">E-mail</label>
        <input id="p-email" type="email" required maxLength={200} autoComplete="email" className="veld" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      </div>
      <div>
        <label className="label" htmlFor="p-tel">Telefoon <span className="font-normal text-kalk">(niet verplicht)</span></label>
        <input id="p-tel" type="tel" maxLength={40} autoComplete="tel" className="veld" value={f.telefoon} onChange={(e) => setF({ ...f, telefoon: e.target.value })} />
      </div>
      <div>
        <label className="label" htmlFor="p-branche">Branche</label>
        <select id="p-branche" required className="veld" value={f.branche} onChange={(e) => setF({ ...f, branche: e.target.value })}>
          <option value="" disabled>Kies</option>
          <option value="zwemles">Zwemles</option>
          <option value="sport">Sport</option>
          <option value="kinderopvang">Kinderopvang</option>
          <option value="overig">Iets anders</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="p-lijst">Hoeveel mensen staan er op je wachtlijst?</label>
        <select id="p-lijst" className="veld" value={f.wachtlijst} onChange={(e) => setF({ ...f, wachtlijst: e.target.value })}>
          <option value="">Weet ik niet precies</option>
          <option value="<25">Minder dan 25</option>
          <option value="25-100">25 tot 100</option>
          <option value="100-300">100 tot 300</option>
          <option value=">300">Meer dan 300</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="p-bericht">Waar loop je nu tegenaan? <span className="font-normal text-kalk">(niet verplicht)</span></label>
        <textarea id="p-bericht" rows={3} maxLength={2000} className="veld" value={f.bericht} onChange={(e) => setF({ ...f, bericht: e.target.value })} />
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="p-website">Website</label>
        <input id="p-website" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} />
      </div>
      {fout && <p className="rounded-md bg-alarm-licht px-3 py-2 text-sm text-alarm sm:col-span-2" role="alert">{fout}</p>}
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button className="l-knop-sterk text-lg disabled:opacity-50" disabled={status === 'bezig'}>{status === 'bezig' ? 'Bezig met versturen…' : 'Aanmelden voor de pilot'}</button>
        <p className="text-sm text-l-zacht">We gebruiken je gegevens alleen om contact met je op te nemen over de pilot.</p>
      </div>
    </form>
  );
}
