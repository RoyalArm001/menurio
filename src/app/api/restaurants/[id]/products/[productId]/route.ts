import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import { updateProduct, deleteProduct } from "@/services/menu.service";
import { parseBody, updateProductSchema } from "@/lib/validation/schemas";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";

type RouteContext = {
  params: Promise<{ id: string; productId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id, productId } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "menu:write",
  );
  if ("error" in access) return access.error;

  const body = await request.json().catch(() => null);
  const parsed = parseBody(updateProductSchema, body);
  if (!parsed.success) return jsonError(parsed.error, 400);

  try {
    const product = await updateProduct(id, productId, parsed.data);
    return applySecurityHeaders(NextResponse.json({ product }));
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Failed", 400);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id, productId } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "menu:delete",
  );
  if ("error" in access) return access.error;

  try {
    await deleteProduct(id, productId);
    return applySecurityHeaders(NextResponse.json({ ok: true }));
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Failed", 400);
  }
}
