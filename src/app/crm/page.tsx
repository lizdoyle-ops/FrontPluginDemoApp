import { Suspense } from "react";
import { CrmHomeClient } from "@/components/crm/CrmHomeClient";

export const dynamic = "force-dynamic";

export default function CrmPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-zinc-100 text-[13px] text-zinc-500">
          Loading CRM…
        </div>
      }
    >
      <CrmHomeClient />
    </Suspense>
  );
}
