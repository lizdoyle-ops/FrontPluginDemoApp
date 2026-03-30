import { Suspense } from "react";
import { DashboardPage } from "@/components/pages/DashboardPage";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-center text-[13px] text-zinc-500">
          Loading…
        </div>
      }
    >
      <DashboardPage />
    </Suspense>
  );
}
