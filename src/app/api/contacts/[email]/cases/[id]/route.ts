import { getNestedItemById } from "@/lib/api/nestedContactRoutes";

type RouteParams = { email: string; id: string };

export async function GET(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email, id } = await context.params;
  return getNestedItemById(request, email, id, "cases", "Case");
}
