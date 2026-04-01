/** Small label showing a record’s stable id (plugin + dashboard). */
export function RecordIdLine({ id }: { id: string }) {
  return (
    <p className="text-[10px] leading-tight text-zinc-400">
      <span className="font-semibold uppercase tracking-wide">ID</span>{" "}
      <span className="font-mono text-[11px] text-zinc-500">{id}</span>
    </p>
  );
}
