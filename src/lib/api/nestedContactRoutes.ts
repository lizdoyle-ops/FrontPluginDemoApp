import { NextResponse } from "next/server";
import type { z } from "zod";
import type { ContactData } from "@/types/contact";
import { verifyDemoApiAuth } from "@/lib/api/verifyDemoApiAuth";
import {
  appendCustomListRow,
  appendTimelineEvent,
  getContact,
  getCustomListRow,
  getNestedContactItem,
  getTimelineEventByIndex,
  type NestedIdCollectionKey,
  upsertNestedContactItem,
} from "@/server/demoStore";
import type { CustomListRow, TimelineEvent } from "@/types/contact";

export function decodeEmailParam(raw: string) {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function decodeIdParam(raw: string) {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function postNestedCollectionItem<K extends NestedIdCollectionKey>(
  request: Request,
  emailRaw: string,
  field: K,
  schema: z.ZodType<ContactData[K][number]>,
) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  const email = decodeEmailParam(emailRaw);
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  if (!getContact(email)) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  const updated = upsertNestedContactItem(
    email,
    field,
    parsed.data as ContactData[K][number],
  );
  return NextResponse.json(updated, { status: 201 });
}

export async function postTimelineEvent(
  request: Request,
  emailRaw: string,
  schema: z.ZodType<TimelineEvent>,
) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  const email = decodeEmailParam(emailRaw);
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  if (!getContact(email)) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  const updated = appendTimelineEvent(email, parsed.data);
  return NextResponse.json(updated, { status: 201 });
}

export async function getNestedItemById<K extends NestedIdCollectionKey>(
  request: Request,
  emailRaw: string,
  idRaw: string,
  field: K,
  notFoundLabel: string,
) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  const email = decodeEmailParam(emailRaw);
  const id = decodeIdParam(idRaw);
  if (!getContact(email)) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  const item = getNestedContactItem(email, field, id);
  if (!item) {
    return NextResponse.json(
      { error: `${notFoundLabel} not found` },
      { status: 404 },
    );
  }
  return NextResponse.json(item);
}

export async function getTimelineItemByIndex(
  request: Request,
  emailRaw: string,
  indexRaw: string,
) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  const email = decodeEmailParam(emailRaw);
  const index = Number.parseInt(indexRaw, 10);
  if (!Number.isFinite(index) || !Number.isInteger(index) || index < 0) {
    return NextResponse.json({ error: "Invalid timeline index" }, { status: 400 });
  }
  if (!getContact(email)) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  const item = getTimelineEventByIndex(email, index);
  if (!item) {
    return NextResponse.json(
      { error: "Timeline event not found" },
      { status: 404 },
    );
  }
  return NextResponse.json({ index, event: item });
}

export async function postCustomListRow(
  request: Request,
  emailRaw: string,
  listIdRaw: string,
  schema: z.ZodType<CustomListRow>,
) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  const email = decodeEmailParam(emailRaw);
  const listId = decodeIdParam(listIdRaw);
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  if (!getContact(email)) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  const updated = appendCustomListRow(email, listId, parsed.data);
  return NextResponse.json(updated, { status: 201 });
}

export async function getCustomListRowByIndex(
  request: Request,
  emailRaw: string,
  listIdRaw: string,
  indexRaw: string,
) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  const email = decodeEmailParam(emailRaw);
  const listId = decodeIdParam(listIdRaw);
  const index = Number.parseInt(indexRaw, 10);
  if (!Number.isFinite(index) || index < 0) {
    return NextResponse.json({ error: "Invalid row index" }, { status: 400 });
  }
  if (!getContact(email)) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  const row = getCustomListRow(email, listId, index);
  if (!row) {
    return NextResponse.json({ error: "Row not found" }, { status: 404 });
  }
  return NextResponse.json({ listId, index, row });
}
