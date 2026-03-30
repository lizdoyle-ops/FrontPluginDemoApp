"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Front, {
  contextUpdates,
  delegateNewWindowsToFront,
} from "@frontapp/plugin-sdk";
import { getFrontConversationBridge } from "@/lib/front/frontBridge";
import { ContactDashboard } from "@/components/dashboard/ContactDashboard";
import {
  extractEmailsFromMessages,
  normalizeMessageList,
} from "@/lib/front/contactDetection";
import { fetchContactData } from "@/lib/front/fetchContact";
import { useDemoConfig } from "@/hooks/useDemoConfig";
import type { ContactData } from "@/types/contact";
import { MOCK_CONTACTS } from "@/data/mockData";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; contact: ContactData }
  | { status: "no_contact" }
  | { status: "error"; message: string };

async function collectMessages(): Promise<unknown[]> {
  const bridge = getFrontConversationBridge(Front);
  const acc: unknown[] = [];
  let token: unknown = undefined;
  for (let i = 0; i < 8; i++) {
    const page = await bridge.listMessages(token);
    const batch = normalizeMessageList(page);
    acc.push(...batch);
    if (page && typeof page === "object" && !Array.isArray(page)) {
      const next = (page as { nextPageToken?: unknown }).nextPageToken;
      token = next;
      if (!next) break;
    } else {
      break;
    }
  }
  return acc;
}

export function DashboardPage() {
  const searchParams = useSearchParams();
  const config = useDemoConfig();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  const resolveContact = useCallback(async () => {
    const demo = searchParams.get("demo");
    if (demo) {
      const c = await fetchContactData(demo);
      if (c) {
        setState({ status: "ready", contact: c });
        return;
      }
    }

    try {
      const messages = await collectMessages();
      const emails = extractEmailsFromMessages(messages);
      for (const email of emails) {
        const c = await fetchContactData(email);
        if (c) {
          setState({ status: "ready", contact: c });
          return;
        }
      }
      setState({ status: "no_contact" });
    } catch {
      setState({
        status: "error",
        message: "Could not load conversation messages.",
      });
    }
  }, [searchParams]);

  useEffect(() => {
    delegateNewWindowsToFront();
  }, []);

  useEffect(() => {
    const sub = contextUpdates.subscribe(() => {
      queueMicrotask(() => void resolveContact());
    });
    queueMicrotask(() => void resolveContact());
    return () => sub.unsubscribe();
  }, [resolveContact]);

  const demoKeys = Object.keys(MOCK_CONTACTS).join(", ");

  if (state.status === "loading") {
    return (
      <div className="p-4 text-center text-[13px] text-zinc-500">
        Loading conversation…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="p-4 text-[13px] text-red-700">{state.message}</div>
    );
  }

  if (state.status === "no_contact") {
    return (
      <div className="space-y-3 p-4 text-[13px] text-zinc-600">
        <p>No matching property contact for this conversation.</p>
        <p className="text-[12px] text-zinc-500">
          Demo emails: {demoKeys}
        </p>
        <p className="text-[12px] text-zinc-500">
          Append{" "}
          <code className="rounded bg-zinc-100 px-1">?demo=email</code> to
          preview outside Front.
        </p>
      </div>
    );
  }

  return (
    <ContactDashboard
      contact={state.contact}
      sectionOrder={config.sectionOrder}
      visibleSections={config.visibleSections}
      customContactFields={config.customContactFields}
      companyName={config.companyName}
      brandColor={config.brandColor}
      secondaryColor={config.secondaryColor}
      caseOverridesRaw={config.caseOverridesRaw}
    />
  );
}
