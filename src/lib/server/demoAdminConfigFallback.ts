import fs from "fs";
import path from "path";
import type { DemoAdminConfigPayload } from "@/lib/api/demoAdminConfigPayloadSchema";
import { demoAdminConfigPayloadSchema } from "@/lib/api/demoAdminConfigPayloadSchema";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "demo-admin-config.json");

let memory: DemoAdminConfigPayload | null = null;
let initDone = false;

function readFilePayload(): DemoAdminConfigPayload | null {
  try {
    if (!fs.existsSync(DATA_FILE)) return null;
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    const ok = demoAdminConfigPayloadSchema.safeParse(parsed);
    return ok.success ? ok.data : null;
  } catch {
    return null;
  }
}

function writeFilePayload(payload: DemoAdminConfigPayload) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), "utf-8");
  } catch {
    /* ignore disk errors in read-only environments (e.g. some serverless) */
  }
}

function ensureInit() {
  if (initDone) return;
  initDone = true;
  const fromDisk = readFilePayload();
  if (fromDisk) memory = fromDisk;
}

/** In-memory + optional JSON file mirror when Postgres admin config is unavailable. */
export function getFallbackDemoAdminConfig(): DemoAdminConfigPayload | null {
  ensureInit();
  return memory;
}

export function setFallbackDemoAdminConfig(payload: DemoAdminConfigPayload) {
  memory = payload;
  writeFilePayload(payload);
}
