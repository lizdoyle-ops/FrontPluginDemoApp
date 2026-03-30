import { getFrontConversationBridge } from "@/lib/front/frontBridge";

/**
 * Creates a composer draft. When `replyToMessageId` is set (inside Front on a conversation),
 * passes `replyOptions: { type: 'reply', originalMessageId }` so the draft is a reply in the
 * current thread (see Front Plugin SDK / ApplicationDraftTemplate.replyOptions).
 */
export async function createHtmlDraftReply(
  frontDefault: unknown,
  html: string,
  replyToMessageId?: string | null,
): Promise<void> {
  const bridge = getFrontConversationBridge(frontDefault);
  const content = { body: html, type: "html" as const };
  const id = replyToMessageId?.trim();
  if (id) {
    await bridge.createDraft({
      replyOptions: {
        type: "reply",
        originalMessageId: id,
      },
      content,
    });
    return;
  }
  await bridge.createDraft({ content });
}
