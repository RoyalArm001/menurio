import { eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { insertReturning } from "@/db/write-helpers";
import {
  importJobs,
  uploadedAssets,
} from "@/db/schema";
import type { ImportPreviewRow } from "@/db/schema/imports";
import { assertCapability } from "@/lib/entitlements";
import type { SubscriptionPlan } from "@/lib/entitlements";
import { createCategory, createProduct } from "./menu.service";

export async function registerUploadedAsset(input: {
  restaurantId: string;
  key: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  purpose: string;
  originalFilename?: string;
}) {
  const asset = await insertReturning(
    uploadedAssets,
    input,
  );
  return asset;
}

export async function createImportJob(
  restaurantId: string,
  userId: string,
  plan: SubscriptionPlan,
  type: "excel" | "pdf" | "photo",
  fileAssetId: string,
) {
  if (type === "pdf" || type === "photo") {
    assertCapability(plan, "AI_IMPORT");
  }

  const db = getDb();
  const [asset] = await db
    .select({ id: uploadedAssets.id })
    .from(uploadedAssets)
    .where(
      and(
        eq(uploadedAssets.id, fileAssetId),
        eq(uploadedAssets.restaurantId, restaurantId),
      ),
    )
    .limit(1);
  if (!asset) throw new Error("Import asset not found");

  const job = await insertReturning(
    importJobs,
    {
      restaurantId,
      type,
      fileAssetId,
      createdByUserId: userId,
      status: "pending",
    },
  );

  return job;
}

/** Parse Excel buffer into preview rows — real parsing, no fake AI */
export function parseExcelPreview(buffer: Buffer): ImportPreviewRow[] {
  // Dynamic require to avoid bundling issues if xlsx not installed yet
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const XLSX = require("xlsx") as typeof import("xlsx");
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]!];
  if (!sheet) return [];

  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);
  return rows
    .map((row) => ({
      category: String(row.category ?? row.Category ?? "Imported"),
      name: String(row.name ?? row.Name ?? row.product ?? ""),
      description: row.description ?? row.Description,
      price: String(row.price ?? row.Price ?? "0"),
      languageCode: row.language ?? row.lang ?? "en",
    }))
    .filter((r) => r.name);
}

export async function processExcelImport(
  jobId: string,
  restaurantId: string,
  buffer: Buffer,
) {
  const db = getDb();
  const previewRows = parseExcelPreview(buffer);

  await db
    .update(importJobs)
    .set({
      previewRows,
      status: "preview_ready",
      updatedAt: new Date(),
    })
    .where(
      and(eq(importJobs.id, jobId), eq(importJobs.restaurantId, restaurantId)),
    );

  const [updated] = await db
    .select()
    .from(importJobs)
    .where(
      and(eq(importJobs.id, jobId), eq(importJobs.restaurantId, restaurantId)),
    )
    .limit(1);

  return updated;
}

export async function confirmImportJob(
  restaurantId: string,
  userId: string,
  jobId: string,
  menuId: string,
) {
  const db = getDb();
  const [job] = await db
    .select()
    .from(importJobs)
    .where(
      and(eq(importJobs.id, jobId), eq(importJobs.restaurantId, restaurantId)),
    )
    .limit(1);

  if (!job || job.status !== "preview_ready") {
    throw new Error("Import job not ready");
  }

  const rows = (job.previewRows ?? []) as ImportPreviewRow[];
  const categoryMap = new Map<string, string>();

  for (const row of rows) {
    let categoryId = categoryMap.get(row.category);
    if (!categoryId) {
      const cat = await createCategory(restaurantId, userId, {
        menuId,
        translations: [
          {
            languageCode: row.languageCode ?? "en",
            name: row.category,
          },
        ],
      });
      categoryId = cat.id;
      categoryMap.set(row.category, categoryId);
    }

    await createProduct(restaurantId, userId, {
      categoryId,
      price: row.price,
      translations: [
        {
          languageCode: row.languageCode ?? "en",
          name: row.name,
          description: row.description,
        },
      ],
    });
  }

  await db
    .update(importJobs)
    .set({ status: "confirmed", confirmedAt: new Date(), updatedAt: new Date() })
    .where(eq(importJobs.id, jobId));

  const [confirmed] = await db
    .select()
    .from(importJobs)
    .where(eq(importJobs.id, jobId))
    .limit(1);

  return confirmed;
}

export async function getImportJob(restaurantId: string, jobId: string) {
  const db = getDb();
  const [job] = await db
    .select()
    .from(importJobs)
    .where(
      and(eq(importJobs.id, jobId), eq(importJobs.restaurantId, restaurantId)),
    )
    .limit(1);
  return job ?? null;
}

export async function listImportJobs(restaurantId: string) {
  const db = getDb();
  return db
    .select()
    .from(importJobs)
    .where(eq(importJobs.restaurantId, restaurantId));
}

/** PDF/Photo import provider abstraction — no fake AI output */
export async function queueAiImportJob(
  jobId: string,
  restaurantId: string,
): Promise<void> {
  void restaurantId;
  const db = getDb();
  await db
    .update(importJobs)
    .set({
      status: "failed",
      errorMessage:
        "AI parsing provider not configured. Upload Excel for structured import.",
      updatedAt: new Date(),
    })
    .where(eq(importJobs.id, jobId));
}
