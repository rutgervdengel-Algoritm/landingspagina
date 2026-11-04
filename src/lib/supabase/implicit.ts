'use client';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/*
 * Alleen voor het aanvragen van de inlogmail.
 *
 * De standaardclient gebruikt PKCE: de link uit de mail werkt dan alleen in
 * de browser waar hij is aangevraagd. Op telefoons opent Gmail links in een
 * eigen browser, dus dan mislukt het inloggen. Met de 'implicit'-flow komt
 * de sessie in de link zelf mee en werkt de link in elke browser.
 * De sessie wordt daarna op /auth/bevestig in de gewone client gezet.
 */
export function createImplicitClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { flowType: 'implicit', persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
