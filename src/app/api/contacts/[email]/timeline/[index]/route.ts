import { getTimelineItemByIndex } from "@/lib/api/nestedContactRoutes";

type RouteParams = { email: string; index: string };

export async function GET(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email, index } = await context.params;
  return getTimelineItemByIndex(request, email, index);
}
