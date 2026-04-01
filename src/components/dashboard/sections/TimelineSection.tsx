import type { TimelineEvent } from "@/types/contact";

export function TimelineSection({ items }: { items: TimelineEvent[] }) {
  if (!items?.length) {
    return <p className="text-zinc-500">No timeline events.</p>;
  }
  const sorted = [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  return (
    <ul className="space-y-2 border-l-2 border-zinc-200 pl-3">
      {sorted.map((e, i) => (
        <li
          key={`${e.date}-${e.type}-${e.title}-${i}`}
          className="relative"
        >
          <span
            className="absolute -left-[17px] top-1.5 h-2 w-2 rounded-full bg-[var(--secondary-color)]"
            aria-hidden
          />
          <div className="text-[11px] uppercase tracking-wide text-zinc-400">
            {e.type.replace("_", " ")}
          </div>
          <div className="font-medium text-zinc-900">{e.title}</div>
          <div className="text-[11px] text-zinc-500">
            {new Date(e.date).toLocaleString()}
          </div>
          {e.detail ? (
            <div className="mt-1 text-zinc-600">{e.detail}</div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
