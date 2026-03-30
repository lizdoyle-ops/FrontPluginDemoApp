import type { WorkOrder } from "@/types/contact";
import { Badge } from "@/components/ui/Badge";

const statusVariant: Record<
  WorkOrder["status"],
  "info" | "warning" | "success"
> = {
  scheduled: "info",
  in_progress: "warning",
  completed: "success",
};

export function WorkOrdersSection({ items }: { items: WorkOrder[] }) {
  if (!items?.length) {
    return <p className="text-zinc-500">No work orders.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((w) => (
        <li
          key={w.id}
          className="rounded-md border border-zinc-100 px-2.5 py-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-medium text-zinc-900">{w.title}</div>
              <div className="text-[11px] text-zinc-500 capitalize">
                {w.type.replace("_", " ")}
                {w.scheduledFor ? ` · ${w.scheduledFor}` : ""}
              </div>
            </div>
            <Badge variant={statusVariant[w.status]}>{w.status}</Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}
