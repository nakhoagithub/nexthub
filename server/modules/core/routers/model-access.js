import plugin from "../../../plugin.js";
import logger from "../../../utils/logger.js";
import checkAuth from "../../../middlewares/auth.js";
import checkAccessRight from "../../../middlewares/access-right.js";

plugin.router.get("/model/:name/access", checkAuth, checkAccessRight, async (req, res) => {
  try {
    const accessModel = req.accessModel;
    return res.status(200).json({ code: 200, access: accessModel });
  } catch (error) {
    logger(error, "model-access.js");
    return res.status(500).json({ code: 500, error: error });
  }
});
