export type PropertyStatus = "active" | "pending" | "completed";

export interface Property {
  id: string;
  address: string;
  city: string;
  postcode: string;
  status: PropertyStatus;
  rentMonthly?: number;
  notes?: string;
}

export type QuoteStatus = "pending" | "accepted" | "expired";

export interface Quote {
  id: string;
  title: string;
  amount: number;
  currency: string;
  status: QuoteStatus;
  validUntil?: string;
}

export interface Inquiry {
  id: string;
  subject: string;
  date: string;
  channel: string;
}

export type CaseStatus = "open" | "in_progress" | "resolved";

export interface Case {
  id: string;
  subject: string;
  status: CaseStatus;
  openedAt: string;
  priority?: "low" | "medium" | "high";
}

export type OpportunityStage =
  | "prospecting"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export interface Opportunity {
  id: string;
  title: string;
  stage: OpportunityStage;
  amount?: number;
  currency?: string;
  expectedCloseDate?: string;
  notes?: string;
}

export type WorkOrderType =
  | "maintenance"
  | "repair"
  | "inspection"
  | "cleaning";

export type WorkOrderStatus = "scheduled" | "in_progress" | "completed";

export interface WorkOrder {
  id: string;
  title: string;
  type: WorkOrderType;
  status: WorkOrderStatus;
  scheduledFor?: string;
  propertyId?: string;
}

export type ContractType =
  | "lease"
  | "service"
  | "vendor"
  | "corporate";

export type ContractStatus = "active" | "expired" | "pending_renewal";

export interface Contract {
  id: string;
  title: string;
  type: ContractType;
  status: ContractStatus;
  startDate: string;
  endDate?: string;
}

export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue";

export interface Invoice {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate?: string;
  /** Card title (e.g. work description). */
  title?: string;
  /** One-line address or property summary. */
  propertySummary?: string;
  workOrderRef?: string;
  category?: string;
  issuedDate?: string;
  paidDate?: string;
  vendorName?: string;
}

export type TimelineEventType =
  | "inquiry"
  | "quote"
  | "reservation"
  | "note"
  | "contract"
  | "payment";

/** Timeline entries are not keyed by id (order / date only). */
export interface TimelineEvent {
  type: TimelineEventType;
  title: string;
  date: string;
  detail?: string;
}

export interface Attachment {
  id: string;
  name: string;
  category: string;
  url?: string;
  uploadedAt: string;
}

/** Custom list row: stable unique id plus string field values (admin-defined keys). */
export type CustomListRow = { id: string } & Record<string, string>;

export interface ContactData {
  email: string;
  name: string;
  company: string;
  role: string;
  segment: string;
  tags: string[];
  properties: Property[];
  quotes: Quote[];
  inquiries: Inquiry[];
  cases: Case[];
  opportunities: Opportunity[];
  workOrders: WorkOrder[];
  contracts: Contract[];
  timeline: TimelineEvent[];
  attachments: Attachment[];
  invoices: Invoice[];
  /** Rows for user-defined object types (Admin centre); keyed by CustomObjectDefinition.id */
  customLists?: Record<string, CustomListRow[]>;
}

/** Configurable list object shown on the plugin dashboard (admin-defined fields). */
export interface CustomObjectDefinition {
  id: string;
  title: string;
  /** Column keys / field ids for each row */
  fieldKeys: string[];
}

export const SECTION_IDS = [
  "properties",
  "quotes",
  "opportunities",
  "cases",
  "workOrders",
  "contracts",
  "invoices",
  "timeline",
  "attachments",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const DEFAULT_SECTION_ORDER: SectionId[] = [...SECTION_IDS];
