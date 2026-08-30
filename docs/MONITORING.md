# Monitoring — Menurio for Restaurants

## Integration point

Production error monitoring is intentionally not hard-wired to a paid vendor.

Hook: `src/lib/monitoring/report-error.ts`

```typescript
import { reportError } from "@/lib/monitoring/report-error";

reportError(error, { context: "order.create", restaurantId });
```

Wire this to Sentry, Datadog, or another provider in production by implementing the reporter.

## Recommended production checks

- Vercel deployment / function error rates
- Database connection pool saturation
- S3 upload failure rate
- Auth callback failures
- Order creation 4xx/5xx ratio

## Analytics

First-party analytics events are stored in `analytics_events` — no third-party tracker required.
