import { NextResponse } from "next/server";
import { getDemoApiToken } from "@/lib/demoApiToken";

export function verifyDemoApiAuth(request: Request): NextResponse | null {
  const expected = getDemoApiToken();
  const auth = request.headers.get("authorization");
  if (!auth || !auth.toLowerCase().startsWith("bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized", hint: "Send Authorization: Bearer <token>" },
      { status: 401 },
    );
  }
  const token = auth.slice(7).trim();
  if (token !== expected) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  return null;
}
