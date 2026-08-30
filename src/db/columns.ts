import { varchar } from "drizzle-orm/mysql-core";
import { randomUUID } from "node:crypto";

/** UUID primary key (MySQL 8.4 — stored as CHAR(36)) */
export function pkId(name = "id") {
  return varchar(name, { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID());
}

/** UUID foreign key / reference column */
export function refId(name: string) {
  return varchar(name, { length: 36 });
}
