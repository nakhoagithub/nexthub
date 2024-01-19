import checkAuth from "../../../middlewares/auth.js";
import plugin from "../../../plugin.js";
import logger from "../../../utils/logger.js";
import { User } from "../models/user.js";

plugin.router.post("/logout", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json({ code: 401, message: "Unauthorized" });
    }
    res.clearCookie("session");
    await User.updateOne({ _id: req.user._id }, { session: "" });
    return res.status(200).json({ code: 200 });
  } catch (error) {
    logger(error, "API /logout");
    return res.status(500).json({ code: 500, error: error });
  }
});
