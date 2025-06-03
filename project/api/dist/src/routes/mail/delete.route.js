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
const deleteMail = zod_1.z.object({
    mailId: zod_1.z.string(),
});
router.delete("/:mailId", auth_1.auth, (0, validate_1.validate)(deleteMail, "params"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body.user;
        const mailId = req.params.mailId;
        yield (0, mail_service_1.useMailService)().deleteMail(user, mailId);
        res.status(200).json({
            message: "Mail deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting mail:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
