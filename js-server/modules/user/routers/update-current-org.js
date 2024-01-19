import checkAuth from "../../../middlewares/auth.js";
import plugin from "../../../plugin.js";
import logger from "../../../utils/logger.js";
import { User } from "../models/user.js";

plugin.router.patch("/user/update-current-org", checkAuth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!req.user) {
      return res.status(200).json({ code: 401, message: "Unauthorized" });
    }

    if (!ids) {
      return res.status(200).json({ code: 400, message: "'ids' is undefined" });
    }
    const result = await User.updateOne({ _id: req.user._id }, { idsCurrentOrg: ids });

    return res.status(200).json({ code: 200, data: result });
  } catch (error) {
    logger(error, "API: /user/change-password");
    return res.status(500).json({ code: 500, error: error });
  }
});
