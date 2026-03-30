# Property CRM Demo API

Base URL in development: `http://localhost:3000`

**Authentication:** None in this demo. For production, place the app behind auth or a private network and validate requests.

**Persistence:** The in-memory store is seeded from mock contacts. If the directory `data/` is writable, updates are mirrored to `data/demo-store.json` (gitignored).

## List contacts

Summaries:

```bash
curl -s http://localhost:3000/api/contacts
```

Full `ContactData` records:

```bash
curl -s "http://localhost:3000/api/contacts?full=1"
```

## Get one contact

URL-encode the email:

```bash
curl -s "http://localhost:3000/api/contacts/leyton%40finalproduction.club"
```

## Replace contact (PUT)

Body must satisfy the full `ContactData` schema (see Zod in `src/lib/api/contactSchemas.ts` or `public/openapi.yaml`).

```bash
curl -s -X PUT "http://localhost:3000/api/contacts/leyton%40finalproduction.club" \
  -H "Content-Type: application/json" \
  -d @contact.json
```

## Patch contact (PATCH)

Shallow merge of top-level fields:

```bash
curl -s -X PATCH "http://localhost:3000/api/contacts/leyton%40finalproduction.club" \
  -H "Content-Type: application/json" \
  -d '{"segment":"Updated segment"}'
```

## Delete contact

```bash
curl -s -X DELETE "http://localhost:3000/api/contacts/someone%40example.com"
```

## Work orders

Create or upsert:

```bash
curl -s -X POST "http://localhost:3000/api/contacts/leyton%40finalproduction.club/work-orders" \
  -H "Content-Type: application/json" \
  -d '{"id":"wo-new","title":"Garden check","type":"inspection","status":"scheduled"}'
```

Upsert by id in path:

```bash
curl -s -X PUT "http://localhost:3000/api/contacts/leyton%40finalproduction.club/work-orders/wo-new" \
  -H "Content-Type: application/json" \
  -d '{"title":"Garden check","type":"inspection","status":"completed"}'
```

Delete:

```bash
curl -s -X DELETE "http://localhost:3000/api/contacts/leyton%40finalproduction.club/work-orders/wo-new"
```

## Invoices

Same pattern under `/invoices` and `/invoices/{id}`.

## OpenAPI

Machine-readable spec: [public/openapi.yaml](public/openapi.yaml) (served as `/openapi.yaml`).
