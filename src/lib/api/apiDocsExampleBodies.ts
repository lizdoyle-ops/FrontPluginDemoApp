import type { CustomObjectDefinition } from "@/types/contact";

/** URL-encoded demo account used in copy-paste curls. */
export const API_DOCS_DEMO_EMAIL_ENCODED = "leyton%40finalproduction.club";

/** JSON bodies for POST / PUT / PATCH keyed by `METHOD|pathTemplate`. */
const EXAMPLE_JSON_BY_METHOD_PATH: Record<string, string> = {
  "POST|/api/contacts":
    '{"email":"new.client@example.com","name":"New Client","company":"","role":"","segment":"","tags":[],"properties":[],"quotes":[],"opportunities":[],"orders":[],"inquiries":[],"cases":[],"workOrders":[],"contracts":[],"timeline":[],"attachments":[],"pets":[],"policies":[],"policyholder":{"name":"","dob":"","email":"","phone":"","address":"","authorisedContacts":[]},"cover":{"vetFeeLimit":0,"vetFeeLimitType":"","remainingLimitThisYear":0,"excess":{"fixed":0,"coInsurance":""},"complementaryTreatment":0,"dental":0,"thirdPartyLiability":0,"exclusions":[]},"claimsHistory":[],"invoices":[]}',
  "PUT|/api/contacts/{email}":
    '{"email":"leyton@finalproduction.club","name":"Leyton","company":"","role":"","segment":"","tags":[],"properties":[],"quotes":[],"opportunities":[],"orders":[],"inquiries":[],"cases":[],"workOrders":[],"contracts":[],"timeline":[],"attachments":[],"pets":[],"policies":[],"policyholder":{"name":"","dob":"","email":"","phone":"","address":"","authorisedContacts":[]},"cover":{"vetFeeLimit":0,"vetFeeLimitType":"","remainingLimitThisYear":0,"excess":{"fixed":0,"coInsurance":""},"complementaryTreatment":0,"dental":0,"thirdPartyLiability":0,"exclusions":[]},"claimsHistory":[],"invoices":[]}',
  "PATCH|/api/contacts/{email}": '{"segment":"Updated segment"}',
  "POST|/api/contacts/{email}/cases":
    '{"id":"case-api-demo","subject":"Support","status":"open","openedAt":"2026-04-01","priority":"medium"}',
  "POST|/api/contacts/{email}/cases/{id}":
    '{"id":"case-api-demo","subject":"Support","status":"open","openedAt":"2026-04-01","priority":"medium"}',
  "PUT|/api/contacts/{email}/cases/{id}":
    '{"subject":"Support (updated)","status":"in_progress","openedAt":"2026-04-01","priority":"high"}',
  "POST|/api/contacts/{email}/properties":
    '{"id":"prop-demo-1","address":"1 Demo Street","city":"London","postcode":"E1 1AA","status":"active"}',
  "POST|/api/contacts/{email}/properties/{id}":
    '{"id":"prop-demo-1","address":"1 Demo Street","city":"London","postcode":"E1 1AA","status":"active"}',
  "PUT|/api/contacts/{email}/properties/{id}":
    '{"address":"1 Demo Street","city":"London","postcode":"E1 1AA","status":"pending"}',
  "POST|/api/contacts/{email}/work-orders":
    '{"id":"wo-demo","title":"Site inspection","type":"inspection","status":"scheduled"}',
  "POST|/api/contacts/{email}/work-orders/{id}":
    '{"id":"wo-demo","title":"Site inspection","type":"inspection","status":"scheduled"}',
  "PUT|/api/contacts/{email}/work-orders/{id}":
    '{"title":"Site inspection","type":"inspection","status":"in_progress"}',
  "POST|/api/contacts/{email}/invoices":
    '{"id":"inv-demo","reference":"INV-DEMO","amount":120,"currency":"GBP","status":"pending"}',
  "POST|/api/contacts/{email}/invoices/{id}":
    '{"id":"inv-demo","reference":"INV-DEMO","amount":120,"currency":"GBP","status":"pending"}',
  "PUT|/api/contacts/{email}/invoices/{id}":
    '{"reference":"INV-DEMO","amount":150,"currency":"GBP","status":"paid"}',
  "POST|/api/contacts/{email}/quotes":
    '{"id":"q-demo","title":"Quote","amount":500,"currency":"GBP","status":"pending"}',
  "POST|/api/contacts/{email}/quotes/{id}":
    '{"id":"q-demo","title":"Quote","amount":500,"currency":"GBP","status":"pending"}',
  "PUT|/api/contacts/{email}/quotes/{id}":
    '{"title":"Quote","amount":550,"currency":"GBP","status":"accepted"}',
  "POST|/api/contacts/{email}/opportunities":
    '{"id":"opp-demo","title":"Pipeline deal","stage":"prospecting"}',
  "POST|/api/contacts/{email}/opportunities/{id}":
    '{"id":"opp-demo","title":"Pipeline deal","stage":"prospecting"}',
  "PUT|/api/contacts/{email}/opportunities/{id}":
    '{"title":"Pipeline deal","stage":"qualified","amount":1000,"currency":"GBP"}',
  "POST|/api/contacts/{email}/orders":
    '{"id":"ord-demo","title":"Supplies","status":"pending","orderedAt":"2026-04-01","total":99,"currency":"GBP"}',
  "POST|/api/contacts/{email}/orders/{id}":
    '{"id":"ord-demo","title":"Supplies","status":"pending","orderedAt":"2026-04-01","total":99,"currency":"GBP"}',
  "PUT|/api/contacts/{email}/orders/{id}":
    '{"title":"Supplies","status":"confirmed","orderedAt":"2026-04-01","total":99,"currency":"GBP"}',
  "POST|/api/contacts/{email}/inquiries":
    '{"id":"inq-demo","subject":"Question","date":"2026-04-01","channel":"Email"}',
  "POST|/api/contacts/{email}/inquiries/{id}":
    '{"id":"inq-demo","subject":"Question","date":"2026-04-01","channel":"Email"}',
  "PUT|/api/contacts/{email}/inquiries/{id}":
    '{"subject":"Question (updated)","date":"2026-04-01","channel":"Email"}',
  "POST|/api/contacts/{email}/contracts":
    '{"id":"con-demo","title":"Service agreement","type":"service","status":"active","startDate":"2026-04-01"}',
  "POST|/api/contacts/{email}/contracts/{id}":
    '{"id":"con-demo","title":"Service agreement","type":"service","status":"active","startDate":"2026-04-01"}',
  "PUT|/api/contacts/{email}/contracts/{id}":
    '{"title":"Service agreement","type":"service","status":"active","startDate":"2026-04-01","endDate":"2027-04-01"}',
  "POST|/api/contacts/{email}/attachments":
    '{"id":"att-demo","name":"document.pdf","category":"general","uploadedAt":"2026-04-01T12:00:00Z"}',
  "POST|/api/contacts/{email}/attachments/{id}":
    '{"id":"att-demo","name":"document.pdf","category":"general","uploadedAt":"2026-04-01T12:00:00Z"}',
  "PUT|/api/contacts/{email}/attachments/{id}":
    '{"name":"document.pdf","category":"general","uploadedAt":"2026-04-01T12:00:00Z"}',
  "POST|/api/contacts/{email}/pets":
    '{"id":"pet-demo","name":"Miso","species":"cat","preExistingConditions":[]}',
  "POST|/api/contacts/{email}/pets/{id}":
    '{"id":"pet-demo","name":"Miso","species":"cat","preExistingConditions":[]}',
  "PUT|/api/contacts/{email}/pets/{id}":
    '{"name":"Miso","species":"cat","breed":"British Shorthair","preExistingConditions":[]}',
  "POST|/api/contacts/{email}/policies":
    '{"id":"pol-demo","policyNumber":"PN-1","product":"Complete","status":"Active","startDate":"2026-01-01","renewalDate":"2027-01-01","annualPremium":748,"paymentFrequency":"Monthly","monthlyDirectDebit":62.33,"paymentStatus":"Up to date"}',
  "POST|/api/contacts/{email}/policies/{id}":
    '{"id":"pol-demo","policyNumber":"PN-1","product":"Complete","status":"Active","startDate":"2026-01-01","renewalDate":"2027-01-01","annualPremium":748,"paymentFrequency":"Monthly","monthlyDirectDebit":62.33,"paymentStatus":"Up to date"}',
  "PUT|/api/contacts/{email}/policies/{id}":
    '{"policyNumber":"PN-1","product":"Complete","status":"Active","startDate":"2026-01-01","renewalDate":"2027-01-01","annualPremium":800,"paymentFrequency":"Monthly","monthlyDirectDebit":66.67,"paymentStatus":"Up to date"}',
  "PUT|/api/contacts/{email}/policyholder":
    '{"name":"Demo Policyholder","dob":"1990-01-01","email":"policyholder@example.com","phone":"07000000000","address":"1 Example Rd","authorisedContacts":["Demo Policyholder"]}',
  "PUT|/api/contacts/{email}/cover":
    '{"vetFeeLimit":8000,"vetFeeLimitType":"Annual","remainingLimitThisYear":8000,"excess":{"fixed":99,"coInsurance":"20% co-pay"},"complementaryTreatment":1000,"dental":1000,"thirdPartyLiability":1000000,"exclusions":["Routine vaccinations"]}',
  "POST|/api/contacts/{email}/claims":
    '{"id":"clm-demo","claimId":"CLM-DEMO-1","dateSubmitted":"2026-04-01","condition":"Checkup","vet":"Demo Vet","amountClaimed":100,"amountPaid":0,"excessApplied":0,"coInsuranceApplied":0,"status":"Submitted"}',
  "POST|/api/contacts/{email}/claims/{id}":
    '{"id":"clm-demo","claimId":"CLM-DEMO-1","dateSubmitted":"2026-04-01","condition":"Checkup","vet":"Demo Vet","amountClaimed":100,"amountPaid":0,"excessApplied":0,"coInsuranceApplied":0,"status":"Submitted"}',
  "PUT|/api/contacts/{email}/claims/{id}":
    '{"claimId":"CLM-DEMO-1","dateSubmitted":"2026-04-01","condition":"Checkup (updated)","vet":"Demo Vet","amountClaimed":120,"amountPaid":0,"excessApplied":0,"coInsuranceApplied":0,"status":"Submitted"}',
  "POST|/api/contacts/{email}/timeline":
    '{"type":"note","title":"Timeline note","date":"2026-04-01","detail":"Example event"}',
  "POST|/api/contacts/{email}/custom-lists/{listId}/rows":
    '{"id":"clr-new","name":"","status":""}',
  "PUT|/api/contacts/{email}/custom-lists/{listId}/rows/{index}":
    '{"id":"clr-at-0","name":"Updated value","status":"ok"}',
};

