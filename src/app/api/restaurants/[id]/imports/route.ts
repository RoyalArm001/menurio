import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import { getSubscription } from "@/services/restaurant.service";
import {
  createImportJob,
  processExcelImport,
  confirmImportJob,
  getImportJob,
} from "@/services/import.service";
import { getDb } from "@/db";
import { uploadedAssets, menus } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getObjectBuffer } from "@/lib/storage/s3";
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

  const jobId = new URL(request.url).searchParams.get("jobId");
  if (!jobId) return jsonError("jobId required", 400);

  const job = await getImportJob(id, jobId);
  if (!job) return jsonError("Job not found", 404);

  return applySecurityHeaders(NextResponse.json({ job }));
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
  const action = body.action as string;

  const sub = await getSubscription(id);
  const plan = sub?.plan ?? "FREE";

  if (action === "create") {
    if (!body.fileAssetId || !body.type) {
      return jsonError("fileAssetId and type required", 400);
    }
    const job = await createImportJob(
      id,
      authResult.userId,
      plan,
      body.type,
      body.fileAssetId,
    );

    if (body.type === "excel") {
      const db = getDb();
      const [asset] = await db
        .select()
        .from(uploadedAssets)
        .where(
          and(
            eq(uploadedAssets.id, body.fileAssetId),
            eq(uploadedAssets.restaurantId, id),
          ),
        )
        .limit(1);

      if (!asset) return jsonError("Asset not found", 404);

      const buffer = await getObjectBuffer(asset.key);
      const updated = await processExcelImport(job.id, id, buffer);
      return applySecurityHeaders(
        NextResponse.json({ job: updated, preview: updated.previewRows }, { status: 201 }),
      );
    }

    return applySecurityHeaders(
      NextResponse.json(
        {
          job,
          message:
            body.type === "pdf" || body.type === "photo"
              ? "Queued for future AI provider — no fake output generated"
              : undefined,
        },
        { status: 201 },
      ),
    );
  }

  if (action === "confirm") {
    if (!body.jobId) return jsonError("jobId required", 400);

    const db = getDb();
    const [menu] = await db
      .select()
      .from(menus)
      .where(and(eq(menus.restaurantId, id), eq(menus.isDefault, true)))
      .limit(1);

    if (!menu) return jsonError("Default menu not found", 404);

    const result = await confirmImportJob(
      id,
      authResult.userId,
      body.jobId,
      menu.id,
    );
    return applySecurityHeaders(NextResponse.json({ job: result }));
  }

  return jsonError("Invalid action", 400);
}
