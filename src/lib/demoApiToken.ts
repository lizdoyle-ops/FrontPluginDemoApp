/**
 * Demo API bearer token (full access, non-expiring for this sample app).
 * Override with NEXT_PUBLIC_DEMO_API_TOKEN in .env / Vercel for production.
 */
export const DEMO_API_TOKEN_DEFAULT =
  "fp-property-plugin-demo-all-scopes-3194afc2e7d4";

export function getDemoApiToken(): string {
  const fromEnv = process.env.NEXT_PUBLIC_DEMO_API_TOKEN?.trim();
  return fromEnv || DEMO_API_TOKEN_DEFAULT;
}
