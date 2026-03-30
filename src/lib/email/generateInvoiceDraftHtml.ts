import type { ContactData, Invoice } from "@/types/contact";
import { escapeAttr, escapeHtml } from "./escapeHtml";
import type { EmailBranding } from "./emailBranding";

function formatMoney(inv: Invoice) {
  const sym = inv.currency === "GBP" ? "£" : `${inv.currency} `;
  return `${sym}${inv.amount.toLocaleString()}`;
}

const statusLabel: Record<Invoice["status"], string> = {
  paid: "PAID",
  pending: "PENDING PAYMENT",
  overdue: "OVERDUE",
  draft: "DRAFT",
};

function logoHeader(logoUrl: string | null, companyName: string) {
  const co = escapeHtml(companyName);
  if (logoUrl?.trim()) {
    const src = escapeAttr(logoUrl.trim());
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="vertical-align:middle;padding-right:14px;"><img src="${src}" alt="" width="120" style="display:block;max-width:120px;height:auto;max-height:48px;"/></td>
<td style="vertical-align:middle;text-align:right;"><div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.9);">${co}</div></td>
</tr></table>`;
  }
  return `<div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.9);text-align:right;">${co}</div>`;
}

export function generateInvoiceDraftHtml(
  contact: ContactData,
  invoice: Invoice,
  branding: EmailBranding,
): string {
  const {
    companyName,
    brandColor,
    secondaryColor,
    logoUrl,
    appTitle = "Property CRM",
  } = branding;
  const navy = escapeAttr(brandColor);
  const teal = escapeAttr(secondaryColor);
  const title = invoice.title ?? invoice.reference;
  const issued = invoice.issuedDate ?? "—";
  const dueOrPaid =
    invoice.status === "paid"
      ? (invoice.paidDate ?? invoice.dueDate ?? "—")
      : (invoice.dueDate ?? "—");
  const dueLabel = invoice.status === "paid" ? "Paid on" : "Due date";
  const statusBg =
    invoice.status === "paid"
      ? "#ecfdf5"
      : invoice.status === "overdue"
        ? "#fef2f2"
        : "#fffbeb";
  const statusFg =
    invoice.status === "paid"
      ? "#065f46"
      : invoice.status === "overdue"
        ? "#991b1b"
        : "#92400e";

  const refLineRaw = [
    invoice.propertySummary,
    invoice.workOrderRef ? `Work order ${invoice.workOrderRef}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:24px;background:#f4f4f5;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:14px;color:#18181b;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e4e4e7;border-radius:10px;overflow:hidden;">
<tr><td style="padding:20px 22px;background:${navy};color:#ffffff;">
  ${logoHeader(logoUrl, companyName)}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.2);">
    <tr>
      <td valign="bottom" style="padding-top:8px;">
        <div style="font-size:22px;font-weight:800;letter-spacing:-0.03em;">INVOICE</div>
        <div style="font-size:12px;opacity:0.9;margin-top:6px;">${escapeHtml(invoice.reference)}</div>
      </td>
      <td valign="bottom" align="right" style="padding-top:8px;font-size:11px;opacity:0.9;line-height:1.5;">
        <div>Issued <strong style="color:#fff;">${escapeHtml(issued)}</strong></div>
        <div>${escapeHtml(dueLabel)} <strong style="color:#fff;">${escapeHtml(dueOrPaid)}</strong></div>
      </td>
    </tr>
  </table>
</td></tr>
<tr><td style="padding:22px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr>
      <td width="50%" style="vertical-align:top;padding-right:12px;">
        <div style="font-size:10px;color:#71717a;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Bill to</div>
        <div style="font-size:15px;font-weight:700;color:${navy};">${escapeHtml(contact.name)}</div>
        <div style="font-size:13px;color:#3f3f46;margin-top:4px;">${escapeHtml(contact.email)}</div>
        <div style="font-size:12px;color:#71717a;margin-top:4px;">${escapeHtml(contact.company)}</div>
      </td>
      <td width="50%" style="vertical-align:top;padding-left:12px;text-align:right;">
        <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:${statusBg};color:${statusFg};font-size:11px;font-weight:700;letter-spacing:0.04em;">${escapeHtml(statusLabel[invoice.status])}</div>
      </td>
    </tr>
  </table>
  ${refLineRaw ? `<p style="margin:0 0 18px;font-size:12px;color:#71717a;line-height:1.5;">${escapeHtml(refLineRaw)}</p>` : ""}

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e4e4e7;border-radius:8px;overflow:hidden;">
    <tr style="background:#fafafa;">
      <th align="left" style="padding:10px 12px;font-size:10px;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #e4e4e7;">Description</th>
      <th align="left" style="padding:10px 12px;font-size:10px;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #e4e4e7;">Category</th>
      <th align="center" style="padding:10px 12px;font-size:10px;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #e4e4e7;">Qty</th>
      <th align="right" style="padding:10px 12px;font-size:10px;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #e4e4e7;">Amount</th>
    </tr>
    <tr>
      <td style="padding:14px 12px;font-size:13px;font-weight:600;border-bottom:1px solid #e4e4e7;">${escapeHtml(title)}</td>
      <td style="padding:14px 12px;font-size:13px;border-bottom:1px solid #e4e4e7;">${escapeHtml(invoice.category ?? "—")}</td>
      <td align="center" style="padding:14px 12px;font-size:13px;border-bottom:1px solid #e4e4e7;">1</td>
      <td align="right" style="padding:14px 12px;font-size:13px;font-weight:600;border-bottom:1px solid #e4e4e7;white-space:nowrap;">${escapeHtml(formatMoney(invoice))}</td>
    </tr>
  </table>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
    <tr>
      <td></td>
      <td width="200" style="padding:8px 0;font-size:13px;color:#71717a;">Subtotal</td>
      <td width="90" align="right" style="padding:8px 0;font-size:13px;">${escapeHtml(formatMoney(invoice))}</td>
    </tr>
    <tr>
      <td></td>
      <td style="padding:8px 0;font-size:14px;font-weight:700;color:${navy};">Total due</td>
      <td align="right" style="padding:8px 0;font-size:16px;font-weight:800;color:${navy};">${escapeHtml(formatMoney(invoice))}</td>
    </tr>
  </table>

  ${invoice.vendorName ? `<div style="margin-top:20px;padding-top:16px;border-top:1px solid #e4e4e7;font-size:12px;color:#3f3f46;"><span style="color:#71717a;">Vendor / contractor</span><br/><strong>${escapeHtml(invoice.vendorName)}</strong></div>` : ""}

  <p style="margin:22px 0 0;font-size:11px;color:#a1a1aa;line-height:1.55;">Questions about this invoice? Reply in Front or contact ${escapeHtml(companyName)}. Generated by ${escapeHtml(appTitle)}.</p>
</td></tr>
<tr><td style="padding:14px 22px;background:${teal};text-align:center;">
  <span style="font-size:11px;font-weight:600;color:#ffffff;letter-spacing:0.04em;">${escapeHtml(companyName)}</span>
</td></tr>
</table>
</body>
</html>`;
}
