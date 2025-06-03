import { z } from "zod";

import tryParseEnv from "./try-parse-env";

const EnvSchema = z.object({
  NODE_ENV: z.string(),
  DB_FILE_NAME: z.string(),
  PORT: z.string(),
  JWT_SECRET: z.string(),
  EXPIRATION_TIME: z.string().transform(Number),
});

// eslint-disable-next-line ts/no-redeclare
export type EnvSchema = z.infer<typeof EnvSchema>;

tryParseEnv(EnvSchema);

// eslint-disable-next-line node/no-process-env
export default EnvSchema.parse(process.env);
