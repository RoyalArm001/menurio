import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import { getDb } from "@/db";
import { auditLogs } from "@/db/schema";
import {
  applySecurityHeaders,
} from "@/lib/security/middleware-helpers";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "restaurant:read",
  );
  if ("error" in access) return access.error;

  const db = getDb();
  const logs = await db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.restaurantId, id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(50);

  return applySecurityHeaders(NextResponse.json({ logs }));
}
