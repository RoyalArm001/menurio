import { NextResponse } from "next/server";
import { processDueScheduledCampaigns } from "@/services/notification.service";
import { applySecurityHeaders } from "@/lib/security/middleware-helpers";
import { pruneExpiredRateLimitBuckets } from "@/lib/security/middleware-helpers";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 503 });
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const processed = await processDueScheduledCampaigns();
  await pruneExpiredRateLimitBuckets(new Date(Date.now() - 24 * 60 * 60 * 1000));
  return applySecurityHeaders(NextResponse.json({ ok: true, processed }));
}
