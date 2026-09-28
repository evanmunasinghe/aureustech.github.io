# Aureus Technologies

A mobile-responsive single-page company website built with:

- Next.js 16 (App Router, TypeScript)
- Bootstrap 5
- Bootstrap Icons
- Prisma + MySQL/TiDB (portfolio projects are stored in the database)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Portfolio admin

Admins edit the public portfolio at `/dashboard/portfolio`. Setup:

1. Set `DATABASE_URL` and `ADMIN_PASSWORD` (see `.env.example`).
2. `npx prisma db push` to create the `PortfolioProject` table.
3. Log in as an admin, open Portfolio, enter `ADMIN_PASSWORD`, and use "Load starter projects" to import the two defaults.

## Build

```bash
npm run build && npm start
```

The site needs a Node server runtime (e.g. Vercel); it is no longer a static export.
