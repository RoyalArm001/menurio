import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import { addCustomDomain, listDomains } from "@/services/domain.service";
import { getSubscription } from "@/services/restaurant.service";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";
import { z } from "zod";

const addDomainSchema = z.object({
  hostname: z.string().min(3).max(253),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "domain:manage",
  );
  if ("error" in access) return access.error;

  const domainList = await listDomains(id);
  return applySecurityHeaders(NextResponse.json({ domains: domainList }));
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "domain:manage",
  );
  if ("error" in access) return access.error;

  const body = await request.json().catch(() => null);
  const parsed = addDomainSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues.map((i) => i.message).join("; "), 400);
  }

  const subscription = await getSubscription(id);
  const plan = subscription?.plan ?? "FREE";

  try {
    const domain = await addCustomDomain(id, parsed.data.hostname, plan);
    return applySecurityHeaders(
      NextResponse.json({ domain }, { status: 201 }),
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to add domain";
    return jsonError(message, 400);
  }
}
