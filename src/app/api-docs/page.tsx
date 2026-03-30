import { getDemoApiToken } from "@/lib/demoApiToken";
import { ApiDocsClient } from "./ApiDocsClient";

export const dynamic = "force-dynamic";

export default function ApiDocsPage() {
  return <ApiDocsClient token={getDemoApiToken()} />;
}
