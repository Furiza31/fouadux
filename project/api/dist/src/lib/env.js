"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const try_parse_env_1 = __importDefault(require("./try-parse-env"));
const EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.string(),
    DB_FILE_NAME: zod_1.z.string(),
    PORT: zod_1.z.string(),
    JWT_SECRET: zod_1.z.string(),
    EXPIRATION_TIME: zod_1.z.string().transform(Number),
});
(0, try_parse_env_1.default)(EnvSchema);
// eslint-disable-next-line node/no-process-env
exports.default = EnvSchema.parse(process.env);
