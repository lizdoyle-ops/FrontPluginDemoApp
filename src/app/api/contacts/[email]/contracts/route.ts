import { contractSchema } from "@/lib/api/contactSchemas";
import { postNestedCollectionItem } from "@/lib/api/nestedContactRoutes";

type RouteParams = { email: string };

export async function POST(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email } = await context.params;
  return postNestedCollectionItem(request, email, "contracts", contractSchema);
}
