import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import { registerUploadedAsset } from "@/services/import.service";
import { verifyManagedUpload } from "@/lib/storage/s3";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";
import { z } from "zod";

const registerSchema = z.object({
  key: z.string().min(1),
  url: z.string().url(),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().min(1),
  purpose: z.string().min(1),
  originalFilename: z.string().optional(),
});

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
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.message, 400);

  try {
    await verifyManagedUpload({
      restaurantId: id,
      key: parsed.data.key,
      publicUrl: parsed.data.url,
      mimeType: parsed.data.mimeType,
      sizeBytes: parsed.data.sizeBytes,
      purpose: parsed.data.purpose,
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Invalid uploaded object",
      400,
    );
  }

  const asset = await registerUploadedAsset({ restaurantId: id, ...parsed.data });

  return applySecurityHeaders(
    NextResponse.json({ asset }, { status: 201 }),
  );
}