function exampleIdForPath(path: string): string {
  if (path.includes("/cases/")) return "case-api-demo";
  if (path.includes("/properties/")) return "prop-demo-1";
  if (path.includes("/work-orders/")) return "wo-demo";
  if (path.includes("/invoices/")) return "inv-demo";
  if (path.includes("/quotes/")) return "q-demo";
  if (path.includes("/opportunities/")) return "opp-demo";
  if (path.includes("/orders/")) return "ord-demo";
  if (path.includes("/inquiries/")) return "inq-demo";
  if (path.includes("/contracts/")) return "con-demo";
  if (path.includes("/attachments/")) return "att-demo";
  if (path.includes("/pets/")) return "pet-demo";
  if (path.includes("/policies/")) return "pol-demo";
  if (path.includes("/claims/")) return "clm-demo";
  return "record-demo";
}

/** Expand `{email}`, `{id}`, `{index}`, `{listId}` for demo curls. */
export function expandApiDocPathForCurl(path: string): string {
  let p = path.replace(/{email}/g, API_DOCS_DEMO_EMAIL_ENCODED);
  p = p.replace(/{listId}/g, "obj-example");
  p = p.replace(/{index}/g, "0");
  if (p.includes("{id}")) {
    p = p.replace(/{id}/g, exampleIdForPath(path));
  }
  return p;
}

