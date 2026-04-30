import { propertySchema } from "@/lib/api/contactSchemas";
import {
  getNestedCollection,
  postNestedCollectionItem,
} from "@/lib/api/nestedContactRoutes";

type RouteParams = { email: string };

export async function GET(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email } = await context.params;
  return getNestedCollection(request, email, "properties");
}

export async function POST(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email } = await context.params;
  return postNestedCollectionItem(request, email, "properties", propertySchema);
}
