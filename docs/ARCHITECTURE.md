# Menurio Backend Architecture

## Stack

```
GitHub → Vercel → Next.js App Router → Beget MySQL 8.4 + S3-compatible storage
```

## Layer Structure

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Schema | `src/db/schema/` | Drizzle ORM models, enums, indexes |
| Services | `src/services/` | Business logic, tenant-scoped queries |
| API | `src/app/api/` | HTTP handlers, validation, guards |
| Auth | `src/lib/auth/` | Google OAuth, sessions, RBAC |
| Entitlements | `src/lib/entitlements/` | Plan capabilities (centralized) |
| Storage | `src/lib/storage/` | S3 presigned uploads (Beget-compatible) |
| SEO | `src/lib/seo/` | Metadata, JSON-LD, sitemap |
| Security | `src/lib/security/` | Headers, rate limits, IP hashing |

## Tenant Isolation

Every tenant-scoped table includes `restaurant_id`. Services call `assertTenantScope()` before mutations. API routes require membership via `requireRestaurantAccess()`.

## Public URLs

| Pattern | Example |
|---------|---------|
| Restaurant page | `/r/{slug}` → `menurio.store/r/lavash` |
| Permanent QR | `/q/{permanentId}` — redirects to current destination |
| Custom domain | Host header → tenant resolution → rewrite to `/r/{slug}` |

## Order Event Stream

`order_events` table stores status transitions for future realtime receiver (WebSocket/SSE/Push).

## Connecting Cursor Onboarding UI

```typescript
// POST /api/restaurants
{ name: "Lavash", slug: "lavash" }  // slug optional — auto-generated

// Response includes restaurant, default branch, qrPermanentId
```

Dashboard menu CRUD:

```typescript
// POST /api/restaurants/{id}/menu  type: "category" | "product"
// GET  /api/restaurants/{id}/menu?menuId=...
// POST /api/restaurants/{id}/menus
```

Image uploads:

```typescript
// POST /api/restaurants/{id}/uploads/presign
// Client uploads to returned uploadUrl, stores publicUrl in product
```
