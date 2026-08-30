import { eq } from "drizzle-orm";
import type { AnyMySqlColumn, MySqlTable } from "drizzle-orm/mysql-core";
import { getDb } from "./index";
import { randomUUID } from "node:crypto";

export function createId() {
  return randomUUID();
}

type TableWithId = MySqlTable & { id: AnyMySqlColumn };

/** Insert row with UUID id and fetch it back (MySQL has no RETURNING). */
export async function insertReturning<TTable extends TableWithId>(
  table: TTable,
  values: TTable["$inferInsert"],
): Promise<TTable["$inferSelect"]> {
  const db = getDb();
  const id = (values as { id?: string }).id ?? createId();
  await db.insert(table).values({ ...values, id } as TTable["$inferInsert"]);
  const [row] = await db
    .select()
    .from(table)
    .where(eq(table.id, id))
    .limit(1);
  if (!row) throw new Error("Insert failed");
  return row;
}

/** Update row by id and fetch it back. */
export async function updateReturning<TTable extends TableWithId>(
  table: TTable,
  id: string,
  patch: Partial<TTable["$inferInsert"]>,
): Promise<TTable["$inferSelect"]> {
  const db = getDb();
  await db
    .update(table)
    .set(patch as Partial<TTable["$inferInsert"]>)
    .where(eq(table.id, id));
  const [row] = await db
    .select()
    .from(table)
    .where(eq(table.id, id))
    .limit(1);
  if (!row) throw new Error("Update failed");
  return row;
}
