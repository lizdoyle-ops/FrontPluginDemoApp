/** Narrow bridge for conversation APIs; typings vary by Front context at runtime. */
export type FrontConversationBridge = {
  listMessages: (paginationToken?: unknown) => Promise<unknown>;
  createDraft: (template: unknown) => Promise<unknown>;
};

export function getFrontConversationBridge(
  front: unknown,
): FrontConversationBridge {
  return front as FrontConversationBridge;
}
