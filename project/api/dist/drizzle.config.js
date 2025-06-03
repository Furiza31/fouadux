"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const drizzle_kit_1 = require("drizzle-kit");
const env_1 = __importDefault(require("./src/lib/env"));
dotenv_1.default.config();
exports.default = (0, drizzle_kit_1.defineConfig)({
    out: "./src/lib/db/migrations",
    schema: "./src/lib/db/schemas/index.ts",
    dialect: "sqlite",
    casing: "snake_case",
    dbCredentials: {
        url: env_1.default.DB_FILE_NAME,
    },
});
