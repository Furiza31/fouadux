"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = tryParseEnv;
const zod_1 = require("zod");
function tryParseEnv(EnvSchema, 
// eslint-disable-next-line node/no-process-env
buildEnv = process.env) {
    try {
        EnvSchema.parse(buildEnv);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            let message = "Missing required values in .env:\n";
            error.issues.forEach((issue) => {
                message += `\t- ${issue.path[0]}\n`;
            });
            const e = new Error(message);
            e.stack = "";
            throw e;
        }
        else {
            console.error(error);
        }
    }
}
