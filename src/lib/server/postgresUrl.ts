/** Shared Postgres connection string for demo admin config + contact store. */
export function postgresConnectionString(): string | undefined {
  const u =
    process.env.POSTGRES_URL?.trim() ||
    process.env.POSTGRES_PRISMA_URL?.trim();
  return u || undefined;
}

export function isPostgresConfigured(): boolean {
  return Boolean(postgresConnectionString());
}
