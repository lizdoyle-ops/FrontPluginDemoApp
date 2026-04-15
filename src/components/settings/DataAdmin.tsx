"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Legacy entry: records are managed from the CRM workspace.
 * Kept for compatibility; `/settings/data` redirects server-side.
 */
export function DataAdmin() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/crm");
  }, [router]);
  return (
    <div className="flex min-h-[40dvh] items-center justify-center p-6 text-[13px] text-zinc-500">
      Redirecting to CRM…
    </div>
  );
}
