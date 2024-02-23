import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { logger } from "./utils/logger";
import plugin from "./plugin";
import "./src/index";
import next from "next";
import { autoImportModule } from "./utils/module";
import { createCronjob } from "./utils/workers/worker";

var whitelist = [
  "http://localhost",
  "http://localhost:3000",
  "http://localhost:8000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:8000",
  "http://10.0.54.200:3000",
  "http://10.0.54.200:8000",
];

const server = express();
server.use(express.json({ limit: "10gb" }));

if (process.env.NODE_ENV !== "production") {
  server.use(morgan("tiny"));
}

server.use(
  cors({
    origin(requestOrigin, callback) {
      if (whitelist.indexOf(requestOrigin ?? "") !== -1 || !requestOrigin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const cookieSecret = process.env.COOKIE_SECRET;
const port = process.env.SERVER_PORT;
const mongoPort = process.env.MONGO_PORT;
const mongoUri = process.env.MONGO_URI;
const mongoDatabaseName = process.env.DATABASE_NAME;
const mongoAttachmentDatabaseName = process.env.DATABASE_ATTACHMENT_NAME;
const mongoUrl = `${mongoUri}:${mongoPort}/${mongoDatabaseName}`;
const mongoAttachmentUrl = `${mongoUri}:${mongoPort}/${mongoAttachmentDatabaseName}`;
const dev = process.env.NODE_ENV !== "production";

server.use(cookieParser(cookieSecret));
const web = next({ dev });
const handle = web.getRequestHandler();

async function main() {
  try {
    await mongoose.connect(mongoUrl).then(async () => {
      console.log("> DB: connected");
    });

    plugin.databaseAttachment = await mongoose.createConnection(mongoAttachmentUrl).asPromise();

    // next js
    if (!dev) {
      await web.prepare();
    }

    server.all("*", (req, res, next) => {
      if (req.originalUrl.startsWith("/api")) {
        return plugin.router(req, res, next);
      }

      if (!dev) {
        return handle(req, res);
      }
    });

    server.listen(port, () => {
      console.log(`> API: http://127.0.0.1:${port}`);
    });

    await autoImportModule();
    await createCronjob();
  } catch (error) {
    logger({ message: error, name: "server.ts" });
  }
}

main();
