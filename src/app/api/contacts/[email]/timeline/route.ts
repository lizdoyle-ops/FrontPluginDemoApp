import { timelineSchema } from "@/lib/api/contactSchemas";
import { postTimelineEvent } from "@/lib/api/nestedContactRoutes";

type RouteParams = { email: string };

export async function POST(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email } = await context.params;
  return postTimelineEvent(request, email, timelineSchema);
}
