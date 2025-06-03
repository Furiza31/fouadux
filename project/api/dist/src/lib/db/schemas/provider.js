"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provider = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const user_1 = require("./user");
exports.provider = (0, sqlite_core_1.sqliteTable)("provider", {
    id: (0, sqlite_core_1.int)().primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)().notNull(),
    token: (0, sqlite_core_1.text)().notNull().unique(),
    expireAt: (0, sqlite_core_1.text)().notNull(),
    userId: (0, sqlite_core_1.int)()
        .notNull()
        .unique()
        .references(() => user_1.user.id, { onDelete: "cascade" }),
});
