import type { CustomObjectDefinition } from "@/types/contact";
import { exampleJsonBodyForRow } from "@/lib/api/apiDocsExampleBodies";

export type ApiDocRow = {
  object: string;
  methods: string;
  path: string;
  note: string;
  /** Present for POST / PUT / PATCH with a sample JSON body for copy-paste. */
  exampleJsonBody?: string;
};

/** Native + contact APIs (everything in CRM Back Office except custom lists). */
export const STATIC_API_DOC_ROWS: ApiDocRow[] = [
  {
    object: "Contacts",
    methods: "GET",
    path: "/api/contacts",
    note: "List contact summaries (name, email, company).",
  },
  {
    object: "Contacts",
    methods: "GET",
    path: "/api/contacts?full=1",
    note: "List full ContactData for every contact.",
  },
  {
    object: "Contacts",
    methods: "POST",
    path: "/api/contacts",
    note: "Create a new contact (full body; 409 if email exists).",
  },
  {
    object: "Contact",
    methods: "GET",
    path: "/api/contacts/{email}",
    note: "Read one contact (URL-encode email, e.g. %40 for @).",
  },
  {
    object: "Contact",
    methods: "PUT",
    path: "/api/contacts/{email}",
    note: "Replace entire contact (Zod-validated body).",
  },
  {
    object: "Contact",
    methods: "PATCH",
    path: "/api/contacts/{email}",
    note: "Shallow merge top-level fields.",
  },
  {
    object: "Contact",
    methods: "DELETE",
    path: "/api/contacts/{email}",
    note: "Remove contact from the demo store.",
  },
  {
    object: "Cases",
    methods: "POST",
    path: "/api/contacts/{email}/cases",
    note: "Create or upsert a case: JSON body must include id, subject, status, openedAt.",
  },
  {
    object: "Case",
    methods: "GET",
    path: "/api/contacts/{email}/cases/{id}",
    note: "Read one case by stable id (e.g. c1). Returns Case JSON only.",
  },
  {
    object: "Case",
    methods: "POST",
    path: "/api/contacts/{email}/cases/{id}",
    note: "Upsert this id: path id is merged onto body; returns full updated contact (201).",
  },
  {
    object: "Case",
    methods: "PUT",
    path: "/api/contacts/{email}/cases/{id}",
    note: "Same upsert as POST; returns full contact (200).",
  },
  {
    object: "Case",
    methods: "DELETE",
    path: "/api/contacts/{email}/cases/{id}",
    note: "Remove the case with this id from the contact.",
  },
  {
    object: "Properties",
    methods: "POST",
    path: "/api/contacts/{email}/properties",
    note: "Upsert property (id in body).",
  },
  {
    object: "Property",
    methods: "GET",
    path: "/api/contacts/{email}/properties/{id}",
    note: "Read one property JSON.",
  },
  {
    object: "Property",
    methods: "POST",
    path: "/api/contacts/{email}/properties/{id}",
    note: "Upsert; path id merged onto body (201).",
  },
  {
    object: "Property",
    methods: "PUT",
    path: "/api/contacts/{email}/properties/{id}",
    note: "Upsert (200).",
  },
  {
    object: "Property",
    methods: "DELETE",
    path: "/api/contacts/{email}/properties/{id}",
    note: "Delete property by id.",
  },
  {
    object: "Work orders",
    methods: "POST",
    path: "/api/contacts/{email}/work-orders",
    note: "Create or upsert a work order (body includes id).",
  },
  {
    object: "Work order",
    methods: "GET",
    path: "/api/contacts/{email}/work-orders/{id}",
    note: "Read one work order JSON.",
  },
  {
    object: "Work order",
    methods: "POST",
    path: "/api/contacts/{email}/work-orders/{id}",
    note: "Upsert; path id applied to body (201).",
  },
  {
    object: "Work order",
    methods: "PUT",
    path: "/api/contacts/{email}/work-orders/{id}",
    note: "Upsert (200).",
  },
  {
    object: "Work order",
    methods: "DELETE",
    path: "/api/contacts/{email}/work-orders/{id}",
    note: "Delete work order by id.",
  },
  {
    object: "Invoices",
    methods: "POST",
    path: "/api/contacts/{email}/invoices",
    note: "Create or upsert an invoice (body includes id).",
  },
  {
    object: "Invoice",
    methods: "GET",
    path: "/api/contacts/{email}/invoices/{id}",
    note: "Read one invoice JSON.",
  },
  {
    object: "Invoice",
    methods: "POST",
    path: "/api/contacts/{email}/invoices/{id}",
    note: "Upsert; path id merged onto body (201).",
  },
  {
    object: "Invoice",
    methods: "PUT",
    path: "/api/contacts/{email}/invoices/{id}",
    note: "Upsert invoice (200).",
  },
  {
    object: "Invoice",
    methods: "DELETE",
    path: "/api/contacts/{email}/invoices/{id}",
    note: "Delete invoice by id.",
  },
  {
    object: "Quotes",
    methods: "POST",
    path: "/api/contacts/{email}/quotes",
    note: "Upsert quote (id in body).",
  },
  {
    object: "Quote",
    methods: "GET",
    path: "/api/contacts/{email}/quotes/{id}",
    note: "Read one quote JSON.",
  },
  {
    object: "Quote",
    methods: "POST",
    path: "/api/contacts/{email}/quotes/{id}",
    note: "Upsert (201).",
  },
  {
    object: "Quote",
    methods: "PUT",
    path: "/api/contacts/{email}/quotes/{id}",
    note: "Upsert (200).",
  },
  {
    object: "Quote",
    methods: "DELETE",
    path: "/api/contacts/{email}/quotes/{id}",
    note: "Delete quote by id.",
  },
  {
    object: "Opportunities",
    methods: "POST",
    path: "/api/contacts/{email}/opportunities",
    note: "Upsert opportunity (id, title, stage in body; optional amount, currency, expectedCloseDate, notes).",
  },
  {
    object: "Opportunity",
    methods: "GET",
    path: "/api/contacts/{email}/opportunities/{id}",
    note: "Read one opportunity JSON.",
  },
  {
    object: "Opportunity",
    methods: "POST",
    path: "/api/contacts/{email}/opportunities/{id}",
    note: "Upsert (201).",
  },
  {
    object: "Opportunity",
    methods: "PUT",
    path: "/api/contacts/{email}/opportunities/{id}",
    note: "Upsert (200).",
  },
  {
    object: "Opportunity",
    methods: "DELETE",
    path: "/api/contacts/{email}/opportunities/{id}",
    note: "Delete opportunity by id.",
  },
  {
    object: "Orders",
    methods: "POST",
    path: "/api/contacts/{email}/orders",
    note: "Upsert order (id, title, status, orderedAt, total, currency in body; optional fulfilledAt, notes).",
  },
  {
    object: "Order",
    methods: "GET",
    path: "/api/contacts/{email}/orders/{id}",
    note: "Read one order JSON.",
  },
  {
    object: "Order",
    methods: "POST",
    path: "/api/contacts/{email}/orders/{id}",
    note: "Upsert (201).",
  },
  {
    object: "Order",
    methods: "PUT",
    path: "/api/contacts/{email}/orders/{id}",
    note: "Upsert (200).",
  },
  {
    object: "Order",
    methods: "DELETE",
    path: "/api/contacts/{email}/orders/{id}",
    note: "Delete order by id.",
  },
  {
    object: "Inquiries",
    methods: "POST",
    path: "/api/contacts/{email}/inquiries",
    note: "Upsert inquiry (id in body).",
  },
  {
    object: "Inquiry",
    methods: "GET",
    path: "/api/contacts/{email}/inquiries/{id}",
    note: "Read one inquiry JSON.",
  },
  {
    object: "Inquiry",
    methods: "POST",
    path: "/api/contacts/{email}/inquiries/{id}",
    note: "Upsert (201).",
  },
  {
    object: "Inquiry",
    methods: "PUT",
    path: "/api/contacts/{email}/inquiries/{id}",
    note: "Upsert (200).",
  },
  {
    object: "Inquiry",
    methods: "DELETE",
    path: "/api/contacts/{email}/inquiries/{id}",
    note: "Delete inquiry by id.",
  },
  {
    object: "Contracts",
    methods: "POST",
    path: "/api/contacts/{email}/contracts",
    note: "Upsert contract (id in body).",
  },
  {
    object: "Contract",
    methods: "GET",
    path: "/api/contacts/{email}/contracts/{id}",
    note: "Read one contract JSON.",
  },
  {
    object: "Contract",
    methods: "POST",
    path: "/api/contacts/{email}/contracts/{id}",
    note: "Upsert (201).",
  },
  {
    object: "Contract",
    methods: "PUT",
    path: "/api/contacts/{email}/contracts/{id}",
    note: "Upsert (200).",
  },
  {
    object: "Contract",
    methods: "DELETE",
    path: "/api/contacts/{email}/contracts/{id}",
    note: "Delete contract by id.",
  },
  {
    object: "Attachments",
    methods: "POST",
    path: "/api/contacts/{email}/attachments",
    note: "Upsert attachment (id in body).",
  },
  {
    object: "Attachment",
    methods: "GET",
    path: "/api/contacts/{email}/attachments/{id}",
    note: "Read one attachment JSON.",
  },
  {
    object: "Attachment",
    methods: "POST",
    path: "/api/contacts/{email}/attachments/{id}",
    note: "Upsert (201).",
  },
  {
    object: "Attachment",
    methods: "PUT",
    path: "/api/contacts/{email}/attachments/{id}",
    note: "Upsert (200).",
  },
  {
    object: "Attachment",
    methods: "DELETE",
    path: "/api/contacts/{email}/attachments/{id}",
    note: "Delete attachment by id.",
  },
  {
    object: "Pets",
    methods: "POST",
    path: "/api/contacts/{email}/pets",
    note: "Upsert pet (id, name, species; optional breed, dob, age, gender, neutered, microchip, preExistingConditions[], legacy authorisedContacts, notes).",
  },
  {
    object: "Pet",
    methods: "GET",
    path: "/api/contacts/{email}/pets/{id}",
    note: "Read one pet JSON.",
  },
  {
    object: "Pet",
    methods: "POST",
    path: "/api/contacts/{email}/pets/{id}",
    note: "Upsert (201).",
  },
  {
    object: "Pet",
    methods: "PUT",
    path: "/api/contacts/{email}/pets/{id}",
    note: "Upsert (200).",
  },
  {
    object: "Pet",
    methods: "DELETE",
    path: "/api/contacts/{email}/pets/{id}",
    note: "Delete pet by id.",
  },
  {
    object: "Policies",
    methods: "POST",
    path: "/api/contacts/{email}/policies",
    note: "Upsert policy (id, policyNumber, product, status, startDate, renewalDate, annualPremium, paymentFrequency, monthlyDirectDebit, paymentStatus).",
  },
  {
    object: "Policy",
    methods: "GET",
    path: "/api/contacts/{email}/policies/{id}",
    note: "Read one policy JSON.",
  },
  {
    object: "Policy",
    methods: "POST",
    path: "/api/contacts/{email}/policies/{id}",
    note: "Upsert (201).",
  },
  {
    object: "Policy",
    methods: "PUT",
    path: "/api/contacts/{email}/policies/{id}",
    note: "Upsert (200).",
  },
  {
    object: "Policy",
    methods: "DELETE",
    path: "/api/contacts/{email}/policies/{id}",
    note: "Delete policy by id.",
  },
  {
    object: "Policyholder",
    methods: "GET",
    path: "/api/contacts/{email}/policyholder",
    note: "Single policyholder object per contact (name, dob, email, phone, address, authorisedContacts[]).",
  },
  {
    object: "Policyholder",
    methods: "PUT",
    path: "/api/contacts/{email}/policyholder",
    note: "Replace policyholder; returns full contact.",
  },
  {
    object: "Cover",
    methods: "GET",
    path: "/api/contacts/{email}/cover",
    note: "Limits, excess (fixed + coInsurance text), buckets, exclusions[].",
  },
  {
    object: "Cover",
    methods: "PUT",
    path: "/api/contacts/{email}/cover",
    note: "Replace cover; returns full contact.",
  },
  {
    object: "Claims",
    methods: "POST",
    path: "/api/contacts/{email}/claims",
    note: "Create or upsert claim (id + claimId + amounts + vet + status; stored on claimsHistory).",
  },
  {
    object: "Claim",
    methods: "GET",
    path: "/api/contacts/{email}/claims/{id}",
    note: "Read one claim by stable id.",
  },
  {
    object: "Claim",
    methods: "POST",
    path: "/api/contacts/{email}/claims/{id}",
    note: "Upsert (201); path id merged onto body.",
  },
  {
    object: "Claim",
    methods: "PUT",
    path: "/api/contacts/{email}/claims/{id}",
    note: "Upsert (200).",
  },
  {
    object: "Claim",
    methods: "DELETE",
    path: "/api/contacts/{email}/claims/{id}",
    note: "Remove claim from claimsHistory.",
  },
  {
    object: "Timeline",
    methods: "POST",
    path: "/api/contacts/{email}/timeline",
    note: "Append one timeline event (no id on events).",
  },
  {
    object: "Timeline event",
    methods: "GET",
    path: "/api/contacts/{email}/timeline/{index}",
    note: "Read one event by zero-based index; response { index, event }.",
  },
];

