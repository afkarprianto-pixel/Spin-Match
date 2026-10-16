CREATE OR REPLACE FUNCTION public.spinmatch_is_active_wasit_for_event(p_event_id bigint)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT auth.uid() IS NOT NULL
    AND upper(coalesce(
      auth.jwt() -> 'app_metadata' ->> 'spinmatch_role',
      auth.jwt() -> 'app_metadata' ->> 'role',
      ''
    )) = 'WASIT'
    AND EXISTS (
      SELECT 1
      FROM public.spinmatch_wasit_event AS wasit
      WHERE wasit.event_id = p_event_id
        AND wasit.auth_user_id = auth.uid()
        AND upper(coalesce(wasit.status, '')) = 'AKTIF'
    );
$$;

REVOKE ALL ON FUNCTION public.spinmatch_is_active_wasit_for_event(bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.spinmatch_is_active_wasit_for_event(bigint) TO authenticated;

ALTER TABLE public.spinmatch_event_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active Wasit can read assigned event data" ON public.spinmatch_event_data;
CREATE POLICY "Active Wasit can read assigned event data"
  ON public.spinmatch_event_data
  FOR SELECT
  TO authenticated
  USING (public.spinmatch_is_active_wasit_for_event(event_id));

DROP POLICY IF EXISTS "Active Wasit can create assigned event data" ON public.spinmatch_event_data;
CREATE POLICY "Active Wasit can create assigned event data"
  ON public.spinmatch_event_data
  FOR INSERT
  TO authenticated
  WITH CHECK (public.spinmatch_is_active_wasit_for_event(event_id));

DROP POLICY IF EXISTS "Active Wasit can update assigned event data" ON public.spinmatch_event_data;
CREATE POLICY "Active Wasit can update assigned event data"
  ON public.spinmatch_event_data
  FOR UPDATE
  TO authenticated
  USING (public.spinmatch_is_active_wasit_for_event(event_id))
  WITH CHECK (public.spinmatch_is_active_wasit_for_event(event_id));
