import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import { updateBranch } from "@/services/branch.service";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";
import { z } from "zod";

const updateBranchSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  address: z.string().max(500).nullable().optional(),
  phone: z.string().max(30).nullable().optional(),
  email: z.string().email().nullable().optional(),
  isActive: z.boolean().optional(),
});

type RouteContext = {
  params: Promise<{ id: string; branchId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id, branchId } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "branch:manage",
  );
  if ("error" in access) return access.error;

  const body = await request.json().catch(() => null);
  const parsed = updateBranchSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.message, 400);

  try {
    const branch = await updateBranch(
      id,
      branchId,
      authResult.userId,
      parsed.data,
    );
    return applySecurityHeaders(NextResponse.json({ branch }));
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Failed", 400);
  }
}
