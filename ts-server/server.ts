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
import { autoImportModule } from "./utils/tool";

var whitelist = [
  "http://localhost",
  "http://localhost:3000",
  "http://localhost:8000",
  "http://localhost:9000",
  "http://10.0.54.200:8000",
  "http://10.0.54.200:3000",
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
server.use(cookieParser(process.env.COOKIE_SECRET));

const port = process.env.SERVER_PORT;
const mongoPort = process.env.MONGO_PORT;
const mongoUri = process.env.MONGO_URI;
const mongoDatabaseName = process.env.DATABASE_NAME;
const mongoAttachmentDatabaseName = process.env.DATABASE_ATTACHMENT_NAME;
const mongoUrl = `${mongoUri}:${mongoPort}/${mongoDatabaseName}`;
const mongoAttachmentUrl = `${mongoUri}:${mongoPort}/${mongoAttachmentDatabaseName}`;
const dev = process.env.NODE_ENV !== "production";
// const web = next({ dev });
// const handle = web.getRequestHandler();

async function main() {
  try {
    await mongoose.connect(mongoUrl).then(async () => {
      console.log("> DB: connected");
    });

    plugin.databaseAttachment = await mongoose.createConnection(mongoAttachmentUrl).asPromise();

    // next js
    // if (process.env.NODE_ENV === "production") {
    //   await web.prepare();
    // }

    server.all("*", (req, res, next) => {
      if (req.originalUrl.startsWith("/api")) {
        return plugin.router(req, res, next);
      }

      //   if (process.env.NODE_ENV === "production") {
      //     return handle(req, res);
      //   }
    });

    server.listen(port, () => {
      console.log(`> API: http://localhost:${port}`);
    });

    autoImportModule();
  } catch (error) {
    logger({ message: error, name: "server.ts" });
  }
}

main();


// "devDependencies": {
//   "ts-node-dev": "^2.0.0",
//   "typescript": "^5.3.3"
// },
// "dependencies": {
//   "@types/bcrypt": "^5.0.2",
//   "@types/body-parser": "^1.19.5",
//   "@types/cookie-parser": "^1.4.6",
//   "@types/cors": "^2.8.17",
//   "@types/express": "^4.17.21",
//   "@types/jsonwebtoken": "^9.0.5",
//   "@types/morgan": "^1.9.9",
//   "cookie-parser": "^1.4.6",
//   "cors": "^2.8.5",
//   "cross-env": "^7.0.3",
//   "dotenv": "^16.3.1",
//   "express": "^4.18.2",
//   "moment": "^2.30.1",
//   "mongoose": "^8.1.0",
//   "morgan": "^1.10.0",
//   "nodemon": "^3.0.3"
// }