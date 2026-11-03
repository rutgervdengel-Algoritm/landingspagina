-- =====================================================================
-- Nieuwe basis: generiek wachtlijstmodel voor elke branche
-- (kinderopvang, zwemles, sport, ...).
--
-- Principes:
--   1. Elke tabel is afgeschermd per organisatie via Row Level Security.
--   2. Ouders/verzorgers lezen NOOIT direct uit tabellen; alleen via
--      functies die een veilige selectie van velden teruggeven.
--   3. Het beslissingslog is append-only: niet te wijzigen of te wissen.
--   4. Een plek accepteren gebeurt in één transactie met rij-locks,
--      zodat een plek nooit twee keer vergeven wordt.
-- =====================================================================

-- ---------- Enums ----------------------------------------------------

create type sector as enum ('kinderopvang', 'zwemles', 'sport', 'overig');
create type member_role as enum ('eigenaar', 'medewerker');
create type entry_status as enum ('wachtend', 'voorstel', 'geplaatst', 'teruggetrokken', 'verlopen');
create type opening_status as enum ('open', 'vol', 'gesloten');
create type offer_status as enum ('voorgesteld', 'geaccepteerd', 'afgewezen', 'verlopen', 'ingetrokken');
create type rule_type as enum ('wachttijd', 'kenmerk', 'leeftijd_oudst', 'leeftijd_jongst');

-- ---------- Organisaties & leden ------------------------------------

create table organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (length(name) between 2 and 120),
  sector      sector not null,
  -- Hoe lang een verzorger heeft om op een voorstel te reageren.
  offer_response_days int not null default 5 check (offer_response_days between 1 and 30),
  -- Elke hoeveel dagen een verzorger interesse moet bevestigen (null = nooit).
  confirm_interval_days int check (confirm_interval_days between 30 and 365),
  created_at  timestamptz not null default now()
);

create table org_members (
  org_id   uuid not null references organizations(id) on delete cascade,
  user_id  uuid not null references auth.users(id) on delete cascade,
  role     member_role not null default 'medewerker',
  display_name text,
  primary key (org_id, user_id)
);

create table locations (
  id       uuid primary key default gen_random_uuid(),
  org_id   uuid not null references organizations(id) on delete cascade,
  name     text not null,
  address  text,
  city     text,
  created_at timestamptz not null default now()
);

-- ---------- Aanbod: groep / lesuur / klas ----------------------------
-- Een "aanbod" is waar iemand op wacht: "Babygroep De Uil", "Zwemles A
-- woensdag 15:00", "Judo 6-8 jaar". Tijdsloten zijn generiek:
-- [{ "dag": "wo", "van": "15:00", "tot": "15:45" }]. Voor kinderopvang
-- zijn het hele dagen ({ "dag": "ma" }).

create table offerings (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references organizations(id) on delete cascade,
  location_id     uuid not null references locations(id) on delete cascade,
  name            text not null,
  min_age_months  int check (min_age_months >= 0),
  max_age_months  int check (max_age_months >= 0),
  level           text,           -- bv. 'A', 'B', 'gele band', null = n.v.t.
  slots           jsonb not null default '[]'::jsonb,
  capacity        int check (capacity > 0),
  active          boolean not null default true,
  created_at      timestamptz not null default now(),
  check (min_age_months is null or max_age_months is null or min_age_months <= max_age_months)
);

-- ---------- Prioriteitsregels ---------------------------------------
-- 'wachttijd'       : langer wachten = hogere score
-- 'kenmerk'         : ja/nee-kenmerk uit priority_factors[factor_key]
--                     (broertje/zusje, lid van de club, personeel, ...)
-- 'leeftijd_oudst'  : oudste kandidaat eerst (bv. zwemles voor oudere kinderen)
-- 'leeftijd_jongst' : jongste eerst

create table priority_rules (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references organizations(id) on delete cascade,
  type        rule_type not null,
  label       text not null,
  factor_key  text,
  weight      int not null check (weight between 0 and 100),
  active      boolean not null default true,
  explanation text,              -- uitleg die verzorgers te zien krijgen
  created_at  timestamptz not null default now(),
  check (type <> 'kenmerk' or factor_key is not null)
);

-- ---------- Inschrijvingen ------------------------------------------

