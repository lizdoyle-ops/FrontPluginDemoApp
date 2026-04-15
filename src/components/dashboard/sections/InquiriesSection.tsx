import type { Inquiry } from "@/types/contact";
import { RecordIdLine } from "@/components/ui/RecordIdLine";

export function InquiriesSection({ items }: { items: Inquiry[] }) {
  return (
    <div className="space-y-2">
      {!items?.length ? (
        <p className="text-zinc-500">No inquiries.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((q) => (
            <li
              key={q.id}
              className="rounded-md border border-zinc-100 px-2.5 py-2"
            >
              <RecordIdLine id={q.id} />
              <div className="font-medium text-zinc-900">{q.subject}</div>
              <div className="text-[11px] text-zinc-500">
                {q.date} · {q.channel}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
