-- Demo admin settings (branding, sections, custom objects) for cloud sync.
-- Row id is fixed to 'global' by the app (see src/lib/server/demoAdminConfigPg.ts).
-- Safe to run multiple times.

CREATE TABLE IF NOT EXISTS demo_admin_config (
  id text PRIMARY KEY,
  payload jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE demo_admin_config IS 'Front plugin demo: persisted admin UI config (JSON payload).';
