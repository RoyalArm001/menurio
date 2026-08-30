import { eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { insertReturning } from "@/db/write-helpers";
import { branches, qrCodes, restaurants, menus } from "@/db/schema";
import { nanoid } from "nanoid";
import {
  buildQrPermanentUrl,
  buildRestaurantPublicUrl,
} from "@/lib/utils/slug";

export interface QrDestination {
  permanentId: string;
  url: string;
  type: "restaurant" | "menu" | "table" | "promotion";
  restaurantId: string;
  restaurantSlug: string;
  targetMenuId?: string | null;
  tableLabel?: string | null;
}

export async function createQrCode(params: {
  restaurantId: string;
  type: "restaurant" | "menu" | "table" | "promotion";
  label?: string;
  targetMenuId?: string;
  targetBranchId?: string;
  tableLabel?: string;
}) {
  const db = getDb();

  if (params.targetMenuId) {
    const [menu] = await db
      .select({ id: menus.id })
      .from(menus)
      .where(
        and(
          eq(menus.id, params.targetMenuId),
          eq(menus.restaurantId, params.restaurantId),
        ),
      )
      .limit(1);
    if (!menu) throw new Error("Menu not found");
  }

  if (params.targetBranchId) {
    const [branch] = await db
      .select({ id: branches.id })
      .from(branches)
      .where(
        and(
          eq(branches.id, params.targetBranchId),
          eq(branches.restaurantId, params.restaurantId),
        ),
      )
      .limit(1);
    if (!branch) throw new Error("Branch not found");
  }

  const permanentId = nanoid(21);

  const qr = await insertReturning(qrCodes, {
    restaurantId: params.restaurantId,
    permanentId,
    type: params.type,
    label: params.label,
    targetMenuId: params.targetMenuId,
    targetBranchId: params.targetBranchId,
    tableLabel: params.tableLabel,
  });

  return qr;
}

export async function resolveQrDestination(
  permanentId: string,
): Promise<QrDestination | null> {
  const db = getDb();

  const [qr] = await db
    .select({
      qr: qrCodes,
      restaurant: restaurants,
    })
    .from(qrCodes)
    .innerJoin(restaurants, eq(qrCodes.restaurantId, restaurants.id))
    .where(and(eq(qrCodes.permanentId, permanentId), eq(qrCodes.isActive, true)))
    .limit(1);

  if (!qr) return null;

  let destinationUrl = buildRestaurantPublicUrl(qr.restaurant.slug);

  if (qr.qr.type === "menu" && qr.qr.targetMenuId) {
    const [menu] = await db
      .select()
      .from(menus)
      .where(
        and(
          eq(menus.id, qr.qr.targetMenuId),
          eq(menus.restaurantId, qr.qr.restaurantId),
        ),
      )
      .limit(1);
    if (menu) {
      destinationUrl = `${destinationUrl}/menu/${menu.slug}`;
    }
  }

  if (qr.qr.type === "table" && qr.qr.tableLabel) {
    destinationUrl = `${destinationUrl}?table=${encodeURIComponent(qr.qr.tableLabel)}`;
  }

  return {
    permanentId: qr.qr.permanentId,
    url: destinationUrl,
    type: qr.qr.type,
    restaurantId: qr.restaurant.id,
    restaurantSlug: qr.restaurant.slug,
    targetMenuId: qr.qr.targetMenuId,
    tableLabel: qr.qr.tableLabel,
  };
}

export function getPermanentQrUrl(permanentId: string): string {
  return buildQrPermanentUrl(permanentId);
}

export async function listQrCodes(restaurantId: string) {
  const db = getDb();
  return db
    .select()
    .from(qrCodes)
    .where(eq(qrCodes.restaurantId, restaurantId));
}
