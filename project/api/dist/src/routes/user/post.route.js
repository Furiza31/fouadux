"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validate_1 = require("../../middlewares/validate");
const mail_service_1 = require("../../services/mail.service");
const user_service_1 = require("../../services/user.service");
const router = (0, express_1.Router)();
const PostUserWithProvider = zod_1.z.object({
    email: zod_1.z.string().email().min(1),
    uuid: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    token: zod_1.z.string().min(1),
    expireAt: zod_1.z.string().min(1),
});
router.post("/", (0, validate_1.validate)(PostUserWithProvider, "body"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, uuid, name, token, expireAt } = req.body;
        const response = yield (0, user_service_1.userService)().getUser({
            email,
            uuid,
            name,
            providerToken: token,
            expireAt,
        });
        yield (0, mail_service_1.useMailService)().init(response.user);
        res.status(201).json({
            message: "User connected successfully",
            data: response,
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
