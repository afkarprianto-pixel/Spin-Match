create or replace function public.spinmatch_get_visible_participants()
returns setof jsonb
language sql
stable
security definer
set search_path = ''
as $function$
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
    when upper(coalesce(
      auth.jwt() -> 'app_metadata' ->> 'spinmatch_role',
      auth.jwt() -> 'app_metadata' ->> 'role',
      ''
    )) = 'REFEREE'
      then jsonb_build_object('notelp', to_jsonb(participant) ->> 'notelp')
    else '{}'::jsonb
  end
  from public."Participants" as participant
  where auth.uid() is null
     or upper(coalesce(
       auth.jwt() -> 'app_metadata' ->> 'spinmatch_role',
       auth.jwt() -> 'app_metadata' ->> 'role',
       ''
     )) in ('PUBLIC', 'PUBLIK')
     or (
       upper(coalesce(
         auth.jwt() -> 'app_metadata' ->> 'spinmatch_role',
         auth.jwt() -> 'app_metadata' ->> 'role',
         ''
       )) = 'REFEREE'
       and exists (
         select 1
         from public.spinmatch_referee_assignments as assignment
         where assignment.event_id = participant.event_id
           and assignment.referee_auth_id = auth.uid()
           and upper(coalesce(assignment.status, '')) = 'AKTIF'
       )
     )
  order by participant.id;
$function$;

revoke all on function public.spinmatch_get_visible_participants() from public;
grant execute on function public.spinmatch_get_visible_participants() to anon, authenticated;
