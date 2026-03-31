import { getCustomListRowByIndex } from "@/lib/api/nestedContactRoutes";

type RouteParams = { email: string; listId: string; index: string };

export async function GET(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email, listId, index } = await context.params;
  return getCustomListRowByIndex(request, email, listId, index);
}
