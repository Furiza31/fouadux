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
exports.useMailService = useMailService;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../lib/db"));
const provider_1 = require("../lib/db/schemas/provider");
const google_mail_service_1 = require("./google.mail.service");
const microsoft_mail_service_1 = require("./microsoft.mail.service");
function useMailService() {
    const googleMailService = (0, google_mail_service_1.useGoogleMailService)();
    const microsoftMailService = (0, microsoft_mail_service_1.useMicrosoftMailService)();
    const getProviderService = (currentUser) => __awaiter(this, void 0, void 0, function* () {
        const providerName = yield db_1.default.select().from(provider_1.provider).where((0, drizzle_orm_1.eq)(provider_1.provider.userId, currentUser.id)).limit(1).then(res => { var _a; return (_a = res[0]) === null || _a === void 0 ? void 0 : _a.name; });
        switch (providerName) {
            case "google":
                return googleMailService;
            case "microsoft":
                return microsoftMailService;
            default:
                throw new Error(`Unsupported provider: ${providerName}`);
        }
    });
    const getMails = (currentUser_1, ...args_1) => __awaiter(this, [currentUser_1, ...args_1], void 0, function* (currentUser, page = 1) {
        const mailService = yield getProviderService(currentUser);
        return mailService.getMails(currentUser, page);
    });
    const getMail = (currentUser, mailId) => __awaiter(this, void 0, void 0, function* () {
        const mailService = yield getProviderService(currentUser);
        return mailService.getMail(currentUser, mailId);
    });
    const insertMail = (currentUser, mailData) => __awaiter(this, void 0, void 0, function* () {
        const mailService = yield getProviderService(currentUser);
        return mailService.insertMail(currentUser, mailData);
    });
    const deleteMail = (currentUser, mailId) => __awaiter(this, void 0, void 0, function* () {
        const mailService = yield getProviderService(currentUser);
        return mailService.deleteMail(currentUser, mailId);
    });
    const init = (currentUser) => __awaiter(this, void 0, void 0, function* () {
        const mailService = yield getProviderService(currentUser);
        return mailService.init(currentUser);
    });
    const dashboard = (currentUser) => __awaiter(this, void 0, void 0, function* () {
        const mailService = yield getProviderService(currentUser);
        return mailService.dashboard(currentUser);
    });
    return {
        init,
        getMails,
        getMail,
        insertMail,
        deleteMail,
        dashboard,
    };
}
