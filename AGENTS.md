# Menurio for Restaurants — Agent Ownership

## Product

Multi-tenant SaaS for restaurants, cafes, bars, and hotels.

**Your Restaurant. Your Website. Your Menu. Your Orders.**

## Stack

GitHub → Vercel → Next.js App Router → Beget MySQL 8.4 → S3-compatible storage

## Ownership

| Agent | Owns |
|-------|------|
| **Cursor** | Visual design, UX, public pages, dashboard UI, themes |
| **Codex** | Database, auth, API, storage, tenancy, permissions, orders, subscriptions, SEO infrastructure, security, tests, deployment |

Do not modify another agent's owned subsystem unless required for functionality.

## Engineering Rules

- TypeScript only
- Never store plaintext passwords
- Never expose secrets to client-side code
- Tenant data strictly isolated by `restaurant_id`
- All privileged operations authorized server-side
- Validate all API input
- Mobile-first UI (Cursor)
- Public pages must be fast and SEO-friendly
- No paid third-party services without documenting why
- Run lint, typecheck, and tests before declaring work complete
- No fake static buttons when real functionality is required

## Plans

FREE · START · PRO · PRO+

Capabilities are centralized in `src/lib/entitlements/` — never scatter plan-name checks.

## Public URL Patterns

- Platform: `menurio.store/r/{slug}`
- QR permanent: `/q/{permanentId}` (survives domain/slug changes)
- Custom domains (PRO+): `menu.restaurant.am`, `restaurant.am`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
