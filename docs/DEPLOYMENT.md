# Deployment — Menurio for Restaurants

## Stack

GitHub → Vercel → Next.js App Router → Beget MySQL 8.4 → Beget S3

## Vercel setup

1. Connect the GitHub repository to Vercel.
2. Set **Framework Preset** to Next.js.
3. Add all variables from `.env.example` in the Vercel project settings.
4. Set `DATABASE_URL` to Beget external MySQL (`mysql://...`) **or** discrete `DB_*` vars.
5. If Google sign-in is enabled, configure Google OAuth with production callback URL:
   - `https://menurio.store/api/auth/callback/google`
6. Point S3 credentials to Beget S3.

## Database migrations

Run against **empty** Beget MySQL before first production use:

```bash
DATABASE_URL=mysql://... npm run db:migrate
```

Back up production data before any migration. Do not run destructive SQL without approval.

Before applying `0003_production_hardening.sql` to an existing database, run
these read-only checks. The migration adds unique constraints and must stop if
existing data contains duplicates:

```sql
SELECT restaurant_id, order_number, COUNT(*) AS duplicates
FROM orders
GROUP BY restaurant_id, order_number
HAVING COUNT(*) > 1;

SELECT campaign_id, subscription_id, COUNT(*) AS duplicates
FROM notification_deliveries
GROUP BY campaign_id, subscription_id
HAVING COUNT(*) > 1;
```

Both queries must return zero rows before migration. The production migration
also creates the MySQL-backed distributed rate-limit table and durable push
delivery retry fields.

## Build verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Notes

- No persistent local filesystem on Vercel; uploads go to S3 via presigned URLs.
- DB credentials are server-side only — never `NEXT_PUBLIC_*`.

## Tenant custom domains (PRO+)

1. Add the tenant hostname in Vercel **and** point its DNS to the Vercel target shown in that dashboard.
2. In the restaurant dashboard, add the hostname. Menurio returns a verification token.
3. Create a TXT record at `_menurio-verify.<hostname>` with either the token itself or `menurio-verification=<token>`.
4. Use the dashboard verification action only after DNS propagation. A domain is not activated until the TXT token resolves.

Vercel owns certificate issuance and SSL status. Confirm the Vercel domain is valid before making it the restaurant's primary public hostname.

Verified custom domains are served at their hostname root, for example
`https://menu.restaurant.am/` and `https://menu.restaurant.am/menu`. The
platform path remains `https://menurio.store/r/{slug}`; do not configure a
custom-domain redirect to that path in DNS or Vercel.
