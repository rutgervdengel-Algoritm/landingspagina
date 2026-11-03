import { NextResponse, type NextRequest } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

/*
 * Twee manieren om binnen te komen via de link in de mail:
 *  - token_hash: werkt in élke browser, ook als de mail op de telefoon in
 *    een andere app opent dan waar de link werd aangevraagd (aanbevolen;
 *    vereist het aangepaste e-mailsjabloon, zie docs/NIEUWE-BASIS.md).
 *  - code (PKCE): werkt alleen in dezelfde browser. Valt terug hierop als
 *    het standaardsjabloon nog actief is.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const volgendeRaw = searchParams.get('volgende') ?? '/start';
  const volgende = volgendeRaw.startsWith('/') && !volgendeRaw.startsWith('//') ? volgendeRaw : '/start';
  const supabase = createClient();

  const tokenHash = searchParams.get('token_hash');
  if (tokenHash) {
    const type = (searchParams.get('type') ?? 'email') as EmailOtpType;
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) return NextResponse.redirect(`${origin}${volgende}`);
  }

  const code = searchParams.get('code');
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${volgende}`);
  }

  return NextResponse.redirect(`${origin}/login?fout=link&volgende=${encodeURIComponent(volgende)}`);
}
