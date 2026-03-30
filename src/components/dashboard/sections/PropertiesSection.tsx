import type { Property } from "@/types/contact";
import { Badge } from "@/components/ui/Badge";

const statusVariant: Record<Property["status"], "success" | "warning" | "default"> = {
  active: "success",
  pending: "warning",
  completed: "default",
};

export function PropertiesSection({ items }: { items: Property[] }) {
  if (!items?.length) {
    return <p className="text-zinc-500">No properties on file.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((p) => (
        <li
          key={p.id}
          className="rounded-md border border-zinc-100 bg-zinc-50/50 px-2.5 py-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-medium text-zinc-900">{p.address}</div>
              <div className="text-zinc-500">
                {p.city} {p.postcode}
              </div>
              {p.rentMonthly != null ? (
                <div className="mt-1 text-zinc-600">
                  £{p.rentMonthly.toLocaleString()} / mo
                </div>
              ) : null}
            </div>
            <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}
