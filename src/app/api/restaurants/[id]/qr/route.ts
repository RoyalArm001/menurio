import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import { createQrCode, listQrCodes } from "@/services/qr.service";
import { getPermanentQrUrl } from "@/services/qr.service";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";
import { z } from "zod";

const createQrSchema = z.object({
  type: z.enum(["restaurant", "menu", "table"]),
  label: z.string().max(120).optional(),
  targetMenuId: z.string().uuid().optional(),
  targetBranchId: z.string().uuid().optional(),
  tableLabel: z.string().max(50).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "qr:manage",
  );
  if ("error" in access) return access.error;

  const codes = await listQrCodes(id);
  const withUrls = codes.map((c) => ({
    ...c,
    permanentUrl: getPermanentQrUrl(c.permanentId),
  }));

  return applySecurityHeaders(NextResponse.json({ qrCodes: withUrls }));
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "qr:manage",
  );
  if ("error" in access) return access.error;

  const body = await request.json().catch(() => null);
  const parsed = createQrSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues.map((i) => i.message).join("; "), 400);
  }

  try {
    const qr = await createQrCode({ restaurantId: id, ...parsed.data });
    return applySecurityHeaders(
      NextResponse.json({
        qr,
        permanentUrl: getPermanentQrUrl(qr.permanentId),
      }, { status: 201 }),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create QR code";
    return jsonError(message, 400);
  }
}
