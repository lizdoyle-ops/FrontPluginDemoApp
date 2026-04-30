import fs from "fs";
import path from "path";
import { MOCK_CONTACTS } from "@/data/mockData";
import {
  pgDeleteContact,
  pgGetContactPayload,
  pgListAllContacts,
  pgUpsertContact,
} from "@/lib/server/demoContactsPg";
import { isPostgresConfigured } from "@/lib/server/postgresUrl";
import type { ContactData, CustomListRow, TimelineEvent } from "@/types/contact";
import { emptyCover, emptyPolicyholder } from "@/types/insurance";
import type { Pet, Policy } from "@/types/insurance";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "demo-store.json");

type StoreShape = Record<string, ContactData>;

let pgSeedPromise: Promise<void> | null = null;

function migratePolicy(raw: unknown): Policy {
  const o = raw as Record<string, unknown>;
  if (
    o &&
    typeof o.product === "string" &&
    typeof o.annualPremium === "number"
  ) {
    return raw as Policy;
  }
  const leg = raw as Record<string, unknown>;
  return {
    id: String(leg.id ?? "pol"),
    policyNumber: String(leg.policyNumber ?? leg.id ?? ""),
    product: String(leg.title ?? "Policy"),
    status: String(leg.status ?? ""),
    startDate: String(leg.startDate ?? ""),
    renewalDate: String(leg.endDate ?? leg.startDate ?? ""),
    annualPremium: 0,
    paymentFrequency: "",
    monthlyDirectDebit: 0,
    paymentStatus: "",
  };
}

function migratePet(raw: unknown): Pet {
  const p = raw as Record<string, unknown>;
  if (Array.isArray(p.preExistingConditions)) {
    return raw as Pet;
  }
  const sp = String(p.species ?? "other");
  const speciesTitle =
    sp === "dog" ? "Dog"
    : sp === "cat" ? "Cat"
    : sp === "bird" ? "Bird"
    : sp === "reptile" ? "Reptile"
    : sp === "other" ? "Other"
    : sp;
  return {
    id: String(p.id),
    name: String(p.name ?? ""),
    species: speciesTitle,
    breed: p.breed as string | undefined,
    dob: p.dob as string | undefined,
    age: typeof p.age === "number" ? p.age : undefined,
    gender: p.gender as Pet["gender"] | undefined,
    neutered: p.neutered as boolean | undefined,
    microchip: p.microchip as string | undefined,
    preExistingConditions: [],
    authorisedContacts: p.authorisedContacts as string | undefined,
    notes: p.notes as string | undefined,
  };
}

