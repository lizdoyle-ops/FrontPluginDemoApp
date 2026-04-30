import { customListRowSchema } from "@/lib/api/contactSchemas";
import { getContact } from "@/server/demoStore";
import {
  decodeEmailParam,
  decodeIdParam,
  postCustomListRow,
} from "@/lib/api/nestedContactRoutes";
import { verifyDemoApiAuth } from "@/lib/api/verifyDemoApiAuth";
import { NextResponse } from "next/server";

type RouteParams = { email: string; listId: string };

export async function GET(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const denied = verifyDemoApiAuth(request);
  if (denied) return denied;
  const { email: emailRaw, listId: listIdRaw } = await context.params;
  const email = decodeEmailParam(emailRaw);
  const listId = decodeIdParam(listIdRaw);
  const contact = await getContact(email);
  if (!contact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  return NextResponse.json({
    listId,
    rows: contact.customLists?.[listId] ?? [],
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email, listId } = await context.params;
  return postCustomListRow(request, email, listId, customListRowSchema);
}
