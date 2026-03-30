import type { Attachment } from "@/types/contact";

export function AttachmentsSection({ items }: { items: Attachment[] }) {
  if (!items?.length) {
    return <p className="text-zinc-500">No attachments.</p>;
  }
  return (
    <ul className="space-y-1.5">
      {items.map((a) => (
        <li
          key={a.id}
          className="flex items-center justify-between gap-2 rounded-md border border-zinc-100 px-2 py-1.5"
        >
          <span className="truncate font-medium text-zinc-800">{a.name}</span>
          <span className="shrink-0 text-[11px] text-zinc-500">{a.category}</span>
        </li>
      ))}
    </ul>
  );
}
