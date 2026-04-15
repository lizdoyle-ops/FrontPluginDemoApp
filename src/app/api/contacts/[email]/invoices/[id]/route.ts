import { NextResponse } from "next/server";
import { verifyDemoApiAuth } from "@/lib/api/verifyDemoApiAuth";
import { invoiceSchema } from "@/lib/api/contactSchemas";
import {
  getNestedItemById,
  upsertNestedItemByPathId,
} from "@/lib/api/nestedContactRoutes";
import { deleteInvoice, getContact, upsertInvoice } from "@/server/demoStore";

type RouteParams = { email: string; id: string };

function decodeEmail(raw: string) {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email: raw, id } = await context.params;
  return getNestedItemById(request, raw, id, "invoices", "Invoice");
}

export async function POST(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email: raw, id } = await context.params;
  return upsertNestedItemByPathId(
    request,
    raw,
    id,
    "invoices",
    invoiceSchema,
    201,
  );
}

export async function PUT(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  const { email: raw, id } = await context.params;
  const email = decodeEmail(raw);
  const json = await request.json();
  const parsed = invoiceSchema.safeParse({ ...json, id });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  if (!getContact(email)) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  const updated = upsertInvoice(email, parsed.data);
  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  const { email: raw, id } = await context.params;
  const email = decodeEmail(raw);
  if (!getContact(email)) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  const updated = deleteInvoice(email, id);
  return NextResponse.json(updated);
}