function newCustomListRowId(): string {
  return `clr-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** Ensures custom list rows have ids; strips legacy timeline `id` fields. */
export function normalizeContactForStore(c: ContactData): ContactData {
  const timeline = (c.timeline ?? []).map((ev) => {
    const legacy = { ...(ev as TimelineEvent & { id?: string }) };
    delete legacy.id;
    const rest = legacy;
    return rest as TimelineEvent;
  });

  const customLists: Record<string, CustomListRow[]> = c.customLists
    ? Object.fromEntries(
        Object.entries(c.customLists).map(([listId, rows]) => [
          listId,
          rows.map((row) => {
            const id = row.id?.trim();
            if (id) return { ...row, id } as CustomListRow;
            return { ...row, id: newCustomListRowId() } as CustomListRow;
          }),
        ]),
      )
    : {};

  const pets = (c.pets ?? []).map(migratePet);
  const policies = (c.policies ?? []).map(migratePolicy);
  const policyholder = c.policyholder ?? emptyPolicyholder();
  const cover = c.cover ?? emptyCover();
  const email = c.email?.trim() ?? "";

  return {
    ...c,
    email,
    name: c.name ?? "",
    company: c.company ?? "",
    role: c.role ?? "",
    segment: c.segment ?? "",
    tags: c.tags ?? [],
    properties: c.properties ?? [],
    quotes: c.quotes ?? [],
    inquiries: c.inquiries ?? [],
    cases: c.cases ?? [],
    opportunities: c.opportunities ?? [],
    orders: c.orders ?? [],
    orderRequests: c.orderRequests ?? [],
    workOrders: c.workOrders ?? [],
    contracts: c.contracts ?? [],
    timeline,
    attachments: c.attachments ?? [],
    customLists,
    pets,
    policies,
    policyholder,
    cover,
    claimsHistory: c.claimsHistory ?? [],
    invoices: c.invoices ?? [],
  };
}

function normalizeEntireStore(contacts: StoreShape): StoreShape {
  const out: StoreShape = {};
  for (const c of Object.values(contacts)) {
    const n = normalizeContactForStore(c);
    out[n.email.trim().toLowerCase()] = n;
  }
  return out;
}

function normalizeStoreKeys(contacts: StoreShape): StoreShape {
  const out: StoreShape = {};
  for (const c of Object.values(contacts)) {
    out[c.email.trim().toLowerCase()] = c;
  }
  return out;
}

let memory: StoreShape = normalizeEntireStore(
  normalizeStoreKeys({ ...MOCK_CONTACTS }),
);

async function ensurePostgresSeeded(): Promise<void> {
  if (!isPostgresConfigured()) return;
  if (pgSeedPromise) return pgSeedPromise;

  pgSeedPromise = (async () => {
    const existing = await pgListAllContacts();
    if (existing.length > 0) return;
    for (const c of Object.values(MOCK_CONTACTS)) {
      await pgUpsertContact(normalizeContactForStore(c));
    }
  })().catch((error) => {
    pgSeedPromise = null;
    throw error;
  });

  return pgSeedPromise;
}

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
  if (isPostgresConfigured()) return;
  const fromDisk = readFileStore();
  const merged = fromDisk
    ? normalizeStoreKeys({ ...MOCK_CONTACTS, ...fromDisk })
    : normalizeStoreKeys({ ...MOCK_CONTACTS });
  memory = normalizeEntireStore(merged);
}

function persist() {
  writeFileStore(memory);
}

function getContactFromMemoryOnly(email: string): ContactData | undefined {
  const key = email.trim().toLowerCase();
  const direct = memory[key];
  if (direct) return direct;
  return Object.values(memory).find((c) => c.email.toLowerCase() === key);
}

export async function getAllContacts(): Promise<StoreShape> {
  if (!isPostgresConfigured()) {
    return { ...memory };
  }

  await ensurePostgresSeeded();
  const dbRows = await pgListAllContacts();
  const dbRecord: StoreShape = {};
  for (const c of dbRows) {
    const n = normalizeContactForStore(c);
    dbRecord[n.email.trim().toLowerCase()] = n;
  }
  return dbRecord;
}

export async function listContactSummaries() {
  const all = await getAllContacts();
  return Object.values(all).map((c) => ({
    email: c.email,
    name: c.name,
    company: c.company,
  }));
}

export async function getContact(
  email: string,
): Promise<ContactData | undefined> {
  const key = email.trim().toLowerCase();
  if (!isPostgresConfigured()) {
    return getContactFromMemoryOnly(email);
  }
  await ensurePostgresSeeded();
  const fromDb = await pgGetContactPayload(key);
  if (fromDb) return normalizeContactForStore(fromDb);
  return undefined;
}

export async function putContact(email: string, data: ContactData) {
  const key = email.trim().toLowerCase();
  const newKey = data.email.trim().toLowerCase();
  const normalized = normalizeContactForStore({
    ...data,
    email: data.email.trim(),
  });
  if (isPostgresConfigured()) {
    await ensurePostgresSeeded();
    const prev = await pgGetContactPayload(key);
    if (prev && key !== newKey) {
      await pgDeleteContact(key);
    }
    await pgUpsertContact(normalized);
    return;
  }

  const prev = memory[key];
  if (prev && prev.email.toLowerCase() !== newKey) {
    delete memory[key];
  }
  memory[newKey] = normalized;
  persist();
}

export async function patchContact(
  email: string,
  partial: Partial<ContactData>,
): Promise<ContactData | undefined> {
  const existing = await getContact(email);
  if (!existing) return undefined;
  const next = { ...existing, ...partial, email: existing.email };
  await putContact(existing.email, next);
  return next;
}

export async function deleteContact(email: string): Promise<boolean> {
  const key = email.trim().toLowerCase();
  if (isPostgresConfigured()) {
    await ensurePostgresSeeded();
    return pgDeleteContact(key);
  }
  const target = getContactFromMemoryOnly(email);
  if (!target) return false;
  delete memory[target.email.toLowerCase()];
  persist();
  return true;
}

/** Keys for contact arrays keyed by string `id` on each item. */
export type NestedIdCollectionKey =
  | "properties"
  | "quotes"
  | "inquiries"
  | "cases"
  | "opportunities"
  | "orders"
  | "orderRequests"
  | "workOrders"
  | "contracts"
  | "attachments"
  | "pets"
  | "policies"
  | "claimsHistory"
  | "invoices";

export async function upsertNestedContactItem<K extends NestedIdCollectionKey>(
  contactEmail: string,
  key: K,
  item: ContactData[K][number],
): Promise<ContactData | undefined> {
  const c = await getContact(contactEmail);
  if (!c) return undefined;
  const list = c[key] as { id: string }[];
  const rest = list.filter((x) => x.id !== (item as { id: string }).id);
  const next = { ...c, [key]: [...rest, item] } as ContactData;
  await putContact(c.email, next);
  return next;
}

export async function getNestedContactItem<K extends NestedIdCollectionKey>(
  contactEmail: string,
  key: K,
  id: string,
): Promise<ContactData[K][number] | undefined> {
  const c = await getContact(contactEmail);
  if (!c) return undefined;
  return (c[key] as { id: string }[]).find((x) => x.id === id) as
    | ContactData[K][number]
    | undefined;
}

export async function deleteNestedContactItem(
  contactEmail: string,
  key: NestedIdCollectionKey,
  id: string,
): Promise<ContactData | undefined> {
  const c = await getContact(contactEmail);
  if (!c) return undefined;
  const list = c[key] as { id: string }[];
  const next = {
    ...c,
    [key]: list.filter((x) => x.id !== id),
  } as ContactData;
  await putContact(c.email, next);
  return next;
}

/** Work order nested CRUD */
export async function upsertWorkOrder(
  contactEmail: string,
  workOrder: ContactData["workOrders"][number],
): Promise<ContactData | undefined> {
  return upsertNestedContactItem(contactEmail, "workOrders", workOrder);
}

export async function getWorkOrder(
  contactEmail: string,
  workOrderId: string,
): Promise<ContactData["workOrders"][number] | undefined> {
  return getNestedContactItem(contactEmail, "workOrders", workOrderId);
}

export async function deleteWorkOrder(
  contactEmail: string,
  workOrderId: string,
): Promise<ContactData | undefined> {
  return deleteNestedContactItem(contactEmail, "workOrders", workOrderId);
}

/** Invoice nested CRUD */
export async function upsertInvoice(
  contactEmail: string,
  invoice: ContactData["invoices"][number],
): Promise<ContactData | undefined> {
  return upsertNestedContactItem(contactEmail, "invoices", invoice);
}

export async function getInvoice(
  contactEmail: string,
  invoiceId: string,
): Promise<ContactData["invoices"][number] | undefined> {
  return getNestedContactItem(contactEmail, "invoices", invoiceId);
}

export async function deleteInvoice(
  contactEmail: string,
  invoiceId: string,
): Promise<ContactData | undefined> {
  return deleteNestedContactItem(contactEmail, "invoices", invoiceId);
}

/** Custom list rows (Admin-defined lists); each row has a unique `id`. */
export async function appendCustomListRow(
  contactEmail: string,
  listId: string,
  row: CustomListRow,
): Promise<ContactData | undefined> {
  const c = await getContact(contactEmail);
  if (!c) return undefined;
  const lists = { ...(c.customLists ?? {}) };
  lists[listId] = [...(lists[listId] ?? []), row];
  const next = { ...c, customLists: lists };
  await putContact(c.email, next);
  return next;
}

export async function appendTimelineEvent(
  contactEmail: string,
  event: TimelineEvent,
): Promise<ContactData | undefined> {
  const c = await getContact(contactEmail);
  if (!c) return undefined;
  const next = { ...c, timeline: [...c.timeline, event] };
  await putContact(c.email, next);
  return next;
}

export async function getTimelineEventByIndex(
  contactEmail: string,
  index: number,
): Promise<TimelineEvent | undefined> {
  const c = await getContact(contactEmail);
  if (!c || !Number.isInteger(index) || index < 0 || index >= c.timeline.length) {
    return undefined;
  }
  return c.timeline[index];
}

export async function getCustomListRow(
  contactEmail: string,
  listId: string,
  index: number,
): Promise<CustomListRow | undefined> {
  const c = await getContact(contactEmail);
  if (!c) return undefined;
  const rows = c.customLists?.[listId];
  if (!rows || index < 0 || index >= rows.length) return undefined;
  return rows[index];
}

export async function replaceCustomListRowAtIndex(
  contactEmail: string,
  listId: string,
  index: number,
  row: CustomListRow,
): Promise<ContactData | undefined> {
  const c = await getContact(contactEmail);
  if (!c) return undefined;
  const lists = { ...(c.customLists ?? {}) };
  const rows = [...(lists[listId] ?? [])];
  if (index < 0 || index >= rows.length) return undefined;
  rows[index] = row;
  lists[listId] = rows;
  const next = { ...c, customLists: lists };
  await putContact(c.email, next);
  return next;
}

export async function deleteCustomListRowAtIndex(
  contactEmail: string,
  listId: string,
  index: number,
): Promise<ContactData | undefined> {
  const c = await getContact(contactEmail);
  if (!c) return undefined;
  const lists = { ...(c.customLists ?? {}) };
  const rows = [...(lists[listId] ?? [])];
  if (index < 0 || index >= rows.length) return undefined;
  rows.splice(index, 1);
  lists[listId] = rows;
  const next = { ...c, customLists: lists };
  await putContact(c.email, next);
  return next;
}

initDemoStoreFromDisk();
