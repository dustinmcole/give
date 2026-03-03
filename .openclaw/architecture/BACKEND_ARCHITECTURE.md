---
owner: give-dev
last_updated: 2026-03-02
---

# Backend Architecture

## Stack
- Hono on Node.js 22
- Zod validation
- PostgreSQL + Prisma 6 ORM
- Stripe Connect Express (marketplace model)

## Directory Structure
```
apps/api/
  src/
    routes/        # Hono route handlers
    middleware/    # Auth, org scoping, error handling
    services/     # Business logic
    lib/          # Utilities, Stripe client, etc.
```

## Core Principles
1. **API-first** — every feature is an API endpoint first, then a UI
2. **Event-driven** — every action emits an event (donation received, donor created, etc.)
3. **Multi-tenant** — single codebase, shared infra, isolated data per organization
4. **AI-aware** — every data point should feed the AI feature store

## API Design
- RESTful: /api/[resource] (plural)
- Zod validation on all request bodies and params
- Standard envelope: `{ data: ..., meta: ... }` or `{ error: { code, message, details } }`
- Cursor-based pagination
- Middleware chain: auth → org scope → validate → handle → emit event

## Security
- Stripe webhook signatures verified before processing
- Organization isolation on every query (organizationId scoping)
- No raw SQL unless Prisma cannot express the query
- PCI SAQ A — card data never touches our servers (Stripe client-side tokenization)
- Field-level encryption for sensitive PII (SSN, bank account numbers)

## Endpoints to Document
(give-dev: update this as you build endpoints — see also API_CONTRACTS.md)
