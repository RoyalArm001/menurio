# Menurio — Multi-tenant Restaurant SaaS

**menurio.store** · Next.js 16 (App Router) · Vercel · Beget MySQL 8.4 · S3 storage

Multi-tenant platform where each restaurant owner gets a dashboard, public menu site (`/r/{slug}`), QR codes, orders, and translations.

## Architecture

```
menurio.store (Beget DNS)
        ↓
     Vercel
        ↓
    Next.js
 ├── Public website + /r/[slug]
 ├── Auth (NextAuth / Google OAuth)
 ├── /dashboard (restaurant owners)
 ├── /admin (platform admin)
 └── /api/* (server-side API)
        ↓
 Beget MySQL 8.4 (external host)
        ↓
 Beget S3 (images/uploads)
```

## Local development

```bash
cp .env.local.example .env.local   # Windows: copy .env.local.example .env.local
npm run setup:local                # Docker MySQL + migrations
npm run dev                        # http://localhost:3000
```

See [docs/LOCAL_DEV.md](docs/LOCAL_DEV.md) for details.

## Production deploy (Vercel)

1. Push to GitHub and import project in Vercel
2. Set environment variables (see below)
3. Add domain `menurio.store` in Vercel → Domains
4. Configure Beget DNS (see **Beget → Vercel DNS** below)
5. Run database migrations against Beget MySQL **once** (see DATABASE section)
6. Deploy

## Beget → Vercel DNS

Domain **menurio.store** is registered and managed in **Beget**.

1. In **Vercel** → Project → **Settings** → **Domains**, add `menurio.store` and `www.menurio.store` (if needed).
2. Vercel shows the exact DNS records required (usually an **A record** for `@` and/or a **CNAME** for `www`).
3. In **Beget** → DNS for `menurio.store`, create records using **exactly the values Vercel displays** at that moment.
   - Do not guess IP or CNAME values — copy them from the Vercel dashboard.
4. Wait for DNS propagation (minutes to a few hours). Vercel will issue SSL automatically.

## Environment variables (Vercel)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes* | `mysql://USER:PASS@HOST:3306/DB` (Beget external MySQL host) |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Alt* | Use instead of `DATABASE_URL` if preferred |
| `AUTH_SECRET` | Yes | Random secret (`openssl rand -base64 32`) |
| `AUTH_URL` | Yes | `https://menurio.store` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional | OAuth callback: `https://menurio.store/api/auth/callback/google` |
| `NEXT_PUBLIC_APP_URL` | Yes | `https://menurio.store` |
| `NEXT_PUBLIC_PLATFORM_URL` | Yes | `https://menurio.store` |
| `PLATFORM_HOSTNAME` | Yes | `menurio.store` |
| `PLATFORM_ADMIN_EMAILS` | Yes | Comma-separated admin emails |
| `S3_*` | Yes | Beget S3 credentials for image uploads |
| `ANALYTICS_IP_SALT` | Yes | Random salt for analytics IP hashing |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Push | Web Push public key (PRO / PRO+) |
| `VAPID_PRIVATE_KEY` | Push | Web Push private key (server only) |
| `VAPID_SUBJECT` | Push | e.g. `mailto:hello@menurio.store` |
| `CRON_SECRET` | PRO+ cron | Bearer token for `/api/cron/notifications` |
| `MFA_ENCRYPTION_KEY` | Reserved | Required only when the optional MFA enrollment flow is implemented |

\* Provide either `DATABASE_URL` **or** all `DB_*` vars. Never expose DB credentials to the client.

## Authentication

Primary flow: **Email + Password** (stored as bcrypt hash in MySQL).

- Register: `/register` → creates User + Restaurant + OWNER membership + FREE subscription in one **database transaction**
- Login: `/login` with credentials (Google OAuth remains **optional** if `GOOGLE_CLIENT_*` env vars are set)
- Sessions: Auth.js JWT sessions (30-day max age)
- Password rules: minimum 8 characters; never stored or returned in plain text

Optional Google sign-in does not replace email/password registration.

## Subscription SEO

SEO is tiered via `src/lib/entitlements/seo.ts`:

| Tier | Features |
|------|----------|
| **FREE** | Auto title/description, canonical, sitemap, basic OG, indexable public pages |
| **PRO** | Custom SEO title/description, multilingual SEO, hreflang, JSON-LD, SEO dashboard |
| **PRO+** | PRO + analytics ID, index control, slug redirects, custom-domain canonical |

Dashboard: **SEO** section at `/dashboard/seo` (PRO+ fields gated server-side).

Migration: `drizzle/0002_auth_seo.sql` adds `restaurant_seo_settings`, `restaurant_seo_translations`, `slug_redirects`.

## PWA (PRO / PRO+)

Each published restaurant on PRO or PRO+ can offer an installable app scoped to `/r/{slug}`:

- Dynamic manifest: `/r/{slug}/manifest.webmanifest`
- Dynamic service worker: `/r/{slug}/sw.js` (scope `/r/{slug}`)
- App name/icon: `pwaDisplayName` → restaurant name → **MENURIO**
- Icon fallback: PWA icon → logo → `/icons/menurio-icon.svg`

Customers see **Install App** on supported browsers; iOS shows Share → Add to Home Screen instructions.

Configure PWA fields under **Dashboard → Settings → PWA & notifications**.

## Push notifications (PRO / PRO+)

- **PRO**: send push notifications to subscribers of that restaurant only
- **PRO+**: scheduled campaigns + delivery history architecture

Public menu: **Enable notifications** (permission only after user click).

### VAPID setup

Generate keys (example using `web-push` CLI):

```bash
npx web-push generate-vapid-keys
```

Set in Vercel / `.env.local`:

| Variable | Side | Description |
|----------|------|-------------|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Client | Public VAPID key |
| `VAPID_PRIVATE_KEY` | Server only | Never expose to browser |
| `VAPID_SUBJECT` | Server | e.g. `mailto:hello@menurio.store` |

### Scheduled notifications (PRO+)

`vercel.json` includes a cron job hitting `/api/cron/notifications` every minute.

Set `CRON_SECRET` in Vercel; the route requires `Authorization: Bearer <CRON_SECRET>`.

### Service worker caching

- Static assets under `/r/{slug}/`: cache-first
- Public menu API `/api/public/restaurants/{slug}`: network-first with offline fallback
- Never caches `/dashboard`, `/admin`, `/api/auth`, or tenant-private APIs

## Database migrations

PostgreSQL migrations are archived in `drizzle/postgresql-legacy/`.

**MySQL (production):**

```bash
# Set DATABASE_URL to Beget MySQL, then:
npm run db:migrate
```

Only run migrations on an **empty** database or when you understand the diff. Do not run destructive commands on production without a backup.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Marketing homepage |
| `/login` | Sign in with email/password; Google OAuth is optional |
| `/onboarding` | Create restaurant |
| `/dashboard/*` | Owner dashboard |
| `/admin` | Platform admin |
| `/r/[slug]` | Public restaurant site |
| `/q/[permanentId]` | Permanent QR redirect |

## Stack

- **Next.js 16** App Router
- **NextAuth v5** (JWT sessions)
- **Drizzle ORM** + **mysql2**
- **Zod** validation
- **S3-compatible** storage (Beget)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm test` | Vitest |
| `npm run db:up` | Start local MySQL (Docker) |
| `npm run db:init` | Apply migrations locally |
| `npm run db:generate` | Generate migration from schema |