const CUSTOM_LIST_TEMPLATE_ROWS: ApiDocRow[] = [
  {
    object: "Custom list row",
    methods: "POST",
    path: "/api/contacts/{email}/custom-lists/{listId}/rows",
    note: "Append a row. listId = object id from Admin centre (e.g. obj-173…). Body: string map + optional id; server may assign id.",
  },
  {
    object: "Custom list row",
    methods: "GET",
    path: "/api/contacts/{email}/custom-lists/{listId}/rows/{index}",
    note: "Read row by zero-based index; response { listId, index, row }.",
  },
  {
    object: "Custom list row",
    methods: "PUT",
    path: "/api/contacts/{email}/custom-lists/{listId}/rows/{index}",
    note: "Replace row at index; JSON body = full CustomListRow (string keys/values + id). Returns full contact.",
  },
  {
    object: "Custom list row",
    methods: "DELETE",
    path: "/api/contacts/{email}/custom-lists/{listId}/rows/{index}",
    note: "Remove row at index. Returns full contact.",
  },
];

function fieldKeysNote(fieldKeys: string[]): string {
  const preview = fieldKeys.slice(0, 6).join(", ");
  const more = fieldKeys.length > 6 ? "…" : "";
  return fieldKeys.length ? `Fields: ${preview}${more}.` : "Define fields in Admin centre.";
}

