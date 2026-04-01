"use client";

import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";

const rows: { object: string; methods: string; path: string; note: string }[] =
  [
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
    {
      object: "Custom list row",
      methods: "POST",
      path: "/api/contacts/{email}/custom-lists/{listId}/rows",
      note: "Append a row (listId = admin object id). Body is field map + optional id.",
    },
    {
      object: "Custom list row",
      methods: "GET",
      path: "/api/contacts/{email}/custom-lists/{listId}/rows/{index}",
      note: "Read row by zero-based index; response { listId, index, row }.",
    },
  ];

export function ApiDocsClient({
  token,
  variant = "page",
}: {
  token: string;
  /** `crm` hides standalone nav and fits the CRM workspace panel. */
  variant?: "page" | "crm";
}) {
  const [copied, setCopied] = useState(false);

  const copyToken = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [token]);

  const shell =
    variant === "crm"
      ? "mx-auto max-w-full space-y-5 text-[13px] text-zinc-700"
      : "mx-auto max-w-full space-y-5 p-3 pb-12 text-[13px] text-zinc-700 sm:p-4 md:max-w-4xl lg:max-w-5xl lg:p-6";

  return (
    <div className={shell}>
      {variant === "page" ? (
        <Link
          href="/"
          className="inline-block text-[12px] font-medium text-[var(--secondary-color)]"
        >
          ← Dashboard
        </Link>
      ) : null}
      <h1 className="text-[17px] font-bold text-zinc-900">API documentation</h1>

      <section className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
        <h2 className="text-[13px] font-semibold text-zinc-900">
          Demo API token (full access)
        </h2>
        <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
          Use this bearer token on every request. It does not rotate in this demo
          app. Override with{" "}
          <code className="rounded bg-zinc-100 px-1">NEXT_PUBLIC_DEMO_API_TOKEN</code>{" "}
          in Vercel env for your own secret.
        </p>
        <div className="mt-2 flex items-start gap-2">
          <code className="flex-1 break-all rounded-lg bg-zinc-100 px-2 py-2 font-mono text-[11px] text-zinc-800">
            {token}
          </code>
          <button
            type="button"
            onClick={() => void copyToken()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            aria-label="Copy token"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="mt-2 font-mono text-[11px] text-zinc-600">
          Authorization: Bearer &lt;token&gt;
        </p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
        <h2 className="mb-2 text-[13px] font-semibold text-zinc-900">
          Endpoints by object (GET/POST per record)
        </h2>
        <p className="mb-2 text-[11px] leading-relaxed text-zinc-500">
          For cases, properties, quotes, inquiries, contracts, attachments, work orders, and
          invoices: use <strong>GET …/&#123;id&#125;</strong> to read one item and{" "}
          <strong>POST</strong> or <strong>PUT</strong> <strong>…/&#123;id&#125;</strong> to upsert
          (path id is merged into the JSON body). <strong>Cases</strong> use the same pattern.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[11px]">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="py-2 pr-2 font-medium">Object</th>
                <th className="py-2 pr-2 font-medium">HTTP</th>
                <th className="py-2 pr-2 font-medium">Path</th>
                <th className="py-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-zinc-100 align-top">
                  <td className="py-2 pr-2 font-medium text-zinc-800">
                    {r.object}
                  </td>
                  <td className="py-2 pr-2 font-mono text-zinc-600">{r.methods}</td>
                  <td className="py-2 pr-2 font-mono text-[10px] text-zinc-800">
                    {r.path}
                  </td>
                  <td className="py-2 text-zinc-600">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-[11px] text-zinc-500">
        OpenAPI:{" "}
        <a
          href="/openapi.yaml"
          className="font-medium text-[var(--brand-color)] underline"
          target="_blank"
          rel="noreferrer"
        >
          /openapi.yaml
        </a>
        · Human guide: <code className="rounded bg-zinc-100 px-1">API.md</code> in
        the repo (update curl with{" "}
        <code className="rounded bg-zinc-100 px-1">-H &quot;Authorization: Bearer …&quot;</code>
        ).
      </p>
    </div>
  );
}
