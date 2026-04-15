import { customListRowSchema } from "@/lib/api/contactSchemas";
import {
  deleteCustomListRowAtIndex,
  getCustomListRowByIndex,
  putCustomListRowAtIndex,
} from "@/lib/api/nestedContactRoutes";

type RouteParams = { email: string; listId: string; index: string };

export async function GET(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email, listId, index } = await context.params;
  return getCustomListRowByIndex(request, email, listId, index);
}

export async function PUT(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email, listId, index } = await context.params;
  return putCustomListRowAtIndex(
    request,
    email,
    listId,
    index,
    customListRowSchema,
  );
}

export async function DELETE(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email, listId, index } = await context.params;
  return deleteCustomListRowAtIndex(request, email, listId, index);
}
