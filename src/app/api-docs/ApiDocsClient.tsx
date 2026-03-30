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
      note: "Create or upsert; path id is applied to body (same rules as PUT).",
    },
    {
      object: "Work order",
      methods: "PUT",
      path: "/api/contacts/{email}/work-orders/{id}",
      note: "Upsert work order; path id must match body id.",
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
      methods: "PUT",
      path: "/api/contacts/{email}/invoices/{id}",
      note: "Upsert invoice; path id must match body id.",
    },
    {
      object: "Invoice",
      methods: "DELETE",
      path: "/api/contacts/{email}/invoices/{id}",
      note: "Delete invoice by id.",
    },
  ];

export function ApiDocsClient({ token }: { token: string }) {
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

  return (
    <div className="space-y-5 p-3 pb-12 text-[13px] text-zinc-700">
      <Link href="/" className="text-[12px] font-medium text-[var(--secondary-color)]">
        ← Dashboard
      </Link>
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
          CRUD endpoints by object
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[280px] border-collapse text-left text-[11px]">
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
