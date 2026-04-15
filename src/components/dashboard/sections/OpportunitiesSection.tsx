import type { Opportunity } from "@/types/contact";
import { Badge } from "@/components/ui/Badge";
import { RecordIdLine } from "@/components/ui/RecordIdLine";

const stageVariant: Record<
  Opportunity["stage"],
  "default" | "info" | "warning" | "success" | "danger"
> = {
  prospecting: "default",
  qualified: "info",
  proposal: "warning",
  negotiation: "warning",
  won: "success",
  lost: "danger",
};

function formatMoney(o: Opportunity) {
  if (o.amount == null) return null;
  const sym = o.currency === "GBP" || !o.currency ? "£" : `${o.currency} `;
  return `${sym}${o.amount.toLocaleString()}`;
}

export function OpportunitiesSection({ items }: { items: Opportunity[] }) {
  if (!items?.length) {
    return <p className="text-zinc-500">No opportunities.</p>;
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
              {formatMoney(o) ? (
                <div className="mt-0.5 text-[12px] text-zinc-600">
                  {formatMoney(o)}
                </div>
              ) : null}
              {o.expectedCloseDate ? (
                <div className="text-[11px] text-zinc-500">
                  Close: {o.expectedCloseDate}
                </div>
              ) : null}
              {o.notes ? (
                <div className="mt-1 text-[11px] text-zinc-600">{o.notes}</div>
              ) : null}
            </div>
            <Badge variant={stageVariant[o.stage]} className="shrink-0 capitalize">
              {o.stage.replace("_", " ")}
            </Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}
