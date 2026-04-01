import type { Contract } from "@/types/contact";
import { Badge } from "@/components/ui/Badge";
import { RecordIdLine } from "@/components/ui/RecordIdLine";

const statusVariant: Record<Contract["status"], "success" | "default" | "warning"> = {
  active: "success",
  expired: "default",
  pending_renewal: "warning",
};

export function ContractsSection({ items }: { items: Contract[] }) {
  if (!items?.length) {
    return <p className="text-zinc-500">No contracts.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((c) => (
        <li
          key={c.id}
          className="rounded-md border border-zinc-100 px-2.5 py-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <RecordIdLine id={c.id} />
              <div className="font-medium text-zinc-900">{c.title}</div>
              <div className="text-[11px] text-zinc-500 capitalize">
                {c.type} · {c.startDate}
                {c.endDate ? ` → ${c.endDate}` : ""}
              </div>
            </div>
            <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}
