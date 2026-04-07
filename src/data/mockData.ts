import type { ContactData } from "@/types/contact";

export const MOCK_CONTACTS: Record<string, ContactData> = {
  "leyton@finalproduction.club": {
    email: "leyton@finalproduction.club",
    name: "Leyton Chen",
    company: "Final Production Ltd",
    role: "Tenant",
    segment: "VIP Client — Film",
    tags: ["VIP", "Film", "Manchester"],
    properties: [
      {
        id: "p1",
        address: "42 Elm Street",
        city: "Manchester",
        postcode: "M4 2BX",
        status: "active",
        rentMonthly: 2400,
        notes: "Corporate let, 12-month rolling",
      },
    ],
    quotes: [
      {
        id: "q1",
        title: "Location package Q1",
        amount: 18500,
        currency: "GBP",
        status: "accepted",
        validUntil: "2026-04-15",
      },
      {
        id: "q2",
        title: "Additional staging",
        amount: 4200,
        currency: "GBP",
        status: "pending",
        validUntil: "2026-05-01",
      },
    ],
    inquiries: [
      {
        id: "in1",
        subject: "Unit availability April",
        date: "2026-03-12",
        channel: "Email",
      },
    ],
    cases: [
      {
        id: "c1",
        subject: "Heating inspection follow-up",
        status: "in_progress",
        openedAt: "2026-03-18",
        priority: "high",
      },
      {
        id: "c2",
        subject: "Parking permit renewal",
        status: "open",
        openedAt: "2026-03-22",
        priority: "low",
      },
    ],
    opportunities: [
      {
        id: "opp1",
        title: "Q2 location bundle upsell",
        stage: "negotiation",
        amount: 24000,
        currency: "GBP",
        expectedCloseDate: "2026-04-30",
        notes: "Follow up after site visit",
      },
    ],
    workOrders: [
      {
        id: "wo1",
        title: "Boiler service",
        type: "maintenance",
        status: "scheduled",
        scheduledFor: "2026-04-02",
        propertyId: "p1",
      },
      {
        id: "wo2",
        title: "Window seal repair",
        type: "repair",
        status: "in_progress",
        propertyId: "p1",
      },
    ],
    contracts: [
      {
        id: "ct1",
        title: "Master lease — Elm Street",
        type: "lease",
        status: "active",
        startDate: "2025-06-01",
        endDate: "2026-05-31",
      },
    ],
    timeline: [
      {
        type: "inquiry",
        title: "Initial availability request",
        date: "2026-03-10T09:00:00Z",
      },
      {
        type: "quote",
        title: "Location package sent",
        date: "2026-03-11T14:30:00Z",
      },
      {
        type: "reservation",
        title: "Holding deposit received",
        date: "2026-03-14T11:00:00Z",
      },
    ],
    attachments: [
      {
        id: "a1",
        name: "Lease_Addendum_2026.pdf",
        category: "Legal",
        uploadedAt: "2026-03-15",
      },
      {
        id: "a2",
        name: "Insurance_Certificate.pdf",
        category: "Compliance",
        uploadedAt: "2026-03-16",
      },
    ],
    invoices: [
      {
        id: "inv1",
        reference: "INV-1001",
        title: "Kitchen faucet replacement",
        amount: 150,
        currency: "GBP",
        status: "paid",
        propertySummary: "42 Elm Street, Manchester M4 2BX",
        workOrderRef: "WO-1001",
        category: "Maintenance",
        issuedDate: "Jan 21, 2026",
        paidDate: "Jan 21, 2026",
        vendorName: "John Smith - Plumbing",
      },
      {
        id: "inv2",
        reference: "INV-1002",
        title: "HVAC system inspection",
        amount: 320,
        currency: "GBP",
        status: "pending",
        propertySummary: "42 Elm Street, Manchester M4 2BX",
        workOrderRef: "WO-1002",
        category: "Inspection",
        issuedDate: "Jan 18, 2026",
        dueDate: "Feb 01, 2026",
        vendorName: "ClimateCare Services",
      },
    ],
    customLists: {},
  },

  "sarah@zestymedia.club": {
    email: "sarah@zestymedia.club",
    name: "Sarah Martinez",
    company: "Zesty Media Group",
    role: "Operations Director",
    segment: "Bulk Client — Marketing",
    tags: ["Bulk", "Marketing", "Renewal"],
    properties: [
      {
        id: "p2",
        address: "Unit 5, Media Wharf",
        city: "Leeds",
        postcode: "LS1 4DY",
        status: "completed",
        rentMonthly: 8900,
      },
      {
        id: "p3",
        address: "Studio B, Northern Quarter",
        city: "Manchester",
        postcode: "M1 1AE",
        status: "pending",
      },
    ],
    quotes: [
      {
        id: "q3",
        title: "Annual bulk booking renewal",
        amount: 96000,
        currency: "GBP",
        status: "pending",
        validUntil: "2026-04-30",
      },
    ],
    inquiries: [
      {
        id: "in2",
        subject: "2026 rate card",
        date: "2026-03-08",
        channel: "Email",
      },
    ],
    cases: [
      {
        id: "c3",
        subject: "Invoice consolidation",
        status: "resolved",
        openedAt: "2026-02-10",
      },
    ],
    opportunities: [
      {
        id: "opp2",
        title: "2026 bulk booking renewal",
        stage: "proposal",
        amount: 96000,
        currency: "GBP",
        expectedCloseDate: "2026-04-30",
      },
    ],
    workOrders: [
      {
        id: "wo3",
        title: "Post-event deep clean",
        type: "cleaning",
        status: "completed",
        propertyId: "p2",
      },
    ],
    contracts: [
      {
        id: "ct2",
        title: "Corporate housing framework",
        type: "corporate",
        status: "expired",
        startDate: "2024-01-01",
        endDate: "2025-12-31",
      },
    ],
    timeline: [
      {
        type: "contract",
        title: "Framework expired",
        date: "2025-12-31T00:00:00Z",
        detail: "Pending renewal quote",
      },
      {
        type: "quote",
        title: "Renewal quote drafted",
        date: "2026-03-09T10:00:00Z",
      },
    ],
    attachments: [
      {
        id: "a3",
        name: "Bulk_Terms_2024.pdf",
        category: "Legal",
        uploadedAt: "2024-01-05",
      },
    ],
    invoices: [
      {
        id: "inv3",
        reference: "INV-2201",
        amount: 8900,
        currency: "GBP",
        status: "pending",
        dueDate: "2026-04-05",
      },
    ],
    customLists: {},
  },

  "elias@auditlawyer.club": {
    email: "elias@auditlawyer.club",
    name: "Elias Omorin",
    company: "Audit & Counsel LLP",
    role: "Partner",
    segment: "Executive Housing — Legal",
    tags: ["Executive", "Legal", "Multi-site"],
    properties: [
      {
        id: "p4",
        address: "The Chambers, 88 Legal Row",
        city: "London",
        postcode: "EC2A 4NE",
        status: "active",
        rentMonthly: 5200,
      },
      {
        id: "p5",
        address: "Riverside House",
        city: "Bristol",
        postcode: "BS1 6QH",
        status: "active",
        rentMonthly: 3100,
      },
    ],
    quotes: [
      {
        id: "q4",
        title: "Partner relocation bundle",
        amount: 12800,
        currency: "GBP",
        status: "expired",
        validUntil: "2026-02-01",
      },
    ],
    inquiries: [],
    cases: [
      {
        id: "c4",
        subject: "Access fob batch order",
        status: "open",
        openedAt: "2026-03-25",
        priority: "medium",
      },
    ],
    opportunities: [
      {
        id: "opp3",
        title: "Second site — Bristol expansion",
        stage: "qualified",
        amount: 18600,
        currency: "GBP",
        expectedCloseDate: "2026-05-15",
        notes: "Partner approved budget range",
      },
    ],
    workOrders: [
      {
        id: "wo4",
        title: "Annual safety inspection — London",
        type: "inspection",
        status: "scheduled",
        scheduledFor: "2026-04-10",
        propertyId: "p4",
      },
    ],
    contracts: [
      {
        id: "ct3",
        title: "Vendor agreement — security",
        type: "vendor",
        status: "active",
        startDate: "2025-09-01",
      },
      {
        id: "ct4",
        title: "Service retainer — concierge",
        type: "service",
        status: "active",
        startDate: "2025-11-01",
      },
    ],
    timeline: [
      {
        type: "payment",
        title: "Q1 retainer received",
        date: "2026-03-01T08:00:00Z",
      },
    ],
    attachments: [
      {
        id: "a4",
        name: "NDA_Executive_Housing.pdf",
        category: "Legal",
        uploadedAt: "2025-08-20",
      },
    ],
    invoices: [
      {
        id: "inv4",
        reference: "INV-9001",
        amount: 5200,
        currency: "GBP",
        status: "paid",
      },
      {
        id: "inv5",
        reference: "INV-9002",
        amount: 3100,
        currency: "GBP",
        status: "draft",
      },
    ],
    customLists: {},
  },
};

export function getMockContact(email: string): ContactData | undefined {
  const key = email.trim().toLowerCase();
  const entry = MOCK_CONTACTS[key];
  if (entry) return entry;
  return Object.values(MOCK_CONTACTS).find(
    (c) => c.email.toLowerCase() === key,
  );
}
