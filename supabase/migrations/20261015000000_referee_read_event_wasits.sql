CREATE OR REPLACE FUNCTION public.spinmatch_get_event_wasits(p_event_id bigint)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_role text := upper(coalesce(
    auth.jwt() -> 'app_metadata' ->> 'spinmatch_role',
    auth.jwt() -> 'app_metadata' ->> 'role',
    ''
  ));
  v_event_owner text;
  v_wasits jsonb;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required';
  END IF;

  SELECT coalesce(
    to_jsonb(e) ->> 'eo_auth_id',
    to_jsonb(e) ->> 'owner_id',
    to_jsonb(e) ->> 'ownerid',
    to_jsonb(e) ->> 'created_by',
    to_jsonb(e) ->> 'owner'
  )
  INTO v_event_owner
  FROM public."Events" AS e
  WHERE e.id = p_event_id;

  IF v_role NOT IN ('SUPER_ADMIN', 'SUPERADMIN', 'ADMIN')
     AND v_event_owner IS DISTINCT FROM v_user_id::text
     AND NOT EXISTS (
       SELECT 1
       FROM public.spinmatch_referee_assignments AS assignment
       WHERE assignment.event_id = p_event_id
         AND assignment.referee_auth_id = v_user_id
         AND upper(coalesce(assignment.status, '')) = 'AKTIF'
     )
  THEN
    RAISE EXCEPTION 'Not authorized to read Wasit assignments for this event';
  END IF;

  SELECT coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', wasit.id,
        'kode_wasit', wasit.kode_wasit,
        'nama_wasit', wasit.nama_wasit,
        'nomor_meja', wasit.nomor_meja,
        'status', wasit.status
      )
      ORDER BY wasit.nomor_meja
    ),
    '[]'::jsonb
  )
  INTO v_wasits
  FROM public.spinmatch_wasit_event AS wasit
  WHERE wasit.event_id = p_event_id;

  RETURN v_wasits;
END;
$$;

REVOKE ALL ON FUNCTION public.spinmatch_get_event_wasits(bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.spinmatch_get_event_wasits(bigint) TO authenticated;
