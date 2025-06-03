"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const env_1 = __importDefault(require("./lib/env"));
const logger_1 = __importDefault(require("./middlewares/logger"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use(logger_1.default);
app.use("/api", routes_1.default);
app
    .listen(env_1.default.PORT, () => {
    console.log(`Server is running on http://localhost:${env_1.default.PORT}`);
})
    .on("error", (error) => {
    throw new Error(error.message);
});
