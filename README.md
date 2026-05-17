# YOO Quote Builder

Internal Next.js + TypeScript + Tailwind CSS MVP for generating patient-facing quotation sheets for YOO Plastic Surgery and Aesthetics Clinic.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## MVP Login

Set `YOO_ADMIN_PASSWORD` in `.env.local` to control access.

```bash
YOO_ADMIN_PASSWORD=your-password
SESSION_SECRET=replace-with-a-long-random-string
```

If no password is configured, the local demo password is:

```text
yoo-demo-2026
```

## Current MVP features

- Select a clinic service template and generate a patient quotation sheet.
- Manage service templates from `/admin/services` when Supabase is configured.
- Save a quote record for the current server session.
- Search recent saved quotes, reload one into the builder, and export the visible history list as CSV.
- Print the quotation sheet or save it as a one-page A4 PDF.

Quote history is currently backed by an in-memory store, so records are cleared when the server restarts.

## Supabase service templates

The service template admin uses Supabase when these environment variables are available:

```bash
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-server-side-key
```

The app also recognizes the Vercel/Supabase integration variants such as `SUPABASE_SECRET_KEY`, `SUPABASE_ANON_KEY`, `SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Before saving templates, run `supabase/schema.sql` in the Supabase SQL editor. Then visit `/admin/services` and click `Seed default templates` once to copy the current hardcoded service list into Supabase.

## Deploy

This app can be pushed to GitHub and imported into Vercel as a Next.js project. Add the same environment variables in Vercel Project Settings before sharing the deployment URL.
