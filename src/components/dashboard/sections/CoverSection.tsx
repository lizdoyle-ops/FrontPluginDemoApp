import type { Cover } from "@/types/contact";

function gbp(n: number) {
  return `£${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function CoverSection({ data }: { data: Cover }) {
  const isEmpty =
    !data.vetFeeLimit &&
    !data.remainingLimitThisYear &&
    !data.exclusions.length;
  if (isEmpty) {
    return <p className="text-zinc-500">No cover details on file.</p>;
  }
  return (
    <div className="space-y-3 text-[12px] text-zinc-800">
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <dt className="text-zinc-500">Vet fee limit</dt>
        <dd>
          {gbp(data.vetFeeLimit)}
          {data.vetFeeLimitType ? ` (${data.vetFeeLimitType})` : ""}
        </dd>
        <dt className="text-zinc-500">Remaining (year)</dt>
        <dd>{gbp(data.remainingLimitThisYear)}</dd>
        <dt className="text-zinc-500">Excess</dt>
        <dd>{gbp(data.excess.fixed)}</dd>
        <dt className="text-zinc-500">Complementary</dt>
        <dd>{gbp(data.complementaryTreatment)}</dd>
        <dt className="text-zinc-500">Dental</dt>
        <dd>{gbp(data.dental)}</dd>
        <dt className="text-zinc-500">Third-party liability</dt>
        <dd>{gbp(data.thirdPartyLiability)}</dd>
      </dl>
      {data.excess.coInsurance ? (
        <p className="text-[11px] leading-relaxed text-zinc-600">
          {data.excess.coInsurance}
        </p>
      ) : null}
      {data.exclusions.length ? (
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            Exclusions
          </div>
          <ul className="mt-1 list-inside list-disc text-[11px] text-zinc-600">
            {data.exclusions.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
