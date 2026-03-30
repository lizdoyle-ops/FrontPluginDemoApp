"use client";

import Link from "next/link";
import { Menu, Sun, X } from "lucide-react";
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
      <div className="flex min-h-[52px] items-center gap-2 px-3 py-2.5">
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
        <h1 className="min-w-0 flex-1 truncate text-[15px] font-semibold leading-tight text-white">
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
                className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-zinc-200 bg-white py-1 text-zinc-800 shadow-lg"
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
                  href="/settings"
                  className="block px-3 py-2 text-[13px] hover:bg-zinc-50"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                >
                  Demo settings
                </Link>
                <Link
                  href="/settings/data"
                  className="block px-3 py-2 text-[13px] hover:bg-zinc-50"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                >
                  Records (API)
                </Link>
                <Link
                  href="/api-docs"
                  className="block px-3 py-2 text-[13px] hover:bg-zinc-50"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                >
                  API docs · token
                </Link>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
