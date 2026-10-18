create or replace function public.spinmatch_get_visible_participants()
returns setof jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_role text := upper(coalesce(
    auth.jwt() -> 'app_metadata' ->> 'spinmatch_role',
    auth.jwt() -> 'app_metadata' ->> 'role',
    ''
  ));
begin
  if current_user_id is not null and current_role <> 'REFEREE' then
    raise exception 'Akses hanya untuk akun Referee dan Publik.';
  end if;

  return query
  select jsonb_build_object(
    'id', participant.id,
    'event_id', participant.event_id,
    'custom_id', to_jsonb(participant) ->> 'custom_id',
    'nama', to_jsonb(participant) ->> 'nama',
    'ptm', to_jsonb(participant) ->> 'ptm',
    'usia', to_jsonb(participant) ->> 'usia',
    'divisi', to_jsonb(participant) ->> 'divisi',
    'statusbayar', to_jsonb(participant) ->> 'statusbayar',
    'nilaibayar', to_jsonb(participant) ->> 'nilaibayar'
  ) || case
    when current_user_id is null then '{}'::jsonb
    else jsonb_build_object('notelp', to_jsonb(participant) ->> 'notelp')
  end
  from public."Participants" as participant
  where current_user_id is null
     or exists (
       select 1
       from public.spinmatch_referee_assignments as assignment
       where assignment.event_id = participant.event_id
         and assignment.referee_auth_id = current_user_id
         and upper(coalesce(assignment.status, '')) = 'AKTIF'
     )
  order by participant.id;
end;
$$;

revoke all on function public.spinmatch_get_visible_participants() from public;
grant execute on function public.spinmatch_get_visible_participants() to anon, authenticated;

drop policy if exists "Public can read event results" on public.spinmatch_event_data;
create policy "Public can read event results"
  on public.spinmatch_event_data
  for select
  to anon
  using (true);

grant select on public.spinmatch_event_data to anon;
