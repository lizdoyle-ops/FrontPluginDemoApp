import { NextResponse } from "next/server";
import { verifyDemoApiAuth } from "@/lib/api/verifyDemoApiAuth";
import { contactDataSchema } from "@/lib/api/contactSchemas";
import {
  getAllContacts,
  getContact,
  listContactSummaries,
  putContact,
} from "@/server/demoStore";

export async function GET(request: Request) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  const { searchParams } = new URL(request.url);
  if (searchParams.get("full") === "1") {
    const all = getAllContacts();
    return NextResponse.json({ contacts: Object.values(all) });
  }
  const summaries = listContactSummaries();
  return NextResponse.json({ contacts: summaries });
}

/** Create or replace a contact by body.email (same as PUT /api/contacts/[email]). */
export async function POST(request: Request) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  const json = await request.json();
  const parsed = contactDataSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  if (getContact(parsed.data.email)) {
    return NextResponse.json(
      { error: "Contact already exists", email: parsed.data.email },
      { status: 409 },
    );
  }
  putContact(parsed.data.email, parsed.data);
  return NextResponse.json(getContact(parsed.data.email), { status: 201 });
}
