import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import next from "next";
import plugin from "./plugin.js";
import logger from "./utils/logger.js";
import mongoose from "mongoose";
import { initDb } from "./modules/core/services/init-database.js";

var whitelist = [
  "http://localhost",
  "http://localhost:3000",
  "http://localhost:8000",
  "http://localhost:9000",
  "http://10.0.54.200:8000",
  "http://10.0.54.200:3000",
];

const corsConfig = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const server = express();
server.use(express.json({ limit: "10gb" }));
if (process.env.NODE_ENV !== "production") {
  server.use(morgan("tiny"));
}
server.use(cors(corsConfig));
server.use(cookieParser(process.env.COOKIE_SECRET));

const port = process.env.SERVER_PORT;
const mongoPort = process.env.MONGO_PORT;
const mongoUri = process.env.MONGO_URI;
const mongoDatabaseName = process.env.DATABASE_NAME;
const mongoAttachmentDatabaseName = process.env.DATABASE_ATTACHMENT_NAME;
const mongoUrl = `${mongoUri}:${mongoPort}/${mongoDatabaseName}`;
const mongoAttachmentUrl = `${mongoUri}:${mongoPort}/${mongoAttachmentDatabaseName}`;
const dev = process.env.NODE_ENV !== "production";
const web = next({ dev });
const handle = web.getRequestHandler();

async function main() {
  try {
    await mongoose.connect(mongoUrl).then(() => {
      console.log("> DB: connected");
      import("./index.js");
      import("./plugin.js");
    });

    plugin.databaseAttachment = await mongoose
      .createConnection(mongoAttachmentUrl)
      .asPromise()
      .then(() => {});

    // next js
    if (process.env.NODE_ENV === "production") {
      await web.prepare();
    }

    server.all("*", (req, res, next) => {
      if (req.originalUrl.startsWith("/api")) {
        return plugin.router(req, res, next);
      }

      if (process.env.NODE_ENV === "production") {
        return handle(req, res);
      }
    });

    server.listen(port, () => {
      console.log(`> API: http://localhost:${port}`);
    });

    await initDb();
  } catch (error) {
    logger(error);
  }
}

main();
