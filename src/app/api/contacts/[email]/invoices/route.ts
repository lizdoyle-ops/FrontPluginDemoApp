import { NextResponse } from "next/server";
import { invoiceSchema } from "@/lib/api/contactSchemas";
import { getContact, upsertInvoice } from "@/server/demoStore";

type RouteParams = { email: string };

function decodeEmail(raw: string) {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email: raw } = await context.params;
  const email = decodeEmail(raw);
  const json = await request.json();
  const parsed = invoiceSchema.safeParse(json);
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
  return NextResponse.json(updated, { status: 201 });
}