function customPostBody(fieldKeys: string[]): string {
  const o: Record<string, string> = { id: "clr-example-1" };
  for (const k of fieldKeys) {
    if (k !== "id") o[k] = "";
  }
  return JSON.stringify(o);
}

function customPutBody(fieldKeys: string[]): string {
  const o: Record<string, string> = { id: "clr-at-0" };
  for (const k of fieldKeys) {
    if (k !== "id") o[k] = k === "name" ? "Updated" : "ok";
  }
  return JSON.stringify(o);
}

export function exampleJsonBodyForRow(
  row: { methods: string; path: string },
  definitions: readonly CustomObjectDefinition[],
): string | undefined {
  const m = row.methods.trim().toUpperCase();
  if (m !== "POST" && m !== "PUT" && m !== "PATCH") return undefined;

  const key = `${row.methods}|${row.path}`;
  const staticHit = EXAMPLE_JSON_BY_METHOD_PATH[key];
  if (staticHit) return staticHit;

  const customPost = row.path.match(
    /^\/api\/contacts\/\{email\}\/custom-lists\/([^/]+)\/rows$/,
  );
  if (customPost && m === "POST") {
    const listId = customPost[1];
    const def = definitions.find((d) => d.id === listId);
    if (def) return customPostBody(def.fieldKeys);
  }
  const customPut = row.path.match(
    /^\/api\/contacts\/\{email\}\/custom-lists\/([^/]+)\/rows\/\{index\}$/,
  );
  if (customPut && m === "PUT") {
    const listId = customPut[1];
    const def = definitions.find((d) => d.id === listId);
    if (def) return customPutBody(def.fieldKeys);
  }

  return undefined;
}

/** Shell-safe single-quoted string for curl (bash). */
function shSingleQuoted(s: string): string {
  return `'${s.replace(/'/g, `'\\''`)}'`;
}

export function buildCurlCommand(
  origin: string,
  token: string,
  method: string,
  pathExpanded: string,
  jsonBody?: string,
): string {
  const url = `${origin.replace(/\/$/, "")}${pathExpanded}`;
  const auth = `-H ${shSingleQuoted(`Authorization: Bearer ${token}`)}`;
  if (jsonBody === undefined) {
    return `curl -s -X ${method} ${shSingleQuoted(url)} \\\n  ${auth}`;
  }
  return `curl -s -X ${method} ${shSingleQuoted(url)} \\\n  ${auth} \\\n  -H ${shSingleQuoted("Content-Type: application/json")} \\\n  -d ${shSingleQuoted(jsonBody)}`;
}
