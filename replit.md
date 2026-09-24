# ConciergeGo Landing Page

Landing page comercial do ConciergeGo para donos de pousadas e hotéis.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/conciergego-landing/src/App.tsx` — one-page marketing experience and lead form
- `artifacts/conciergego-landing/src/index.css` — ConciergeGo visual system and responsive styles
- `lib/api-spec/openapi.yaml` — source of truth for the lead submission contract
- `lib/db/src/schema/leads.ts` — persisted contact lead model
- `artifacts/api-server/src/routes/leads.ts` — lead submission endpoint

## Architecture decisions

- The landing page is a separate web artifact from the existing ConciergeGo SaaS and links to the external app for sign-in and signup.
- The only server-side behavior is the public lead capture endpoint; no landing-page authentication is required.
- The visual language follows the supplied ConciergeGo design system: green, cream, aqua, coral accents, and editorial hospitality pacing.

## Product

The site explains ConciergeGo's value, capabilities, plans, and Solus Design background, then captures qualified hospitality leads or routes visitors to WhatsApp.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- API client requests use the shared `/api` proxy path; the landing page must remain at the root preview path.
- External signup, login, plan, and WhatsApp URLs are intentionally kept outside the landing-page app.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
