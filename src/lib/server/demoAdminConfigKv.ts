import { getKv } from "@/lib/server/kvClient";

const ADMIN_CONFIG_KEY = "demo:admin-config";

function decode(raw: unknown): unknown | null {
  if (raw == null) return null;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return raw;
}

export async function kvGetDemoAdminConfig(): Promise<unknown | null> {
  const kv = getKv();
  if (!kv) return null;
  const raw = await kv.get(ADMIN_CONFIG_KEY);
  return decode(raw);
}

export async function kvUpsertDemoAdminConfig(
  payload: unknown,
): Promise<void> {
  const kv = getKv();
  if (!kv) throw new Error("KV not configured");
  await kv.set(ADMIN_CONFIG_KEY, JSON.stringify(payload));
}
