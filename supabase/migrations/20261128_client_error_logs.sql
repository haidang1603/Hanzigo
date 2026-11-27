-- =========================================================================
-- HANZI GO - LIGHTWEIGHT CLIENT ERROR TELEMETRY LOGS
-- =========================================================================
-- Additive migration for GlobalErrorBoundary & unhandledrejection telemetry.
-- Strictly read-restricted to ADMIN and write-restricted to service_role.

CREATE TABLE IF NOT EXISTS public.client_error_logs (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  route TEXT NOT NULL DEFAULT '/',
  error_name TEXT NOT NULL DEFAULT 'Error',
  error_message TEXT NOT NULL,
  component_stack_short TEXT NOT NULL DEFAULT '',
  app_version TEXT NOT NULL DEFAULT '',
  user_agent_short TEXT NOT NULL DEFAULT '',
  fingerprint TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_client_error_logs_created_at
  ON public.client_error_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_client_error_logs_fingerprint
  ON public.client_error_logs (fingerprint);

ALTER TABLE public.client_error_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "client_error_logs_service_insert" ON public.client_error_logs;
CREATE POLICY "client_error_logs_service_insert"
  ON public.client_error_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

DROP POLICY IF EXISTS "client_error_logs_admin_select" ON public.client_error_logs;
CREATE POLICY "client_error_logs_admin_select"
  ON public.client_error_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
  );
