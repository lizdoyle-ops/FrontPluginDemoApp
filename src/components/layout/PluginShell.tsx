"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useDemoConfig } from "@/hooks/useDemoConfig";

export function PluginShell({ children }: { children: React.ReactNode }) {
  const { appTitle, logoUrl } = useDemoConfig();
  const [panelDark, setPanelDark] = useState(false);

  return (
    <div
      className={`mx-auto flex min-h-full w-full max-w-[300px] flex-col border-x border-zinc-200/80 shadow-md ${
        panelDark ? "bg-zinc-900" : "bg-[#f4f4f5]"
      }`}
    >
      <Header
        title={appTitle}
        logoUrl={logoUrl}
        onTogglePanelTheme={() => setPanelDark((d) => !d)}
      />
      <div className="flex-1">{children}</div>
    </div>
  );
}
