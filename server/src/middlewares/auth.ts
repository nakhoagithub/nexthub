import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { logger } from "../../utils/logger";

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = req.cookies?.session;

    if (!session) {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

    const token = jwt.verify(session, process.env.JWT_SECRET!);

    if (!token) {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

    const User = mongoose.model("user");
    const user = await User.findOne({ _id: (token as JwtPayload).id });

    if (!user) {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

    if (session !== user?.session) {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

    (req as any).user = user;

    return next();
  } catch (error) {
    logger({ message: error, name: "checkAuth" });
    return res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
};

export default checkAuth;
