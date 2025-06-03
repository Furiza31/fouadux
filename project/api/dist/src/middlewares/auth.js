"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../lib/env"));
function auth(req, res, next) {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    else {
        jsonwebtoken_1.default.verify(token, env_1.default.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: "Unauthorized: Invalid token" });
            }
            if (!req.body) {
                req.body = {};
            }
            req.body.user = decoded;
            next();
        });
    }
}
