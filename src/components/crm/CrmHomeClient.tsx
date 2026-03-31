"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Building2,
  ChevronLeft,
  LayoutGrid,
  Loader2,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Trash2,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ApiDocsClient } from "@/components/api-docs/ApiDocsClient";
import { AdminCentre } from "@/components/crm/AdminCentre";
import { CustomListsEditor } from "@/components/crm/CustomListsEditor";
import { demoApiAuthHeaders } from "@/lib/api/demoFetchHeaders";
import { getDemoApiToken } from "@/lib/demoApiToken";
import { useDemoConfig } from "@/hooks/useDemoConfig";
import { emptyContact } from "@/lib/crm/emptyContact";
import type { ContactData } from "@/types/contact";

const jsonAuth = (): HeadersInit => ({
  ...demoApiAuthHeaders(),
  "Content-Type": "application/json",
});

type TabId =
  | "account"
  | "properties"
  | "workOrders"
  | "invoices"
  | "quotes"
  | "cases"
  | "contracts"
  | "timeline"
  | "attachments"
  | "inquiries"
  | "customLists";

const BASE_TABS: { id: TabId; label: string }[] = [
  { id: "account", label: "Account" },
  { id: "properties", label: "Properties" },
  { id: "workOrders", label: "Work orders" },
  { id: "invoices", label: "Invoices" },
  { id: "quotes", label: "Quotes" },
  { id: "cases", label: "Cases" },
  { id: "contracts", label: "Contracts" },
  { id: "timeline", label: "Timeline" },
  { id: "attachments", label: "Attachments" },
  { id: "inquiries", label: "Inquiries" },
];

