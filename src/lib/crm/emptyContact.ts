import type { ContactData } from "@/types/contact";
import { emptyCover, emptyPolicyholder } from "@/types/insurance";

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
    orders: [],
    workOrders: [],
    contracts: [],
    timeline: [],
    attachments: [],
    pets: [],
    policies: [],
    policyholder: emptyPolicyholder(),
    cover: emptyCover(),
    claimsHistory: [],
    invoices: [],
    customLists: {},
  };
}
