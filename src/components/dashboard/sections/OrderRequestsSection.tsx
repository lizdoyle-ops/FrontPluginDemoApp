import type { OrderRequest } from "@/types/contact";
import { RecordIdLine } from "@/components/ui/RecordIdLine";

export function OrderRequestsSection({ items }: { items: OrderRequest[] }) {
  if (!items?.length) {
    return <p className="text-zinc-500">No order requests.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((r) => (
        <li
          key={r.id}
          className="rounded-md border border-zinc-100 px-2.5 py-2 text-[13px]"
        >
          <RecordIdLine id={r.id} />
          <div className="font-medium text-zinc-900">{r.title}</div>
          <div className="mt-1 text-zinc-600">
            <span className="text-zinc-500">Broker</span> {r.broker} ·{" "}
            <span className="text-zinc-500">Charterer</span> {r.charterer}
          </div>
          <div className="text-zinc-600">
            <span className="text-zinc-500">Cargo</span> {r.cargo} ·{" "}
            <span className="text-zinc-500">Qty</span> {r.quantity}
          </div>
          <div className="text-zinc-600">
            {r.loadPort} → {r.dischargePort}
          </div>
          <div className="mt-0.5 text-[12px] text-zinc-500">
            Laycan {r.laycan} · Rate idea {r.rateIdea}
          </div>
        </li>
      ))}
    </ul>
  );
}
