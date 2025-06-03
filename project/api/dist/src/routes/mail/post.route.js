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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = __importDefault(require("zod"));
const auth_1 = require("../../middlewares/auth");
const validate_1 = require("../../middlewares/validate");
const mail_service_1 = require("../../services/mail.service");
const router = (0, express_1.Router)();
const PostInsertMail = zod_1.default.object({
    subject: zod_1.default.string(),
    sender: zod_1.default.string(),
    body: zod_1.default.string(),
    to: zod_1.default.string(),
});
router.post("/", auth_1.auth, (0, validate_1.validate)(PostInsertMail, "body"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body.user;
        const mailData = req.body;
        const response = yield (0, mail_service_1.useMailService)().insertMail(user, mailData);
        res.status(201).json({
            message: "Mail created successfully",
            data: response,
        });
    }
    catch (error) {
        console.error("Error creating mail:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
