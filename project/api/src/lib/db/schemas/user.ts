import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: int().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  uuid: text().notNull().unique(),
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
