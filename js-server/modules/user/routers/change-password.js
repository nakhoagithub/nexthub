import checkAuth from "../../../middlewares/auth.js";
import plugin from "../../../plugin.js";
import logger from "../../../utils/logger.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";

plugin.router.patch("/user/change-password", checkAuth, async (req, res) => {
  try {
    const { _id, password } = req.body;
    if (!req.user) {
      return res.status(200).json({ code: 401, message: "Unauthorized" });
    }

    if (!_id || !password) {
      return res.status(200).json({ code: 400, message: "'_id' or 'password' is undefined" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.updateOne({ _id: _id }, { password: hashedPassword, session: "" });

    return res.status(200).json({ code: 200, data: result });
  } catch (error) {
    logger(error, "API: /user/change-password");
    return res.status(500).json({ code: 500, error: error });
  }
});
