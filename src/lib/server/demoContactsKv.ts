import { getKv } from "@/lib/server/kvClient";
import type { ContactData } from "@/types/contact";

/** Single Redis hash holds every contact (field = email, value = JSON payload). */
const CONTACTS_HASH = "demo:contacts";

function emailKey(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Upstash auto-decodes JSON values, so `hgetall` may return either parsed
 * objects or raw strings depending on what was stored. Normalise both.
 */
function decodePayload(raw: unknown): ContactData | null {
  if (raw == null) return null;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as ContactData;
    } catch {
      return null;
    }
  }
  if (typeof raw === "object") return raw as ContactData;
  return null;
}

export async function kvListAllContacts(): Promise<ContactData[]> {
  const kv = getKv();
  if (!kv) return [];
  const all = await kv.hgetall<Record<string, unknown>>(CONTACTS_HASH);
  if (!all) return [];
  const out: ContactData[] = [];
  for (const value of Object.values(all)) {
    const decoded = decodePayload(value);
    if (decoded) out.push(decoded);
  }
  out.sort((a, b) => a.email.localeCompare(b.email));
  return out;
}

export async function kvGetContactPayload(
  email: string,
): Promise<ContactData | null> {
  const kv = getKv();
  if (!kv) return null;
  const raw = await kv.hget(CONTACTS_HASH, emailKey(email));
  return decodePayload(raw);
}

export async function kvUpsertContact(data: ContactData): Promise<void> {
  const kv = getKv();
  if (!kv) throw new Error("KV not configured");
  const key = emailKey(data.email);
  const payload = { ...data, email: data.email.trim() };
  await kv.hset(CONTACTS_HASH, { [key]: JSON.stringify(payload) });
}

export async function kvDeleteContact(email: string): Promise<boolean> {
  const kv = getKv();
  if (!kv) throw new Error("KV not configured");
  const removed = await kv.hdel(CONTACTS_HASH, emailKey(email));
  return removed > 0;
}
