/**
 * Choose a message id for createDraft({ replyOptions }).
 * Uses the most recent message in the thread (by `date`) so the draft is a reply in the same conversation.
 */
export function pickReplyMessageId(messages: unknown[]): string | undefined {
  type Msg = { id?: unknown; date?: unknown };
  const scored: { id: string; t: number }[] = [];
  for (const m of messages) {
    if (!m || typeof m !== "object") continue;
    const o = m as Msg;
    if (typeof o.id !== "string" || !o.id) continue;
    const d = o.date;
    let t = 0;
    if (d instanceof Date) t = d.getTime();
    else if (typeof d === "string" || typeof d === "number") {
      const ms = new Date(d).getTime();
      t = Number.isNaN(ms) ? 0 : ms;
    }
    scored.push({ id: o.id, t });
  }
  if (!scored.length) return undefined;
  scored.sort((a, b) => b.t - a.t);
  return scored[0].id;
}
