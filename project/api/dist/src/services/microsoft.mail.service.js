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
exports.useMicrosoftMailService = useMicrosoftMailService;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../lib/db"));
const schemas_1 = require("../lib/db/schemas");
const provider_1 = require("../lib/db/schemas/provider");
function useMicrosoftMailService() {
    const API_ENDPOINT = "https://graph.microsoft.com/v1.0";
    const MAIL_TO_SAVE_IN_DB = 50;
    const MAIL_PER_PAGE = 10;
    const getHeader = (token) => {
        return {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    };
    const getUserToken = (currentUser) => __awaiter(this, void 0, void 0, function* () {
        const userFound = yield db_1.default.select().from(provider_1.provider).where((0, drizzle_orm_1.eq)(provider_1.provider.userId, currentUser.id)).limit(1).then(res => res[0]);
        if (!userFound) {
            throw new Error("User not found");
        }
        if (userFound.name !== "microsoft") {
            throw new Error("User is not a Microsoft user");
        }
        if (!userFound.token) {
            throw new Error("User token not found");
        }
        if (new Date(userFound.expireAt) < new Date()) {
            throw new Error("User token has expired");
        }
        return userFound.token;
    });
    const getMailsFromMicrosoft = (currentUser_1, ...args_1) => __awaiter(this, [currentUser_1, ...args_1], void 0, function* (currentUser, page = 1, mailsPerPage = MAIL_PER_PAGE) {
        const skip = (page - 1) * mailsPerPage;
        const query = `?$top=${mailsPerPage}&$skip=${skip}&$select=id,subject,from,receivedDateTime,bodyPreview`;
        const headers = getHeader(yield getUserToken(currentUser));
        const res = yield fetch(`${API_ENDPOINT}/me/messages${query}`, {
            headers,
        });
        if (!res.ok) {
            const text = yield res.text();
            throw new Error(`Lecture des mails échouée (${res.status}): ${text}`);
        }
        const json = yield res.json();
        return json.value.map((item) => {
            var _a, _b;
            return ({
                id: item.id,
                subject: item.subject,
                sender: (_b = (_a = item.from) === null || _a === void 0 ? void 0 : _a.emailAddress.address) !== null && _b !== void 0 ? _b : "",
                body: item.bodyPreview,
                date: new Date(item.receivedDateTime).toISOString(),
                userId: currentUser.id,
                to: currentUser.email,
            });
        });
    });
    const init = (currentUser) => __awaiter(this, void 0, void 0, function* () {
        const mailCount = yield db_1.default.select({ count: (0, drizzle_orm_1.count)() }).from(schemas_1.mail).where((0, drizzle_orm_1.eq)(schemas_1.mail.userId, currentUser.id)).then(res => res[0].count);
        if (mailCount >= MAIL_TO_SAVE_IN_DB) {
            return;
        }
        const mails = yield getMailsFromMicrosoft(currentUser, 1, MAIL_TO_SAVE_IN_DB);
        if (mails.length === 0)
            return;
        yield db_1.default.insert(schemas_1.mail).values(mails).onConflictDoNothing();
    });
    const getMails = (currentUser_1, ...args_1) => __awaiter(this, [currentUser_1, ...args_1], void 0, function* (currentUser, page = 1) {
        const mailCount = yield db_1.default.select({ count: (0, drizzle_orm_1.count)() }).from(schemas_1.mail).where((0, drizzle_orm_1.eq)(schemas_1.mail.userId, currentUser.id)).then(res => res[0].count);
        if (page * MAIL_PER_PAGE > mailCount) {
            const newMails = yield getMailsFromMicrosoft(currentUser, page, MAIL_TO_SAVE_IN_DB);
            if (newMails.length === 0) {
                return db_1.default.select().from(schemas_1.mail).where((0, drizzle_orm_1.eq)(schemas_1.mail.userId, currentUser.id)).limit(MAIL_PER_PAGE).offset((page - 1) * MAIL_PER_PAGE).orderBy((0, drizzle_orm_1.desc)(schemas_1.mail.date));
            }
            yield db_1.default.insert(schemas_1.mail).values(newMails).onConflictDoNothing();
            return newMails.slice(0, MAIL_PER_PAGE).sort((a, b) => { var _a, _b; return new Date((_a = a.date) !== null && _a !== void 0 ? _a : "").getTime() - new Date((_b = b.date) !== null && _b !== void 0 ? _b : "").getTime(); });
        }
        return db_1.default.select().from(schemas_1.mail).where((0, drizzle_orm_1.eq)(schemas_1.mail.userId, currentUser.id)).limit(MAIL_PER_PAGE).offset((page - 1) * MAIL_PER_PAGE).orderBy((0, drizzle_orm_1.desc)(schemas_1.mail.date));
    });
    const getMail = (currentUser, mailId) => __awaiter(this, void 0, void 0, function* () {
        const mailFound = yield db_1.default.select().from(schemas_1.mail).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.mail.id, mailId), (0, drizzle_orm_1.eq)(schemas_1.mail.userId, currentUser.id))).limit(1).then(res => res[0]);
        if (!mailFound) {
            throw new Error("Mail not found");
        }
        return mailFound;
    });
    const insertMail = (currentUser, mailData) => __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.insert(schemas_1.mail).values(Object.assign(Object.assign({}, mailData), { id: crypto.randomUUID(), date: new Date().toISOString(), userId: currentUser.id })).returning().then(res => res[0]);
    });
    const deleteMail = (currentUser, mailId) => __awaiter(this, void 0, void 0, function* () {
        yield db_1.default.delete(schemas_1.mail).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.mail.id, mailId), (0, drizzle_orm_1.eq)(schemas_1.mail.userId, currentUser.id)));
    });
    const dashboard = (currentUser) => __awaiter(this, void 0, void 0, function* () {
        const mailCount = yield db_1.default.select({ count: (0, drizzle_orm_1.count)() }).from(schemas_1.mail).where((0, drizzle_orm_1.eq)(schemas_1.mail.userId, currentUser.id)).then(res => res[0].count);
        return {
            mailCount,
        };
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
