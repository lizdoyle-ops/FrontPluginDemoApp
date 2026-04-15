export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Safe double-quoted HTML attributes (e.g. img src). */
export function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/\n/g, " ");
}
