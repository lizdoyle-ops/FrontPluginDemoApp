import { demoApiAuthHeaders } from "@/lib/api/demoFetchHeaders";
import { getMockContact } from "@/data/mockData";
import type { ContactData } from "@/types/contact";

export async function fetchContactData(
  email: string,
): Promise<ContactData | undefined> {
  try {
    const res = await fetch(
      `/api/contacts/${encodeURIComponent(email)}`,
      { cache: "no-store", headers: demoApiAuthHeaders() },
    );
    if (res.ok) {
      return (await res.json()) as ContactData;
    }
    if (res.status === 404) {
      return undefined;
    }
    /* Avoid falling back to MOCK_CONTACTS on auth/config errors — that hides real CRM data. */
    return undefined;
  } catch {
    /* offline */
    return getMockContact(email);
  }
}
