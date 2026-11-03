-- Functies die de app gebruikt. Alles wat over meerdere tabellen gaat
-- gebeurt hier in één transactie, met het log erbij.

-- ---------- Onboarding: organisatie aanmaken ------------------------
-- RLS staat geen directe insert in organizations toe (je bent nog geen lid).
create function create_organization(
  p_name text, p_sector sector, p_location text, p_city text,
  p_rules jsonb, p_display_name text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_org uuid; v_rule jsonb;
begin
  if auth.uid() is null then raise exception 'Niet ingelogd'; end if;

  insert into organizations (name, sector) values (p_name, p_sector) returning id into v_org;
  insert into org_members (org_id, user_id, role, display_name) values (v_org, auth.uid(), 'eigenaar', p_display_name);
  insert into locations (org_id, name, city) values (v_org, p_location, p_city);

  for v_rule in select * from jsonb_array_elements(coalesce(p_rules, '[]'::jsonb)) loop
    insert into priority_rules (org_id, type, label, factor_key, weight, active)
    values (v_org, (v_rule->>'type')::rule_type, v_rule->>'label', v_rule->>'factorKey',
            (v_rule->>'weight')::int, coalesce((v_rule->>'active')::boolean, true));
  end loop;

  insert into audit_log (org_id, actor_id, actor_label, action, entity, entity_id)
  values (v_org, auth.uid(), coalesce(p_display_name, 'Eigenaar'), 'organisatie_aangemaakt', 'organisatie', v_org);
  return v_org;
end $$;

-- ---------- Medewerker: voorstel doen -------------------------------
-- Draait met de rechten van de medewerker (RLS geldt), maar atomair.
create function staff_create_offer(
  p_opening uuid, p_entry uuid, p_score numeric, p_breakdown jsonb, p_reason text default null
) returns uuid
language plpgsql security invoker set search_path = public as $$
declare v_opening openings%rowtype; v_org organizations%rowtype; v_offer uuid; v_label text;
begin
  select * into v_opening from openings where id = p_opening for update;
  if not found then raise exception 'Plek niet gevonden'; end if;
  if v_opening.status <> 'open' then raise exception 'Deze plek is niet meer open'; end if;
  select * into v_org from organizations where id = v_opening.org_id;
  select coalesce(display_name, 'Medewerker') into v_label from org_members where org_id = v_org.id and user_id = auth.uid();

  update waitlist_entries set status = 'voorstel'
   where id = p_entry and org_id = v_org.id and status = 'wachtend';
  if not found then raise exception 'Deze inschrijving staat niet (meer) op de wachtlijst'; end if;

  insert into offers (org_id, opening_id, entry_id, score, breakdown, expires_at, created_by)
  values (v_org.id, p_opening, p_entry, p_score, p_breakdown,
          now() + make_interval(days => v_org.offer_response_days), auth.uid())
  returning id into v_offer;

  insert into audit_log (org_id, actor_id, actor_label, action, entity, entity_id, reason, metadata)
  values (v_org.id, auth.uid(), v_label, 'voorstel_gedaan', 'voorstel', v_offer, p_reason,
          jsonb_build_object('score', p_score, 'entry_id', p_entry, 'opening_id', p_opening));
  return v_offer;
end $$;

-- ---------- Verzorger: openstaande voorstellen ----------------------
create function guardian_offers()
returns table (
  offer_id uuid, entry_id uuid, participant_name text, org_name text,
  offering_name text, slots jsonb, start_date date, expires_at timestamptz,
  breakdown jsonb
)
language sql stable security definer set search_path = public as $$
  select f.id, e.id, e.participant_name, o.name, g.name, p.slots, p.start_date, f.expires_at, f.breakdown
  from offers f
  join waitlist_entries e on e.id = f.entry_id
  join openings p on p.id = f.opening_id
  join offerings g on g.id = p.offering_id
  join organizations o on o.id = f.org_id
  where f.status = 'voorgesteld' and f.expires_at > now()
    and lower(e.guardian_email) = lower(auth.jwt() ->> 'email');
$$;

-- ---------- Verzorger: invoer voor de positieberekening -------------
-- Geeft de groep, de actieve regels en de andere wachtenden terug, maar
-- GEPSEUDONIMISEERD: geen namen, e-mail, telefoon of notities, en alleen
-- de kenmerken die een actieve regel echt gebruikt.
create function guardian_position_inputs(p_entry uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v_entry waitlist_entries%rowtype; v_keys text[]; v_result jsonb;
begin
  select * into v_entry from waitlist_entries
   where id = p_entry and lower(guardian_email) = lower(auth.jwt() ->> 'email');
  if not found then raise exception 'Inschrijving niet gevonden'; end if;
  if v_entry.offering_id is null then return null; end if;

  select coalesce(array_agg(factor_key), '{}') into v_keys
    from priority_rules where org_id = v_entry.org_id and active and type = 'kenmerk';

  select jsonb_build_object(
    'sector', o.sector,
    'offering', jsonb_build_object('id', g.id, 'name', g.name, 'minAgeMonths', g.min_age_months,
                                   'maxAgeMonths', g.max_age_months, 'level', g.level, 'slots', g.slots),
    'rules', (select coalesce(jsonb_agg(jsonb_build_object('id', r.id, 'type', r.type, 'label', r.label,
                     'factorKey', r.factor_key, 'weight', r.weight, 'active', r.active, 'explanation', r.explanation)), '[]')
              from priority_rules r where r.org_id = o.id and r.active),
    'entries', (select coalesce(jsonb_agg(jsonb_build_object(
                     'id', case when e.id = v_entry.id then e.id::text else 'x' || left(md5(e.id::text || p_entry::text), 12) end,
                     'participantName', case when e.id = v_entry.id then e.participant_name else '' end,
                     'birthdate', e.participant_birthdate,
                     'preferredSlots', e.preferred_slots, 'minSlots', e.min_slots, 'level', e.level,
                     'desiredStartDate', e.desired_start_date,
                     'priorityFactors', (select coalesce(jsonb_object_agg(k, e.priority_factors->k), '{}')
                                           from unnest(v_keys) k where e.priority_factors ? k),
                     'registeredAt', e.registered_at, 'status', e.status)), '[]')
                from waitlist_entries e
               where e.offering_id = v_entry.offering_id and e.status in ('wachtend', 'voorstel'))
  ) into v_result
  from organizations o join offerings g on g.id = v_entry.offering_id
  where o.id = v_entry.org_id;
  return v_result;
end $$;

revoke all on function create_organization(text, sector, text, text, jsonb, text) from public, anon;
revoke all on function staff_create_offer(uuid, uuid, numeric, jsonb, text) from public, anon;
revoke all on function guardian_offers() from public, anon;
revoke all on function guardian_position_inputs(uuid) from public, anon;
grant execute on function create_organization(text, sector, text, text, jsonb, text) to authenticated;
grant execute on function staff_create_offer(uuid, uuid, numeric, jsonb, text) to authenticated;
grant execute on function guardian_offers() to authenticated;
grant execute on function guardian_position_inputs(uuid) to authenticated;
