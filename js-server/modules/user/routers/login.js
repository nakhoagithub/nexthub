import plugin from "../../../plugin.js";
import { readCSV } from "../../../utils/csv.js";
import logger from "../../../utils/logger.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

plugin.router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;

    if (username === undefined || password === undefined) {
      return res.status(200).json({ code: 400 });
    }

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(200).json({ code: 400, message: "User not found" });
    }

    if (!user.active) {
      return res.status(200).json({ code: 400, message: "User is inactive" });
    }

    const check = await bcrypt.compare(password, user.password);

    if (!check) {
      return res.status(200).json({ code: 400, message: "Incorrect password" });
    }

    const session = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("session", session, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      // signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    await User.updateOne({ username }, { session });

    let newData = user.toJSON();
    delete newData.password;
    delete newData.createdAt;
    delete newData.updatedAt;
    return res.status(200).json({ code: 200, message: "Success", data: newData });
  } catch (error) {
    logger(error, "API /login");
    return res.status(500).json({ code: 500, error: error });
  }
});
