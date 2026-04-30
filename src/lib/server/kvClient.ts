import { Redis } from "@upstash/redis";

type KvHolder = typeof globalThis & { __demoAppKv?: Redis | null };
const holder = globalThis as KvHolder;

function readUrlAndToken(): { url: string; token: string } | null {
  const url =
    process.env.KV_REST_API_URL?.trim() ||
    process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token =
    process.env.KV_REST_API_TOKEN?.trim() ||
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return { url, token };
}

/** Returns a singleton Upstash/Vercel KV client, or null when not configured. */
export function getKv(): Redis | null {
  if (holder.__demoAppKv !== undefined) return holder.__demoAppKv ?? null;
  const creds = readUrlAndToken();
  if (!creds) {
    holder.__demoAppKv = null;
    return null;
  }
  holder.__demoAppKv = new Redis({ url: creds.url, token: creds.token });
  return holder.__demoAppKv;
}

export function isKvConfigured(): boolean {
  return getKv() !== null;
}
