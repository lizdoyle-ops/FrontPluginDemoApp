# Property Management CRM — Front Plugin

Next.js (App Router) sidebar plugin for [Front](https://front.com) using `@frontapp/plugin-sdk`: contact detection from conversation messages, property CRM sections, configurable demo settings, HTML email drafts, and a small demo REST API.

## Prerequisites

- Node.js 18+
- A Front workspace with plugin development enabled

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Outside Front, append a demo contact query, for example:

`http://localhost:3000/?demo=leyton%40finalproduction.club`

## Demo contacts

- `leyton@finalproduction.club` — Leyton Chen  
- `sarah@zestymedia.club` — Sarah Martinez  
- `elias@auditlawyer.club` — Elias Omorin  

## Repository

Source repo: **[github.com/lizdoyle-ops/FrontPluginDemoApp](https://github.com/lizdoyle-ops/FrontPluginDemoApp)**.

GitHub holds the code only. The **HTTPS URL Front uses in the iframe** should be your **deployed** app (e.g. Vercel), not the raw `github.com` page.

### Push updates from your machine

If `origin` is not set yet:

```bash
cd /path/to/FrontPluginDemoApp
git remote add origin https://github.com/lizdoyle-ops/FrontPluginDemoApp.git
git push -u origin main
```

If `origin` already exists, run:

```bash
git push -u origin main
```

Use [GitHub authentication](https://docs.github.com/en/get-started/git-basics/about-remote-repositories#cloning-with-https-urls) (browser login, PAT, or SSH) when prompted.

## Deploy a public URL (Vercel + GitHub)

1. Sign in at [vercel.com](https://vercel.com) and click **Add New… → Project**.
2. **Import** the GitHub repository you just pushed.
3. Leave defaults (Framework: Next.js, Build: `next build`, Output: Next.js). Deploy.
4. Copy the production URL. This project’s deployment is **[https://front-plugin-demo-app.vercel.app/](https://front-plugin-demo-app.vercel.app/)**.

**Front plugin URL:** use the **root** of that deployment (Front loads the plugin in an iframe; paths like `/` and `/settings` work relative to that origin).

### Ship new changes (GitHub → Vercel)

1. Commit and push to the branch Vercel is watching (usually `main`):

   ```bash
   git add -A
   git commit -m "Describe your change"
   git push origin main
   ```

2. **Vercel** picks up the push automatically if the project is **connected to that GitHub repo** (Git integration). Watch **Deployments** in the Vercel project; when the build is green, production updates.

3. If you need to redeploy without a new commit: Vercel dashboard → your project → **Deployments** → **⋯** on the latest deployment → **Redeploy**.

**Note:** The demo API writes to the server filesystem only when `/data` exists on the host; on Vercel the filesystem is ephemeral, so API mutations may not persist across deploys—mock data and `localStorage` still work for the sidebar UI.

**API auth:** All `/api/contacts/*` routes require `Authorization: Bearer <token>`. The default token is built in; override with `NEXT_PUBLIC_DEMO_API_TOKEN` in Vercel (see [.env.example](.env.example)). Open **CRM — full workspace** → **API docs** tab (`/crm?tab=api`; `/api-docs` redirects there).

## Front plugin setup

1. In [Front developer settings](https://dev.frontapp.com/docs/plugins-introduction), create or edit your plugin and set the **plugin URL** to your Vercel (or other) **HTTPS** origin.
2. Open a conversation with a demo email to verify contact detection; use the header menu for **Demo settings** and **Records (API)**.

## API

See [API.md](API.md), CRM workspace **API docs** tab (token + CRUD table), and [public/openapi.yaml](public/openapi.yaml).

## Stack

- Next.js 16+, React 19, TypeScript, Tailwind CSS v4  
- `@frontapp/plugin-sdk`, `@frontapp/ui-kit` (installed; UI is primarily custom + Tailwind)  
- `@dnd-kit` for settings reordering, `zod` for API validation, `lucide-react` for icons  

## References

- [Front Plugin SDK](https://dev.frontapp.com/docs/plugins-introduction)  
- [Front UI Kit](https://ui-kit.frontapp.com/)  
