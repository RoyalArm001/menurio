import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

/** Shared, privacy-preserving rate-limit buckets for all server instances. */
export const rateLimitBuckets = mysqlTable("rate_limit_buckets", {
  bucketKey: varchar("bucket_key", { length: 128 }).primaryKey(),
  requestCount: int("request_count").notNull().default(0),
  resetAt: timestamp("reset_at", { mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export type RateLimitBucket = typeof rateLimitBuckets.$inferSelect;