/** Per–custom-object rows with concrete listId paths (copy-paste friendly). */
export function buildCustomObjectApiDocRows(
  definitions: readonly CustomObjectDefinition[],
): ApiDocRow[] {
  return definitions.flatMap((d) => {
    const fk = fieldKeysNote(d.fieldKeys);
    return [
      {
        object: `Custom · ${d.title}`,
        methods: "POST",
        path: `/api/contacts/{email}/custom-lists/${d.id}/rows`,
        note: `Append row to this list. ${fk} Returns full contact.`,
      },
      {
        object: `Custom · ${d.title}`,
        methods: "GET",
        path: `/api/contacts/{email}/custom-lists/${d.id}/rows/{index}`,
        note: `Read row by index. ${fk}`,
      },
      {
        object: `Custom · ${d.title}`,
        methods: "PUT",
        path: `/api/contacts/{email}/custom-lists/${d.id}/rows/{index}`,
        note: `Replace row at index. ${fk} Returns full contact.`,
      },
      {
        object: `Custom · ${d.title}`,
        methods: "DELETE",
        path: `/api/contacts/{email}/custom-lists/${d.id}/rows/{index}`,
        note: `Delete row at index. ${fk} Returns full contact.`,
      },
    ];
  });
}

export function buildApiDocumentationRows(
  customObjectDefinitions: readonly CustomObjectDefinition[],
): ApiDocRow[] {
  const custom =
    customObjectDefinitions.length > 0 ?
      buildCustomObjectApiDocRows(customObjectDefinitions)
    : CUSTOM_LIST_TEMPLATE_ROWS;
  const merged = [...STATIC_API_DOC_ROWS, ...custom];
  return merged.map((row) => {
    const exampleJsonBody = exampleJsonBodyForRow(
      row,
      customObjectDefinitions,
    );
    return exampleJsonBody ? { ...row, exampleJsonBody } : { ...row };
  });
}
