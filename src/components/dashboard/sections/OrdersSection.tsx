import type { Order } from "@/types/contact";
import { Badge } from "@/components/ui/Badge";
import { RecordIdLine } from "@/components/ui/RecordIdLine";

const statusVariant: Record<
  Order["status"],
  "default" | "info" | "warning" | "success" | "danger"
> = {
  pending: "default",
  confirmed: "info",
  processing: "warning",
  fulfilled: "success",
  cancelled: "danger",
};

function formatMoney(currency: string, total: number) {
  const sym = currency === "GBP" || !currency ? "£" : `${currency} `;
  return `${sym}${total.toLocaleString()}`;
}

export function OrdersSection({ items }: { items: Order[] }) {
  if (!items?.length) {
    return <p className="text-zinc-500">No orders.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((o) => (
        <li
          key={o.id}
          className="rounded-md border border-zinc-100 px-2.5 py-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <RecordIdLine id={o.id} />
              <div className="font-medium text-zinc-900">{o.title}</div>
              <div className="mt-0.5 text-[12px] text-zinc-600">
                {formatMoney(o.currency, o.total)}
              </div>
              <div className="text-[11px] text-zinc-500">
                Ordered: {o.orderedAt}
                {o.fulfilledAt ? ` · Fulfilled: ${o.fulfilledAt}` : null}
              </div>
              {o.notes ? (
                <div className="mt-1 text-[11px] text-zinc-600">{o.notes}</div>
              ) : null}
            </div>
            <Badge variant={statusVariant[o.status]} className="shrink-0 capitalize">
              {o.status}
            </Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}
