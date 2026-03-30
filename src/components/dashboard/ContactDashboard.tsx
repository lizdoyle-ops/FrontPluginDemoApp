"use client";

import {
  Banknote,
  Clock,
  FileSignature,
  FileText,
  Headphones,
  Home,
  Paperclip,
  Wrench,
} from "lucide-react";
import { useCallback, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CollapsibleSection } from "@/components/dashboard/CollapsibleSection";
import { ContactCard } from "@/components/dashboard/ContactCard";
import { AttachmentsSection } from "@/components/dashboard/sections/AttachmentsSection";
import { CasesSection } from "@/components/dashboard/sections/CasesSection";
import { ContractsSection } from "@/components/dashboard/sections/ContractsSection";
import { InvoicesSection } from "@/components/dashboard/sections/InvoicesSection";
import { PropertiesSection } from "@/components/dashboard/sections/PropertiesSection";
import { QuotesSection } from "@/components/dashboard/sections/QuotesSection";
import { TimelineSection } from "@/components/dashboard/sections/TimelineSection";
import { WorkOrdersSection } from "@/components/dashboard/sections/WorkOrdersSection";
import { generateEmailTemplate } from "@/lib/email/generateEmailTemplate";
import { generateInvoiceDraftHtml } from "@/lib/email/generateInvoiceDraftHtml";
import type { ContactData, CustomContactField, Invoice, SectionId } from "@/types/contact";
import { getFrontConversationBridge } from "@/lib/front/frontBridge";

const SECTION_LABELS: Record<SectionId, string> = {
  properties: "Properties",
  quotes: "Quotes",
  cases: "Support cases",
  workOrders: "Work orders",
  contracts: "Contracts",
  invoices: "Invoices",
  timeline: "Timeline",
  attachments: "Attachments",
};

const SECTION_ICONS: Record<SectionId, LucideIcon> = {
  properties: Home,
  quotes: FileText,
  cases: Headphones,
  workOrders: Wrench,
  contracts: FileSignature,
  invoices: Banknote,
  timeline: Clock,
  attachments: Paperclip,
};

export function ContactDashboard({
  contact,
  sectionOrder,
  visibleSections,
  customContactFields,
  companyName,
  brandColor,
  secondaryColor,
  caseOverridesRaw,
}: {
  contact: ContactData;
  sectionOrder: SectionId[];
  visibleSections: Record<SectionId, boolean>;
  customContactFields: CustomContactField[];
  companyName: string;
  brandColor: string;
  secondaryColor: string;
  caseOverridesRaw: string;
}) {
  const [draftStatus, setDraftStatus] = useState<string | null>(null);

  const sendSummaryDraft = useCallback(async () => {
    setDraftStatus(null);
    try {
      const FrontMod = await import("@frontapp/plugin-sdk");
      const html = generateEmailTemplate(contact, {
        companyName,
        brandColor,
        secondaryColor,
      });
      await getFrontConversationBridge(FrontMod.default).createDraft({
        content: { body: html, type: "html" },
      });
      setDraftStatus("Summary draft saved in Front.");
    } catch {
      setDraftStatus("Could not create draft (open in Front).");
    }
  }, [brandColor, companyName, contact, secondaryColor]);

  const sendInvoiceDraft = useCallback(
    async (invoice: Invoice) => {
      setDraftStatus(null);
      try {
        const FrontMod = await import("@frontapp/plugin-sdk");
        const html = generateInvoiceDraftHtml(
          contact,
          invoice,
          companyName,
          brandColor,
        );
        await getFrontConversationBridge(FrontMod.default).createDraft({
          content: { body: html, type: "html" },
        });
        setDraftStatus("Invoice draft saved in Front.");
      } catch {
        setDraftStatus("Could not create draft (open in Front).");
      }
    },
    [brandColor, companyName, contact],
  );

  const sections: Record<SectionId, { count: number; node: ReactNode }> = {
    properties: {
      count: contact.properties.length,
      node: <PropertiesSection items={contact.properties} />,
    },
    quotes: {
      count: contact.quotes.length,
      node: <QuotesSection items={contact.quotes} />,
    },
    cases: {
      count: contact.cases.length,
      node: (
        <CasesSection
          items={contact.cases}
          overridesText={caseOverridesRaw}
        />
      ),
    },
    workOrders: {
      count: contact.workOrders.length,
      node: <WorkOrdersSection items={contact.workOrders} />,
    },
    contracts: {
      count: contact.contracts.length,
      node: <ContractsSection items={contact.contracts} />,
    },
    invoices: {
      count: contact.invoices.length,
      node: (
        <InvoicesSection
          items={contact.invoices}
          onSendInvoice={sendInvoiceDraft}
        />
      ),
    },
    timeline: {
      count: contact.timeline.length,
      node: <TimelineSection items={contact.timeline} />,
    },
    attachments: {
      count: contact.attachments.length,
      node: <AttachmentsSection items={contact.attachments} />,
    },
  };

  return (
    <div className="mx-auto flex w-full max-w-[300px] flex-col gap-3 px-3 pb-8 pt-3">
      <ContactCard contact={contact} customFields={customContactFields} />
      <button
        type="button"
        onClick={() => void sendSummaryDraft()}
        className="text-center text-[12px] font-medium text-[var(--secondary-color)] underline-offset-2 hover:underline"
      >
        Email full summary as draft
      </button>
      {draftStatus ? (
        <p className="text-center text-[11px] text-zinc-500">{draftStatus}</p>
      ) : null}
      {sectionOrder.map((id) => {
        if (!visibleSections[id]) return null;
        const meta = sections[id];
        if (!meta) return null;
        const Icon = SECTION_ICONS[id];
        const isInvoices = id === "invoices";
        return (
          <CollapsibleSection
            key={id}
            icon={Icon}
            title={SECTION_LABELS[id]}
            count={meta.count}
            variant={isInvoices ? "accordion" : "nav"}
            defaultOpen={isInvoices}
          >
            {meta.node}
          </CollapsibleSection>
        );
      })}
    </div>
  );
}
