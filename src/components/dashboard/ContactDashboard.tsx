"use client";

import {
  Banknote,
  Clock,
  FileSignature,
  FileText,
  Headphones,
  Home,
  Layers,
  Paperclip,
  ShoppingCart,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CollapsibleSection } from "@/components/dashboard/CollapsibleSection";
import { ContactCard } from "@/components/dashboard/ContactCard";
import { AttachmentsSection } from "@/components/dashboard/sections/AttachmentsSection";
import { CasesSection } from "@/components/dashboard/sections/CasesSection";
import { ContractsSection } from "@/components/dashboard/sections/ContractsSection";
import { DynamicCustomListSection } from "@/components/dashboard/sections/DynamicCustomListSection";
import { InvoicesSection } from "@/components/dashboard/sections/InvoicesSection";
import { OpportunitiesSection } from "@/components/dashboard/sections/OpportunitiesSection";
import { OrdersSection } from "@/components/dashboard/sections/OrdersSection";
import { PropertiesSection } from "@/components/dashboard/sections/PropertiesSection";
import { QuotesSection } from "@/components/dashboard/sections/QuotesSection";
import { TimelineSection } from "@/components/dashboard/sections/TimelineSection";
import { WorkOrdersSection } from "@/components/dashboard/sections/WorkOrdersSection";
import type { EmailBranding } from "@/lib/email/emailBranding";
import { generateEmailTemplate } from "@/lib/email/generateEmailTemplate";
import { generateInvoiceDraftHtml } from "@/lib/email/generateInvoiceDraftHtml";
import type {
  ContactData,
  CustomObjectDefinition,
  Invoice,
  SectionId,
} from "@/types/contact";
import { createHtmlDraftReply } from "@/lib/front/createHtmlDraftReply";

const SECTION_LABELS: Record<SectionId, string> = {
  properties: "Properties",
  quotes: "Quotes",
  opportunities: "Opportunities",
  orders: "Orders",
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
  opportunities: TrendingUp,
  orders: ShoppingCart,
  cases: Headphones,
  workOrders: Wrench,
  contracts: FileSignature,
  invoices: Banknote,
  timeline: Clock,
  attachments: Paperclip,
};

export function ContactDashboard({
  contact,
  replyToMessageId,
  sectionOrder,
  visibleSections,
  companyName,
  brandColor,
  secondaryColor,
  logoUrl,
  appTitle,
  customObjectDefinitions,
  customObjectOrder,
  visibleCustomObjects,
}: {
  contact: ContactData;
  replyToMessageId: string | null;
  sectionOrder: SectionId[];
  visibleSections: Record<SectionId, boolean>;
  companyName: string;
  brandColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  appTitle: string;
  customObjectDefinitions: CustomObjectDefinition[];
  customObjectOrder: string[];
  visibleCustomObjects: Record<string, boolean>;
}) {
  const [draftStatus, setDraftStatus] = useState<string | null>(null);

  const defById = useMemo(
    () =>
      Object.fromEntries(
        customObjectDefinitions.map((d) => [d.id, d]),
      ) as Record<string, CustomObjectDefinition>,
    [customObjectDefinitions],
  );

  const emailBranding: EmailBranding = useMemo(
    () => ({
      companyName,
      brandColor,
      secondaryColor,
      logoUrl,
      appTitle,
    }),
    [appTitle, brandColor, companyName, logoUrl, secondaryColor],
  );

  const sendSummaryDraft = useCallback(async () => {
    setDraftStatus(null);
    try {
      const FrontMod = await import("@frontapp/plugin-sdk");
      const html = generateEmailTemplate(contact, emailBranding);
      await createHtmlDraftReply(FrontMod.default, html, replyToMessageId);
      setDraftStatus(
        replyToMessageId
          ? "Reply draft saved in this conversation."
          : "Draft saved (open inside a Front conversation for threaded reply).",
      );
    } catch {
      setDraftStatus("Could not create draft (open in Front).");
    }
  }, [contact, emailBranding, replyToMessageId]);

  const sendInvoiceDraft = useCallback(
    async (invoice: Invoice) => {
      setDraftStatus(null);
      try {
        const FrontMod = await import("@frontapp/plugin-sdk");
        const html = generateInvoiceDraftHtml(
          contact,
          invoice,
          emailBranding,
        );
        await createHtmlDraftReply(FrontMod.default, html, replyToMessageId);
        setDraftStatus(
          replyToMessageId
            ? "Invoice reply draft saved in this conversation."
            : "Draft saved (open inside a Front conversation for threaded reply).",
        );
      } catch {
        setDraftStatus("Could not create draft (open in Front).");
      }
    },
    [contact, emailBranding, replyToMessageId],
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
    opportunities: {
      count: contact.opportunities.length,
      node: <OpportunitiesSection items={contact.opportunities} />,
    },
    orders: {
      count: contact.orders.length,
      node: <OrdersSection items={contact.orders} />,
    },
    cases: {
      count: contact.cases.length,
      node: <CasesSection items={contact.cases} />,
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

  const customLists = contact.customLists ?? {};

  return (
    <div className="mx-auto flex w-full max-w-full flex-col gap-3 px-3 pb-8 pt-3 sm:px-4 lg:gap-4 lg:px-6">
      <ContactCard contact={contact} />
      <button
        type="button"
        onClick={() => void sendSummaryDraft()}
        className="text-center text-[12px] font-medium text-[var(--secondary-color)] underline-offset-2 hover:underline lg:text-[13px]"
      >
        Email full summary as draft
      </button>
      {draftStatus ? (
        <p className="text-center text-[11px] text-zinc-500">{draftStatus}</p>
      ) : null}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4 lg:items-start">
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
              defaultOpen={false}
            >
              {meta.node}
            </CollapsibleSection>
          );
        })}
        {customObjectOrder.map((oid) => {
          if (visibleCustomObjects[oid] === false) return null;
          const def = defById[oid];
          if (!def) return null;
          const rows = customLists[oid] ?? [];
          return (
            <CollapsibleSection
              key={`custom-${oid}`}
              icon={Layers}
              title={def.title}
              count={rows.length}
              variant="nav"
              defaultOpen={false}
            >
              <DynamicCustomListSection
                fieldKeys={def.fieldKeys}
                rows={rows}
              />
            </CollapsibleSection>
          );
        })}
      </div>
    </div>
  );
}
