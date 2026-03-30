"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { ContactData } from "@/types/contact";
import { Card } from "@/components/ui/Card";

export function DataAdmin() {
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refreshList = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await fetch("/api/contacts?full=1");
      if (!res.ok) throw new Error("List failed");
      const data = (await res.json()) as { contacts: ContactData[] };
      setContacts(data.contacts ?? []);
    } catch {
      setLoadError("Could not load contacts.");
    }
  }, []);

  useEffect(() => {
    void refreshList();
  }, [refreshList]);

  useEffect(() => {
    if (selectedEmail || contacts.length === 0) return;
    const first = contacts[0];
    setSelectedEmail(first.email);
    setJsonText(JSON.stringify(first, null, 2));
  }, [contacts, selectedEmail]);

  const selectContact = async (email: string) => {
    setSelectedEmail(email);
    setStatus(null);
    try {
      const res = await fetch(
        `/api/contacts/${encodeURIComponent(email)}`,
      );
      if (!res.ok) throw new Error("not found");
      const c = (await res.json()) as ContactData;
      setJsonText(JSON.stringify(c, null, 2));
    } catch {
      setJsonText("");
      setStatus("Failed to load contact.");
    }
  };

  const savePut = async () => {
    if (!selectedEmail) return;
    setStatus(null);
    try {
      const parsed = JSON.parse(jsonText) as ContactData;
      const res = await fetch(
        `/api/contacts/${encodeURIComponent(selectedEmail)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setStatus(
          `Save failed: ${JSON.stringify(err?.error ?? res.statusText)}`,
        );
        return;
      }
      setStatus("Saved.");
      void refreshList();
    } catch {
      setStatus("Invalid JSON or network error.");
    }
  };

  return (
    <div className="space-y-3 p-2.5 pb-10">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-semibold text-zinc-900">
          Records (API)
        </h2>
        <Link
          href="/settings"
          className="text-[12px] font-medium text-[var(--secondary-color)]"
        >
          Settings
        </Link>
      </div>
      <p className="text-[11px] text-zinc-500">
        Edit JSON and PUT to the same routes documented in{" "}
        <Link href="/api-docs" className="underline">
          API docs
        </Link>{" "}
        and <code className="rounded bg-zinc-100 px-1">API.md</code>.
      </p>
      {loadError ? (
        <p className="text-[12px] text-red-600">{loadError}</p>
      ) : null}
      <Card className="p-2">
        <div className="max-h-32 space-y-1 overflow-y-auto">
          {contacts.map((c) => (
            <button
              key={c.email}
              type="button"
              onClick={() => void selectContact(c.email)}
              className={`block w-full truncate rounded px-2 py-1.5 text-left text-[12px] ${
                selectedEmail === c.email
                  ? "bg-zinc-200 font-medium"
                  : "hover:bg-zinc-50"
              }`}
            >
              {c.name} · {c.email}
            </button>
          ))}
        </div>
      </Card>
      <textarea
        className="min-h-[220px] w-full rounded border border-zinc-200 p-2 font-mono text-[11px]"
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        spellCheck={false}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void savePut()}
          className="flex-1 rounded-md py-2 text-[13px] font-semibold text-white"
          style={{ background: "var(--brand-color)" }}
        >
          Save (PUT)
        </button>
        <button
          type="button"
          onClick={() => void refreshList()}
          className="rounded-md border border-zinc-200 px-3 py-2 text-[12px]"
        >
          Refresh
        </button>
      </div>
      {status ? (
        <p className="text-center text-[12px] text-zinc-600">{status}</p>
      ) : null}
    </div>
  );
}
