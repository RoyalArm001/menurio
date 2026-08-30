import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import { getMenuTree, createCategory, createProduct } from "@/services/menu.service";
import {
  parseBody,
  createCategorySchema,
  createProductSchema,
} from "@/lib/validation/schemas";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "menu:read",
  );
  if ("error" in access) return access.error;

  const url = new URL(request.url);
  const menuId = url.searchParams.get("menuId") ?? undefined;
  const tree = await getMenuTree(id, menuId);
  return applySecurityHeaders(NextResponse.json({ menus: tree }));
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
  const type = body.type as "category" | "product" | undefined;

  if (type === "category") {
    const parsed = parseBody(createCategorySchema, body);
    if (!parsed.success) return jsonError(parsed.error, 400);
    const category = await createCategory(id, authResult.userId, parsed.data);
    return applySecurityHeaders(
      NextResponse.json({ category }, { status: 201 }),
    );
  }

  if (type === "product") {
    const parsed = parseBody(createProductSchema, body);
    if (!parsed.success) return jsonError(parsed.error, 400);
    const product = await createProduct(id, authResult.userId, parsed.data);
    return applySecurityHeaders(
      NextResponse.json({ product }, { status: 201 }),
    );
  }

  return jsonError("Invalid type — use category or product", 400);
}
