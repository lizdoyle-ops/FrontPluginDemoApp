import type { Attachment } from "@/types/contact";
import { RecordIdLine } from "@/components/ui/RecordIdLine";

export function AttachmentsSection({ items }: { items: Attachment[] }) {
  if (!items?.length) {
    return <p className="text-zinc-500">No attachments.</p>;
  }
  return (
    <ul className="space-y-1.5">
      {items.map((a) => (
        <li
          key={a.id}
          className="flex flex-col gap-1 rounded-md border border-zinc-100 px-2 py-1.5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 flex-1">
            <RecordIdLine id={a.id} />
            <span className="block truncate font-medium text-zinc-800">
              {a.name}
            </span>
          </div>
          <span className="shrink-0 text-[11px] text-zinc-500">{a.category}</span>
        </li>
      ))}
    </ul>
  );
}
