import { NextResponse } from "next/server";
import { policyholderSchema } from "@/lib/api/contactSchemas";
import { decodeEmailParam } from "@/lib/api/nestedContactRoutes";
import { verifyDemoApiAuth } from "@/lib/api/verifyDemoApiAuth";
import { getContact, patchContact } from "@/server/demoStore";

type RouteParams = { email: string };

export async function GET(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  const { email: raw } = await context.params;
  const email = decodeEmailParam(raw);
  const c = getContact(email);
  if (!c) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  return NextResponse.json(c.policyholder);
}

export async function PUT(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  const { email: raw } = await context.params;
  const email = decodeEmailParam(raw);
  if (!getContact(email)) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = policyholderSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  patchContact(email, { policyholder: parsed.data });
  return NextResponse.json(getContact(email));
}
