import plugin from "../../../plugin.js";
import logger from "../../../utils/logger.js";
import { User } from "../models/user.js";

plugin.router.post("/user/create-admin", async (req, res) => {
  try {
    let { username, password } = req.body;

    if (username === undefined || password === undefined) {
      return res.status(200).json({ code: 403, message: "'username' and 'password' is requiered" });
    }

    const user = await User.findOne({ state: "admin" });

    if (user) {
      return res.status(200).json({ code: 400, message: "User already exists" });
    }

    // user
    let newUser = await User.create({
      username: username,
      password: password,
      state: "master",
    });

    return res.status(200).json({ code: 200, data: newUser });
  } catch (error) {
    logger(error, "API /user/create-admin");
    return res.status(500).json({ code: 500, error: error });
  }
});
