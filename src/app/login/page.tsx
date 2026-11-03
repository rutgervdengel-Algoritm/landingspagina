'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BRAND } from '@/lib/brand';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const volgende = params.get('volgende') ?? '/start';
  const fout = params.get('fout');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [stap, setStap] = useState<'email' | 'code'>('email');
  const [bezig, setBezig] = useState(false);
  const [melding, setMelding] = useState<string | null>(
    fout ? 'Inloggen via de link lukte niet in deze browser. Vul je e-mailadres in en gebruik de code uit de mail.' : null,
  );

  async function verstuur(e: React.FormEvent) {
    e.preventDefault();
    setBezig(true);
    setMelding(null);
    const { error } = await createClient().auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?volgende=${encodeURIComponent(volgende)}` },
    });
    setBezig(false);
    if (error) {
      if (error.status === 429) {
        setMelding('Er zijn het afgelopen uur te veel inlogmails verstuurd. Heb je al een mail met een code? Vul die dan hieronder in.');
        setStap('code');
        return;
      }
      setMelding(`Versturen lukte niet: ${error.message}`);
      return;
    }
    setStap('code');
  }

  async function controleer(e: React.FormEvent) {
    e.preventDefault();
    setBezig(true);
    setMelding(null);
    const { error } = await createClient().auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' });
    if (error) {
      setBezig(false);
      setMelding('Deze code klopt niet of is verlopen. Controleer de code of vraag een nieuwe mail aan.');
      return;
    }
    router.push(volgende);
    router.refresh();
  }

  return (
    <main className="app flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <p className="font-display text-2xl font-extrabold">{BRAND.name}</p>

        {stap === 'email' ? (
          <form onSubmit={verstuur} className="mt-10">
            <h1 className="text-3xl font-extrabold">Inloggen</h1>
            <p className="mt-3 text-kalk">Voor organisaties én ouders. Je krijgt een mail met een code, een wachtwoord is niet nodig.</p>
            <label htmlFor="email" className="label mt-8">E-mailadres</label>
            <input id="email" type="email" required autoComplete="email" className="veld" value={email} onChange={(e) => setEmail(e.target.value)} />
            {melding && <p className="mt-3 rounded-md bg-alarm-licht px-3 py-2 text-sm text-alarm" role="alert">{melding}</p>}
            <button type="submit" className="knop-hoofd mt-6 w-full" disabled={bezig}>{bezig ? 'Mail wordt verstuurd…' : 'Stuur inlogcode'}</button>
            <button type="button" className="mt-4 w-full text-sm text-kalk underline" onClick={() => { if (email) setStap('code'); else setMelding('Vul eerst je e-mailadres in.'); }}>
              Ik heb al een code
            </button>
          </form>
        ) : (
          <form onSubmit={controleer} className="mt-10">
            <h1 className="text-3xl font-extrabold">Vul je code in</h1>
            <p className="mt-3 text-kalk">
              We hebben een mail gestuurd naar <strong className="text-inkt">{email}</strong>. Typ de code over, of tik op de link in de mail.
            </p>
            <label htmlFor="code" className="label mt-8">Code uit de mail</label>
            <input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6,8}"
              maxLength={8}
              required
              className="veld text-center font-display text-3xl tracking-[0.3em] tabular-nums"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />
            {melding && <p className="mt-3 rounded-md bg-alarm-licht px-3 py-2 text-sm text-alarm" role="alert">{melding}</p>}
            <button type="submit" className="knop-hoofd mt-6 w-full" disabled={bezig || code.length < 6}>{bezig ? 'Bezig met inloggen…' : 'Inloggen'}</button>
            <button type="button" className="mt-4 w-full text-sm text-kalk underline" onClick={() => { setStap('email'); setCode(''); setMelding(null); }}>
              Ander e-mailadres of nieuwe mail
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
