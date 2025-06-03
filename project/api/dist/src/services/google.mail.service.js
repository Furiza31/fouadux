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
exports.useGoogleMailService = useGoogleMailService;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../lib/db"));
const schemas_1 = require("../lib/db/schemas");
const provider_1 = require("../lib/db/schemas/provider");
function useGoogleMailService() {
    const API_ENDPOINT = "https://www.googleapis.com/gmail/v1";
    const MAIL_TO_SAVE_IN_DB = 50;
    const MAIL_PER_PAGE = 10;
    const getHeader = (token) => ({
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    });
    const getUserToken = (currentUser) => __awaiter(this, void 0, void 0, function* () {
        const userFound = yield db_1.default
            .select()
            .from(provider_1.provider)
            .where((0, drizzle_orm_1.eq)(provider_1.provider.userId, currentUser.id))
            .limit(1)
            .then(res => res[0]);
        if (!userFound) {
            throw new Error("User not found");
        }
        if (userFound.name !== "google") {
            throw new Error("User is not a Google user");
        }
        if (!userFound.token) {
            throw new Error("User token not found");
        }
        if (new Date(userFound.expireAt) < new Date()) {
            throw new Error("User token has expired");
        }
        return userFound.token;
    });
    const getMailsFromGoogle = (currentUser_1, ...args_1) => __awaiter(this, [currentUser_1, ...args_1], void 0, function* (currentUser, page = 1, mailsPerPage = MAIL_PER_PAGE) {
        var _a, _b, _c, _d, _e;
        const token = yield getUserToken(currentUser);
        let pageToken;
        for (let i = 1; i < page; i++) {
            const params = new URLSearchParams();
            params.set("maxResults", String(mailsPerPage));
            if (pageToken) {
                params.set("pageToken", pageToken);
            }
            const listRes = yield fetch(`${API_ENDPOINT}/users/me/messages?${params.toString()}`, {
                headers: getHeader(token),
            });
            if (!listRes.ok) {
                const text = yield listRes.text();
                throw new Error(`Lecture des mails échouée (${listRes.status}): ${text}`);
            }
            const listJson = yield listRes.json();
            pageToken = listJson.nextPageToken;
            if (!pageToken) {
                return [];
            }
        }
        const params = new URLSearchParams();
        params.set("maxResults", String(mailsPerPage));
        if (pageToken) {
            params.set("pageToken", pageToken);
        }
        const listRes = yield fetch(`${API_ENDPOINT}/users/me/messages?${params.toString()}`, {
            headers: getHeader(token),
        });
        if (!listRes.ok) {
            const text = yield listRes.text();
            throw new Error(`Lecture des mails échouée (${listRes.status}): ${text}`);
        }
        const listJson = yield listRes.json();
        const messages = (_a = listJson.messages) !== null && _a !== void 0 ? _a : [];
        if (!Array.isArray(messages) || messages.length === 0) {
            return [];
        }
        const mails = [];
        for (const m of messages) {
            const msgRes = yield fetch(`${API_ENDPOINT}/users/me/messages/${m.id}?format=full`, { headers: getHeader(token) });
            if (!msgRes.ok) {
                const text = yield msgRes.text();
                throw new Error(`Lecture du mail ${m.id} échouée (${msgRes.status}): ${text}`);
            }
            const msg = yield msgRes.json();
            const headers = {};
            for (const h of msg.payload.headers) {
                headers[h.name.toLowerCase()] = h.value;
            }
            let rawBody = ((_b = msg.payload.body) === null || _b === void 0 ? void 0 : _b.data) || "";
            if (msg.payload.parts) {
                const part = msg.payload.parts.find(p => p.mimeType === "text/plain");
                if (part) {
                    rawBody = part.body.data;
                }
            }
            const decodedBody = rawBody
                ? decodeURIComponent(atob(rawBody.replace(/-/g, "+").replace(/_/g, "/"))
                    .split("")
                    .map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
                    .join(""))
                : "";
            mails.push({
                id: msg.id,
                subject: (_c = headers.subject) !== null && _c !== void 0 ? _c : "",
                sender: (_d = headers.from) !== null && _d !== void 0 ? _d : "",
                body: decodedBody,
                date: new Date((_e = headers.date) !== null && _e !== void 0 ? _e : "").toISOString(),
                userId: currentUser.id,
                to: currentUser.email,
            });
        }
        return mails;
    });
    const init = (currentUser) => __awaiter(this, void 0, void 0, function* () {
        const mailCount = yield db_1.default
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schemas_1.mail)
            .where((0, drizzle_orm_1.eq)(schemas_1.mail.userId, currentUser.id))
            .then(res => res[0].count);
        if (mailCount >= MAIL_TO_SAVE_IN_DB) {
            return;
        }
        const mails = yield getMailsFromGoogle(currentUser, 1, MAIL_TO_SAVE_IN_DB);
        if (mails.length === 0) {
            return;
        }
        yield db_1.default
            .insert(schemas_1.mail)
            .values(mails.map(m => (Object.assign(Object.assign({}, m), { userId: currentUser.id }))))
            .onConflictDoNothing();
    });
    const getMails = (currentUser_1, ...args_1) => __awaiter(this, [currentUser_1, ...args_1], void 0, function* (currentUser, page = 1) {
        const mailCount = yield db_1.default
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schemas_1.mail)
            .where((0, drizzle_orm_1.eq)(schemas_1.mail.userId, currentUser.id))
            .then(res => res[0].count);
        if (page * MAIL_PER_PAGE > mailCount) {
            const newMails = yield getMailsFromGoogle(currentUser, page, MAIL_TO_SAVE_IN_DB);
            if (newMails.length === 0) {
                return db_1.default
                    .select()
                    .from(schemas_1.mail)
                    .where((0, drizzle_orm_1.eq)(schemas_1.mail.userId, currentUser.id))
                    .limit(MAIL_PER_PAGE)
                    .offset((page - 1) * MAIL_PER_PAGE)
                    .orderBy((0, drizzle_orm_1.desc)(schemas_1.mail.date));
            }
            yield db_1.default
                .insert(schemas_1.mail)
                .values(newMails.map(m => (Object.assign(Object.assign({}, m), { userId: currentUser.id }))))
                .onConflictDoNothing();
            return newMails.splice(0, MAIL_PER_PAGE).sort((a, b) => { var _a, _b; return new Date((_a = b.date) !== null && _a !== void 0 ? _a : "").getTime() - new Date((_b = a.date) !== null && _b !== void 0 ? _b : "").getTime(); });
        }
        return db_1.default
            .select()
            .from(schemas_1.mail)
            .where((0, drizzle_orm_1.eq)(schemas_1.mail.userId, currentUser.id))
            .limit(MAIL_PER_PAGE)
            .offset((page - 1) * MAIL_PER_PAGE)
            .orderBy((0, drizzle_orm_1.desc)(schemas_1.mail.date));
    });
    const getMail = (currentUser, mailId) => __awaiter(this, void 0, void 0, function* () {
        const mailFound = yield db_1.default
            .select()
            .from(schemas_1.mail)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.mail.id, mailId), (0, drizzle_orm_1.eq)(schemas_1.mail.userId, currentUser.id)))
            .limit(1)
            .then(res => res[0]);
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
        const mailCount = yield db_1.default
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schemas_1.mail)
            .where((0, drizzle_orm_1.eq)(schemas_1.mail.userId, currentUser.id))
            .then(res => res[0].count);
        const contactCount = yield db_1.default
            .selectDistinct({ count: (0, drizzle_orm_1.count)(schemas_1.mail.sender) })
            .from(schemas_1.mail)
            .where((0, drizzle_orm_1.eq)(schemas_1.mail.userId, currentUser.id))
            .then(res => res[0].count);
        return {
            totalMails: mailCount,
            totalContacts: contactCount,
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
