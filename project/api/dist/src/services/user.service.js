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
exports.userService = userService;
const drizzle_orm_1 = require("drizzle-orm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../lib/db"));
const schemas_1 = require("../lib/db/schemas");
const provider_1 = require("../lib/db/schemas/provider");
const env_1 = __importDefault(require("../lib/env"));
function userService() {
    function generateToken({ id, email, uuid }) {
        return jsonwebtoken_1.default.sign({ id, email, uuid }, env_1.default.JWT_SECRET, {
            expiresIn: env_1.default.EXPIRATION_TIME,
        });
    }
    const initProvider = (_a) => __awaiter(this, [_a], void 0, function* ({ userId, name, providerToken, expireAt, }) {
        yield db_1.default.insert(provider_1.provider).values({
            name,
            token: providerToken,
            expireAt,
            userId,
        }).onConflictDoUpdate({
            target: provider_1.provider.userId,
            set: {
                name,
                token: providerToken,
                expireAt,
            },
        });
    });
    const getUser = (_a) => __awaiter(this, [_a], void 0, function* ({ email, uuid, name, providerToken, expireAt, }) {
        try {
            const existingUser = yield db_1.default
                .select()
                .from(schemas_1.user)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.user.email, email), (0, drizzle_orm_1.eq)(schemas_1.user.uuid, uuid)))
                .limit(1)
                .then(res => res[0]);
            if (existingUser) {
                const token = generateToken({ id: existingUser.id, email, uuid });
                yield initProvider({
                    userId: existingUser.id,
                    name,
                    providerToken,
                    expireAt,
                });
                return { user: existingUser, token };
            }
            const newUser = yield db_1.default.insert(schemas_1.user).values({
                email,
                uuid,
            }).returning().then(res => res[0]);
            if (!newUser || !newUser.id) {
                throw new Error("Failed to create user");
            }
            yield initProvider({
                userId: newUser.id,
                name,
                providerToken,
                expireAt,
            });
            const token = generateToken({
                id: newUser.id,
                email,
                uuid,
            });
            return { user: newUser, token };
        }
        catch (error) {
            throw new Error(`Failed to create user: ${error}`);
        }
    });
    return { getUser };
}
