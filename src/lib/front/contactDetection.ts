function pushEmail(set: Set<string>, raw: unknown) {
  if (typeof raw !== "string") return;
  const e = raw.trim().toLowerCase();
  if (e.includes("@")) set.add(e);
}

function fromRecipientLike(obj: unknown): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const r = obj as Record<string, unknown>;
  if (typeof r.handle === "string") return r.handle;
  if (typeof r.email === "string") return r.email;
  return undefined;
}

function fromAuthorLike(obj: unknown): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const a = obj as Record<string, unknown>;
  if (typeof a.email === "string") return a.email;
  return fromRecipientLike(a);
}

/**
 * Extract unique email handles from Front messages or loosely-typed API payloads.
 */
export function extractEmailsFromMessages(messages: unknown[]): string[] {
  const set = new Set<string>();
  for (const msg of messages) {
    if (!msg || typeof msg !== "object") continue;
    const m = msg as Record<string, unknown>;
    pushEmail(set, fromAuthorLike(m.author));
    pushEmail(set, fromAuthorLike(m.sender));
    pushEmail(set, fromAuthorLike(m.from));
    const recipients = m.recipients;
    if (Array.isArray(recipients)) {
      for (const rec of recipients) pushEmail(set, fromRecipientLike(rec));
    }
    const to = m.to;
    if (Array.isArray(to)) {
      for (const rec of to) pushEmail(set, fromRecipientLike(rec));
    }
    const cc = m.cc;
    if (Array.isArray(cc)) {
      for (const rec of cc) pushEmail(set, fromRecipientLike(rec));
    }
  }
  return [...set];
}

export function normalizeMessageList(response: unknown): unknown[] {
  if (Array.isArray(response)) return response;
  if (response && typeof response === "object") {
    const r = response as { results?: unknown[] };
    if (Array.isArray(r.results)) return r.results;
  }
  return [];
}
