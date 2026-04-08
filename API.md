# Property CRM Demo API

Use a base URL and token for all examples:

```bash
# Production
export BASE=https://front-plugin-demo-app.vercel.app

# Local dev
# export BASE=http://localhost:3000
```

## Authentication

Every request must include a **Bearer token** (full demo access, non-expiring unless you change it):

```http
Authorization: Bearer <token>
```

- Default token (if `NEXT_PUBLIC_DEMO_API_TOKEN` is unset): `fp-property-plugin-demo-all-scopes-3194afc2e7d4`
- Override in `.env` / Vercel: `NEXT_PUBLIC_DEMO_API_TOKEN=your-secret`

The in-app **API docs** page shows the active token. For production, rotate the env value and treat it like a secret.

### Clickable work order (browser)

The REST API expects `Authorization: Bearer …`, so you cannot open `/api/contacts/.../work-orders/...` in a new tab without a client that sends headers. For a **shareable link**, use:

```text
$BASE/view/work-order?email=leyton%40finalproduction.club&id=wo1&token=<same-token-as-Bearer>
```

Example with the default demo token (replace if you set `NEXT_PUBLIC_DEMO_API_TOKEN`):

`https://front-plugin-demo-app.vercel.app/view/work-order?email=leyton%40finalproduction.club&id=wo1&token=fp-property-plugin-demo-all-scopes-3194afc2e7d4`

Anyone with that URL can view the work order while the token is valid—treat it like a credential.

**Persistence:** The in-memory store is seeded from mock contacts. If the directory `data/` is writable, updates are mirrored to `data/demo-store.json` (gitignored).

### CRM workspace (browser UI)

Full-screen desk at **`/crm`** (also linked from the plugin hamburger as **CRM — full workspace**). It uses the same Bearer token as the API (`NEXT_PUBLIC_DEMO_API_TOKEN` is available to the browser) to list accounts, edit nested records, and create contacts. Changes apply to the **same store** the Front sidebar reads when a conversation email matches.

On **Vercel**, the filesystem is ephemeral: persistence across deploys is not guaranteed unless you add external storage.

## List contacts

Summaries:

```bash
export H="Authorization: Bearer fp-property-plugin-demo-all-scopes-3194afc2e7d4"
curl -s -H "$H" "$BASE/api/contacts"
```

Full `ContactData` records:

```bash
curl -s -H "$H" "$BASE/api/contacts?full=1"
```

## Get one contact

URL-encode the email:

```bash
curl -s -H "$H" "$BASE/api/contacts/leyton%40finalproduction.club"
```

## Create contact (POST)

Body must be a full valid `ContactData` (all nested arrays may be empty). Returns **409** if that email already exists.

```bash
curl -s -X POST "$BASE/api/contacts" \
  -H "$H" \
  -H "Content-Type: application/json" \
  -d '{"email":"new.client@example.com","name":"New Client","company":"","role":"","segment":"","tags":[],"properties":[],"quotes":[],"opportunities":[],"orders":[],"inquiries":[],"cases":[],"workOrders":[],"contracts":[],"timeline":[],"attachments":[],"invoices":[]}'
```

## Replace contact (PUT)

Body must satisfy the full `ContactData` schema (see Zod in `src/lib/api/contactSchemas.ts` or `public/openapi.yaml`).

```bash
curl -s -X PUT "$BASE/api/contacts/leyton%40finalproduction.club" \
  -H "$H" \
  -H "Content-Type: application/json" \
  -d @contact.json
```

## Patch contact (PATCH)

Shallow merge of top-level fields:

```bash
curl -s -X PATCH "$BASE/api/contacts/leyton%40finalproduction.club" \
  -H "$H" \
  -H "Content-Type: application/json" \
  -d '{"segment":"Updated segment"}'
```

## Delete contact

```bash
curl -s -H "$H" -X DELETE "$BASE/api/contacts/someone%40example.com"
```

## Work orders

Create or upsert (id in JSON body):

```bash
curl -s -X POST "$BASE/api/contacts/leyton%40finalproduction.club/work-orders" \
  -H "$H" \
  -H "Content-Type: application/json" \
  -d '{"id":"wo-new","title":"Garden check","type":"inspection","status":"scheduled"}'
```

Get one work order:

```bash
curl -s -H "$H" "$BASE/api/contacts/leyton%40finalproduction.club/work-orders/wo-new"
```

Create or upsert with id in the URL (body `id` must match path after merge):

```bash
curl -s -X POST "$BASE/api/contacts/leyton%40finalproduction.club/work-orders/wo-new" \
  -H "$H" \
  -H "Content-Type: application/json" \
  -d '{"title":"Garden check","type":"inspection","status":"scheduled"}'
```

Upsert by id in path:

```bash
curl -s -X PUT "$BASE/api/contacts/leyton%40finalproduction.club/work-orders/wo-new" \
  -H "$H" \
  -H "Content-Type: application/json" \
  -d '{"title":"Garden check","type":"inspection","status":"completed"}'
```

Delete:

```bash
curl -s -H "$H" -X DELETE "$BASE/api/contacts/leyton%40finalproduction.club/work-orders/wo-new"
```

## Opportunities

Create or upsert (`id`, `title`, and `stage` required; `stage` is one of `prospecting`, `qualified`, `proposal`, `negotiation`, `won`, `lost`):

```bash
curl -s -X POST "$BASE/api/contacts/leyton%40finalproduction.club/opportunities" \
  -H "$H" \
  -H "Content-Type: application/json" \
  -d '{"id":"opp-new","title":"Lease renewal","stage":"proposal","amount":12000,"currency":"GBP","expectedCloseDate":"2026-06-30"}'
```

Get one:

