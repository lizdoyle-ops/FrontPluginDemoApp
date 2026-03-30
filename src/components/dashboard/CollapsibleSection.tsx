"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

export function CollapsibleSection({
  icon: Icon,
  title,
  count,
  variant = "nav",
  defaultOpen = false,
  children,
}: {
  icon: LucideIcon;
  title: string;
  count: number;
  variant?: "accordion" | "nav";
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const label = `${title} (${count})`;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full min-h-[48px] items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-zinc-50/90"
        aria-expanded={open}
      >
        <Icon
          className="h-[18px] w-[18px] shrink-0 text-zinc-500"
          strokeWidth={2}
        />
        <span className="min-w-0 flex-1 text-[14px] font-semibold text-zinc-900">
          {label}
        </span>
        {variant === "nav" && !open ? (
          <ChevronRight className="h-5 w-5 shrink-0 text-zinc-400" />
        ) : (
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>
      {open ? (
        <div className="border-t border-zinc-100 px-3.5 py-3 text-[13px] text-zinc-700">
          {children}
        </div>
      ) : null}
    </div>
  );
}
