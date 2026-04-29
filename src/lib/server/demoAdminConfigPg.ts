import { getPostgresPool } from "@/lib/server/postgresPool";

const TABLE = "demo_admin_config";
const ROW_ID = "global";

async function ensureTable(client: import("pg").PoolClient): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${TABLE} (
      id text PRIMARY KEY,
      payload jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

export async function getDemoAdminConfigRow(): Promise<unknown | null> {
  const pool = getPostgresPool();
  if (!pool) return null;
  const client = await pool.connect();
  try {
    await ensureTable(client);
    const { rows } = await client.query<{ payload: unknown }>(
      `SELECT payload FROM ${TABLE} WHERE id = $1`,
      [ROW_ID],
    );
    if (!rows[0]) return null;
    return rows[0].payload;
  } finally {
    client.release();
  }
}

export async function upsertDemoAdminConfigRow(
  payload: unknown,
): Promise<void> {
  const pool = getPostgresPool();
  if (!pool) throw new Error("Database not configured");
  const client = await pool.connect();
  try {
    await ensureTable(client);
    await client.query(
      `
      INSERT INTO ${TABLE} (id, payload, updated_at)
      VALUES ($1, $2::jsonb, now())
      ON CONFLICT (id) DO UPDATE SET
        payload = EXCLUDED.payload,
        updated_at = now()
      `,
      [ROW_ID, JSON.stringify(payload)],
    );
  } finally {
    client.release();
  }
}
