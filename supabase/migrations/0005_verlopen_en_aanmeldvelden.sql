-- 1. Voorstellen verlopen vanzelf.
--    Tot nu toe verliep een voorstel pas op het moment dat de ouder het
--    opende. Reageerde een ouder niet, dan bleef de plek bezet en kwam de
--    volgende in de rij niet aan de beurt.
--
--    verloop_voorstellen() zet elk voorstel waarvan de termijn voorbij is op
--    'verlopen', zet de inschrijving terug op 'wachtend' en legt het vast in
--    het log. De functie doet alleen wat al verschuldigd is en geeft geen
--    gegevens terug, dus elke ingelogde gebruiker mag hem aanroepen: de app
--    doet dat bij het openen van beheer en van het ouderportaal. Daarnaast
--    draait hij elk uur via pg_cron.

create index if not exists offers_open_expiry on offers (expires_at) where status = 'voorgesteld';

create function verloop_voorstellen() returns int
language plpgsql security definer set search_path = public as $$
declare v_aantal int;
begin
  with verlopen as (
    update offers set status = 'verlopen'
     where id in (select id from offers where status = 'voorgesteld' and expires_at < now() for update skip locked)
    returning id, org_id, entry_id
  ), terug as (
    update waitlist_entries set status = 'wachtend'
     where id in (select entry_id from verlopen) and status = 'voorstel'
    returning id
  ), gelogd as (
    insert into audit_log (org_id, actor_label, action, entity, entity_id, reason)
    select org_id, 'Systeem', 'voorstel_verlopen', 'voorstel', id, 'Reactietermijn verstreken zonder reactie'
      from verlopen
    returning 1
  )
  select count(*) into v_aantal from verlopen;
  return v_aantal;
end $$;

revoke all on function verloop_voorstellen() from public, anon;
grant execute on function verloop_voorstellen() to authenticated;

-- 2. Pilotformulier: soort opvang en aantal locaties als eigen velden.
alter table pilot_aanmeldingen
  add column opvangsoort text check (opvangsoort is null or length(opvangsoort) <= 40),
  add column locaties    text check (locaties is null or length(locaties) <= 40);
