"use client";

import Link from "next/link";
import { ExternalLink, Menu, Sun, X } from "lucide-react";
import { useState } from "react";

export function Header({
  title,
  logoUrl,
  onTogglePanelTheme,
}: {
  title: string;
  logoUrl: string | null;
  onTogglePanelTheme: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-20 text-white shadow-sm"
      style={{ background: "var(--brand-color)" }}
    >
      <div className="flex min-h-[52px] items-center gap-2 px-3 py-2.5 sm:px-4 md:min-h-[56px] md:rounded-t-2xl md:px-5">
        {logoUrl ? (
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/20 bg-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-[10px] font-bold tracking-tight text-white">
            LRG
          </div>
        )}
        <h1 className="min-w-0 flex-1 text-[15px] font-semibold leading-tight text-white [overflow-wrap:anywhere] line-clamp-2 md:text-[16px]">
          {title}
        </h1>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white/90 hover:bg-white/10"
            aria-label="Toggle panel background"
            onClick={onTogglePanelTheme}
          >
            <Sun className="h-5 w-5" />
          </button>
          <div className="relative">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white/90 hover:bg-white/10"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            {open ? (
              <nav
                className="absolute right-0 top-full z-30 mt-1 min-w-[13.75rem] rounded-lg border border-zinc-200 bg-white py-1 text-zinc-800 shadow-lg"
                role="menu"
              >
                <Link
                  href="/"
                  className="block px-3 py-2 text-[13px] hover:bg-zinc-50"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                >
                  Dashboard
                </Link>
                <Link
                  href="/crm"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Opens in a new browser tab"
                  aria-label="Back Office View (opens in new tab)"
                  className="group flex items-center justify-between gap-2 px-3 py-2 text-[13px] hover:bg-zinc-50"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                >
                  <span>Back Office View</span>
                  <ExternalLink
                    className="h-3.5 w-3.5 shrink-0 text-zinc-400 transition-colors group-hover:text-zinc-700"
                    aria-hidden
                  />
                </Link>
                <Link
                  href="/crm?tab=admin"
                  className="block px-3 py-2 text-[13px] hover:bg-zinc-50"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                >
                  Admin centre
                </Link>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
