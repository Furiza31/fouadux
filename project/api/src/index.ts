import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import "dotenv/config";
import express from "express";

import env from "./lib/env";
import loggerMiddleware from "./middlewares/logger";
import routes from "./routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(loggerMiddleware);
app.use("/api", routes);

app
  .listen(env.PORT, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
