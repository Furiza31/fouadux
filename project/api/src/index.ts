import { ExpressAuth } from "@auth/express";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import { authOptions } from "./authConfig";
import routes from "./routes/index";
import bodyParser = require("body-parser");

console.log("🚀 Starting server 🚀");

dotenv.config();

const app: Express = express();
export const port = process.env.PORT || 3000;
console.log("🛣️ Loading routes 🛣️");
const allRoutes = routes();

console.log("🔧 Setting up server 🔧");
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.set("trust proxy", true);
app.use("/oauth/*", ExpressAuth(authOptions));
allRoutes.forEach((route) => app.use(route));

console.log("✅ Server setup complete ✅");

app.listen(port, () => {
  console.log(
    `⚡️ [server]: Server is running at http://localhost:${port} ⚡️`
  );
});
