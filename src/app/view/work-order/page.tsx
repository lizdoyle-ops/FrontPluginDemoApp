import Link from "next/link";
import { getDemoApiToken } from "@/lib/demoApiToken";
import { getContact, getWorkOrder } from "@/server/demoStore";

export const dynamic = "force-dynamic";

type Search = { email?: string; id?: string; token?: string };

export default async function WorkOrderViewPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const emailRaw = sp.email?.trim() ?? "";
  const id = sp.id?.trim() ?? "";
  const token = sp.token?.trim() ?? "";
  const expected = getDemoApiToken();

  if (!token || token !== expected) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <h1 className="text-lg font-semibold text-zinc-800">Unauthorized</h1>
        <p className="mt-2 text-[13px] text-zinc-600">
          Add a valid <code className="rounded bg-zinc-200 px-1">token</code>{" "}
          query parameter (same value as the demo API Bearer token).
        </p>
      </main>
    );
  }

  if (!emailRaw || !id) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <h1 className="text-lg font-semibold text-zinc-800">Missing parameters</h1>
        <p className="mt-2 text-[13px] text-zinc-600">
          Required: <code className="rounded bg-zinc-200 px-1">email</code>,{" "}
          <code className="rounded bg-zinc-200 px-1">id</code>,{" "}
          <code className="rounded bg-zinc-200 px-1">token</code>.
        </p>
      </main>
    );
  }

  let email = emailRaw;
  try {
    email = decodeURIComponent(emailRaw);
  } catch {
    /* use raw */
  }

  const contact = getContact(email);
  if (!contact) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <h1 className="text-lg font-semibold text-zinc-800">Contact not found</h1>
        <p className="mt-2 text-[13px] text-zinc-600">{email}</p>
      </main>
    );
  }

  const workOrder = getWorkOrder(contact.email, id);
  if (!workOrder) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <h1 className="text-lg font-semibold text-zinc-800">
          Work order not found
        </h1>
        <p className="mt-2 text-[13px] text-zinc-600">
          No work order <span className="font-mono">{id}</span> for this contact.
        </p>
      </main>
    );
  }

  const rows: { label: string; value: string }[] = [
    { label: "ID", value: workOrder.id },
    { label: "Title", value: workOrder.title },
    { label: "Type", value: workOrder.type },
    { label: "Status", value: workOrder.status },
    ...(workOrder.scheduledFor
      ? [{ label: "Scheduled for", value: workOrder.scheduledFor }]
      : []),
    ...(workOrder.propertyId
      ? [{ label: "Property ID", value: workOrder.propertyId }]
      : []),
  ];

  return (
    <main className="mx-auto w-full max-w-md px-4 py-10 sm:px-6 md:max-w-lg lg:max-w-2xl">
      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        Work order
      </p>
      <h1 className="mt-1 text-xl font-semibold text-zinc-900">
        {workOrder.title}
      </h1>
      <p className="mt-1 text-[13px] text-zinc-600">
        {contact.name} · {contact.email}
      </p>

      <dl className="mt-8 divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white shadow-sm">
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className="grid grid-cols-[7rem_1fr] gap-2 px-4 py-3 text-[13px]"
          >
            <dt className="font-medium text-zinc-500">{label}</dt>
            <dd className="text-zinc-900">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-8 text-[11px] text-zinc-500">
        Anyone with this link can view this record while the token is valid.
        Treat shared URLs like credentials.
      </p>

      <Link
        href="/"
        className="mt-4 inline-block text-[13px] font-medium text-[var(--secondary-color)]"
      >
        ← Open plugin
      </Link>
    </main>
  );
}
