# Local Development — Menurio

## Prerequisites

- Node.js 20+
- Docker Desktop (for local MySQL)

## Quick start

```bash
copy .env.local.example .env.local
npm install
npm run setup:local
npm run dev
```

Open http://localhost:3000

## Database (Docker MySQL 8.4)

| Setting | Value |
|---------|-------|
| Host | `127.0.0.1` |
| Port | `3307` |
| Database | `menurio` |
| User | `menurio` |
| Password | `menurio_dev` |

Connection URL:

```
DATABASE_URL=mysql://menurio:menurio_dev@127.0.0.1:3307/menurio
```

Commands:

```bash
npm run db:up      # start MySQL container
npm run db:init    # apply Drizzle migrations
npm run db:down    # stop container
npm run db:logs    # view logs
```

## Optional Google OAuth

Email/password authentication works without Google. To enable Google sign-in:

1. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com)
2. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
3. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`

## S3 uploads (optional locally)

Without S3 credentials, file uploads fail gracefully. For full upload testing, configure Beget S3 vars in `.env.local`.

## Production

Production uses **Beget MySQL 8.4** (external host, not localhost) and **Vercel**. See root [README.md](../README.md).
