import { NextResponse } from "next/server";
import { demoAdminConfigPayloadSchema } from "@/lib/api/demoAdminConfigPayloadSchema";
import { verifyDemoApiAuth } from "@/lib/api/verifyDemoApiAuth";
import {
  getFallbackDemoAdminConfig,
  setFallbackDemoAdminConfig,
} from "@/lib/server/demoAdminConfigFallback";
import {
  kvGetDemoAdminConfig,
  kvUpsertDemoAdminConfig,
} from "@/lib/server/demoAdminConfigKv";
import { isKvConfigured } from "@/lib/server/kvClient";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  if (!isKvConfigured()) {
    const fallback = getFallbackDemoAdminConfig();
    return NextResponse.json({ payload: fallback });
  }
  try {
    const raw = await kvGetDemoAdminConfig();
    if (raw == null) {
      const fallback = getFallbackDemoAdminConfig();
      return NextResponse.json({ payload: fallback });
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
    const fallback = getFallbackDemoAdminConfig();
    return NextResponse.json(
      { error: "KV error", payload: fallback },
      { status: 200 },
    );
  }
}

export async function PUT(request: Request) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
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
  setFallbackDemoAdminConfig(parsed.data);
  if (!isKvConfigured()) {
    return NextResponse.json({ ok: true });
  }
  try {
    await kvUpsertDemoAdminConfig(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("demo-admin-config PUT", e);
    return NextResponse.json(
      { error: "KV error (saved to file fallback)" },
      { status: 200 },
    );
  }
}
