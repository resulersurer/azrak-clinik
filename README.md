# Azrak Klinik

Azrak Klinik is a TypeScript [Next.js](https://nextjs.org) application, ready to deploy on Vercel.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this repository to GitHub.
2. In the [Vercel dashboard](https://vercel.com/new), select **Add New Project** and import the repository.
3. Keep the automatically detected **Next.js** framework preset and deploy.

Vercel automatically runs `npm run build` and deploys the resulting application. No `vercel.json` configuration is required for this Next.js app.

### Environment Variables

Add production environment variables in **Project Settings > Environment Variables** in Vercel. Prefix values that must be accessible in the browser with `NEXT_PUBLIC_`.

For a local production check, run:

```bash
npm run build
```
