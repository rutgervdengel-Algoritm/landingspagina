-- Aanmeldingen voor de pilot via de landingspagina.
-- Iedereen mag een aanmelding INVOEGEN; niemand mag ze via de API lezen,
-- wijzigen of verwijderen. Lezen gebeurt in het Supabase-dashboard.

create table pilot_aanmeldingen (
  id            uuid primary key default gen_random_uuid(),
  naam          text not null check (length(naam) between 2 and 120),
  organisatie   text not null check (length(organisatie) between 2 and 160),
  branche       text not null check (branche in ('zwemles', 'sport', 'kinderopvang', 'overig')),
  email         text not null check (length(email) <= 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telefoon      text check (telefoon is null or length(telefoon) <= 40),
  wachtlijst    text check (wachtlijst is null or wachtlijst in ('<25', '25-100', '100-300', '>300', 'weet niet')),
  bericht       text check (bericht is null or length(bericht) <= 2000),
  bron          text check (bron is null or length(bron) <= 60),
  created_at    timestamptz not null default now()
);

alter table pilot_aanmeldingen enable row level security;

create policy pilot_insert on pilot_aanmeldingen
  for insert to anon, authenticated
  with check (true);

revoke select, update, delete on pilot_aanmeldingen from anon, authenticated;
grant insert on pilot_aanmeldingen to anon, authenticated;
