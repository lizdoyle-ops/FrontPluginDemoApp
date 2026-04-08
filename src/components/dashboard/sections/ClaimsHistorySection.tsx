import type { ClaimHistoryItem } from "@/types/contact";
import { Badge } from "@/components/ui/Badge";
import { RecordIdLine } from "@/components/ui/RecordIdLine";

function gbp(n: number) {
  return `£${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function ClaimsHistorySection({ items }: { items: ClaimHistoryItem[] }) {
  if (!items?.length) {
    return <p className="text-zinc-500">No claims on file.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((c) => (
        <li
          key={c.id}
          className="rounded-md border border-zinc-100 px-2.5 py-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <RecordIdLine id={c.claimId} />
              <div className="font-medium text-zinc-900">{c.condition}</div>
              <div className="text-[11px] text-zinc-500">
                Submitted {c.dateSubmitted} · {c.vet}
              </div>
              <div className="mt-1 text-[11px] text-zinc-600">
                Claimed {gbp(c.amountClaimed)} · Paid {gbp(c.amountPaid)}
              </div>
            </div>
            <Badge variant="default" className="shrink-0">
              {c.status}
            </Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}
