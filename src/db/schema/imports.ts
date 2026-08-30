import {
  int,
  json,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { restaurants } from "./restaurants";
import { importJobStatusEnum, importJobTypeEnum } from "./enums";
import { pkId, refId } from "../columns";

export const uploadedAssets = mysqlTable("uploaded_assets", {
  id: pkId(),
  restaurantId: refId("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  key: text("key").notNull(),
  url: text("url").notNull(),
  mimeType: varchar("mime_type", { length: 128 }).notNull(),
  sizeBytes: int("size_bytes").notNull(),
  purpose: varchar("purpose", { length: 32 }).notNull(),
  originalFilename: text("original_filename"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const importJobs = mysqlTable("import_jobs", {
  id: pkId(),
  restaurantId: refId("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  type: importJobTypeEnum.notNull(),
  status: importJobStatusEnum.notNull().default("pending"),
  fileAssetId: refId("file_asset_id").references(() => uploadedAssets.id, {
    onDelete: "set null",
  }),
  previewRows: json("preview_rows").$type<ImportPreviewRow[]>().default([]),
  errorMessage: text("error_message"),
  createdByUserId: refId("created_by_user_id"),
  confirmedAt: timestamp("confirmed_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export type ImportPreviewRow = {
  category: string;
  name: string;
  description?: string;
  price: string;
  languageCode?: string;
};

export type UploadedAsset = typeof uploadedAssets.$inferSelect;
export type ImportJob = typeof importJobs.$inferSelect;
