# Nieuwe basis — architectuur en bouwvolgorde

Eén Next.js-app (landing + beheer + ouderportaal) op Vercel, met Supabase
(Postgres + Auth) in Frankfurt. Generiek voor elke branche met wachtlijsten:
kinderopvang, zwemles, sport, en meer.

## Wat er staat

| Onderdeel | Waar | Status |
|---|---|---|
| Datamodel + afscherming per organisatie (RLS) | `supabase/migrations/0001_basis.sql` | Live op Supabase-project `wachtlijst-pilot` (eu-central-1) |
| Org-verwijdering wist ook het log (AVG) | `supabase/migrations/0002_log_wissen_bij_opzeggen.sql` | Live |
| Matching-engine (generiek, met uitleg) | `src/lib/matching/` | 10 tests groen |
| Branche-configuratie (woorden, weging, standaardregels) | `src/lib/matching/sectors.ts` | Kinderopvang, zwemles, sport, overig |

## Ontwerpkeuzes die de oude problemen oplossen

- **Ouders loggen in met een magic link** (bewezen e-mailadres), niet met een
  raadbare code. Ze lezen nooit direct uit tabellen, alleen via functies die
  veilige velden teruggeven. Interne notities zijn voor ouders onzichtbaar.
- **Een plek accepteren is één transactie met rij-locks.** Tweede acceptatie
  of dubbelklik geeft `niet_open`; zodra een plek vol is worden andere open
  voorstellen ingetrokken en gaan die kandidaten terug op de lijst.
  De database weigert `spots_filled > num_spots`.
- **Beslissingslog is append-only** (trigger), behalve als de hele
  organisatie wordt verwijderd.
- **Leeftijd, niveau en tijdsloten zijn harde criteria.** Een babyplek gaat
  nooit naar een peuter; zwemniveau B nooit naar groep A.
- **De positie die een ouder ziet = de echte volgorde.** `positionInOffering`
  gebruikt exact dezelfde ranking als `rankCandidates`.
- **Deterministisch:** bij gelijke score wint wie het langst wacht.

## Bouwvolgorde (volgende stappen)

1. Supabase-client + auth in Next.js (beheerder: e-mail/wachtwoord of magic link; ouder: magic link).
2. Beheer: onboarding-wizard (branche kiezen → locatie → groepen → regels), inschrijvingen, import uit Excel/CSV.
3. Plek vrijgekomen → kandidaten met uitleg → voorstel versturen (e-mail via Resend, EU) met reactietermijn.
4. Ouderportaal: positie + uitleg, voorstel accepteren/afwijzen, interesse bevestigen.
5. Landingspagina per branche, zonder onware claims, met pilotformulier en analytics.
6. Monitoring (foutmeldingen), backups controleren, verwerkersovereenkomst-pagina.
