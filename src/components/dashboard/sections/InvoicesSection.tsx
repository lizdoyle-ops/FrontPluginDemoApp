import { Send } from "lucide-react";
import type { Invoice } from "@/types/contact";
import { Badge } from "@/components/ui/Badge";
import { RecordIdLine } from "@/components/ui/RecordIdLine";

const statusVariant: Record<
  Invoice["status"],
  "default" | "warning" | "success" | "danger"
> = {
  draft: "default",
  pending: "warning",
  paid: "success",
  overdue: "danger",
};

const statusLabel: Record<Invoice["status"], string> = {
  draft: "Draft",
  pending: "Pending",
  paid: "Paid",
  overdue: "Overdue",
};

function formatMoney(inv: Invoice) {
  const sym = inv.currency === "GBP" ? "£" : `${inv.currency} `;
  return `${sym}${inv.amount.toLocaleString()}`;
}

export function InvoicesSection({
  items,
  onSendInvoice,
}: {
  items: Invoice[];
  onSendInvoice?: (inv: Invoice) => void;
}) {
  if (!items?.length) {
    return <p className="text-[13px] text-zinc-500">No invoices.</p>;
  }
  return (
    <ul className="space-y-3">
      {items.map((inv) => {
        const title = inv.title ?? inv.reference;
        const refLine = [
          inv.propertySummary,
          inv.reference,
          inv.workOrderRef ? `WO: ${inv.workOrderRef}` : "",
        ]
          .filter(Boolean)
          .join(" · ");
        const issued = inv.issuedDate ?? "—";
        const paidOrDue =
          inv.status === "paid"
            ? (inv.paidDate ?? inv.dueDate ?? "—")
            : (inv.dueDate ?? "—");
        const secondColLabel = inv.status === "paid" ? "Paid" : "Due";

        return (
          <li
            key={inv.id}
            className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
          >
            <div className="flex items-start justify-between gap-2 border-b border-zinc-100 px-3 py-2.5">
              <div className="min-w-0">
                <RecordIdLine id={inv.id} />
                <h4 className="text-[13px] font-bold leading-snug text-zinc-900">
                  {title}
                </h4>
              </div>
              <Badge
                variant={statusVariant[inv.status]}
                className="shrink-0 capitalize"
              >
                {statusLabel[inv.status]}
              </Badge>
            </div>
            <div className="px-3 py-2">
              {refLine ? (
                <p className="text-[11px] leading-relaxed text-zinc-500">
                  {refLine}
                </p>
              ) : null}
              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[12px]">
                <div>
                  <div className="text-[11px] font-medium text-zinc-500">
                    Amount
                  </div>
                  <div className="font-semibold text-zinc-900">
                    {formatMoney(inv)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-zinc-500">
                    Category
                  </div>
                  <div className="font-semibold text-zinc-900">
                    {inv.category ?? "—"}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-zinc-500">
                    Issued
                  </div>
                  <div className="text-zinc-800">{issued}</div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-zinc-500">
                    {secondColLabel}
                  </div>
                  <div className="text-zinc-800">{paidOrDue}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-zinc-100 px-3 py-2.5">
              <p className="min-w-0 truncate text-[11px] text-zinc-600">
                {inv.vendorName ? (
                  <>
                    <span className="text-zinc-500">Vendor: </span>
                    {inv.vendorName}
                  </>
                ) : (
                  <span className="text-zinc-400">No vendor on file</span>
                )}
              </p>
              {onSendInvoice ? (
                <button
                  type="button"
                  onClick={() => onSendInvoice(inv)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--secondary-color)] hover:bg-[var(--secondary-light)]"
                  aria-label={`Draft email for ${title}`}
                >
                  <Send className="h-4 w-4" strokeWidth={2} />
                </button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
