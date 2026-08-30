# Environment Variables

See [`.env.example`](./.env.example) for the full list.

## Required for production

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Beget MySQL connection |
| `AUTH_SECRET` | Session signing (`openssl rand -base64 32`) |
| `AUTH_URL` | Canonical app URL |
| `GOOGLE_CLIENT_ID` | Optional Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Optional Google OAuth |
| `NEXT_PUBLIC_PLATFORM_URL` | Public links, SEO, QR targets |
| `PLATFORM_HOSTNAME` | Subdomain tenant resolution |
| `S3_*` | Object storage (Beget S3-compatible) |
| `ANALYTICS_IP_SALT` | Privacy-preserving analytics |
| `MFA_ENCRYPTION_KEY` | Reserved for optional MFA enrollment; do not configure a placeholder in production |

## Vercel deployment

1. Connect GitHub repository
2. Set all environment variables in Vercel project settings
3. Run `npm run db:migrate` against production DB (via CI or manual)
4. Deploy — build command: `npm run build`

## Local development

```bash
cp .env.example .env.local
# Fill in values
npm install
npm run db:migrate
npm run dev
```

Never commit `.env.local` or production secrets.
