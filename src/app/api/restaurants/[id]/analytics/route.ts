import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import { getDashboardAnalytics } from "@/services/analytics-read.service";
import { applySecurityHeaders } from "@/lib/security/middleware-helpers";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "analytics:read",
  );
  if ("error" in access) return access.error;

  const analytics = await getDashboardAnalytics(id);
  return applySecurityHeaders(NextResponse.json({ analytics }));
}
