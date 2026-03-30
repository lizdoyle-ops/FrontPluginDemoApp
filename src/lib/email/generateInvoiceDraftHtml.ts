import type { ContactData, Invoice } from "@/types/contact";
import { escapeHtml } from "./escapeHtml";

export function generateInvoiceDraftHtml(
  contact: ContactData,
  invoice: Invoice,
  companyName: string,
  brandColor: string,
): string {
  const title = invoice.title ?? invoice.reference;
  const sub = [
    invoice.propertySummary,
    invoice.reference,
    invoice.workOrderRef ? `WO: ${invoice.workOrderRef}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const co = escapeHtml(companyName);
  const bc = escapeHtml(brandColor);
  return `<!DOCTYPE html><html><body style="margin:0;padding:16px;font-family:system-ui,sans-serif;font-size:14px;color:#18181b;">
<table role="presentation" width="100%" style="max-width:520px;margin:0 auto;border:1px solid #e4e4e7;border-radius:8px;">
<tr><td style="padding:16px;background:${bc};color:#fff;font-weight:600;">${co}</td></tr>
<tr><td style="padding:16px;">
<p style="margin:0 0 8px;font-weight:600;">${escapeHtml(title)}</p>
<p style="margin:0 0 12px;color:#71717a;font-size:13px;">${escapeHtml(sub)}</p>
<p style="margin:0;"><strong>${escapeHtml(invoice.currency)} ${invoice.amount.toLocaleString()}</strong></p>
<p style="margin:8px 0 0;font-size:12px;color:#71717a;">${escapeHtml(contact.name)} · ${escapeHtml(contact.email)}</p>
</td></tr></table></body></html>`;
}
