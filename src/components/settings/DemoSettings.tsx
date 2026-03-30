"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Legacy entry: demo configuration now lives in CRM → Admin centre.
 * Kept so older imports or branches still typecheck; `/settings` redirects server-side.
 */
export function DemoSettings() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/crm?tab=admin");
  }, [router]);
  return (
    <div className="flex min-h-[40dvh] items-center justify-center p-6 text-[13px] text-zinc-500">
      Redirecting to Admin centre…
    </div>
  );
}
