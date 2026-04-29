import { z } from "zod";
import { SECTION_IDS } from "@/types/contact";

const sectionIdSchema = z.enum(
  SECTION_IDS as unknown as [string, ...string[]],
);

const customObjectDefinitionSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  fieldKeys: z.array(z.string()),
});

/** Full demo admin payload stored in Postgres / mirrored in localStorage. */
export const demoAdminConfigPayloadSchema = z.object({
  appTitle: z.string(),
  companyName: z.string(),
  brandColor: z.string(),
  secondaryColor: z.string(),
  logoUrl: z.string().nullable(),
  sectionOrder: z.array(sectionIdSchema),
  visibleSections: z.record(sectionIdSchema, z.boolean()),
  customObjectDefinitions: z.array(customObjectDefinitionSchema),
  customObjectOrder: z.array(z.string()),
  visibleCustomObjects: z.record(z.string(), z.boolean()),
});

export type DemoAdminConfigPayload = z.infer<typeof demoAdminConfigPayloadSchema>;
