import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import { resolveDatabaseUrl } from "@/lib/db/url";

let pool: mysql.Pool | null = null;
let _db: MySql2Database<typeof schema> | null = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      uri: resolveDatabaseUrl(),
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 5,
      idleTimeout: 60_000,
    });
  }
  return pool;
}

export function getDb() {
  if (!_db) {
    _db = drizzle(getPool(), { schema, mode: "default" });
  }
  return _db;
}

/** @deprecated Prefer getDb() */
export const db = new Proxy({} as MySql2Database<typeof schema>, {
  get(_target, prop) {
    return Reflect.get(getDb(), prop);
  },
});

export type Database = MySql2Database<typeof schema>;
