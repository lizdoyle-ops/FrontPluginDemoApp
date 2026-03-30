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

## Push to GitHub

GitHub stores your source code. The **HTTPS URL Front loads in the iframe** must come from a host that serves the built app (recommended: **Vercel** connected to this repo).

1. Create a new empty repository on [GitHub](https://github.com/new) (any name, e.g. `front-property-plugin`). Do **not** add a README or `.gitignore` (this project already has them).

2. In the project folder, connect and push (replace `YOUR_USER` and `YOUR_REPO`):

```bash
cd /path/to/FrontPluginDemoApp
git init
git add .
git commit -m "Initial commit: Front property CRM plugin"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

## Deploy a public URL (Vercel + GitHub)

1. Sign in at [vercel.com](https://vercel.com) and click **Add New… → Project**.
2. **Import** the GitHub repository you just pushed.
3. Leave defaults (Framework: Next.js, Build: `next build`, Output: Next.js). Deploy.
4. Copy the production URL (e.g. `https://front-property-plugin.vercel.app`).

**Front plugin URL:** use the **root** of that deployment, e.g. `https://your-app.vercel.app` (Front loads the plugin in an iframe; paths like `/` and `/settings` work relative to that origin).

**Note:** The demo API writes to the server filesystem only when `/data` exists on the host; on Vercel the filesystem is ephemeral, so API mutations may not persist across deploys—mock data and `localStorage` still work for the sidebar UI.

## Front plugin setup

1. In [Front developer settings](https://dev.frontapp.com/docs/plugins-introduction), create or edit your plugin and set the **plugin URL** to your Vercel (or other) **HTTPS** origin.
2. Open a conversation with a demo email to verify contact detection; use the header menu for **Demo settings** and **Records (API)**.

## API

See [API.md](API.md) and [public/openapi.yaml](public/openapi.yaml) (`/openapi.yaml` when running).

## Stack

- Next.js 16+, React 19, TypeScript, Tailwind CSS v4  
- `@frontapp/plugin-sdk`, `@frontapp/ui-kit` (installed; UI is primarily custom + Tailwind)  
- `@dnd-kit` for settings reordering, `zod` for API validation, `lucide-react` for icons  

## References

- [Front Plugin SDK](https://dev.frontapp.com/docs/plugins-introduction)  
- [Front UI Kit](https://ui-kit.frontapp.com/)  
