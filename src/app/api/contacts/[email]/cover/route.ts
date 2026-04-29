import { NextResponse } from "next/server";
import { coverSchema } from "@/lib/api/contactSchemas";
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
  const c = await getContact(email);
  if (!c) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  return NextResponse.json(c.cover);
}

export async function PUT(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  const { email: raw } = await context.params;
  const email = decodeEmailParam(raw);
  if (!(await getContact(email))) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = coverSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  await patchContact(email, { cover: parsed.data });
  return NextResponse.json(await getContact(email));
}
