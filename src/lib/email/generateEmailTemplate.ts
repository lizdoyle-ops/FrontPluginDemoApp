import type { ContactData } from "@/types/contact";
import { escapeAttr, escapeHtml } from "./escapeHtml";
import type { EmailBranding } from "./emailBranding";

function money(currency: string, amount: number) {
  const sym = currency === "GBP" ? "£" : `${currency} `;
  return `${sym}${amount.toLocaleString()}`;
}

function logoBlock(logoUrl: string | null, companyName: string) {
  const co = escapeHtml(companyName);
  if (logoUrl?.trim()) {
    const src = escapeAttr(logoUrl.trim());
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="vertical-align:middle;padding-right:12px;"><img src="${src}" alt="" width="112" style="display:block;max-width:112px;height:auto;max-height:44px;"/></td>
<td style="vertical-align:middle;"><div style="font-size:11px;opacity:0.95;letter-spacing:0.06em;text-transform:uppercase;color:#fff;">${co}</div></td>
</tr></table>`;
  }
  return `<div style="font-size:11px;opacity:0.95;letter-spacing:0.06em;text-transform:uppercase;color:#fff;">${co}</div>`;
}

function th(label: string, accent: string) {
  return `<th align="left" style="padding:8px 6px;border-bottom:2px solid ${escapeAttr(accent)};font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.04em;">${escapeHtml(label)}</th>`;
}
function td(content: string, extra = "") {
  return `<td style="padding:8px 6px;border-bottom:1px solid #e4e4e7;font-size:13px;color:#18181b;${extra}">${content}</td>`;
}

export function generateEmailTemplate(
  contact: ContactData,
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
  const foot = escapeHtml(appTitle);

  const propsRows =
    contact.properties?.length ?
      contact.properties
        .map((p) => {
          const rent =
            p.rentMonthly != null ? money("GBP", p.rentMonthly) : "—";
          return `<tr>${td(escapeHtml(p.address))}${td(escapeHtml(`${p.city} ${p.postcode}`))}${td(escapeHtml(p.status))}${td(rent, "white-space:nowrap;")}</tr>`;
        })
        .join("")
    : `<tr><td colspan="4" style="padding:12px 6px;color:#71717a;font-size:13px;">No properties on file.</td></tr>`;

  const quotesRows =
    contact.quotes?.length ?
      contact.quotes
        .map(
          (q) =>
            `<tr>${td(escapeHtml(q.title))}${td(money(q.currency, q.amount), "white-space:nowrap;")}${td(escapeHtml(q.status))}${td(escapeHtml(q.validUntil ?? "—"))}</tr>`,
        )
        .join("")
    : `<tr><td colspan="4" style="padding:12px 6px;color:#71717a;font-size:13px;">No quotes.</td></tr>`;

  const oppRows =
    contact.opportunities?.length ?
      contact.opportunities
        .map((o) => {
          const amt =
            o.amount != null ?
              money(o.currency ?? "GBP", o.amount)
            : "—";
          return `<tr>${td(escapeHtml(o.title))}${td(escapeHtml(o.stage))}${td(amt, "white-space:nowrap;")}${td(escapeHtml(o.expectedCloseDate ?? "—"))}</tr>`;
        })
        .join("")
    : `<tr><td colspan="4" style="padding:12px 6px;color:#71717a;font-size:13px;">No opportunities.</td></tr>`;

  const orderRows =
    contact.orders?.length ?
      contact.orders
        .map(
          (o) =>
            `<tr>${td(escapeHtml(o.title))}${td(escapeHtml(o.status))}${td(money(o.currency, o.total), "white-space:nowrap;")}${td(escapeHtml(o.orderedAt))}</tr>`,
        )
        .join("")
    : `<tr><td colspan="4" style="padding:12px 6px;color:#71717a;font-size:13px;">No orders.</td></tr>`;

  const casesRows =
    contact.cases?.length ?
      contact.cases
        .map(
          (c) =>
            `<tr>${td(escapeHtml(c.subject))}${td(escapeHtml(c.status))}${td(escapeHtml(c.openedAt))}${td(escapeHtml(c.priority ?? "—"))}</tr>`,
        )
        .join("")
    : `<tr><td colspan="4" style="padding:12px 6px;color:#71717a;font-size:13px;">No cases.</td></tr>`;

  const woRows =
    contact.workOrders?.length ?
      contact.workOrders
        .map(
          (w) =>
            `<tr>${td(escapeHtml(w.title))}${td(escapeHtml(w.type))}${td(escapeHtml(w.status))}${td(escapeHtml(w.scheduledFor ?? "—"))}</tr>`,
        )
        .join("")
    : `<tr><td colspan="4" style="padding:12px 6px;color:#71717a;font-size:13px;">No work orders.</td></tr>`;

  const invRows =
    contact.invoices?.length ?
      contact.invoices
        .map(
          (i) =>
            `<tr>${td(escapeHtml(i.title ?? i.reference))}${td(escapeHtml(i.reference))}${td(money(i.currency, i.amount), "white-space:nowrap;")}${td(escapeHtml(i.status))}</tr>`,
        )
        .join("")
    : `<tr><td colspan="4" style="padding:12px 6px;color:#71717a;font-size:13px;">No invoices.</td></tr>`;

  const petRows =
    contact.pets?.length ?
      contact.pets
        .map(
          (p) =>
            `<tr>${td(escapeHtml(p.name))}${td(escapeHtml(p.species))}${td(escapeHtml(p.breed ?? "—"))}${td(escapeHtml(p.microchip ?? "—"))}</tr>`,
        )
        .join("")
    : `<tr><td colspan="4" style="padding:12px 6px;color:#71717a;font-size:13px;">No pets.</td></tr>`;

  const policyRows =
    contact.policies?.length ?
      contact.policies
        .map(
          (pol) =>
            `<tr>${td(escapeHtml(pol.product))}${td(escapeHtml(pol.policyNumber))}${td(money("GBP", pol.annualPremium), "white-space:nowrap;")}${td(escapeHtml(pol.status))}</tr>`,
        )
        .join("")
    : `<tr><td colspan="4" style="padding:12px 6px;color:#71717a;font-size:13px;">No policies.</td></tr>`;

  const ph = contact.policyholder;
  const policyholderBlock =
    ph.name.trim() || ph.email.trim() ?
      `<div style="font-size:13px;color:#18181b;line-height:1.55;">${escapeHtml(ph.name)}<br/>${escapeHtml(ph.email)}${ph.phone ? `<br/>${escapeHtml(ph.phone)}` : ""}${ph.address ? `<br/>${escapeHtml(ph.address)}` : ""}${ph.authorisedContacts.length ? `<br/><span style="font-size:11px;color:#71717a;">Authorised: ${escapeHtml(ph.authorisedContacts.join(", "))}</span>` : ""}</div>`
    : `<p style="margin:0;color:#71717a;font-size:13px;">No policyholder on file.</p>`;

  const cov = contact.cover;
  const coverBlock =
    cov.vetFeeLimit > 0 || cov.exclusions.length ?
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:12px;"><tr><td style="padding:4px 0;color:#71717a;">Vet limit</td><td>${money("GBP", cov.vetFeeLimit)} (${escapeHtml(cov.vetFeeLimitType || "—")})</td></tr><tr><td style="padding:4px 0;color:#71717a;">Remaining</td><td>${money("GBP", cov.remainingLimitThisYear)}</td></tr><tr><td style="padding:4px 0;color:#71717a;">Excess</td><td>${money("GBP", cov.excess.fixed)}</td></tr></table>${cov.excess.coInsurance ? `<p style="margin:8px 0 0;font-size:11px;color:#52525b;">${escapeHtml(cov.excess.coInsurance)}</p>` : ""}`
    : `<p style="margin:0;color:#71717a;font-size:13px;">No cover details.</p>`;

  const claimRows =
    contact.claimsHistory?.length ?
      contact.claimsHistory
        .map(
          (c) =>
            `<tr>${td(escapeHtml(c.claimId))}${td(escapeHtml(c.condition))}${td(money("GBP", c.amountPaid), "white-space:nowrap;")}${td(escapeHtml(c.status))}</tr>`,
        )
        .join("")
    : `<tr><td colspan="4" style="padding:12px 6px;color:#71717a;font-size:13px;">No claims.</td></tr>`;

  const timelineSlice = contact.timeline?.slice(0, 6) ?? [];
  const tlRows =
    timelineSlice.length ?
      timelineSlice
        .map(
          (e) =>
            `<tr>${td(escapeHtml(e.type))}${td(escapeHtml(e.title))}${td(escapeHtml(e.date.slice(0, 16)))}</tr>`,
        )
        .join("")
    : `<tr><td colspan="3" style="padding:12px 6px;color:#71717a;font-size:13px;">No timeline events.</td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:20px;background:#f4f4f5;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:14px;color:#18181b;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e4e4e7;border-radius:10px;overflow:hidden;">
<tr><td style="padding:18px 20px;background:${navy};color:#ffffff;">
  ${logoBlock(logoUrl, companyName)}
  <div style="font-size:20px;font-weight:700;margin-top:14px;letter-spacing:-0.02em;">Account summary</div>
  <div style="font-size:12px;opacity:0.9;margin-top:6px;">Prepared for ${escapeHtml(contact.name)} · ${escapeHtml(contact.email)}</div>
</td></tr>
<tr><td style="padding:20px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px;">
    <tr><td style="font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;padding-bottom:6px;">Contact</td></tr>
    <tr><td style="font-size:15px;font-weight:700;color:${navy};">${escapeHtml(contact.name)}</td></tr>
    <tr><td style="font-size:13px;color:#3f3f46;padding-top:4px;">${escapeHtml(contact.company)}</td></tr>
    <tr><td style="font-size:12px;color:#71717a;padding-top:4px;">${escapeHtml(contact.role)} · ${escapeHtml(contact.segment)}</td></tr>
  </table>

  <div style="font-size:12px;font-weight:700;color:${navy};margin:18px 0 8px;text-transform:uppercase;letter-spacing:0.04em;">Properties</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr>${th("Address", secondaryColor)}${th("Location", secondaryColor)}${th("Status", secondaryColor)}${th("Rent/mo", secondaryColor)}</tr>${propsRows}</table>

  <div style="font-size:12px;font-weight:700;color:${navy};margin:18px 0 8px;text-transform:uppercase;letter-spacing:0.04em;">Quotes</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr>${th("Title", secondaryColor)}${th("Amount", secondaryColor)}${th("Status", secondaryColor)}${th("Valid until", secondaryColor)}</tr>${quotesRows}</table>

  <div style="font-size:12px;font-weight:700;color:${navy};margin:18px 0 8px;text-transform:uppercase;letter-spacing:0.04em;">Opportunities</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr>${th("Title", secondaryColor)}${th("Stage", secondaryColor)}${th("Amount", secondaryColor)}${th("Close", secondaryColor)}</tr>${oppRows}</table>

  <div style="font-size:12px;font-weight:700;color:${navy};margin:18px 0 8px;text-transform:uppercase;letter-spacing:0.04em;">Orders</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr>${th("Title", secondaryColor)}${th("Status", secondaryColor)}${th("Total", secondaryColor)}${th("Ordered", secondaryColor)}</tr>${orderRows}</table>

  <div style="font-size:12px;font-weight:700;color:${navy};margin:18px 0 8px;text-transform:uppercase;letter-spacing:0.04em;">Support cases</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr>${th("Subject", secondaryColor)}${th("Status", secondaryColor)}${th("Opened", secondaryColor)}${th("Priority", secondaryColor)}</tr>${casesRows}</table>

  <div style="font-size:12px;font-weight:700;color:${navy};margin:18px 0 8px;text-transform:uppercase;letter-spacing:0.04em;">Work orders</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr>${th("Title", secondaryColor)}${th("Type", secondaryColor)}${th("Status", secondaryColor)}${th("Scheduled", secondaryColor)}</tr>${woRows}</table>

  <div style="font-size:12px;font-weight:700;color:${navy};margin:18px 0 8px;text-transform:uppercase;letter-spacing:0.04em;">Invoices</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr>${th("Description", secondaryColor)}${th("Ref", secondaryColor)}${th("Amount", secondaryColor)}${th("Status", secondaryColor)}</tr>${invRows}</table>

  <div style="font-size:12px;font-weight:700;color:${navy};margin:18px 0 8px;text-transform:uppercase;letter-spacing:0.04em;">Pets</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr>${th("Name", secondaryColor)}${th("Species", secondaryColor)}${th("Breed", secondaryColor)}${th("Microchip", secondaryColor)}</tr>${petRows}</table>

  <div style="font-size:12px;font-weight:700;color:${navy};margin:18px 0 8px;text-transform:uppercase;letter-spacing:0.04em;">Policies</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr>${th("Product", secondaryColor)}${th("Policy #", secondaryColor)}${th("Premium", secondaryColor)}${th("Status", secondaryColor)}</tr>${policyRows}</table>

  <div style="font-size:12px;font-weight:700;color:${navy};margin:18px 0 8px;text-transform:uppercase;letter-spacing:0.04em;">Policyholder</div>
  ${policyholderBlock}

  <div style="font-size:12px;font-weight:700;color:${navy};margin:18px 0 8px;text-transform:uppercase;letter-spacing:0.04em;">Cover</div>
  ${coverBlock}

  <div style="font-size:12px;font-weight:700;color:${navy};margin:18px 0 8px;text-transform:uppercase;letter-spacing:0.04em;">Claims</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr>${th("Claim ID", secondaryColor)}${th("Condition", secondaryColor)}${th("Paid", secondaryColor)}${th("Status", secondaryColor)}</tr>${claimRows}</table>

  <div style="font-size:12px;font-weight:700;color:${navy};margin:18px 0 8px;text-transform:uppercase;letter-spacing:0.04em;">Recent timeline</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr>${th("Type", secondaryColor)}${th("Event", secondaryColor)}${th("When", secondaryColor)}</tr>${tlRows}</table>

  <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:22px;">
    <tr><td style="border-radius:8px;background:${escapeAttr(secondaryColor)};">
      <span style="display:inline-block;padding:12px 20px;color:#ffffff;font-weight:600;font-size:13px;">Open in ${escapeHtml(companyName)} CRM</span>
    </td></tr>
  </table>
  <p style="margin:18px 0 0;font-size:11px;color:#a1a1aa;line-height:1.55;">This message was generated by ${foot}. Reply in Front to continue the thread.</p>
</td></tr>
<tr><td style="padding:14px 20px;background:#fafafa;border-top:1px solid #e4e4e7;font-size:11px;color:#71717a;">© ${escapeHtml(companyName)} · Confidential</td></tr>
</table>
</body>
</html>`;
}
