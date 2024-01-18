import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import checkAuth from "../middlewares/auth";
import plugin from "../../plugin";
import { logger } from "../../utils/logger";
import mongoose from "mongoose";

plugin.router.get("/auth", checkAuth, async (req, res) => {
  try {
    const user: any = (req as any).user;
    let newUser = { ...{ ...user }._doc };
    delete newUser.password;
    delete newUser.session;
    delete newUser.createdAt;
    delete newUser.updatedAt;

    return res.status(200).json({ code: 200, data: newUser });
  } catch (error) {
    logger({ message: error, name: "API: /auth" });
    return res.status(500).json({ code: 500, error: error });
  }
});

plugin.router.patch("/user/change-password", checkAuth, async (req, res) => {
  try {
    const User = mongoose.model("user");
    const { _id, password } = req.body;

    if (!_id || !password) {
      return res.status(400).json({ code: 400, message: "'_id' or 'password' is undefined" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.updateOne({ _id: _id }, { password: hashedPassword, session: "" });

    return res.status(200).json({ code: 200, data: result });
  } catch (error) {
    logger({ message: error, name: "API: /user/change-password" });
    return res.status(500).json({ code: 500, error: error });
  }
});

plugin.router.post("/login", async (req, res) => {
  try {
    const User = mongoose.model("user");
    let { username, password } = req.body;

    if (username === undefined || password === undefined) {
      return res.status(400).json({ code: 400, message: "'username' and 'password' is requiered" });
    }

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(400).json({ code: 400, message: "User not found" });
    }

    if (!user.active) {
      return res.status(400).json({ code: 400, message: "User is inactive" });
    }

    const check = await bcrypt.compare(password, user.password);

    if (!check) {
      return res.status(400).json({ code: 400, message: "Incorrect password" });
    }

    const session = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    res.cookie("session", session, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      signed: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    await User.updateOne({ username }, { session });

    let newData = user.toJSON();
    delete newData.password;
    delete newData.createdAt;
    delete newData.updatedAt;
    return res.status(200).json({ code: 200, message: "Success", data: newData });
  } catch (error) {
    logger({ message: error, name: "API: /login" });
    return res.status(500).json({ code: 500, error: error });
  }
});

plugin.router.post("/logout", checkAuth, async (req, res) => {
  try {
    const User = mongoose.model("user");
    const user: any = (req as any).user;
    res.clearCookie("session");
    await User.updateOne({ _id: user._id }, { session: "" });
    return res.status(200).json({ code: 200 });
  } catch (error) {
    logger({ message: error, name: "API: /logout" });
    return res.status(500).json({ code: 500, error: error });
  }
});

plugin.router.patch("/user/update-current-org", checkAuth, async (req, res) => {
  try {
    const user: any = (req as any).user;
    const User = mongoose.model("user");
    const { ids } = req.body;

    if (!ids) {
      return res.status(400).json({ code: 400, message: "'ids' is undefined" });
    }
    const result = await User.updateOne({ _id: user._id }, { idsCurrentOrg: ids });

    return res.status(200).json({ code: 200, data: result });
  } catch (error) {
    logger({ message: error, name: "API: /user/change-password" });
    return res.status(500).json({ code: 500, error: error });
  }
});

plugin.router.post("/user/create-master", async (req, res) => {
  try {
    const User = mongoose.model("user");

    let { username, password } = req.body;

    if (username === undefined || password === undefined) {
      return res.status(400).json({ code: 400, message: "'username' and 'password' is requiered" });
    }

    const user = await User.findOne({ state: "master" });

    if (user) {
      return res.status(400).json({ code: 400, message: "User already exists" });
    }

    // user
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser = await User.create({
      username: username,
      password: hashedPassword,
      state: "master",
    });

    return res.status(200).json({ code: 200, data: newUser });
  } catch (error) {
    logger({ message: error, name: "API /user/create-master" });
    return res.status(500).json({ code: 500, error: error });
  }
});
