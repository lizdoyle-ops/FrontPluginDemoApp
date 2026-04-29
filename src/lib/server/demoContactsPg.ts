import { getPostgresPool } from "@/lib/server/postgresPool";
import type { ContactData } from "@/types/contact";

const TABLE = "demo_contacts";

async function ensureTable(client: import("pg").PoolClient): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${TABLE} (
      email text PRIMARY KEY,
      payload jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

/** All contacts stored in Postgres (payload only; email is PK). */
export async function pgListAllContacts(): Promise<ContactData[]> {
  const pool = getPostgresPool();
  if (!pool) return [];
  const client = await pool.connect();
  try {
    await ensureTable(client);
    const { rows } = await client.query<{ payload: ContactData }>(
      `SELECT payload FROM ${TABLE} ORDER BY email`,
    );
    return rows.map((r) => r.payload);
  } finally {
    client.release();
  }
}

export async function pgGetContactPayload(
  emailKey: string,
): Promise<ContactData | null> {
  const pool = getPostgresPool();
  if (!pool) return null;
  const client = await pool.connect();
  try {
    await ensureTable(client);
    const { rows } = await client.query<{ payload: ContactData }>(
      `SELECT payload FROM ${TABLE} WHERE email = $1`,
      [emailKey],
    );
    return rows[0]?.payload ?? null;
  } finally {
    client.release();
  }
}

export async function pgUpsertContact(data: ContactData): Promise<void> {
  const pool = getPostgresPool();
  if (!pool) throw new Error("Database not configured");
  const key = data.email.trim().toLowerCase();
  const client = await pool.connect();
  try {
    await ensureTable(client);
    await client.query(
      `
      INSERT INTO ${TABLE} (email, payload, updated_at)
      VALUES ($1, $2::jsonb, now())
      ON CONFLICT (email) DO UPDATE SET
        payload = EXCLUDED.payload,
        updated_at = now()
      `,
      [key, JSON.stringify({ ...data, email: data.email.trim() })],
    );
  } finally {
    client.release();
  }
}

export async function pgDeleteContact(emailKey: string): Promise<boolean> {
  const pool = getPostgresPool();
  if (!pool) throw new Error("Database not configured");
  const client = await pool.connect();
  try {
    await ensureTable(client);
    const { rowCount } = await client.query(`DELETE FROM ${TABLE} WHERE email = $1`, [
      emailKey,
    ]);
    return (rowCount ?? 0) > 0;
  } finally {
    client.release();
  }
}
