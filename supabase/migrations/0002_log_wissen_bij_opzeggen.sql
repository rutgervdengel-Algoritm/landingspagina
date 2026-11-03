-- Het log blijft onwijzigbaar, maar mag wél mee verdwijnen als de hele
-- organisatie wordt verwijderd (recht op verwijdering / einde contract).
create or replace function audit_log_immutable() returns trigger
language plpgsql set search_path = public as $$
begin
  if tg_op = 'DELETE' and not exists (select 1 from organizations where id = old.org_id) then
    return old;
  end if;
  raise exception 'Het beslissingslog kan niet worden gewijzigd of verwijderd';
end $$;
