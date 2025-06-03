"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.user = (0, sqlite_core_1.sqliteTable)("user", {
    id: (0, sqlite_core_1.int)().primaryKey({ autoIncrement: true }),
    email: (0, sqlite_core_1.text)().notNull().unique(),
    uuid: (0, sqlite_core_1.text)().notNull().unique(),
});
