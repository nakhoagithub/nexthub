import jwt from "jsonwebtoken";
import { User } from "../modules/user/models/user.js";
import logger from "../utils/logger.js";

const checkAuth = async (req, res, next) => {
  try {
    const session = req.cookies?.session;

    if (!session) {
      return res.status(200).json({ code: 401, message: "Session not found" });
    }

    const token = jwt.verify(session, process.env.JWT_SECRET);

    if (!token) {
      return res.status(200).json({ code: 401, message: "Could not validate JWT" });
    }

    const user = await User.findOne({ _id: token.id });

    if (!user) {
      return res.status(200).json({ code: 401, message: "Unauthorized" });
    }

    if (session !== user?.session) {
      return res.status(200).json({ code: 401, message: "Invalid session" });
    }

    req.user = user;

    return next();
  } catch (error) {
    logger(error, "checkAuth");
    return res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
};

export default checkAuth;
