import fs from "fs";
import path from "path";
import { MOCK_CONTACTS } from "@/data/mockData";
import type { ContactData, CustomListRow, TimelineEvent } from "@/types/contact";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "demo-store.json");

type StoreShape = Record<string, ContactData>;

function newCustomListRowId(): string {
  return `clr-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** Ensures custom list rows have ids; strips legacy timeline `id` fields. */
export function normalizeContactForStore(c: ContactData): ContactData {
  const timeline = (c.timeline ?? []).map((ev) => {
    const legacy = ev as TimelineEvent & { id?: string };
    const { id: _drop, ...rest } = legacy;
    return rest as TimelineEvent;
  });

  const customLists = c.customLists
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
    : c.customLists;

  const opportunities = c.opportunities ?? [];
  const orders = c.orders ?? [];
  return { ...c, timeline, customLists, opportunities, orders };
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
  const merged = fromDisk
    ? normalizeStoreKeys({ ...MOCK_CONTACTS, ...fromDisk })
    : normalizeStoreKeys({ ...MOCK_CONTACTS });
  memory = normalizeEntireStore(merged);
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
  const normalized = normalizeContactForStore({
    ...data,
    email: data.email.trim(),
  });
  memory[newKey] = normalized;
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

/** Keys for contact arrays keyed by string `id` on each item. */
export type NestedIdCollectionKey =
  | "properties"
  | "quotes"
  | "inquiries"
  | "cases"
  | "opportunities"
  | "orders"
  | "workOrders"
  | "contracts"
  | "attachments"
  | "invoices";

export function upsertNestedContactItem<K extends NestedIdCollectionKey>(
  contactEmail: string,
  key: K,
  item: ContactData[K][number],
): ContactData | undefined {
  const c = getContact(contactEmail);
  if (!c) return undefined;
  const list = c[key] as { id: string }[];
  const rest = list.filter((x) => x.id !== (item as { id: string }).id);
  const next = { ...c, [key]: [...rest, item] } as ContactData;
  putContact(c.email, next);
  return next;
}

export function getNestedContactItem<K extends NestedIdCollectionKey>(
  contactEmail: string,
  key: K,
  id: string,
): ContactData[K][number] | undefined {
  const c = getContact(contactEmail);
  if (!c) return undefined;
  return (c[key] as { id: string }[]).find((x) => x.id === id) as
    | ContactData[K][number]
    | undefined;
}

export function deleteNestedContactItem(
  contactEmail: string,
  key: NestedIdCollectionKey,
  id: string,
): ContactData | undefined {
  const c = getContact(contactEmail);
  if (!c) return undefined;
  const list = c[key] as { id: string }[];
  const next = {
    ...c,
    [key]: list.filter((x) => x.id !== id),
  } as ContactData;
  putContact(c.email, next);
  return next;
}

/** Work order nested CRUD */
export function upsertWorkOrder(
  contactEmail: string,
  workOrder: ContactData["workOrders"][number],
): ContactData | undefined {
  return upsertNestedContactItem(contactEmail, "workOrders", workOrder);
}

export function getWorkOrder(
  contactEmail: string,
  workOrderId: string,
): ContactData["workOrders"][number] | undefined {
  return getNestedContactItem(contactEmail, "workOrders", workOrderId);
}

export function deleteWorkOrder(
  contactEmail: string,
  workOrderId: string,
): ContactData | undefined {
  return deleteNestedContactItem(contactEmail, "workOrders", workOrderId);
}

/** Invoice nested CRUD */
export function upsertInvoice(
  contactEmail: string,
  invoice: ContactData["invoices"][number],
): ContactData | undefined {
  return upsertNestedContactItem(contactEmail, "invoices", invoice);
}

export function getInvoice(
  contactEmail: string,
  invoiceId: string,
): ContactData["invoices"][number] | undefined {
  return getNestedContactItem(contactEmail, "invoices", invoiceId);
}

export function deleteInvoice(
  contactEmail: string,
  invoiceId: string,
): ContactData | undefined {
  return deleteNestedContactItem(contactEmail, "invoices", invoiceId);
}

/** Custom list rows (Admin-defined lists); each row has a unique `id`. */
export function appendCustomListRow(
  contactEmail: string,
  listId: string,
  row: CustomListRow,
): ContactData | undefined {
  const c = getContact(contactEmail);
  if (!c) return undefined;
  const lists = { ...(c.customLists ?? {}) };
  lists[listId] = [...(lists[listId] ?? []), row];
  const next = { ...c, customLists: lists };
  putContact(c.email, next);
  return next;
}

export function appendTimelineEvent(
  contactEmail: string,
  event: TimelineEvent,
): ContactData | undefined {
  const c = getContact(contactEmail);
  if (!c) return undefined;
  const next = { ...c, timeline: [...c.timeline, event] };
  putContact(c.email, next);
  return next;
}

export function getTimelineEventByIndex(
  contactEmail: string,
  index: number,
): TimelineEvent | undefined {
  const c = getContact(contactEmail);
  if (!c || !Number.isInteger(index) || index < 0 || index >= c.timeline.length) {
    return undefined;
  }
  return c.timeline[index];
}

export function getCustomListRow(
  contactEmail: string,
  listId: string,
  index: number,
): CustomListRow | undefined {
  const c = getContact(contactEmail);
  if (!c) return undefined;
  const rows = c.customLists?.[listId];
  if (!rows || index < 0 || index >= rows.length) return undefined;
  return rows[index];
}

initDemoStoreFromDisk();
