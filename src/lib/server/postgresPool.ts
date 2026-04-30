import { Pool } from "pg";
import { postgresConnectionString } from "@/lib/server/postgresUrl";

const poolHolder = globalThis as typeof globalThis & {
  __demoAppPgPool?: Pool;
};

function shouldRelaxSupabaseTls(connectionString: string): boolean {
  try {
    const parsed = new URL(connectionString);
    if (!parsed.hostname.endsWith(".supabase.co")) return false;
    const sslMode = parsed.searchParams.get("sslmode")?.toLowerCase();
    return sslMode !== "disable";
  } catch {
    return connectionString.includes("supabase.co");
  }
}

export function getPostgresPool(): Pool | null {
  const url = postgresConnectionString();
  if (!url) return null;
  if (!poolHolder.__demoAppPgPool) {
    poolHolder.__demoAppPgPool = new Pool({
      connectionString: url,
      max: 2,
      // Supabase can fail TLS chain validation in some serverless runtimes.
      ...(shouldRelaxSupabaseTls(url)
        ? { ssl: { rejectUnauthorized: false } }
        : {}),
    });
  }
  return poolHolder.__demoAppPgPool;
}
