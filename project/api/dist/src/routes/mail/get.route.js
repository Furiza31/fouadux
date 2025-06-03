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
const auth_1 = require("../../middlewares/auth");
const validate_1 = require("../../middlewares/validate");
const mail_service_1 = require("../../services/mail.service");
const router = (0, express_1.Router)();
const getMails = zod_1.z.object({
    page: zod_1.z.number().optional(),
});
router.get("/", auth_1.auth, (0, validate_1.validate)(getMails, "query"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body.user;
        const response = yield (0, mail_service_1.useMailService)().getMails(user, req.query.page ? Number(req.query.page) : 1);
        res.status(200).json({
            message: "Mails retrieved successfully",
            data: response,
        });
    }
    catch (error) {
        console.error("Error retrieving mails:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.get("/dashboard", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body.user;
        const response = yield (0, mail_service_1.useMailService)().dashboard(user);
        res.status(200).json({
            message: "Dashboard initialized successfully",
            data: response,
        });
    }
    catch (error) {
        console.error("Error initializing dashboard:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
const getMail = zod_1.z.object({
    mailId: zod_1.z.string(),
});
router.get("/:mailId", auth_1.auth, (0, validate_1.validate)(getMail, "params"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body.user;
        const mailId = req.params.mailId;
        const response = yield (0, mail_service_1.useMailService)().getMail(user, mailId);
        if (!response) {
            res.status(404).json({ error: "Mail not found" });
        }
        else {
            res.status(200).json({
                message: "Mail retrieved successfully",
                data: response,
            });
        }
    }
    catch (error) {
        console.error("Error retrieving mail:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
