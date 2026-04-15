import { getDemoApiToken } from "@/lib/demoApiToken";

/** Headers for browser fetch() calls to this app’s /api/* routes. */
export function demoApiAuthHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${getDemoApiToken()}`,
  };
}
