import { getDb } from "@/db";
import { auditLogs } from "@/db/schema";

export async function writeAuditLog(params: {
  restaurantId?: string;
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
}): Promise<void> {
  const db = getDb();
  await db.insert(auditLogs).values({
    restaurantId: params.restaurantId,
    userId: params.userId,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    metadata: params.metadata ?? {},
    ipAddress: params.ipAddress ?? undefined,
  });
}
