import type { Case } from "@/types/contact";
import { Badge } from "@/components/ui/Badge";

const statusVariant: Record<Case["status"], "danger" | "warning" | "success"> = {
  open: "danger",
  in_progress: "warning",
  resolved: "success",
};

export function CasesSection({ items }: { items: Case[] }) {
  return (
    <div className="space-y-2">
      {!items?.length ? (
        <p className="text-zinc-500">No support cases.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((c) => (
            <li
              key={c.id}
              className="rounded-md border border-zinc-100 px-2.5 py-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium text-zinc-900">{c.subject}</div>
                  <div className="text-[11px] text-zinc-500">
                    Opened {c.openedAt}
                    {c.priority ? ` · ${c.priority} priority` : ""}
                  </div>
                </div>
                <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
