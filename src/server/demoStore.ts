import fs from "fs";
import path from "path";
import { MOCK_CONTACTS } from "@/data/mockData";
import type { ContactData } from "@/types/contact";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "demo-store.json");

type StoreShape = Record<string, ContactData>;

function normalizeStoreKeys(contacts: StoreShape): StoreShape {
  const out: StoreShape = {};
  for (const c of Object.values(contacts)) {
    out[c.email.trim().toLowerCase()] = c;
  }
  return out;
}

let memory: StoreShape = normalizeStoreKeys({ ...MOCK_CONTACTS });

function readFileStore(): StoreShape | null {
  try {
    if (!fs.existsSync(DATA_FILE)) return null;
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as StoreShape;
    return typeof parsed === "object" && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}

function writeFileStore(data: StoreShape) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    /* ignore disk errors in read-only environments */
  }
}

export function initDemoStoreFromDisk() {
  const fromDisk = readFileStore();
  if (fromDisk) {
    memory = normalizeStoreKeys({ ...MOCK_CONTACTS, ...fromDisk });
  } else {
    memory = normalizeStoreKeys({ ...MOCK_CONTACTS });
  }
}

function persist() {
  writeFileStore(memory);
}

export function getAllContacts(): StoreShape {
  return { ...memory };
}

export function listContactSummaries() {
  return Object.values(memory).map((c) => ({
    email: c.email,
    name: c.name,
    company: c.company,
  }));
}

export function getContact(email: string): ContactData | undefined {
  const key = email.trim().toLowerCase();
  const direct = memory[key];
  if (direct) return direct;
  return Object.values(memory).find(
    (c) => c.email.toLowerCase() === key,
  );
}

export function putContact(email: string, data: ContactData) {
  const key = email.trim().toLowerCase();
  const prev = memory[key];
  if (prev && prev.email.toLowerCase() !== data.email.trim().toLowerCase()) {
    delete memory[key];
  }
  const newKey = data.email.trim().toLowerCase();
  memory[newKey] = { ...data, email: data.email.trim() };
  persist();
}

export function patchContact(
  email: string,
  partial: Partial<ContactData>,
): ContactData | undefined {
  const existing = getContact(email);
  if (!existing) return undefined;
  const next = { ...existing, ...partial, email: existing.email };
  putContact(existing.email, next);
  return next;
}

export function deleteContact(email: string): boolean {
  const target = getContact(email);
  if (!target) return false;
  delete memory[target.email.toLowerCase()];
  persist();
  return true;
}

/** Work order nested CRUD */
export function upsertWorkOrder(
  contactEmail: string,
  workOrder: ContactData["workOrders"][number],
): ContactData | undefined {
  const c = getContact(contactEmail);
  if (!c) return undefined;
  const rest = c.workOrders.filter((w) => w.id !== workOrder.id);
  const next = { ...c, workOrders: [...rest, workOrder] };
  putContact(c.email, next);
  return next;
}

export function getWorkOrder(
  contactEmail: string,
  workOrderId: string,
): ContactData["workOrders"][number] | undefined {
  const c = getContact(contactEmail);
  if (!c) return undefined;
  return c.workOrders.find((w) => w.id === workOrderId);
}

export function deleteWorkOrder(
  contactEmail: string,
  workOrderId: string,
): ContactData | undefined {
  const c = getContact(contactEmail);
  if (!c) return undefined;
  const next = {
    ...c,
    workOrders: c.workOrders.filter((w) => w.id !== workOrderId),
  };
  putContact(c.email, next);
  return next;
}

/** Invoice nested CRUD */
export function upsertInvoice(
  contactEmail: string,
  invoice: ContactData["invoices"][number],
): ContactData | undefined {
  const c = getContact(contactEmail);
  if (!c) return undefined;
  const rest = c.invoices.filter((i) => i.id !== invoice.id);
  const next = { ...c, invoices: [...rest, invoice] };
  putContact(c.email, next);
  return next;
}

export function deleteInvoice(
  contactEmail: string,
  invoiceId: string,
): ContactData | undefined {
  const c = getContact(contactEmail);
  if (!c) return undefined;
  const next = {
    ...c,
    invoices: c.invoices.filter((i) => i.id !== invoiceId),
  };
  putContact(c.email, next);
  return next;
}

initDemoStoreFromDisk();
