import { NextResponse } from "next/server";
import {
  getAllContacts,
  listContactSummaries,
} from "@/server/demoStore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("full") === "1") {
    const all = getAllContacts();
    return NextResponse.json({ contacts: Object.values(all) });
  }
  const summaries = listContactSummaries();
  return NextResponse.json({ contacts: summaries });
}
