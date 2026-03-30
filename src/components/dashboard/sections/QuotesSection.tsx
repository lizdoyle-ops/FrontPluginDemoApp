import type { Quote } from "@/types/contact";
import { Badge } from "@/components/ui/Badge";

const statusVariant: Record<Quote["status"], "warning" | "success" | "default"> = {
  pending: "warning",
  accepted: "success",
  expired: "default",
};

export function QuotesSection({ items }: { items: Quote[] }) {
  if (!items?.length) {
    return <p className="text-zinc-500">No quotes.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((q) => (
        <li
          key={q.id}
          className="flex items-start justify-between gap-2 rounded-md border border-zinc-100 px-2.5 py-2"
        >
          <div>
            <div className="font-medium text-zinc-900">{q.title}</div>
            <div className="text-zinc-600">
              {q.currency} {q.amount.toLocaleString()}
            </div>
            {q.validUntil ? (
              <div className="text-[11px] text-zinc-500">
                Valid until {q.validUntil}
              </div>
            ) : null}
          </div>
          <Badge variant={statusVariant[q.status]}>{q.status}</Badge>
        </li>
      ))}
    </ul>
  );
}
