import { propertySchema } from "@/lib/api/contactSchemas";
import {
  deleteNestedItemByPathId,
  getNestedItemById,
  upsertNestedItemByPathId,
} from "@/lib/api/nestedContactRoutes";

type RouteParams = { email: string; id: string };

export async function GET(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email, id } = await context.params;
  return getNestedItemById(request, email, id, "properties", "Property");
}

export async function POST(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email, id } = await context.params;
  return upsertNestedItemByPathId(
    request,
    email,
    id,
    "properties",
    propertySchema,
    201,
  );
}

export async function PUT(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email, id } = await context.params;
  return upsertNestedItemByPathId(
    request,
    email,
    id,
    "properties",
    propertySchema,
    200,
  );
}

export async function DELETE(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { email, id } = await context.params;
  return deleteNestedItemByPathId(request, email, id, "properties");
}
