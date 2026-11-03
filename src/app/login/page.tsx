'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BRAND } from '@/lib/brand';

function LoginForm() {
  const params = useSearchParams();
  const volgende = params.get('volgende') ?? '/start';
  const fout = params.get('fout');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'invoer' | 'bezig' | 'verstuurd'>('invoer');
  const [melding, setMelding] = useState<string | null>(fout ? 'De inloglink is verlopen of al gebruikt. Vraag een nieuwe aan.' : null);

  async function verstuur(e: React.FormEvent) {
    e.preventDefault();
    setStatus('bezig');
    setMelding(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?volgende=${encodeURIComponent(volgende)}` },
    });
    if (error) {
      setStatus('invoer');
      setMelding(
        error.status === 429
          ? 'Er zijn net te veel inloglinks aangevraagd. Probeer het over een paar minuten opnieuw.'
          : `Versturen lukte niet: ${error.message}`,
      );
      return;
    }
    setStatus('verstuurd');
  }

  return (
    <main className="app flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <p className="font-display text-2xl font-extrabold">{BRAND.name}</p>
        {status === 'verstuurd' ? (
          <div className="mt-10" role="status">
            <h1 className="text-3xl font-extrabold">Kijk in je mail</h1>
            <p className="mt-3 text-kalk">
              We hebben een inloglink gestuurd naar <strong className="text-inkt">{email}</strong>. Open de link op dit
              apparaat om verder te gaan. De link werkt één uur.
            </p>
            <button className="knop-rustig mt-6" onClick={() => setStatus('invoer')}>
              Ander e-mailadres gebruiken
            </button>
          </div>
        ) : (
          <form onSubmit={verstuur} className="mt-10">
            <h1 className="text-3xl font-extrabold">Inloggen</h1>
            <p className="mt-3 text-kalk">
              Voor organisaties én ouders. Je krijgt een link in je mail, een wachtwoord is niet nodig.
            </p>
            <label htmlFor="email" className="label mt-8">
              E-mailadres
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="veld"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {melding && (
              <p className="mt-3 rounded-md bg-alarm-licht px-3 py-2 text-sm text-alarm" role="alert">
                {melding}
              </p>
            )}
            <button type="submit" className="knop-hoofd mt-6 w-full" disabled={status === 'bezig'}>
              {status === 'bezig' ? 'Link wordt verstuurd…' : 'Stuur inloglink'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
