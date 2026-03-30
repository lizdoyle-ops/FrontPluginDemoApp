import { NextResponse } from "next/server";
import { verifyDemoApiAuth } from "@/lib/api/verifyDemoApiAuth";
import { contactDataSchema, contactPatchSchema } from "@/lib/api/contactSchemas";
import {
  deleteContact,
  getContact,
  patchContact,
  putContact,
} from "@/server/demoStore";

type RouteParams = { email: string };

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
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  const { email: raw } = await context.params;
  const email = decodeEmail(raw);
  const contact = getContact(email);
  if (!contact) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(contact);
}

export async function PUT(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  const { email: raw } = await context.params;
  const email = decodeEmail(raw);
  const json = await request.json();
  const parsed = contactDataSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  putContact(email, parsed.data);
  return NextResponse.json(getContact(parsed.data.email));
}

export async function PATCH(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  const { email: raw } = await context.params;
  const email = decodeEmail(raw);
  const json = await request.json();
  const parsed = contactPatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const updated = patchContact(email, parsed.data);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  const { email: raw } = await context.params;
  const email = decodeEmail(raw);
  const ok = deleteContact(email);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
