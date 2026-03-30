"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useDemoConfig } from "@/hooks/useDemoConfig";

export function PluginShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { appTitle, logoUrl } = useDemoConfig();
  const [panelDark, setPanelDark] = useState(false);

  if (pathname?.startsWith("/view")) {
    return (
      <div className="min-h-dvh w-full bg-zinc-100 text-zinc-900">{children}</div>
    );
  }

  const shellSurface = panelDark ? "bg-zinc-900" : "bg-[#f4f4f5]";

  return (
    <div className="flex min-h-dvh w-full justify-center bg-zinc-100">
      <div
        className={`flex min-h-dvh w-full max-w-[min(100%,72rem)] flex-col border-x border-zinc-200/80 shadow-md md:my-4 md:max-h-[calc(100dvh-2rem)] md:min-h-[calc(100dvh-2rem)] md:rounded-2xl md:border md:shadow-xl ${shellSurface}`}
      >
        <Header
          title={appTitle}
          logoUrl={logoUrl}
          onTogglePanelTheme={() => setPanelDark((d) => !d)}
        />
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