```bash
curl -s -H "$H" "$BASE/api/contacts/leyton%40finalproduction.club/opportunities/opp-new"
```

Upsert with id in path:

```bash
curl -s -X PUT "$BASE/api/contacts/leyton%40finalproduction.club/opportunities/opp-new" \
  -H "$H" \
  -H "Content-Type: application/json" \
  -d '{"title":"Lease renewal","stage":"negotiation","amount":12500,"currency":"GBP"}'
```

Delete:

```bash
curl -s -H "$H" -X DELETE "$BASE/api/contacts/leyton%40finalproduction.club/opportunities/opp-new"
```

## Orders

Create or upsert (`id`, `title`, `status`, `orderedAt`, `total`, and `currency` required; `status` is one of `pending`, `confirmed`, `processing`, `fulfilled`, `cancelled`):

```bash
curl -s -X POST "$BASE/api/contacts/leyton%40finalproduction.club/orders" \
  -H "$H" \
  -H "Content-Type: application/json" \
  -d '{"id":"ord-new","title":"Supplies — studio","status":"confirmed","orderedAt":"2026-04-01","total":450,"currency":"GBP"}'
```

Get one:

```bash
curl -s -H "$H" "$BASE/api/contacts/leyton%40finalproduction.club/orders/ord-new"
```

Upsert with id in path:

```bash
curl -s -X PUT "$BASE/api/contacts/leyton%40finalproduction.club/orders/ord-new" \
  -H "$H" \
  -H "Content-Type: application/json" \
  -d '{"title":"Supplies — studio","status":"fulfilled","orderedAt":"2026-04-01","total":450,"currency":"GBP","fulfilledAt":"2026-04-03"}'
```

Delete:

```bash
curl -s -H "$H" -X DELETE "$BASE/api/contacts/leyton%40finalproduction.club/orders/ord-new"
```

## Invoices

- **POST** `/api/contacts/{email}/invoices` — create or upsert (include `id` in JSON).
- **GET** `/api/contacts/{email}/invoices/{id}` — fetch one invoice.
- **POST** / **PUT** / **DELETE** `/api/contacts/{email}/invoices/{id}` — upsert with path id merged onto JSON (POST → 201, PUT → 200) or remove.

## Nested objects (create + fetch)

Each nested type supports:

1. **POST** collection URL — upsert using **`id` inside the JSON body**.
2. **GET** `.../{id}` — return **only that record** as JSON.
3. **POST** / **PUT** `.../{id}` — upsert that id (path id overrides `body.id`); response is the **full updated `ContactData`**. **DELETE** `.../{id}` removes the record.

All require `Authorization: Bearer …`. Timeline uses **index** instead of id; custom lists use **row index**.

| Collection   | POST (body id)                         | GET one                         | POST/PUT/DELETE one id                                      |
|-------------|---------------------------------------|---------------------------------|-------------------------------------------------------------|
| Cases       | `.../cases`                           | `.../cases/{id}`                | `.../cases/{id}`                                            |
| Properties  | `.../properties`                     | `.../properties/{id}`           | `.../properties/{id}`                                       |
| Quotes      | `.../quotes`                         | `.../quotes/{id}`               | `.../quotes/{id}`                                           |
| Opportunities | `.../opportunities`               | `.../opportunities/{id}`        | `.../opportunities/{id}`                                    |
| Orders      | `.../orders`                        | `.../orders/{id}`               | `.../orders/{id}`                                           |
| Inquiries   | `.../inquiries`                     | `.../inquiries/{id}`            | `.../inquiries/{id}`                                        |
| Contracts   | `.../contracts`                     | `.../contracts/{id}`           | `.../contracts/{id}`                                        |
| Timeline    | `.../timeline` (append, no id)       | `.../timeline/{index}`          | —                                                           |
| Attachments | `.../attachments`                   | `.../attachments/{id}`          | `.../attachments/{id}`                                      |
| Work orders | `.../work-orders`                   | `.../work-orders/{id}`          | `.../work-orders/{id}`                                      |
| Invoices    | `.../invoices`                      | `.../invoices/{id}`             | `.../invoices/{id}`                                         |

**Custom lists** (rows are maps of string → string; `listId` is the Admin custom object id, e.g. `obj-123`):

- **POST** `/api/contacts/{email}/custom-lists/{listId}/rows` — append one row (JSON body: keys = field keys, values = strings).
- **GET** `/api/contacts/{email}/custom-lists/{listId}/rows/{index}` — fetch row at zero-based `index` (response: `{ listId, index, row }`).

Example — create a case:

```bash
curl -s -X POST "$BASE/api/contacts/leyton%40finalproduction.club/cases" \
  -H "$H" \
  -H "Content-Type: application/json" \
  -d '{"id":"case-api-1","subject":"API test","status":"open","openedAt":"2026-03-30","priority":"medium"}'
```

Fetch that case:

```bash
curl -s -H "$H" "$BASE/api/contacts/leyton%40finalproduction.club/cases/case-api-1"
```

Upsert the **same** case via the id URL (path id applied to body):

```bash
curl -s -X PUT "$BASE/api/contacts/leyton%40finalproduction.club/cases/case-api-1" \
  -H "$H" \
  -H "Content-Type: application/json" \
  -d '{"subject":"API test (updated)","status":"in_progress","openedAt":"2026-03-30","priority":"high"}'
```

Shapes match Zod in `src/lib/api/contactSchemas.ts`.

## OpenAPI

Machine-readable spec: [public/openapi.yaml](public/openapi.yaml) (served as `/openapi.yaml`).

In the app, open **Back Office View** → **API docs** tab (`/crm?tab=api`) for the bearer token and endpoint table. The legacy path `/api-docs` redirects there.
