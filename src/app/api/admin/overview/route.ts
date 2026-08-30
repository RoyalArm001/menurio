import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPlatformAdmin } from "@/lib/auth/platform-admin";
import { getDb } from "@/db";
import { restaurants, users, subscriptions, orders, auditLogs, restaurantDesigns, domains } from "@/db/schema";
import { desc, count, eq } from "drizzle-orm";
import { jsonError, applySecurityHeaders } from "@/lib/security/middleware-helpers";

export const dynamic = "force-dynamic";

async function requirePlatformAdmin() {
  const session = await auth();
  if (!session?.user?.id) return { error: jsonError("Unauthorized", 401) } as const;
  const ok = await isPlatformAdmin(session.user.id);
  if (!ok) return { error: jsonError("Forbidden", 403) } as const;
  return { userId: session.user.id } as const;
}

export async function GET() {
  const gate = await requirePlatformAdmin();
  if ("error" in gate) return gate.error;

  const db = getDb();

  const [restaurantCount] = await db.select({ c: count() }).from(restaurants);
  const [userCount] = await db.select({ c: count() }).from(users);
  const [orderCount] = await db.select({ c: count() }).from(orders);

  const recentRestaurants = await db
    .select({ id: restaurants.id, name: restaurants.name, slug: restaurants.slug, createdAt: restaurants.createdAt })
    .from(restaurants)
    .orderBy(desc(restaurants.createdAt))
    .limit(10);

  const recentAudit = await db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(20);

  const planBreakdown = await db.select().from(subscriptions);
  const designs = await db
    .select({
      restaurantId: restaurantDesigns.restaurantId,
      themeId: restaurantDesigns.themeId,
      whiteLabelEnabled: restaurantDesigns.whiteLabelEnabled,
      customCssEnabled: restaurantDesigns.customCssEnabled,
    })
    .from(restaurantDesigns);
  const verifiedDomains = await db
    .select({ restaurantId: domains.restaurantId, hostname: domains.hostname, verified: domains.verified })
    .from(domains)
    .where(eq(domains.verified, true));

  return applySecurityHeaders(
    NextResponse.json({
      stats: {
        restaurants: Number(restaurantCount?.c ?? 0),
        users: Number(userCount?.c ?? 0),
        orders: Number(orderCount?.c ?? 0),
      },
      recentRestaurants,
      recentAudit,
      subscriptions: planBreakdown,
      designs,
      customDomains: verifiedDomains,
    }),
  );
}
