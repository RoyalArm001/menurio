/**
 * Apply Drizzle MySQL migrations locally (idempotent).
 * Usage: npm run db:init
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { resolveDatabaseUrl } from "../src/lib/db/url";

dotenv.config({ path: ".env.local", override: true });

async function tableExists(
  conn: mysql.Connection,
  table: string,
): Promise<boolean> {
  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) AS c FROM information_schema.tables
     WHERE table_schema = DATABASE() AND table_name = ?`,
    [table],
  );
  return Number(rows[0]?.c ?? 0) > 0;
}

async function runMigrationFile(conn: mysql.Connection, filename: string) {
  const path = join(process.cwd(), "drizzle", filename);
  const sql = readFileSync(path, "utf8");
  const statements = sql
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await conn.query(statement);
  }
  console.log(`✓ Applied ${filename}`);
}

async function main() {
  const url = resolveDatabaseUrl();
  const conn = await mysql.createConnection(url);

  try {
    await conn.query("SELECT 1");
    console.log("Connected to MySQL");

    const journalPath = join(process.cwd(), "drizzle", "meta", "_journal.json");
    let files: string[] = [];
    try {
      const journal = JSON.parse(readFileSync(journalPath, "utf8")) as {
        entries: Array<{ tag: string }>;
      };
      files = journal.entries.map((e) => `${e.tag}.sql`);
    } catch {
      files = readdirSync(join(process.cwd(), "drizzle"))
        .filter((f) => f.endsWith(".sql"))
        .sort();
    }

    if (!(await tableExists(conn, "users"))) {
      for (const file of files) {
        await runMigrationFile(conn, file);
      }
    } else {
      console.log("• Schema already present — skipped migrations");
    }

    console.log("\nDatabase ready.");
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
