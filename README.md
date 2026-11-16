This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3040](http://localhost:3040) with your browser to see the result. (Port **3040** avoids the default **3000**, which is often already taken.)

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

To use another port once: `npx next dev --port <port>`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Geist, a font family.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy

This site runs on Google Cloud Run (`Dockerfile`, project `tolowa-studio`, region `us-west1`). Vercel is retired and prohibited; do not add `vercel.json` or `.vercel/` (CI enforces this).
