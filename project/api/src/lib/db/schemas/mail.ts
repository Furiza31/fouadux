import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./user";

export const mail = sqliteTable("mail", {
  id: text("id").primaryKey(),
  subject: text(),
  sender: text(),
  body: text(),
  date: text(),
  to: text(),
  userId: int()
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),
});

export type Mail = typeof mail.$inferSelect;
export type NewMail = typeof mail.$inferInsert;
