import { z } from "zod";

export const propertySchema = z.object({
  id: z.string(),
  address: z.string(),
  city: z.string(),
  postcode: z.string(),
  status: z.enum(["active", "pending", "completed"]),
  rentMonthly: z.number().optional(),
  notes: z.string().optional(),
});

export const quoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(["pending", "accepted", "expired"]),
  validUntil: z.string().optional(),
});

export const inquirySchema = z.object({
  id: z.string(),
  subject: z.string(),
  date: z.string(),
  channel: z.string(),
});

export const caseSchema = z.object({
  id: z.string(),
  subject: z.string(),
  status: z.enum(["open", "in_progress", "resolved"]),
  openedAt: z.string(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

export const workOrderSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(["scheduled", "in_progress", "completed"]),
  type: z.enum(["maintenance", "repair", "inspection", "cleaning"]),
  scheduledFor: z.string().optional(),
  propertyId: z.string().optional(),
});

export const contractSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(["lease", "service", "vendor", "corporate"]),
  status: z.enum(["active", "expired", "pending_renewal"]),
  startDate: z.string(),
  endDate: z.string().optional(),
});

export const invoiceSchema = z.object({
  id: z.string(),
  reference: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(["draft", "pending", "paid", "overdue"]),
  dueDate: z.string().optional(),
  title: z.string().optional(),
  propertySummary: z.string().optional(),
  workOrderRef: z.string().optional(),
  category: z.string().optional(),
  issuedDate: z.string().optional(),
  paidDate: z.string().optional(),
  vendorName: z.string().optional(),
});

export const timelineSchema = z.object({
  type: z.enum([
    "inquiry",
    "quote",
    "reservation",
    "note",
    "contract",
    "payment",
  ]),
  title: z.string(),
  date: z.string(),
  detail: z.string().optional(),
});

export const attachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  url: z.string().optional(),
  uploadedAt: z.string(),
});

/** String map with required unique `id`; server fills `id` if omitted or empty. */
export const customListRowSchema = z
  .record(z.string(), z.string())
  .transform((row) => {
    const id = row.id?.trim();
    if (id) return { ...row, id };
    return {
      ...row,
      id: `clr-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    };
  });

const stringRow = customListRowSchema;

export const contactDataSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  company: z.string(),
  role: z.string(),
  segment: z.string(),
  tags: z.array(z.string()),
  properties: z.array(propertySchema),
  quotes: z.array(quoteSchema),
  inquiries: z.array(inquirySchema),
  cases: z.array(caseSchema),
  workOrders: z.array(workOrderSchema),
  contracts: z.array(contractSchema),
  timeline: z.array(timelineSchema),
  attachments: z.array(attachmentSchema),
  invoices: z.array(invoiceSchema),
  customLists: z.record(z.string(), z.array(stringRow)).optional(),
});

export const contactPatchSchema = contactDataSchema.partial();
