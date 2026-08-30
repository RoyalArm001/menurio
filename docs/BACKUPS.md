# Backups — Menurio for Restaurants

## Beget MySQL

Use Beget's automated MySQL backups and exports. Recommended:

- Daily full backups with 7–30 day retention
- Point-in-time recovery where available
- Test restore procedure quarterly

## S3 assets

- Enable versioning on the Beget/S3 bucket when supported
- Replicate bucket to a secondary region or provider for disaster recovery
- Never treat the Vercel filesystem as a backup target

## Application export

Restaurant data can be exported via:

- Database dump (`mysqldump`) — full tenant data
- S3 bucket sync — uploaded logos, covers, product images, import files

Future: add dashboard export utilities for menu JSON/CSV per restaurant.
