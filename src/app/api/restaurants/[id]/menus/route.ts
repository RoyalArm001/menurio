import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import { createMenu, listMenus } from "@/services/menu.service";
import { parseBody, createMenuSchema } from "@/lib/validation/schemas";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "menu:read",
  );
  if ("error" in access) return access.error;

  const menuList = await listMenus(id);
  return applySecurityHeaders(NextResponse.json({ menus: menuList }));
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "menu:write",
  );
  if ("error" in access) return access.error;

  const body = await request.json().catch(() => null);
  const parsed = parseBody(createMenuSchema, body);
  if (!parsed.success) return jsonError(parsed.error, 400);

  const menu = await createMenu(id, authResult.userId, parsed.data);
  return applySecurityHeaders(NextResponse.json({ menu }, { status: 201 }));
}
