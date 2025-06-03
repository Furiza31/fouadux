import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./user";

export const provider = sqliteTable("provider", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  token: text().notNull().unique(),
  expireAt: text().notNull(),
  userId: int()
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
});

export type Provider = typeof provider.$inferSelect;
export type NewProvider = typeof provider.$inferInsert;
