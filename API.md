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

## Invoices

Same pattern under `/invoices` and `/invoices/{id}`.

## OpenAPI

Machine-readable spec: [public/openapi.yaml](public/openapi.yaml) (served as `/openapi.yaml`).
