"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const delete_route_1 = __importDefault(require("./mail/delete.route"));
const get_route_1 = __importDefault(require("./mail/get.route"));
const post_route_1 = __importDefault(require("./mail/post.route"));
const post_route_2 = __importDefault(require("./user/post.route"));
const router = (0, express_1.Router)();
router.use("/users", post_route_2.default);
router.use("/mails", get_route_1.default);
router.use("/mails", post_route_1.default);
router.use("/mails", delete_route_1.default);
exports.default = router;
