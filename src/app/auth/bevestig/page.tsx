'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { BRAND } from '@/lib/brand';

/*
 * Landingsplek van de link uit de inlogmail. De tokens staan in het
 * #-deel van de URL (dat bereikt de server nooit) en worden hier in de
 * sessie-cookies gezet. Werkt in elke browser, ook die van Gmail.
 */
export default function Bevestig() {
  const [fout, setFout] = useState<string | null>(null);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    const raw = query.get('volgende') ?? '/start';
    const volgende = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/start';

    // Oudere links (PKCE of token_hash) gaan via de server-route.
    if (query.get('code') || query.get('token_hash')) {
      window.location.replace(`/auth/callback${window.location.search}`);
      return;
    }

    const melding = hash.get('error_description') ?? query.get('error_description');
    if (melding) {
      setFout(
        hash.get('error_code') === 'otp_expired' || /expired|invalid/i.test(melding)
          ? 'Deze link is verlopen of al gebruikt. Vraag een nieuwe aan.'
          : `Inloggen lukte niet: ${melding}`,
      );
      return;
    }

    const access_token = hash.get('access_token');
    const refresh_token = hash.get('refresh_token');
    if (!access_token || !refresh_token) {
      setFout('Deze link bevat geen inloggegevens. Vraag een nieuwe aan.');
      return;
    }

    const traag = setTimeout(() => setFout('Inloggen duurt te lang. Controleer je verbinding en vraag een nieuwe link aan.'), 15000);
    createClient()
      .auth.setSession({ access_token, refresh_token })
      .then(({ error }) => {
        clearTimeout(traag);
        if (error) setFout('Deze link is verlopen of al gebruikt. Vraag een nieuwe aan.');
        else window.location.replace(volgende);
      })
      .catch(() => {
        clearTimeout(traag);
        setFout('Deze link is ongeldig. Vraag een nieuwe aan.');
      });
  }, []);

  return (
    <main className="app flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <p className="font-display text-2xl font-extrabold">{BRAND.name}</p>
        {fout ? (
          <div className="mt-10">
            <h1 className="text-3xl font-extrabold">Dat lukte niet</h1>
            <p className="mt-3 text-kalk" role="alert">{fout}</p>
            <Link href="/login" className="knop-hoofd mt-6">Nieuwe inloglink aanvragen</Link>
          </div>
        ) : (
          <p className="mt-10 text-kalk" role="status">Je wordt ingelogd…</p>
        )}
      </div>
    </main>
  );
}
