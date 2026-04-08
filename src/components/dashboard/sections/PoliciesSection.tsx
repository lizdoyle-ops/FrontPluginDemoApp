import type { Policy } from "@/types/contact";
import { Badge } from "@/components/ui/Badge";
import { RecordIdLine } from "@/components/ui/RecordIdLine";

function gbp(n: number) {
  return `£${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function statusVariant(
  s: string,
): "default" | "info" | "warning" | "success" | "danger" {
  const low = s.toLowerCase();
  if (low.includes("active") || low.includes("paid") || low.includes("up to date"))
    return "success";
  if (low.includes("expired") || low.includes("lapsed")) return "danger";
  if (low.includes("pending") || low.includes("renewal")) return "warning";
  return "default";
}

export function PoliciesSection({ items }: { items: Policy[] }) {
  if (!items?.length) {
    return <p className="text-zinc-500">No policies on file.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((pol) => (
        <li
          key={pol.id}
          className="rounded-md border border-zinc-100 px-2.5 py-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <RecordIdLine id={pol.id} />
              <div className="font-medium text-zinc-900">
                {pol.product} · {pol.policyNumber}
              </div>
              <div className="text-[12px] text-zinc-600">
                {gbp(pol.annualPremium)} / {pol.paymentFrequency}
                {pol.monthlyDirectDebit ?
                  ` · DD ${gbp(pol.monthlyDirectDebit)}`
                : null}
              </div>
              <div className="text-[11px] text-zinc-500">
                Start {pol.startDate} · Renewal {pol.renewalDate}
              </div>
              {pol.paymentStatus ? (
                <div className="mt-0.5 text-[11px] text-zinc-600">
                  Payment: {pol.paymentStatus}
                </div>
              ) : null}
            </div>
            <Badge variant={statusVariant(pol.status)} className="shrink-0">
              {pol.status}
            </Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}
