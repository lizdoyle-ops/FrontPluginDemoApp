"use client";

import { Building2, Briefcase, Mail, Tag, User } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DynamicIcon } from "@/lib/icons";
import type { ContactData, CustomContactField } from "@/types/contact";

export function ContactCard({
  contact,
  customFields,
}: {
  contact: ContactData;
  customFields: CustomContactField[];
}) {
  const firstName = contact.name.trim().split(/\s+/)[0] || contact.name;
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-zinc-900">
        <User className="h-4 w-4 shrink-0 text-zinc-500" strokeWidth={2} />
        <span className="text-[14px] font-semibold">Contact Information</span>
      </div>
      <div className="flex gap-3">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white shadow-inner"
          style={{ background: "var(--brand-color)" }}
          aria-hidden
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[16px] font-bold leading-tight text-zinc-900">
            {firstName}
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-[12px] text-zinc-500">
            <Mail className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
            <span className="truncate">{contact.email}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[12px] text-zinc-600">
            <User className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden />
            <span>{contact.role}</span>
          </div>
        </div>
      </div>
      {(contact.company || contact.segment) && (
        <div className="mt-3 space-y-1 border-t border-zinc-100 pt-3 text-[11px] text-zinc-500">
          {contact.company ? (
            <div className="flex items-start gap-1">
              <Building2 className="mt-0.5 h-3 w-3 shrink-0 text-zinc-400" />
              <span>{contact.company}</span>
            </div>
          ) : null}
          {contact.segment ? (
            <div className="flex items-start gap-1">
              <Briefcase className="mt-0.5 h-3 w-3 shrink-0 text-zinc-400" />
              <span>{contact.segment}</span>
            </div>
          ) : null}
        </div>
      )}
      {contact.tags?.length ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {contact.tags.map((t) => (
            <Badge key={t} variant="info" className="gap-0.5 text-[10px]">
              <Tag className="h-3 w-3" aria-hidden />
              {t}
            </Badge>
          ))}
        </div>
      ) : null}
      {customFields.length ? (
        <ul className="mt-3 space-y-2 border-t border-zinc-100 pt-3">
          {customFields.map((f) => (
            <li key={f.id} className="flex items-start gap-2 text-[12px]">
              <DynamicIcon
                name={f.icon}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--secondary-color)]"
                aria-hidden
              />
              <div>
                <div className="text-[11px] text-zinc-500">{f.label}</div>
                <div className="text-zinc-800">{f.value}</div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
