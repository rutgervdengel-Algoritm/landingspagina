# Nieuwe basis — architectuur en status

Eén Next.js-app (landing + beheer + ouderportaal) op Vercel, met Supabase
(Postgres + Auth) in Frankfurt. Generiek voor elke branche met wachtlijsten:
kinderopvang, zwemles, sport en meer. Naam: **Eenplekje**
(`src/lib/brand.ts`, één regel om te wijzigen).

## Schermen

| Route | Voor wie | Wat |
|---|---|---|
| `/login` | iedereen | Inloglink per e-mail, geen wachtwoord |
| `/start` | ingelogd | Stuurt door: medewerker → `/beheer`, ouder → `/mijn`, nieuw → `/welkom` |
| `/aan-de-slag` | nieuwe organisatie | Vier stappen: branche, organisatie, eerste groep, voorrangsregels |
| `/beheer` | medewerker | Per groep: wie nu aan de beurt is, en waarom. Knop voor voorbeelddata |
| `/beheer/plek` | medewerker | Plek vrijgekomen → live ranking met uitleg → voorstel doen |
| `/beheer/inschrijvingen` | medewerker | Lijst, toevoegen, plakken uit Excel |
| `/beheer/instellingen` | medewerker | Groepen en voorrangsregels |
| `/beheer/log` | medewerker | Onwijzigbaar beslissingslog |
| `/mijn` | ouder | Volgnummer met uitleg, voorstel accepteren/afwijzen, interesse bevestigen |

## Database (`supabase/migrations/`)

- `0001_basis.sql` — tabellen, RLS per organisatie, veilige ouderfuncties,
  accepteren in één transactie met rij-locks.
- `0002_log_wissen_bij_opzeggen.sql` — log mag alleen mee verdwijnen als de hele organisatie wordt verwijderd.
- `0003_app_functies.sql` — organisatie aanmaken, voorstel doen, ouder-voorstellen,
  gepseudonimiseerde invoer voor de positie (geen namen of notities van anderen).

Alle drie staan live op project `wachtlijst-pilot` (eu-central-1).

## Getest

- 16 unit-tests (matching, leeftijd, Excel-import).
- Volledige keten op de echte database, als echte rollen, in een transactie die
  is teruggedraaid: medewerker richt in → zet iemand op de lijst → doet voorstel;
  andere medewerker ziet niets; ouder ziet alleen eigen voorstel en accepteert;
  log bevat elke stap.

## Nog te doen vóór de pilot

1. **E-mail via eigen SMTP** (Resend, EU). Supabase verstuurt inloglinks standaard
   alleen naar leden van het Supabase-team, en met een laag limiet. Voor ouders is dit nodig.
2. **Supabase Auth-instellingen**: Site URL en toegestane redirect-URL's op het productiedomein zetten.
3. Automatische e-mail bij een voorstel (nu: kant-en-klaar bericht om te kopiëren).
4. Landingspagina per branche, zonder onware claims, met pilotformulier en analytics.
5. Medewerkers uitnodigen (nu: één eigenaar per organisatie).
6. Verwerkersovereenkomst en privacyverklaring.

## Focus opvang en BSO (14 november 2026)

- `/bso`: eigen landingspagina; rekent als branche `kinderopvang` (`LANDING.bso.sector`).
- Positie voor ouders wordt berekend op de peildatum: de gewenste startdatum of de dag waarop
  het kind de minimumleeftijd van de groep bereikt, als die later is dan vandaag (`peildatum` in de engine).
- Inrichten: snelle keuze Babygroep, Peutergroep, Verticale groep, BSO; voorrangsregel
  "Stroomt door vanuit onze eigen opvang" (kenmerk `doorstroom`, staat aan bij BSO).
- Pilotformulier: soort opvang en aantal locaties staan tussen haken bovenaan `bericht`
  (geen schemawijziging nodig); `bron` is de pagina (`bso`, `kinderopvang`, ...).

Open: database staat op pauze (gratis plan), site is niet openbaar (Vercel-beveiliging, geen domein),
geen melding bij een nieuwe aanmelding, voorstel verloopt pas als de ouder het opent.
