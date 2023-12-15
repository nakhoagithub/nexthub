import checkAuth from "../../../middlewares/auth.js";
import plugin from "../../../plugin.js";
import logger from "../../../utils/logger.js";

plugin.router.get("/auth", checkAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json({ code: 401, message: "Unauthorized" });
    }
    let newUser = { ...{ ...req.user }._doc };
    delete newUser.password;
    delete newUser.session;
    delete newUser.createdAt;
    delete newUser.updatedAt;

    return res.status(200).json({ code: 200, data: newUser });
  } catch (error) {
    logger(error);
    return res.status(500).json({ code: 500, error: error });
  }
});
