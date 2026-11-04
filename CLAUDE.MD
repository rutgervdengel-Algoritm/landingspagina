# Eenplekje

Wachtlijst-app voor zwemscholen, sportclubs en kinderopvang: ouders zien hun plek in de rij en waarom; organisaties zien bij elke vrije plek wie aan de beurt is.
Eén Next.js 14-app (App Router, TypeScript, Tailwind) met landingspagina, beheer en ouderportaal. Data en inloggen via Supabase (project `wachtlijst-pilot`, eu-central-1). Uitrol via Vercel.

## Belangrijk
- Naam staat op één plek: `src/lib/brand.ts`.
- Matching-logica is puur en getest: `src/lib/matching/` (`npm test`). Positie voor ouders = dezelfde ranking als bij een echte plek.
- Database en beveiliging: `supabase/migrations/`. RLS per organisatie; ouders lezen alleen via `guardian_*`-functies; accepteren is atomair; log is append-only.
- Helpers die zowel server als browser gebruiken horen NIET in een `'use client'`-bestand (zie `src/lib/slots.ts`).
- Landingspagina: `src/components/landing/`. Geen claims over klanten, aantallen of reviews die niet waar zijn.
- Alle tekst in het Nederlands, gewone taal, actief.

## Routes
`/`, `/zwemles`, `/sport`, `/kinderopvang` (landing) · `/login`, `/auth/bevestig` · `/aan-de-slag` (inrichten) · `/beheer/*` · `/mijn` (ouder).

Zie `docs/NIEUWE-BASIS.md` voor architectuur en open punten.
