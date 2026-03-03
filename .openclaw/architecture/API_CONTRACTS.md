---
owner: give-dev
last_updated: 2026-03-02
---

# API Contracts

## Conventions
- Base path: /api
- Auth: Bearer token in Authorization header
- Org scoping: organizationId from auth context (never from request body)
- Response envelope: { data: ..., meta: { cursor, hasMore } }
- Error envelope: { error: { code: string, message: string, details?: object } }
- Pagination: cursor-based (?cursor=xxx&limit=25)

## Endpoints

(give-dev: document each endpoint as you build it)

### Template

```
### [METHOD] /api/[resource]
**Added:** WI-XXXX
**Auth:** required
**Request:**
  - Body: { field: type }
  - Params: { id: string }
  - Query: { cursor?: string, limit?: number }
**Response:**
  - 200: { data: ResourceType }
  - 400: { error: { code: "VALIDATION_ERROR", message: "..." } }
  - 404: { error: { code: "NOT_FOUND", message: "..." } }
**Notes:** [any special behavior]
```
