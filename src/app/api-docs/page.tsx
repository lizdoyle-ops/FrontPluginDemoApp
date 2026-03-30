import Link from "next/link";

export default function ApiDocsPage() {
  return (
    <div className="space-y-4 p-4 text-[13px] text-zinc-700">
      <Link href="/" className="text-[var(--secondary-color)]">
        ← Dashboard
      </Link>
      <h1 className="text-lg font-semibold text-zinc-900">API documentation</h1>
      <p>
        OpenAPI spec:{" "}
        <a
          href="/openapi.yaml"
          className="font-medium text-[var(--brand-color)] underline"
          target="_blank"
          rel="noreferrer"
        >
          /openapi.yaml
        </a>
      </p>
      <p>
        Human-readable guide with curl examples: see the repository file{" "}
        <code className="rounded bg-zinc-100 px-1">API.md</code>.
      </p>
      <p className="text-[12px] text-zinc-500">
        This demo API is unauthenticated. Protect it in production (e.g. behind
        your own auth or a private network).
      </p>
    </div>
  );
}
