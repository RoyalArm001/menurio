import { NextResponse } from "next/server";
import { getRestaurantPublicProfile } from "@/services/restaurant.service";
import { getMenuTree } from "@/services/menu.service";
import {
  applySecurityHeaders,
  jsonError,
  withRateLimit,
} from "@/lib/security/middleware-helpers";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: Request, context: RouteContext) {
  const rate = await withRateLimit(
    request as unknown as import("next/server").NextRequest,
    "public-restaurant",
    120,
    60_000,
  );
  if (!rate.allowed) return jsonError("Too many requests", 429);

  const { slug } = await context.params;
  const profile = await getRestaurantPublicProfile(slug);

  if (!profile || !profile.restaurant.isPublished) {
    return jsonError("Not found", 404);
  }

  const menus = await getMenuTree(profile.restaurant.id);
  return applySecurityHeaders(
    NextResponse.json({ ...profile, menus }),
  );
}
