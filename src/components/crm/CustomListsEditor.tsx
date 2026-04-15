"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { demoApiAuthHeaders } from "@/lib/api/demoFetchHeaders";
import type {
  ContactData,
  CustomListRow,
  CustomObjectDefinition,
} from "@/types/contact";

const jsonAuth = (): HeadersInit => ({
  ...demoApiAuthHeaders(),
  "Content-Type": "application/json",
});

function newRowId(): string {
  return `clr-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function emptyRow(keys: string[]): CustomListRow {
  const fields = Object.fromEntries(
    keys.filter((k) => k !== "id").map((k) => [k, ""]),
  ) as Record<string, string>;
  return { ...fields, id: newRowId() };
}

export function CustomListsEditor({
  contact,
  definitions,
  onUpdated,
}: {
  contact: ContactData;
  definitions: CustomObjectDefinition[];
  onUpdated: (c: ContactData) => void;
}) {
  const [lists, setLists] = useState<Record<string, CustomListRow[]>>(
    () => contact.customLists ?? {},
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setLists(contact.customLists ?? {});
  }, [contact.email, contact.customLists]);

  const enc = (e: string) => encodeURIComponent(e);

  const saveList = async (defId: string, rows: CustomListRow[]) => {
    setErr(null);
    setSaving(defId);
    const nextLists = { ...lists, [defId]: rows };
    try {
      const res = await fetch(`/api/contacts/${enc(contact.email)}`, {
        method: "PATCH",
        headers: jsonAuth(),
        body: JSON.stringify({ customLists: nextLists }),
      });
      if (!res.ok) throw new Error("patch");
      const updated = (await res.json()) as ContactData;
      setLists(updated.customLists ?? {});
      onUpdated(updated);
    } catch {
      setErr("Could not save. Check network and token.");
    } finally {
      setSaving(null);
    }
  };

  if (!definitions.length) {
    return (
      <p className="text-[13px] text-zinc-500">
        No custom objects defined. Add them in Admin centre → Custom objects,
        then save.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {err ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-800">
          {err}
        </p>
      ) : null}
      {definitions.map((def) => {
        const rows = lists[def.id] ?? [];
        const keys = def.fieldKeys.length
          ? def.fieldKeys
          : ["value"];
        return (
          <div
            key={def.id}
            className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
          >
            <div className="border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
              <h4 className="text-sm font-semibold text-zinc-900">
                {def.title}
              </h4>
              <p className="text-[11px] text-zinc-500">
                Object id: <code className="rounded bg-zinc-100 px-1">{def.id}</code>
              </p>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full min-w-[320px] border-collapse text-left text-[12px]">
                <thead>
                  <tr className="border-b border-zinc-100 text-[11px] font-medium uppercase text-zinc-500">
                    <th className="py-2 pr-2">ID</th>
                    {keys.map((k) => (
                      <th key={k} className="py-2 pr-2">
                        {k}
                      </th>
                    ))}
                    <th className="w-16 py-2 text-right"> </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={keys.length + 2}
                        className="py-6 text-center text-zinc-500"
                      >
                        No rows. Add one below.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, ri) => (
                      <tr key={row.id} className="border-b border-zinc-50">
                        <td className="max-w-[140px] truncate py-1.5 pr-2 font-mono text-[11px] text-zinc-500">
                          {row.id}
                        </td>
                        {keys.map((k) => (
                          <td key={k} className="py-1.5 pr-2">
                            <input
                              className="w-full min-w-[6rem] rounded border border-zinc-200 px-2 py-1"
                              value={row[k] ?? ""}
                              onChange={(e) => {
                                const next = [...rows];
                                next[ri] = { ...next[ri], [k]: e.target.value };
                                setLists((L) => ({ ...L, [def.id]: next }));
                              }}
                            />
                          </td>
                        ))}
                        <td className="py-1.5 text-right">
                          <button
                            type="button"
                            className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                            aria-label="Remove row"
                            onClick={() => {
                              const next = rows.filter((_, i) => i !== ri);
                              setLists((L) => ({ ...L, [def.id]: next }));
                            }}
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
            <div className="flex flex-wrap gap-2 border-t border-zinc-100 px-4 py-3">
              <button
                type="button"
                onClick={() => {
                  const next = [...rows, emptyRow(keys)];
                  setLists((L) => ({ ...L, [def.id]: next }));
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] font-medium hover:bg-zinc-50"
              >
                <Plus className="h-4 w-4" />
                Add row
              </button>
              <button
                type="button"
                disabled={saving === def.id}
                onClick={() => void saveList(def.id, lists[def.id] ?? [])}
                className="rounded-lg bg-[var(--brand-color)] px-4 py-1.5 text-[12px] font-semibold text-white disabled:opacity-50"
              >
                {saving === def.id ? "Saving…" : `Save ${def.title}`}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
