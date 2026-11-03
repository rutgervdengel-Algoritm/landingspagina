import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const volgendeRaw = searchParams.get('volgende') ?? '/start';
  // Alleen interne paden toestaan (geen open redirect).
  const volgende = volgendeRaw.startsWith('/') && !volgendeRaw.startsWith('//') ? volgendeRaw : '/start';

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${volgende}`);
  }
  return NextResponse.redirect(`${origin}/login?fout=link`);
}
