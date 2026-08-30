import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import { listBranches, createBranch } from "@/services/branch.service";
import { getSubscription } from "@/services/restaurant.service";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";
import { z } from "zod";

const createBranchSchema = z.object({
  name: z.string().min(1).max(120),
  address: z.string().max(500).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "branch:manage",
  );
  if ("error" in access) return access.error;

  const branches = await listBranches(id);
  return applySecurityHeaders(NextResponse.json({ branches }));
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "branch:manage",
  );
  if ("error" in access) return access.error;

  const body = await request.json().catch(() => null);
  const parsed = createBranchSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.message, 400);

  const sub = await getSubscription(id);
  try {
    const branch = await createBranch(
      id,
      authResult.userId,
      sub?.plan ?? "FREE",
      parsed.data,
    );
    return applySecurityHeaders(
      NextResponse.json({ branch }, { status: 201 }),
    );
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Failed", 400);
  }
}
