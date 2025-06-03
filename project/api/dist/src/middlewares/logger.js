"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function loggerMiddleware(req, res, next) {
    console.log("-".repeat(50));
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log("-".repeat(50));
    next();
}
exports.default = loggerMiddleware;
