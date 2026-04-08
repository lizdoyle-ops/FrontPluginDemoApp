import type { Policyholder } from "@/types/contact";

export function PolicyholderSection({ data }: { data: Policyholder }) {
  const hasAny =
    data.name.trim() ||
    data.email.trim() ||
    data.phone.trim() ||
    data.address.trim();
  if (!hasAny) {
    return <p className="text-zinc-500">No policyholder on file.</p>;
  }
  return (
    <div className="space-y-2 text-[13px] text-zinc-800">
      <div className="font-semibold text-zinc-900">{data.name}</div>
      {data.dob ? (
        <div className="text-[12px] text-zinc-600">DOB: {data.dob}</div>
      ) : null}
      {data.email ? <div>{data.email}</div> : null}
      {data.phone ? <div className="text-zinc-600">{data.phone}</div> : null}
      {data.address ? (
        <div className="text-[12px] leading-snug text-zinc-600">{data.address}</div>
      ) : null}
      {data.authorisedContacts.length ? (
        <div className="mt-2 border-t border-zinc-100 pt-2">
          <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            Authorised contacts
          </div>
          <ul className="mt-1 list-inside list-disc text-[12px] text-zinc-700">
            {data.authorisedContacts.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
