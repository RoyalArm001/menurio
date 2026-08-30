import { getDb } from "@/db";
import { analyticsEvents, products, qrCodes } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { hashIp, truncateUserAgent } from "@/lib/security/privacy";
import type { z } from "zod";
import type { analyticsEventSchema } from "@/lib/validation/schemas";

export type AnalyticsInput = z.infer<typeof analyticsEventSchema>;

export async function trackEvent(
  restaurantId: string,
  input: AnalyticsInput,
  requestHeaders?: Headers,
) {
  const db = getDb();
  const ip = requestHeaders ? requestHeaders.get("x-forwarded-for") : null;

  if (input.productId) {
    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(
        and(
          eq(products.id, input.productId),
          eq(products.restaurantId, restaurantId),
        ),
      )
      .limit(1);
    if (!product) throw new Error("Product does not belong to this restaurant");
  }

  if (input.qrCodeId) {
    const [qrCode] = await db
      .select({ id: qrCodes.id })
      .from(qrCodes)
      .where(
        and(
          eq(qrCodes.id, input.qrCodeId),
          eq(qrCodes.restaurantId, restaurantId),
        ),
      )
      .limit(1);
    if (!qrCode) throw new Error("QR code does not belong to this restaurant");
  }

  await db.insert(analyticsEvents).values({
    restaurantId,
    eventType: input.eventType,
    sessionId: input.sessionId,
    path: input.path,
    productId: input.productId,
    qrCodeId: input.qrCodeId,
    metadata: input.metadata ?? {},
    ipHash: ip ? hashIp(ip.split(",")[0]!.trim()) : null,
    userAgent: truncateUserAgent(
      requestHeaders?.get("user-agent") ?? null,
    ),
  });
}
