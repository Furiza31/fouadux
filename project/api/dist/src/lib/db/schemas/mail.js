"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mail = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const user_1 = require("./user");
exports.mail = (0, sqlite_core_1.sqliteTable)("mail", {
    id: (0, sqlite_core_1.text)("id").primaryKey(),
    subject: (0, sqlite_core_1.text)(),
    sender: (0, sqlite_core_1.text)(),
    body: (0, sqlite_core_1.text)(),
    date: (0, sqlite_core_1.text)(),
    to: (0, sqlite_core_1.text)(),
    userId: (0, sqlite_core_1.int)()
        .notNull()
        .references(() => user_1.user.id, {
        onDelete: "cascade",
    }),
});