function Modal({
  open,
  title,
  children,
  footer,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  footer: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crm-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="crm-modal-title"
          className="text-lg font-semibold tracking-tight text-zinc-900"
        >
          {title}
        </h2>
        <div className="mt-4 space-y-3 text-[13px]">{children}</div>
        <div className="mt-6 flex justify-end gap-2 border-t border-zinc-100 pt-4">
          {footer}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function inputClass(disabled?: boolean) {
  return `w-full rounded-lg border border-zinc-200 px-3 py-2 text-[13px] outline-none transition focus:border-[var(--brand-color)] focus:ring-2 focus:ring-[var(--brand-color)]/20 ${
    disabled ? "cursor-not-allowed bg-zinc-50 text-zinc-500" : "bg-white"
  }`;
}

export function CrmHomeClient() {
  const cfg = useDemoConfig();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [workspace, setWorkspace] = useState<"accounts" | "admin" | "api">(
    "accounts",
  );
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [contact, setContact] = useState<ContactData | null>(null);
  const [tab, setTab] = useState<TabId>("account");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    kind: "newAccount" | "edit";
    recordKey?: string;
    index?: number;
    draft: Record<string, string>;
  } | null>(null);

  const enc = (e: string) => encodeURIComponent(e);

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "admin") setWorkspace("admin");
    else if (t === "api") setWorkspace("api");
    else setWorkspace("accounts");
  }, [searchParams]);

  useEffect(() => {
    if (tab === "customLists" && cfg.customObjectDefinitions.length === 0) {
      setTab("account");
    }
  }, [tab, cfg.customObjectDefinitions.length]);

  const setWorkspaceRoute = useCallback(
    (w: "accounts" | "admin" | "api") => {
      setWorkspace(w);
      const path = "/crm";
      if (w === "admin") router.replace(`${path}?tab=admin`);
      else if (w === "api") router.replace(`${path}?tab=api`);
      else router.replace(path);
    },
    [router],
  );

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }, []);

  const refreshList = useCallback(async () => {
    const res = await fetch("/api/contacts?full=1", {
      headers: demoApiAuthHeaders(),
    });
    if (!res.ok) throw new Error("list");
    const data = (await res.json()) as { contacts: ContactData[] };
    setContacts(data.contacts ?? []);
    return data.contacts ?? [];
  }, []);

  const loadOne = useCallback(async (email: string) => {
    const res = await fetch(`/api/contacts/${enc(email)}`, {
      headers: demoApiAuthHeaders(),
    });
    if (!res.ok) throw new Error("one");
    const c = (await res.json()) as ContactData;
    setContact(c);
    return c;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await refreshList();
      } catch {
        if (!cancelled) showToast("Could not load accounts.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshList, showToast]);

  useEffect(() => {
    if (!selectedEmail) {
      setContact(null);
      return;
    }
    let cancelled = false;
    void loadOne(selectedEmail).catch(() => {
      if (!cancelled) showToast("Could not load account.");
    });
    return () => {
      cancelled = true;
    };
  }, [selectedEmail, loadOne, showToast]);

  const mergeContactInList = useCallback((c: ContactData) => {
    setContacts((prev) => {
      const i = prev.findIndex(
        (x) => x.email.toLowerCase() === c.email.toLowerCase(),
      );
      if (i < 0) return [...prev, c];
      const next = [...prev];
      next[i] = c;
      return next;
    });
    setContact(c);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q),
    );
  }, [contacts, search]);

  const crmTabs = useMemo(() => {
    if (cfg.customObjectDefinitions.length === 0) return BASE_TABS;
    return [
      ...BASE_TABS,
      { id: "customLists" as TabId, label: "Custom lists" },
    ];
  }, [cfg.customObjectDefinitions.length]);

  const saveAccount = async () => {
    if (!contact) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/contacts/${enc(contact.email)}`, {
        method: "PATCH",
        headers: jsonAuth(),
        body: JSON.stringify({
          name: contact.name,
          company: contact.company,
          role: contact.role,
          segment: contact.segment,
          tags: contact.tags,
        }),
      });
      if (!res.ok) throw new Error("patch");
      const next = (await res.json()) as ContactData;
      mergeContactInList(next);
      showToast("Account saved.");
    } catch {
      showToast("Save failed.");
    } finally {
      setBusy(false);
    }
  };

  const deleteAccount = async () => {
    if (!contact) return;
    if (
      !window.confirm(
        `Delete ${contact.name} and all nested records? This cannot be undone.`,
      )
    )
      return;
    setBusy(true);
    try {
      const res = await fetch(`/api/contacts/${enc(contact.email)}`, {
        method: "DELETE",
        headers: demoApiAuthHeaders(),
      });
      if (!res.ok) throw new Error("del");
      setSelectedEmail(null);
      setContact(null);
      await refreshList();
      showToast("Account removed.");
    } catch {
      showToast("Delete failed.");
    } finally {
      setBusy(false);
    }
  };

  const patchArrays = async <K extends keyof ContactData>(
    key: K,
    value: ContactData[K],
  ) => {
    if (!contact) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/contacts/${enc(contact.email)}`, {
        method: "PATCH",
        headers: jsonAuth(),
        body: JSON.stringify({ [key]: value }),
      });
      if (!res.ok) throw new Error("patch");
      const next = (await res.json()) as ContactData;
      mergeContactInList(next);
      showToast("Saved.");
    } catch {
      showToast("Save failed.");
    } finally {
      setBusy(false);
    }
  };

  const submitNewAccount = async (email: string, name: string) => {
    setBusy(true);
    try {
      const body = emptyContact(email, name);
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: jsonAuth(),
        body: JSON.stringify(body),
      });
      if (res.status === 409) {
        showToast("An account with that email already exists.");
        return;
      }
      if (!res.ok) throw new Error("post");
      const created = (await res.json()) as ContactData;
      await refreshList();
      setSelectedEmail(created.email);
      setTab("account");
      setModal(null);
      showToast("Account created.");
    } catch {
      showToast("Could not create account.");
    } finally {
      setBusy(false);
    }
  };

  const openNewAccount = () =>
    setModal({
      kind: "newAccount",
      draft: { email: "", name: "" },
    });

  /* ——— Work order / invoice via nested API ——— */
  const saveWorkOrder = async (body: Record<string, string>, existingId?: string) => {
    if (!contact) return;
    const id = (existingId ?? body.id ?? "").trim();
    if (!id) {
      showToast("Work order id required.");
      return;
    }
    const payload = {
      id,
      title: body.title || "Untitled",
      type: body.type || "maintenance",
      status: body.status || "scheduled",
      scheduledFor: body.scheduledFor || undefined,
      propertyId: body.propertyId || undefined,
    };
    setBusy(true);
    try {
      const url = existingId
        ? `/api/contacts/${enc(contact.email)}/work-orders/${enc(id)}`
        : `/api/contacts/${enc(contact.email)}/work-orders`;
      const res = await fetch(url, {
        method: existingId ? "PUT" : "POST",
        headers: jsonAuth(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("wo");
      const next = (await res.json()) as ContactData;
      mergeContactInList(next);
      setModal(null);
      showToast("Work order saved.");
    } catch {
      showToast("Could not save work order.");
    } finally {
      setBusy(false);
    }
  };

  const deleteWorkOrder = async (id: string) => {
    if (!contact) return;
    if (!window.confirm("Remove this work order?")) return;
    setBusy(true);
    try {
      const res = await fetch(
        `/api/contacts/${enc(contact.email)}/work-orders/${enc(id)}`,
        { method: "DELETE", headers: demoApiAuthHeaders() },
      );
      if (!res.ok) throw new Error("wod");
      const next = (await res.json()) as ContactData;
      mergeContactInList(next);
      showToast("Removed.");
    } catch {
      showToast("Delete failed.");
    } finally {
      setBusy(false);
    }
  };

  const saveInvoice = async (body: Record<string, string>, existingId?: string) => {
    if (!contact) return;
    const id = (existingId ?? body.id ?? "").trim();
    if (!id) {
      showToast("Invoice id required.");
      return;
    }
    const payload = {
      id,
      reference: body.reference || `REF-${id}`,
      amount: Number(body.amount) || 0,
      currency: body.currency || "GBP",
      status: body.status || "draft",
      dueDate: body.dueDate || undefined,
      title: body.title || undefined,
      propertySummary: body.propertySummary || undefined,
      category: body.category || undefined,
    };
    setBusy(true);
    try {
      const url = existingId
        ? `/api/contacts/${enc(contact.email)}/invoices/${enc(id)}`
        : `/api/contacts/${enc(contact.email)}/invoices`;
      const res = await fetch(url, {
        method: existingId ? "PUT" : "POST",
        headers: jsonAuth(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("inv");
      const next = (await res.json()) as ContactData;
      mergeContactInList(next);
      setModal(null);
      showToast("Invoice saved.");
    } catch {
      showToast("Could not save invoice.");
    } finally {
      setBusy(false);
    }
  };

  const deleteInvoice = async (id: string) => {
    if (!contact) return;
    if (!window.confirm("Remove this invoice?")) return;
    setBusy(true);
    try {
      const res = await fetch(
        `/api/contacts/${enc(contact.email)}/invoices/${enc(id)}`,
        { method: "DELETE", headers: demoApiAuthHeaders() },
      );
      if (!res.ok) throw new Error("invd");
      const next = (await res.json()) as ContactData;
      mergeContactInList(next);
      showToast("Removed.");
    } catch {
      showToast("Delete failed.");
    } finally {
      setBusy(false);
    }
  };

  const renderTable = (
    rows: Record<string, unknown>[],
    cols: { key: string; label: string }[],
    onEdit: (row: Record<string, unknown>, i: number) => void,
    onDelete: (row: Record<string, unknown>, i: number) => void,
    addLabel: string,
    onAdd: () => void,
  ) => (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
        <span className="text-[12px] font-medium text-zinc-500">
          {rows.length} record{rows.length === 1 ? "" : "s"}
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand-color)] px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:opacity-95"
        >
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              {cols.map((c) => (
                <th key={c.key} className="px-4 py-2.5">
                  {c.label}
                </th>
              ))}
              <th className="w-24 px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={cols.length + 1}
                  className="px-4 py-10 text-center text-zinc-500"
                >
                  No rows yet. Add one to sync with the Front plugin.
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={String(row.id ?? i)}
                  className="border-b border-zinc-50 hover:bg-zinc-50/50"
                >
                  {cols.map((c) => (
                    <td key={c.key} className="max-w-[200px] truncate px-4 py-2.5">
                      {String(row[c.key] ?? "—")}
                    </td>
                  ))}
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      className="mr-1 inline-flex rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                      aria-label="Edit"
                      onClick={() => onEdit(row, i)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex rounded-md p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600"
                      aria-label="Delete"
                      onClick={() => onDelete(row, i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const tabPanel = () => {
    if (!contact) return null;
    switch (tab) {
      case "account":
        return (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-2">
              <h3 className="text-sm font-semibold text-zinc-900">
                Company & role
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name">
                  <input
                    className={inputClass()}
                    value={contact.name}
                    onChange={(e) =>
                      setContact({ ...contact, name: e.target.value })
                    }
                  />
                </Field>
                <Field label="Email">
                  <input
                    className={inputClass(true)}
                    readOnly
                    value={contact.email}
                  />
                </Field>
                <Field label="Company">
                  <input
                    className={inputClass()}
                    value={contact.company}
                    onChange={(e) =>
                      setContact({ ...contact, company: e.target.value })
                    }
                  />
                </Field>
                <Field label="Role">
                  <input
                    className={inputClass()}
                    value={contact.role}
                    onChange={(e) =>
                      setContact({ ...contact, role: e.target.value })
                    }
                  />
                </Field>
                <Field label="Segment">
                  <input
                    className={inputClass()}
                    value={contact.segment}
                    onChange={(e) =>
                      setContact({ ...contact, segment: e.target.value })
                    }
                  />
                </Field>
                <Field label="Tags (comma-separated)">
                  <input
                    className={inputClass()}
                    value={contact.tags.join(", ")}
                    onChange={(e) =>
                      setContact({
                        ...contact,
                        tags: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </Field>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void saveAccount()}
                  className="rounded-lg bg-[var(--brand-color)] px-4 py-2 text-[13px] font-semibold text-white shadow-sm disabled:opacity-50"
                >
                  Save account
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void deleteAccount()}
                  className="rounded-lg border border-red-200 px-4 py-2 text-[13px] font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  Delete account
                </button>
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50/80 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-zinc-900">Snapshot</h3>
              <dl className="mt-4 space-y-3 text-[13px]">
                <div className="flex justify-between gap-2">
                  <dt className="text-zinc-500">Properties</dt>
                  <dd className="font-medium">{contact.properties.length}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-zinc-500">Work orders</dt>
                  <dd className="font-medium">{contact.workOrders.length}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-zinc-500">Invoices</dt>
                  <dd className="font-medium">{contact.invoices.length}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-zinc-500">Quotes</dt>
                  <dd className="font-medium">{contact.quotes.length}</dd>
                </div>
              </dl>
              <p className="mt-6 text-[11px] leading-relaxed text-zinc-500">
                Data is stored on this host (see API docs). The sidebar plugin
                reads the same records for matching conversation emails.
              </p>
            </div>
          </div>
        );
      case "properties":
        return renderTable(
          contact.properties as unknown as Record<string, unknown>[],
          [
            { key: "id", label: "ID" },
            { key: "address", label: "Address" },
            { key: "city", label: "City" },
            { key: "status", label: "Status" },
          ],
          (row, i) =>
            setModal({
              kind: "edit",
              recordKey: "property",
              index: i,
              draft: {
                id: String(row.id ?? ""),
                address: String(row.address ?? ""),
                city: String(row.city ?? ""),
                postcode: String(row.postcode ?? ""),
                status: String(row.status ?? "active"),
                rentMonthly: String(row.rentMonthly ?? ""),
                notes: String(row.notes ?? ""),
              },
            }),
          (row, i) => {
            const next = contact.properties.filter((_, j) => j !== i);
            void patchArrays("properties", next);
          },
          "Add property",
          () =>
            setModal({
              kind: "edit",
              recordKey: "property",
              draft: {
                id: `p-${Date.now()}`,
                address: "",
                city: "",
                postcode: "",
                status: "active",
                rentMonthly: "",
                notes: "",
              },
            }),
        );
      case "workOrders":
        return renderTable(
          contact.workOrders as unknown as Record<string, unknown>[],
          [
            { key: "id", label: "ID" },
            { key: "title", label: "Title" },
            { key: "type", label: "Type" },
            { key: "status", label: "Status" },
          ],
          (row) =>
            setModal({
              kind: "edit",
              recordKey: "workOrder",
              draft: {
                id: String(row.id ?? ""),
                title: String(row.title ?? ""),
                type: String(row.type ?? "maintenance"),
                status: String(row.status ?? "scheduled"),
                scheduledFor: String(row.scheduledFor ?? ""),
                propertyId: String(row.propertyId ?? ""),
              },
            }),
          (row) => void deleteWorkOrder(String(row.id)),
          "Add work order",
          () =>
            setModal({
              kind: "edit",
              recordKey: "workOrder",
              draft: {
                id: `wo-${Date.now()}`,
                title: "",
                type: "maintenance",
                status: "scheduled",
                scheduledFor: "",
                propertyId: "",
              },
            }),
        );
      case "invoices":
        return renderTable(
          contact.invoices as unknown as Record<string, unknown>[],
          [
            { key: "reference", label: "Ref" },
            { key: "title", label: "Title" },
            { key: "amount", label: "Amount" },
            { key: "status", label: "Status" },
          ],
          (row) =>
            setModal({
              kind: "edit",
              recordKey: "invoice",
              draft: {
                id: String(row.id ?? ""),
                reference: String(row.reference ?? ""),
                title: String(row.title ?? ""),
                amount: String(row.amount ?? "0"),
                currency: String(row.currency ?? "GBP"),
                status: String(row.status ?? "draft"),
                dueDate: String(row.dueDate ?? ""),
                propertySummary: String(row.propertySummary ?? ""),
                category: String(row.category ?? ""),
              },
            }),
          (row) => void deleteInvoice(String(row.id)),
          "Add invoice",
          () =>
            setModal({
              kind: "edit",
              recordKey: "invoice",
              draft: {
                id: `inv-${Date.now()}`,
                reference: "",
                title: "",
                amount: "0",
                currency: "GBP",
                status: "draft",
                dueDate: "",
                propertySummary: "",
                category: "",
              },
            }),
        );
      case "quotes":
        return renderTable(
          contact.quotes as unknown as Record<string, unknown>[],
          [
            { key: "title", label: "Title" },
            { key: "amount", label: "Amount" },
            { key: "status", label: "Status" },
          ],
          (row, i) =>
            setModal({
              kind: "edit",
              recordKey: "quote",
              index: i,
              draft: {
                id: String(row.id ?? ""),
                title: String(row.title ?? ""),
                amount: String(row.amount ?? ""),
                currency: String(row.currency ?? "GBP"),
                status: String(row.status ?? "pending"),
                validUntil: String(row.validUntil ?? ""),
              },
            }),
          (row, i) => {
            const next = contact.quotes.filter((_, j) => j !== i);
            void patchArrays("quotes", next);
          },
          "Add quote",
          () =>
            setModal({
              kind: "edit",
              recordKey: "quote",
              draft: {
                id: `q-${Date.now()}`,
                title: "",
                amount: "0",
                currency: "GBP",
                status: "pending",
                validUntil: "",
              },
            }),
        );
      case "cases":
        return renderTable(
          contact.cases as unknown as Record<string, unknown>[],
          [
            { key: "subject", label: "Subject" },
            { key: "status", label: "Status" },
            { key: "openedAt", label: "Opened" },
          ],
          (row, i) =>
            setModal({
              kind: "edit",
              recordKey: "case",
              index: i,
              draft: {
                id: String(row.id ?? ""),
                subject: String(row.subject ?? ""),
                status: String(row.status ?? "open"),
                openedAt: String(row.openedAt ?? ""),
                priority: String(row.priority ?? "medium"),
              },
            }),
          (row, i) => {
            const next = contact.cases.filter((_, j) => j !== i);
            void patchArrays("cases", next);
          },
          "Add case",
          () =>
            setModal({
              kind: "edit",
              recordKey: "case",
              draft: {
                id: `c-${Date.now()}`,
                subject: "",
                status: "open",
                openedAt: new Date().toISOString().slice(0, 10),
                priority: "medium",
              },
            }),
        );
      case "contracts":
        return renderTable(
          contact.contracts as unknown as Record<string, unknown>[],
          [
            { key: "title", label: "Title" },
            { key: "type", label: "Type" },
            { key: "status", label: "Status" },
          ],
          (row, i) =>
            setModal({
              kind: "edit",
              recordKey: "contract",
              index: i,
              draft: {
                id: String(row.id ?? ""),
                title: String(row.title ?? ""),
                type: String(row.type ?? "lease"),
                status: String(row.status ?? "active"),
                startDate: String(row.startDate ?? ""),
                endDate: String(row.endDate ?? ""),
              },
            }),
          (row, i) => {
            const next = contact.contracts.filter((_, j) => j !== i);
            void patchArrays("contracts", next);
          },
          "Add contract",
          () =>
            setModal({
              kind: "edit",
              recordKey: "contract",
              draft: {
                id: `ct-${Date.now()}`,
                title: "",
                type: "lease",
                status: "active",
                startDate: new Date().toISOString().slice(0, 10),
                endDate: "",
              },
            }),
        );
      case "timeline":
        return renderTable(
          contact.timeline as unknown as Record<string, unknown>[],
          [
            { key: "type", label: "Type" },
            { key: "title", label: "Title" },
            { key: "date", label: "Date" },
          ],
          (row, i) =>
            setModal({
              kind: "edit",
              recordKey: "timeline",
              index: i,
              draft: {
                id: String(row.id ?? ""),
                type: String(row.type ?? "note"),
                title: String(row.title ?? ""),
                date: String(row.date ?? ""),
                detail: String(row.detail ?? ""),
              },
            }),
          (row, i) => {
            const next = contact.timeline.filter((_, j) => j !== i);
            void patchArrays("timeline", next);
          },
          "Add event",
          () =>
            setModal({
              kind: "edit",
              recordKey: "timeline",
              draft: {
                id: `t-${Date.now()}`,
                type: "note",
                title: "",
                date: new Date().toISOString(),
                detail: "",
              },
            }),
        );
      case "attachments":
        return renderTable(
          contact.attachments as unknown as Record<string, unknown>[],
          [
            { key: "name", label: "Name" },
            { key: "category", label: "Category" },
            { key: "uploadedAt", label: "Uploaded" },
          ],
          (row, i) =>
            setModal({
              kind: "edit",
              recordKey: "attachment",
              index: i,
              draft: {
                id: String(row.id ?? ""),
                name: String(row.name ?? ""),
                category: String(row.category ?? ""),
                uploadedAt: String(row.uploadedAt ?? ""),
                url: String(row.url ?? ""),
              },
            }),
          (row, i) => {
            const next = contact.attachments.filter((_, j) => j !== i);
            void patchArrays("attachments", next);
          },
          "Add attachment",
          () =>
            setModal({
              kind: "edit",
              recordKey: "attachment",
              draft: {
                id: `a-${Date.now()}`,
                name: "",
                category: "General",
                uploadedAt: new Date().toISOString().slice(0, 10),
                url: "",
              },
            }),
        );
      case "inquiries":
        return renderTable(
          contact.inquiries as unknown as Record<string, unknown>[],
          [
            { key: "subject", label: "Subject" },
            { key: "date", label: "Date" },
            { key: "channel", label: "Channel" },
          ],
          (row, i) =>
            setModal({
              kind: "edit",
              recordKey: "inquiry",
              index: i,
              draft: {
                id: String(row.id ?? ""),
                subject: String(row.subject ?? ""),
                date: String(row.date ?? ""),
                channel: String(row.channel ?? "Email"),
              },
            }),
          (row, i) => {
            const next = contact.inquiries.filter((_, j) => j !== i);
            void patchArrays("inquiries", next);
          },
          "Add inquiry",
          () =>
            setModal({
              kind: "edit",
              recordKey: "inquiry",
              draft: {
                id: `in-${Date.now()}`,
                subject: "",
                date: new Date().toISOString().slice(0, 10),
                channel: "Email",
              },
            }),
        );
      case "customLists":
        return (
          <CustomListsEditor
            contact={contact}
            definitions={cfg.customObjectDefinitions}
            onUpdated={(c) => mergeContactInList(c)}
          />
        );
      default:
        return null;
    }
  };

  const submitModal = () => {
    if (!modal || !contact) return;
    const { kind, recordKey, index, draft } = modal;
    if (kind === "newAccount") {
      void submitNewAccount(draft.email, draft.name);
      return;
    }
    if (recordKey === "property") {
      const prop = {
        id: draft.id,
        address: draft.address,
        city: draft.city,
        postcode: draft.postcode,
        status: draft.status as "active" | "pending" | "completed",
        rentMonthly: draft.rentMonthly ? Number(draft.rentMonthly) : undefined,
        notes: draft.notes || undefined,
      };
      const list = [...contact.properties];
      if (index !== undefined) list[index] = prop;
      else list.push(prop);
      void patchArrays("properties", list);
      setModal(null);
      return;
    }
    if (recordKey === "workOrder") {
      const isEdit = contact.workOrders.some((w) => w.id === draft.id);
      void saveWorkOrder(draft, isEdit ? draft.id : undefined);
      return;
    }
    if (recordKey === "invoice") {
      const isEdit = contact.invoices.some((inv) => inv.id === draft.id);
      void saveInvoice(draft, isEdit ? draft.id : undefined);
      return;
    }
    if (recordKey === "quote") {
      const q = {
        id: draft.id,
        title: draft.title,
        amount: Number(draft.amount) || 0,
        currency: draft.currency,
        status: draft.status as "pending" | "accepted" | "expired",
        validUntil: draft.validUntil || undefined,
      };
      const list = [...contact.quotes];
      if (index !== undefined) list[index] = q;
      else list.push(q);
      void patchArrays("quotes", list);
      setModal(null);
      return;
    }
    if (recordKey === "case") {
      const c = {
        id: draft.id,
        subject: draft.subject,
        status: draft.status as "open" | "in_progress" | "resolved",
        openedAt: draft.openedAt,
        priority: draft.priority as "low" | "medium" | "high" | undefined,
      };
      const list = [...contact.cases];
      if (index !== undefined) list[index] = c;
      else list.push(c);
      void patchArrays("cases", list);
      setModal(null);
      return;
    }
    if (recordKey === "contract") {
      const c = {
        id: draft.id,
        title: draft.title,
        type: draft.type as ContactData["contracts"][number]["type"],
        status: draft.status as ContactData["contracts"][number]["status"],
        startDate: draft.startDate,
        endDate: draft.endDate || undefined,
      };
      const list = [...contact.contracts];
      if (index !== undefined) list[index] = c;
      else list.push(c);
      void patchArrays("contracts", list);
      setModal(null);
      return;
    }
    if (recordKey === "timeline") {
      const t = {
        id: draft.id,
        type: draft.type as ContactData["timeline"][number]["type"],
        title: draft.title,
        date: draft.date,
        detail: draft.detail || undefined,
      };
      const list = [...contact.timeline];
      if (index !== undefined) list[index] = t;
      else list.push(t);
      void patchArrays("timeline", list);
      setModal(null);
      return;
    }
    if (recordKey === "attachment") {
      const a = {
        id: draft.id,
        name: draft.name,
        category: draft.category,
        uploadedAt: draft.uploadedAt,
        url: draft.url || undefined,
      };
      const list = [...contact.attachments];
      if (index !== undefined) list[index] = a;
      else list.push(a);
      void patchArrays("attachments", list);
      setModal(null);
      return;
    }
    if (recordKey === "inquiry") {
      const q = {
        id: draft.id,
        subject: draft.subject,
        date: draft.date,
        channel: draft.channel,
      };
      const list = [...contact.inquiries];
      if (index !== undefined) list[index] = q;
      else list.push(q);
      void patchArrays("inquiries", list);
      setModal(null);
    }
  };

  const modalBody = () => {
    if (!modal) return null;
    if (modal.kind === "newAccount") {
      return (
        <>
          <Field label="Email">
            <input
              className={inputClass()}
              type="email"
              value={modal.draft.email}
              onChange={(e) =>
                setModal({ ...modal, draft: { ...modal.draft, email: e.target.value } })
              }
            />
          </Field>
          <Field label="Display name">
            <input
              className={inputClass()}
              value={modal.draft.name}
              onChange={(e) =>
                setModal({ ...modal, draft: { ...modal.draft, name: e.target.value } })
              }
            />
          </Field>
        </>
      );
    }
    const d = modal.draft;
    switch (modal.recordKey) {
      case "property":
        return (
          <>
            <Field label="ID">
              <input
                className={inputClass(modal.index !== undefined)}
                readOnly={modal.index !== undefined}
                value={d.id}
                onChange={(e) =>
                  setModal({ ...modal, draft: { ...d, id: e.target.value } })
                }
              />
            </Field>
            <Field label="Address">
              <input
                className={inputClass()}
                value={d.address}
                onChange={(e) =>
                  setModal({
                    ...modal,
                    draft: { ...d, address: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="City">
              <input
                className={inputClass()}
                value={d.city}
                onChange={(e) =>
                  setModal({ ...modal, draft: { ...d, city: e.target.value } })
                }
              />
            </Field>
            <Field label="Postcode">
              <input
                className={inputClass()}
                value={d.postcode}
                onChange={(e) =>
                  setModal({
                    ...modal,
                    draft: { ...d, postcode: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Status">
              <select
                className={inputClass()}
                value={d.status}
                onChange={(e) =>
                  setModal({ ...modal, draft: { ...d, status: e.target.value } })
                }
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </Field>
            <Field label="Rent (monthly)">
              <input
                type="number"
                className={inputClass()}
                value={d.rentMonthly}
                onChange={(e) =>
                  setModal({
                    ...modal,
                    draft: { ...d, rentMonthly: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Notes">
              <textarea
                className={`${inputClass()} min-h-[72px]`}
                value={d.notes}
                onChange={(e) =>
                  setModal({ ...modal, draft: { ...d, notes: e.target.value } })
                }
              />
            </Field>
          </>
        );
      case "workOrder":
        return (
          <>
            <Field label="ID">
              <input
                className={inputClass(
                  contact ? contact.workOrders.some((w) => w.id === d.id) : false,
                )}
                readOnly={
                  contact ? contact.workOrders.some((w) => w.id === d.id) : false
                }
                value={d.id}
                onChange={(e) =>
                  setModal({ ...modal, draft: { ...d, id: e.target.value } })
                }
              />
            </Field>
            <Field label="Title">
              <input
                className={inputClass()}
                value={d.title}
                onChange={(e) =>
                  setModal({ ...modal, draft: { ...d, title: e.target.value } })
                }
              />
            </Field>
            <Field label="Type">
              <select
                className={inputClass()}
                value={d.type}
                onChange={(e) =>
                  setModal({ ...modal, draft: { ...d, type: e.target.value } })
                }
              >
                <option value="maintenance">Maintenance</option>
                <option value="repair">Repair</option>
                <option value="inspection">Inspection</option>
                <option value="cleaning">Cleaning</option>
              </select>
            </Field>
            <Field label="Status">
              <select
                className={inputClass()}
                value={d.status}
                onChange={(e) =>
                  setModal({ ...modal, draft: { ...d, status: e.target.value } })
                }
              >
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </Field>
            <Field label="Scheduled for">
              <input
                className={inputClass()}
                value={d.scheduledFor}
                onChange={(e) =>
                  setModal({
                    ...modal,
                    draft: { ...d, scheduledFor: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Property ID">
              <input
                className={inputClass()}
                value={d.propertyId}
                onChange={(e) =>
                  setModal({
                    ...modal,
                    draft: { ...d, propertyId: e.target.value },
                  })
                }
              />
            </Field>
          </>
        );
      case "invoice":
        return (
          <>
            <Field label="ID">
              <input
                className={inputClass(
                  contact?.invoices.some((i) => i.id === d.id) ?? false,
                )}
                readOnly={contact?.invoices.some((i) => i.id === d.id)}
                value={d.id}
                onChange={(e) =>
                  setModal({ ...modal, draft: { ...d, id: e.target.value } })
                }
              />
            </Field>
            <Field label="Reference">
              <input
                className={inputClass()}
                value={d.reference}
                onChange={(e) =>
                  setModal({
                    ...modal,
                    draft: { ...d, reference: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Title">
              <input
                className={inputClass()}
                value={d.title}
                onChange={(e) =>
                  setModal({ ...modal, draft: { ...d, title: e.target.value } })
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Amount">
                <input
                  type="number"
                  className={inputClass()}
                  value={d.amount}
                  onChange={(e) =>
                    setModal({
                      ...modal,
                      draft: { ...d, amount: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Currency">
                <input
                  className={inputClass()}
                  value={d.currency}
                  onChange={(e) =>
                    setModal({
                      ...modal,
                      draft: { ...d, currency: e.target.value },
                    })
                  }
                />
              </Field>
            </div>
            <Field label="Status">
              <select
                className={inputClass()}
                value={d.status}
                onChange={(e) =>
                  setModal({ ...modal, draft: { ...d, status: e.target.value } })
                }
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </Field>
            <Field label="Due date">
              <input
                className={inputClass()}
                value={d.dueDate}
                onChange={(e) =>
                  setModal({ ...modal, draft: { ...d, dueDate: e.target.value } })
                }
              />
            </Field>
            <Field label="Category">
              <input
                className={inputClass()}
                value={d.category}
                onChange={(e) =>
                  setModal({
                    ...modal,
                    draft: { ...d, category: e.target.value },
                  })
                }
              />
            </Field>
          </>
        );
      default:
        return Object.keys(d).map((k) => (
          <Field key={k} label={k}>
            <input
              className={inputClass()}
              value={d[k] ?? ""}
              onChange={(e) =>
                setModal({ ...modal, draft: { ...d, [k]: e.target.value } })
              }
            />
          </Field>
        ));
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-zinc-100 via-white to-zinc-100 text-zinc-900">
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
              style={{ background: "var(--brand-color)" }}
            >
              <LayoutGrid className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
                CRM workspace
              </h1>
              <p className="text-[11px] text-zinc-500 sm:text-[12px]">
                Full-screen desk · same data as the Front plugin
              </p>
            </div>
            <nav
              className="flex shrink-0 items-center gap-0.5 rounded-xl border border-zinc-200 bg-zinc-50 p-1"
              aria-label="Workspace"
            >
              <button
                type="button"
                onClick={() => setWorkspaceRoute("accounts")}
                className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition ${
                  workspace === "accounts"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Accounts
              </button>
              <button
                type="button"
                onClick={() => setWorkspaceRoute("admin")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition ${
                  workspace === "admin"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Settings2 className="h-3.5 w-3.5" strokeWidth={2} />
                Admin centre
              </button>
              <button
                type="button"
                onClick={() => setWorkspaceRoute("api")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition ${
                  workspace === "api"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" strokeWidth={2} />
                API docs
              </button>
            </nav>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Plugin view
            </Link>
            {workspace === "accounts" ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    void refreshList().then(() => showToast("Refreshed."))
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-medium hover:bg-zinc-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={openNewAccount}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand-color)] px-3 py-2 text-[12px] font-semibold text-white shadow-sm hover:opacity-95"
                >
                  <Plus className="h-4 w-4" />
                  New account
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-zinc-200 bg-zinc-900 px-4 py-2 text-[12px] text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      {workspace === "admin" ? (
        <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-10 lg:py-6">
          <AdminCentre onToast={showToast} />
        </div>
      ) : workspace === "api" ? (
        <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-10 lg:py-6">
          <div className="min-h-[50dvh] lg:rounded-2xl lg:border lg:border-zinc-200 lg:bg-white lg:p-6 lg:shadow-sm">
            <ApiDocsClient token={getDemoApiToken()} variant="crm" />
          </div>
        </div>
      ) : (
        <div className="mx-auto flex max-w-[1600px] gap-0 lg:gap-6 lg:px-6 lg:py-6">
          <aside className="w-full border-b border-zinc-200 bg-white lg:w-80 lg:shrink-0 lg:rounded-2xl lg:border lg:shadow-sm">
            <div className="p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-9 pr-3 text-[13px] outline-none focus:border-[var(--brand-color)] focus:bg-white focus:ring-2 focus:ring-[var(--brand-color)]/15"
                  placeholder="Search accounts…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <nav className="max-h-[40dvh] overflow-y-auto px-2 pb-4 lg:max-h-[calc(100dvh-220px)]">
              {loading ? (
                <div className="flex justify-center py-12 text-zinc-500">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <p className="px-3 py-8 text-center text-[13px] text-zinc-500">
                  No accounts match.
                </p>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.email}
                    type="button"
                    onClick={() => {
                      setSelectedEmail(c.email);
                      setTab("account");
                    }}
                    className={`mb-1 flex w-full flex-col items-start rounded-xl px-3 py-3 text-left transition ${
                      selectedEmail === c.email
                        ? "bg-[var(--secondary-light)] ring-2 ring-[var(--secondary-color)]/30"
                        : "hover:bg-zinc-50"
                    }`}
                  >
                    <span className="font-semibold text-zinc-900">{c.name}</span>
                    <span className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-500">
                      <Mail className="h-3 w-3 shrink-0" />
                      {c.email}
                    </span>
                    {c.company ? (
                      <span className="mt-1 flex items-center gap-1 text-[11px] text-zinc-600">
                        <Building2 className="h-3 w-3 shrink-0" />
                        {c.company}
                      </span>
                    ) : null}
                  </button>
                ))
              )}
            </nav>
          </aside>

          <main className="min-h-[50dvh] flex-1 px-4 py-5 lg:rounded-2xl lg:border lg:border-zinc-200 lg:bg-white lg:p-6 lg:shadow-sm">
            {!contact ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-[15px] font-medium text-zinc-700">
                  Select an account or create a new one
                </p>
                <p className="mt-2 max-w-md text-[13px] text-zinc-500">
                  Edits save to the hosted API store. Open the plugin in Front on
                  a conversation with that contact&apos;s email to see the same
                  records.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-5 flex flex-wrap gap-2 border-b border-zinc-100 pb-4">
                  {crmTabs.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTab(t.id)}
                      className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition ${
                        tab === t.id
                          ? "bg-[var(--brand-color)] text-white shadow-sm"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                {busy ? (
                  <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-white/30">
                    <Loader2 className="h-10 w-10 animate-spin text-[var(--brand-color)]" />
                  </div>
                ) : null}
                {tabPanel()}
              </>
            )}
          </main>
        </div>
      )}

      <Modal
        open={!!modal}
        title={
          modal?.kind === "newAccount"
            ? "New account"
            : modal?.recordKey
              ? `Edit ${modal.recordKey}`
              : "Edit"
        }
        onClose={() => setModal(null)}
        footer={
          <>
            <button
              type="button"
              className="rounded-lg px-4 py-2 text-[13px] text-zinc-600 hover:bg-zinc-100"
              onClick={() => setModal(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={busy}
              className="rounded-lg bg-[var(--brand-color)] px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
              onClick={() => void submitModal()}
            >
              {modal?.kind === "newAccount" ? "Create" : "Save"}
            </button>
          </>
        }
      >
        {modalBody()}
      </Modal>
    </div>
  );
}
