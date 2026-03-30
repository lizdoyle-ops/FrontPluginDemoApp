export function DynamicCustomListSection({
  fieldKeys,
  rows,
}: {
  fieldKeys: string[];
  rows: Record<string, string>[];
}) {
  if (!fieldKeys.length) {
    return (
      <p className="text-[13px] text-zinc-500">
        No fields configured for this list in Admin centre.
      </p>
    );
  }
  if (!rows.length) {
    return <p className="text-[13px] text-zinc-500">No records yet.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[240px] border-collapse text-left text-[12px]">
        <thead>
          <tr className="border-b border-zinc-100 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            {fieldKeys.map((k) => (
              <th key={k} className="py-2 pr-3">
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-zinc-50">
              {fieldKeys.map((k) => (
                <td key={k} className="py-2 pr-3 text-zinc-800">
                  {row[k] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
