import type { Attachment } from "@/types/contact";

type MaybeRecord = Record<string, unknown>;

function asRecord(value: unknown): MaybeRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as MaybeRecord;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function inferCategory(name?: string, contentType?: string): string {
  const lowerName = name?.toLowerCase() ?? "";
  if (lowerName.endsWith(".pdf")) return "PDF";
  if (lowerName.endsWith(".doc") || lowerName.endsWith(".docx")) return "Document";
  if (lowerName.endsWith(".xls") || lowerName.endsWith(".xlsx")) return "Spreadsheet";
  if (lowerName.endsWith(".png") || lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) {
    return "Image";
  }
  if (contentType) {
    const [main] = contentType.split("/");
    if (main) return main.charAt(0).toUpperCase() + main.slice(1);
  }
  return "Attachment";
}

function getMessageDateIso(message: MaybeRecord): string {
  const dateValue = message.date;
  if (dateValue instanceof Date) return dateValue.toISOString();
  if (typeof dateValue === "string" || typeof dateValue === "number") {
    const parsed = new Date(dateValue).toISOString();
    if (parsed !== "Invalid Date") return parsed;
  }
  return new Date().toISOString();
}

function getMessageId(message: MaybeRecord): string | undefined {
  return asString(message.id);
}

function getAttachmentArray(message: MaybeRecord): unknown[] {
  const content = asRecord(message.content);
  if (content && Array.isArray(content.attachments)) return content.attachments;
  if (Array.isArray(message.attachments)) return message.attachments;
  return [];
}

export function extractAttachmentsFromMessages(messages: unknown[]): Attachment[] {
  const results: Attachment[] = [];
  const seen = new Set<string>();

  for (const rawMessage of messages) {
    const message = asRecord(rawMessage);
    if (!message) continue;

    const messageId = getMessageId(message) ?? "message";
    const uploadedAt = getMessageDateIso(message);
    const attachments = getAttachmentArray(message);

    attachments.forEach((rawAttachment, index) => {
      const attachment = asRecord(rawAttachment);
      if (!attachment) return;

      const rawId = asString(attachment.id);
      const name = asString(attachment.name) ?? `Attachment ${index + 1}`;
      const contentType = asString(attachment.contentType) ?? asString(attachment.type);
      const url = asString(attachment.url) ?? asString(attachment.downloadUrl);

      const id = rawId ?? `${messageId}-att-${index}-${name}`;
      if (seen.has(id)) return;
      seen.add(id);

      results.push({
        id,
        name,
        category: inferCategory(name, contentType),
        url,
        uploadedAt,
      });
    });
  }

  return results;
}
