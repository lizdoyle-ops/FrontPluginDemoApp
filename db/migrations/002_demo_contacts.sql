-- Full CRM contact graph: one row per email, entire ContactData as JSONB.
-- Merges with in-app mock seeds when reading; DB rows override by email key.

CREATE TABLE IF NOT EXISTS demo_contacts (
  email text PRIMARY KEY,
  payload jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE demo_contacts IS 'Front plugin demo: full contact record (properties, quotes, customLists, etc.).';
