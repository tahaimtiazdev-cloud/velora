# VELORA

A production-quality, full-stack e-commerce application for a fictional premium fashion/lifestyle brand. Built as a portfolio-quality demonstration of a real commercial storefront — database-backed catalog, authentication, cart, Stripe checkout, and an admin dashboard.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4
- PostgreSQL ([Neon](https://neon.tech), serverless)
- [Prisma ORM](https://www.prisma.io) 7 (driver adapters, no Rust engine)
- [Auth.js](https://authjs.dev) v5 (Credentials provider)
- [Stripe](https://stripe.com) (test mode)
- [Resend](https://resend.com) for transactional email
- Deployed on [Vercel](https://vercel.com)

## Getting started

```bash
npm install
```

Copy `.env.example` to `.env` and `.env.local` and fill in a `DATABASE_URL` (a free [Neon](https://neon.tech) project works well). Then:

```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts

Seeded by `prisma/seed.ts` — demo data only, not real credentials:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@velora.example` | `VeloraAdmin123!` |
| Customer | `customer@velora.example` | `VeloraCustomer123!` |

## Project structure

```
prisma/
  schema.prisma       Database schema
  seed.ts              Seed script (categories, products, variants, demo users)
src/
  app/                 Route segments + API routes
  components/
    ui/                Generic primitives (Button, Container, Section, Badge, ...)
    layout/             Header, Footer
    home/               Homepage sections
    product/            Product card and catalog components
  lib/
    db.ts              Prisma client (Neon driver adapter)
    queries/            Data-access functions, grouped by domain
    inventory.ts        Stock calculation rules
    site-config.ts      Static site/nav config
  types/                Types derived from query return shapes
```

## Data model

Products with variants (e.g. sizes, colors) track stock **per variant**; a product's own `stock` field is only authoritative when it has no variants. See `src/lib/inventory.ts` for the shared rule used across the catalog, product pages, and cart validation.

## Scripts

- `npm run dev` / `npm run build` / `npm run start` / `npm run lint`
- `npm run db:migrate` — create/apply a migration in development
- `npm run db:deploy` — apply migrations in production
- `npm run db:seed` — re-run the seed script
- `npm run db:studio` — open Prisma Studio

## Status

Built in stages; see commit history. Currently: **Stage 1 — project setup, design system, database schema, seed data, base layout, navigation, and a database-backed homepage.**
