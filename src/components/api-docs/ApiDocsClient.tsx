"use client";

import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useDemoConfig } from "@/hooks/useDemoConfig";
import {
  buildCurlCommand,
  expandApiDocPathForCurl,
} from "@/lib/api/apiDocsExampleBodies";
import { buildApiDocumentationRows } from "@/lib/api/apiDocsRows";

function CopyTextButton({
  label,
  text,
  compact,
}: {
  label: string;
  text: string;
  compact?: boolean;
}) {
  const [ok, setOk] = useState(false);
  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setOk(true);
      setTimeout(() => setOk(false), 2000);
    } catch {
      /* ignore */
    }
  }, [text]);
  return (
    <button
      type="button"
      onClick={() => void onCopy()}
      className={`inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-[10px] font-medium text-zinc-700 hover:bg-zinc-50 ${
        compact ? "" : "shrink-0"
      }`}
    >
      {ok ? (
        <Check className="h-3 w-3 text-emerald-600" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {label}
    </button>
  );
}

export function ApiDocsClient({
  token,
  variant = "page",
}: {
  token: string;
  /** `crm` hides standalone nav and fits the CRM workspace panel. */
  variant?: "page" | "crm";
}) {
  const cfg = useDemoConfig();
  const rows = useMemo(
    () => buildApiDocumentationRows(cfg.customObjectDefinitions),
    [cfg.customObjectDefinitions],
  );
  const [curlOrigin, setCurlOrigin] = useState("http://localhost:3000");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurlOrigin(window.location.origin);
    }
  }, []);
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
        <p className="mb-2 text-[11px] text-zinc-600">
          For every <strong>POST</strong>, <strong>PUT</strong>, and{" "}
          <strong>PATCH</strong> row, use the sample <strong>curl</strong> and{" "}
          <strong>JSON body</strong> below (copy buttons). URLs use this origin:{" "}
          <code className="rounded bg-zinc-100 px-1">{curlOrigin}</code> and demo
          contact <code className="rounded bg-zinc-100 px-1">leyton@…</code>{" "}
          (URL-encoded in curl); replace with your values as needed.
        </p>
        <p className="mb-2 text-[11px] leading-relaxed text-zinc-500">
          For cases, properties, quotes, opportunities, orders, inquiries, contracts,
          attachments, pets, policies, claims, work orders, and invoices: use{" "}
          <strong>GET …/&#123;id&#125;</strong> to read one item and{" "}
          <strong>POST</strong> or <strong>PUT</strong> <strong>…/&#123;id&#125;</strong> to upsert
          (path id is merged into the JSON body). <strong>Policyholder</strong> and{" "}
          <strong>cover</strong> are singletons per contact: <strong>GET</strong> and{" "}
          <strong>PUT</strong> only on <code className="rounded bg-zinc-100 px-0.5">…/policyholder</code>{" "}
          and <code className="rounded bg-zinc-100 px-0.5">…/cover</code>.{" "}
          <strong>Custom lists</strong> use <code className="rounded bg-zinc-100 px-0.5">listId</code>{" "}
          from Admin centre; rows support <strong>POST</strong> (append),{" "}
          <strong>GET</strong>/<strong>PUT</strong>/<strong>DELETE</strong> by zero-based{" "}
          <strong>index</strong>. When you define custom objects in Admin, matching endpoint rows
          appear at the bottom of this table.
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
              {rows.map((r, i) => {
                const hasCurl =
                  (r.methods === "POST" ||
                    r.methods === "PUT" ||
                    r.methods === "PATCH") &&
                  r.exampleJsonBody !== undefined;
                const pathEx = expandApiDocPathForCurl(r.path);
                const curlFull =
                  hasCurl ?
                    buildCurlCommand(
                      curlOrigin,
                      token,
                      r.methods,
                      pathEx,
                      r.exampleJsonBody,
                    )
                  : "";
                return (
                  <Fragment key={`${r.methods}-${r.path}-${i}`}>
                    <tr className="border-b border-zinc-100 align-top">
                      <td className="py-2 pr-2 font-medium text-zinc-800">
                        {r.object}
                      </td>
                      <td className="py-2 pr-2 font-mono text-zinc-600">
                        {r.methods}
                      </td>
                      <td className="py-2 pr-2 font-mono text-[10px] text-zinc-800">
                        {r.path}
                      </td>
                      <td className="py-2 text-zinc-600">{r.note}</td>
                    </tr>
                    {hasCurl ? (
                      <tr className="border-b border-zinc-100 bg-zinc-50/90 align-top">
                        <td colSpan={4} className="px-2 py-2">
                          <div className="flex flex-wrap items-center gap-2 pb-1.5">
                            <CopyTextButton label="Copy curl" text={curlFull} />
                            <CopyTextButton
                              label="Copy JSON body"
                              text={r.exampleJsonBody!}
                            />
                          </div>
                          <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-md border border-zinc-200 bg-white p-2 font-mono text-[10px] leading-snug text-zinc-800">
                            {curlFull}
                          </pre>
                          <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                            Body only
                          </p>
                          <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-all rounded-md border border-zinc-200 bg-white p-2 font-mono text-[10px] leading-snug text-zinc-800">
                            {r.exampleJsonBody}
                          </pre>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
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
