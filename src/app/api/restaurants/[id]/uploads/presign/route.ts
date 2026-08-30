import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import { createPresignedUploadUrl, validateUploadConstraints } from "@/lib/storage/s3";
import { parseBody, presignedUploadSchema } from "@/lib/validation/schemas";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";
import { assertCapability, EntitlementError } from "@/lib/entitlements";
import { getSubscription } from "@/services/restaurant.service";

type RouteContext = { params: Promise<{ id: string }> };

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
  const parsed = parseBody(presignedUploadSchema, body);
  if (!parsed.success) return jsonError(parsed.error, 400);

  if (parsed.data.restaurantId !== id) {
    return jsonError("Restaurant ID mismatch", 403);
  }

  try {
    validateUploadConstraints({
      purpose: parsed.data.purpose,
      contentType: parsed.data.contentType,
      sizeBytes: parsed.data.sizeBytes,
    });
    const subscription = await getSubscription(id);
    const plan = subscription?.plan ?? "FREE";
    if (parsed.data.purpose === "logo") assertCapability(plan, "CUSTOM_LOGO");
    if (parsed.data.purpose === "cover") assertCapability(plan, "CUSTOM_COVER");
    if (parsed.data.purpose === "favicon") assertCapability(plan, "CUSTOM_FAVICON");
  } catch (err) {
    if (err instanceof EntitlementError) return jsonError(err.message, 403);
    return jsonError(err instanceof Error ? err.message : "Invalid upload", 400);
  }

  try {
    const result = await createPresignedUploadUrl({
      restaurantId: id,
      purpose: parsed.data.purpose,
      filename: parsed.data.filename,
      contentType: parsed.data.contentType,
      sizeBytes: parsed.data.sizeBytes,
    });
    return applySecurityHeaders(NextResponse.json(result));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return jsonError(message, 500);
  }
}
