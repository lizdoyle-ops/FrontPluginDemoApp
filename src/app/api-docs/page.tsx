import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** API docs live in CRM → API docs (`/crm?tab=api`). */
export default function ApiDocsPage() {
  redirect("/crm?tab=api");
}
