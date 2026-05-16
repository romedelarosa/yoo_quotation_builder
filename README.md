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

## Deploy

This app can be pushed to GitHub and imported into Vercel as a Next.js project. Add the same environment variables in Vercel Project Settings before sharing the deployment URL.
