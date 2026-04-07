import type { ContactData } from "@/types/contact";

export function emptyContact(email: string, name: string): ContactData {
  const e = email.trim();
  const n = name.trim();
  return {
    email: e,
    name: n,
    company: "",
    role: "",
    segment: "",
    tags: [],
    properties: [],
    quotes: [],
    inquiries: [],
    cases: [],
    opportunities: [],
    workOrders: [],
    contracts: [],
    timeline: [],
    attachments: [],
    invoices: [],
    customLists: {},
  };
}
