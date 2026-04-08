import type { Pet } from "@/types/contact";
import { Badge } from "@/components/ui/Badge";
import { RecordIdLine } from "@/components/ui/RecordIdLine";

export function PetsSection({ items }: { items: Pet[] }) {
  if (!items?.length) {
    return <p className="text-zinc-500">No pets on file.</p>;
  }
  return (
    <ul className="space-y-3">
      {items.map((p) => (
        <li
          key={p.id}
          className="rounded-md border border-zinc-100 px-2.5 py-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <RecordIdLine id={p.id} />
              <div className="font-medium text-zinc-900">{p.name}</div>
              <div className="text-[12px] text-zinc-600">
                {p.species}
                {p.breed ? ` · ${p.breed}` : ""}
              </div>
              <div className="text-[11px] text-zinc-500">
                {p.dob ? `DOB ${p.dob}` : null}
                {p.age != null ? ` · Age ${p.age}` : null}
                {p.gender ? ` · ${p.gender}` : null}
                {p.neutered === true ? " · Neutered" : ""}
                {p.neutered === false ? " · Not neutered" : ""}
              </div>
              {p.microchip ? (
                <div className="mt-0.5 font-mono text-[11px] text-zinc-600">
                  Chip: {p.microchip}
                </div>
              ) : null}
              {p.authorisedContacts ? (
                <div className="mt-1 text-[11px] text-zinc-600">
                  <span className="font-medium text-zinc-500">
                    Authorised (pet):{" "}
                  </span>
                  {p.authorisedContacts}
                </div>
              ) : null}
              {p.preExistingConditions.length ? (
                <div className="mt-2 border-t border-zinc-50 pt-2">
                  <div className="text-[11px] font-medium text-zinc-500">
                    Pre-existing conditions
                  </div>
                  <ul className="mt-1 space-y-1 text-[11px] text-zinc-700">
                    {p.preExistingConditions.map((x, i) => (
                      <li key={i}>
                        {x.condition}
                        {x.excludedFromCover ? (
                          <span className="text-amber-700"> (excluded)</span>
                        ) : null}
                        <span className="text-zinc-500">
                          {" "}
                          — {x.status} ({x.notedDate})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {p.notes ? (
                <div className="mt-1 text-[11px] text-zinc-600">{p.notes}</div>
              ) : null}
            </div>
            <Badge variant="default" className="shrink-0 capitalize">
              {p.species}
            </Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}
