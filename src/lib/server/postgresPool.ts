import { Pool } from "pg";
import { postgresConnectionString } from "@/lib/server/postgresUrl";

const poolHolder = globalThis as typeof globalThis & {
  __demoAppPgPool?: Pool;
};

export function getPostgresPool(): Pool | null {
  const url = postgresConnectionString();
  if (!url) return null;
  if (!poolHolder.__demoAppPgPool) {
    poolHolder.__demoAppPgPool = new Pool({
      connectionString: url,
      max: 2,
    });
  }
  return poolHolder.__demoAppPgPool;
}
