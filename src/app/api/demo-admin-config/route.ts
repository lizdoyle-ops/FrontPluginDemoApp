import { NextResponse } from "next/server";
import { demoAdminConfigPayloadSchema } from "@/lib/api/demoAdminConfigPayloadSchema";
import { verifyDemoApiAuth } from "@/lib/api/verifyDemoApiAuth";
import { getDemoAdminConfigRow, upsertDemoAdminConfigRow } from "@/lib/server/demoAdminConfigPg";
import { isPostgresConfigured } from "@/lib/server/postgresUrl";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  if (!isPostgresConfigured()) {
    return NextResponse.json(
      { error: "Database not configured", payload: null },
      { status: 503 },
    );
  }
  try {
    const raw = await getDemoAdminConfigRow();
    if (raw == null) {
      return NextResponse.json({ payload: null });
    }
    const parsed = demoAdminConfigPayloadSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Stored payload failed validation" },
        { status: 500 },
      );
    }
    return NextResponse.json({ payload: parsed.data });
  } catch (e) {
    console.error("demo-admin-config GET", e);
    return NextResponse.json(
      { error: "Database error", payload: null },
      { status: 503 },
    );
  }
}

export async function PUT(request: Request) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  if (!isPostgresConfigured()) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = demoAdminConfigPayloadSchema.safeParse(
    body &&
      typeof body === "object" &&
      "payload" in body &&
      (body as { payload: unknown }).payload,
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  try {
    await upsertDemoAdminConfigRow(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("demo-admin-config PUT", e);
    return NextResponse.json({ error: "Database error" }, { status: 503 });
  }
}
