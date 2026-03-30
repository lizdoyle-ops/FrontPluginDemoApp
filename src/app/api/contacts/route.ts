import { NextResponse } from "next/server";
import { verifyDemoApiAuth } from "@/lib/api/verifyDemoApiAuth";
import {
  getAllContacts,
  listContactSummaries,
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
