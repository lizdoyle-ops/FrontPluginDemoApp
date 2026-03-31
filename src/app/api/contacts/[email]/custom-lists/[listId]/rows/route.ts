import { customListRowSchema } from "@/lib/api/contactSchemas";
import { postCustomListRow } from "@/lib/api/nestedContactRoutes";

type RouteParams = { email: string; listId: string };

export async function POST(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email, listId } = await context.params;
  return postCustomListRow(request, email, listId, customListRowSchema);
}
