import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

import env from "./src/lib/env";

dotenv.config();

export default defineConfig({
  out: "./src/lib/db/migrations",
  schema: "./src/lib/db/schemas/index.ts",
  dialect: "sqlite",
  casing: "snake_case",
  dbCredentials: {
    url: env.DB_FILE_NAME,
  },
});
