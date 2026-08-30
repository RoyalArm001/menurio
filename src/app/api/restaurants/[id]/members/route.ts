import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import {
  listMembers,
  addMemberByEmail,
  updateMemberRole,
  removeMember,
} from "@/services/team.service";
import { getSubscription } from "@/services/restaurant.service";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";
import { z } from "zod";

const addMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "MANAGER", "EDITOR", "ORDER_OPERATOR"]),
});

const updateRoleSchema = z.object({
  memberId: z.string().uuid(),
  role: z.enum(["ADMIN", "MANAGER", "EDITOR", "ORDER_OPERATOR"]),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "member:manage",
  );
  if ("error" in access) return access.error;

  const members = await listMembers(id);
  return applySecurityHeaders(NextResponse.json({ members }));
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "member:manage",
  );
  if ("error" in access) return access.error;

  const body = await request.json().catch(() => null);
  const parsed = addMemberSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.message, 400);

  const sub = await getSubscription(id);
  const plan = sub?.plan ?? "FREE";

  try {
    const member = await addMemberByEmail(
      id,
      authResult.userId,
      parsed.data.email,
      parsed.data.role,
      plan,
    );
    return applySecurityHeaders(
      NextResponse.json({ member }, { status: 201 }),
    );
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Failed", 400);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "member:manage",
  );
  if ("error" in access) return access.error;

  const body = await request.json().catch(() => null);
  const parsed = updateRoleSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.message, 400);

  try {
    const member = await updateMemberRole(
      id,
      authResult.userId,
      parsed.data.memberId,
      parsed.data.role,
    );
    return applySecurityHeaders(NextResponse.json({ member }));
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Failed", 400);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "member:manage",
  );
  if ("error" in access) return access.error;

  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get("memberId");
  if (!memberId) return jsonError("memberId required", 400);

  try {
    await removeMember(id, authResult.userId, memberId);
    return applySecurityHeaders(NextResponse.json({ ok: true }));
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Failed", 400);
  }
}