create table waitlist_entries (
  id                  uuid primary key default gen_random_uuid(),
  org_id              uuid not null references organizations(id) on delete cascade,
  location_id         uuid references locations(id) on delete set null,
  offering_id         uuid references offerings(id) on delete set null,
  participant_name    text not null,
  participant_birthdate date,
  guardian_name       text not null,
  guardian_email      text not null check (guardian_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  guardian_phone      text,
  -- Gewenste tijdsloten in hetzelfde formaat als offerings.slots.
  preferred_slots     jsonb not null default '[]'::jsonb,
  -- Minimaal aantal gewenste sloten dat passend is (deelplaatsing).
  min_slots           int check (min_slots >= 1),
  level               text,
  desired_start_date  date,
  priority_factors    jsonb not null default '{}'::jsonb,
  -- Alleen zichtbaar voor de organisatie, nooit voor verzorgers.
  internal_notes      text,
  status              entry_status not null default 'wachtend',
  registered_at       timestamptz not null default now(),
  last_confirmed_at   timestamptz not null default now(),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index on waitlist_entries (org_id, status);
create index on waitlist_entries (lower(guardian_email));

-- ---------- Vrijgekomen plekken & voorstellen -----------------------

create table openings (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references organizations(id) on delete cascade,
  offering_id  uuid not null references offerings(id) on delete cascade,
  slots        jsonb not null default '[]'::jsonb,
  start_date   date not null,
  num_spots    int not null default 1 check (num_spots > 0),
  spots_filled int not null default 0 check (spots_filled >= 0),
  status       opening_status not null default 'open',
  created_by   uuid references auth.users(id),
  created_at   timestamptz not null default now(),
  check (spots_filled <= num_spots)   -- een plek kan nooit "overvol" raken
);

create table offers (
  id             uuid primary key default gen_random_uuid(),
  org_id         uuid not null references organizations(id) on delete cascade,
  opening_id     uuid not null references openings(id) on delete cascade,
  entry_id       uuid not null references waitlist_entries(id) on delete cascade,
  score          numeric(5,1) not null,
  breakdown      jsonb not null,
  status         offer_status not null default 'voorgesteld',
  expires_at     timestamptz not null,
  responded_at   timestamptz,
  decline_reason text,
  created_by     uuid references auth.users(id),
  created_at     timestamptz not null default now()
);

-- Maximaal één openstaand voorstel per inschrijving per plek.
create unique index offers_one_open_per_entry
  on offers (opening_id, entry_id) where status = 'voorgesteld';

-- ---------- Beslissingslog (append-only) -----------------------------

create table audit_log (
  id          bigint generated always as identity primary key,
  org_id      uuid not null references organizations(id) on delete cascade,
  actor_id    uuid,                -- medewerker; null = verzorger of systeem
  actor_label text not null,       -- 'Medewerker Anna', 'Verzorger', 'Systeem'
  action      text not null,
  entity      text not null,
  entity_id   uuid,
  reason      text,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index on audit_log (org_id, created_at desc);
create index on audit_log (entity_id);

create function audit_log_immutable() returns trigger
language plpgsql set search_path = public as $$
begin
  raise exception 'Het beslissingslog kan niet worden gewijzigd of verwijderd';
end $$;

create trigger audit_log_no_update before update or delete on audit_log
  for each row execute function audit_log_immutable();

-- ---------- Helpers -------------------------------------------------

create function is_member(p_org uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from org_members where org_id = p_org and user_id = auth.uid());
$$;

create function touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

create trigger entries_touch before update on waitlist_entries
  for each row execute function touch_updated_at();

-- ---------- Row Level Security --------------------------------------
-- Medewerkers zien en bewerken alleen data van hun eigen organisatie.
-- Er is GEEN policy voor verzorgers: zij gaan via de functies hieronder.

alter table organizations    enable row level security;
alter table org_members      enable row level security;
alter table locations        enable row level security;
alter table offerings        enable row level security;
alter table priority_rules   enable row level security;
alter table waitlist_entries enable row level security;
alter table openings         enable row level security;
alter table offers           enable row level security;
alter table audit_log        enable row level security;

create policy org_select on organizations for select using (is_member(id));
create policy org_update on organizations for update using (is_member(id));

create policy members_select on org_members for select using (is_member(org_id));

do $$
declare t text;
begin
  foreach t in array array['locations','offerings','priority_rules','waitlist_entries','openings','offers']
  loop
    execute format('create policy %1$s_all on %1$s for all using (is_member(org_id)) with check (is_member(org_id))', t);
  end loop;
end $$;

create policy audit_select on audit_log for select using (is_member(org_id));
create policy audit_insert on audit_log for insert with check (is_member(org_id));

-- ---------- Verzorgerskant: alleen veilige velden --------------------
-- Inloggen gebeurt met een magic link (Supabase Auth). De identiteit is
-- dus een bewezen e-mailadres, niet een raadbare code.

create function guardian_entries()
returns table (
  entry_id uuid, org_name text, sector sector, location_name text,
  offering_name text, participant_name text, preferred_slots jsonb,
  desired_start_date date, status entry_status, registered_at timestamptz,
  last_confirmed_at timestamptz
)
language sql stable security definer set search_path = public as $$
  select e.id, o.name, o.sector, l.name, f.name, e.participant_name,
         e.preferred_slots, e.desired_start_date, e.status, e.registered_at,
         e.last_confirmed_at
  from waitlist_entries e
  join organizations o on o.id = e.org_id
  left join locations l on l.id = e.location_id
  left join offerings f on f.id = e.offering_id
  where lower(e.guardian_email) = lower(auth.jwt() ->> 'email')
    and e.status <> 'teruggetrokken';
$$;

create function guardian_confirm_interest(p_entry uuid) returns void
language plpgsql security definer set search_path = public as $$
declare v_org uuid;
begin
  update waitlist_entries
     set last_confirmed_at = now()
   where id = p_entry
     and lower(guardian_email) = lower(auth.jwt() ->> 'email')
     and status = 'wachtend'
  returning org_id into v_org;

  if v_org is null then raise exception 'Inschrijving niet gevonden'; end if;

  insert into audit_log (org_id, actor_label, action, entity, entity_id)
  values (v_org, 'Verzorger', 'interesse_bevestigd', 'inschrijving', p_entry);
end $$;

-- Reageren op een voorstel. Alles in één transactie met rij-locks:
--   * voorstel moet nog openstaan en niet verlopen zijn
--   * er moet nog een plek vrij zijn
--   * als de plek daarmee vol is, vervallen alle andere open voorstellen
-- Geeft een uitkomstcode terug in plaats van een fout te gooien, zodat
-- statuswijzigingen (bv. 'verlopen') bewaard blijven:
--   'geaccepteerd' | 'afgewezen' | 'verlopen' | 'vergeven' | 'niet_open'
create function guardian_respond_offer(p_offer uuid, p_accept boolean, p_reason text default null)
returns text
language plpgsql security definer set search_path = public as $$
declare
  v_offer   offers%rowtype;
  v_opening openings%rowtype;
  v_entry   waitlist_entries%rowtype;
begin
  select * into v_offer from offers where id = p_offer for update;
  if not found then raise exception 'Voorstel niet gevonden'; end if;

  select * into v_entry from waitlist_entries where id = v_offer.entry_id for update;
  if lower(v_entry.guardian_email) <> lower(coalesce(auth.jwt() ->> 'email', '')) then
    raise exception 'Voorstel niet gevonden';
  end if;

  if v_offer.status <> 'voorgesteld' then
    return 'niet_open';
  end if;

  -- Lock de plek vóór elke beslissing, zodat twee gelijktijdige
  -- acceptaties op elkaar wachten.
  select * into v_opening from openings where id = v_offer.opening_id for update;

  if v_offer.expires_at < now() then
    update offers set status = 'verlopen' where id = p_offer;
    update waitlist_entries set status = 'wachtend' where id = v_entry.id;
    insert into audit_log (org_id, actor_label, action, entity, entity_id)
    values (v_offer.org_id, 'Systeem', 'voorstel_verlopen', 'voorstel', p_offer);
    return 'verlopen';
  end if;

  if not p_accept then
    update offers set status = 'afgewezen', responded_at = now(), decline_reason = p_reason where id = p_offer;
    update waitlist_entries set status = 'wachtend' where id = v_entry.id;
    insert into audit_log (org_id, actor_label, action, entity, entity_id, reason)
    values (v_offer.org_id, 'Verzorger', 'voorstel_afgewezen', 'voorstel', p_offer, p_reason);
    return 'afgewezen';
  end if;

  if v_opening.status <> 'open' or v_opening.spots_filled >= v_opening.num_spots then
    update offers set status = 'ingetrokken' where id = p_offer;
    update waitlist_entries set status = 'wachtend' where id = v_entry.id;
    return 'vergeven';
  end if;

  update offers set status = 'geaccepteerd', responded_at = now() where id = p_offer;
  update waitlist_entries set status = 'geplaatst' where id = v_entry.id;
  update openings
     set spots_filled = spots_filled + 1,
         status = case when spots_filled + 1 >= num_spots then 'vol'::opening_status else status end
   where id = v_opening.id;

  -- Plek vol: andere open voorstellen intrekken en die kandidaten terug op de lijst.
  if v_opening.spots_filled + 1 >= v_opening.num_spots then
    update waitlist_entries set status = 'wachtend'
     where id in (select entry_id from offers
                   where opening_id = v_opening.id and status = 'voorgesteld' and id <> p_offer);
    update offers set status = 'ingetrokken'
     where opening_id = v_opening.id and status = 'voorgesteld' and id <> p_offer;
  end if;

  insert into audit_log (org_id, actor_label, action, entity, entity_id)
  values (v_offer.org_id, 'Verzorger', 'voorstel_geaccepteerd', 'voorstel', p_offer);
  return 'geaccepteerd';
end $$;

-- Supabase geeft functies standaard ook aan 'anon'; dat willen we niet.
revoke all on function guardian_entries() from public, anon;
revoke all on function guardian_confirm_interest(uuid) from public, anon;
revoke all on function guardian_respond_offer(uuid, boolean, text) from public, anon;
revoke all on function is_member(uuid) from public, anon;
grant execute on function is_member(uuid) to authenticated;
grant execute on function guardian_entries() to authenticated;
grant execute on function guardian_confirm_interest(uuid) to authenticated;
grant execute on function guardian_respond_offer(uuid, boolean, text) to authenticated;
