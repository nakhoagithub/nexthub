import plugin from "../../../plugin.js";
import logger from "../../../utils/logger.js";
import checkAuth from "../../../middlewares/auth.js";
import { installModel, uninstallModel } from "../services/init-database.js";
import checkAccessInstall from "../../../middlewares/access-install.js";

plugin.router.post("/model/:name/install", checkAuth, checkAccessInstall, async (req, res) => {
  const { name } = req.params;
  try {
    const result = await installModel(name);
    if (!result) {
      return res.status(200).json({ code: 400, message: "Can't install model" });
    }
    return res.status(200).json({ code: 200 });
  } catch (error) {
    logger(error, `Install model: ${name}`);
    return res.status(200).json({ code: 500, error });
  }
});

plugin.router.post("/model/:name/uninstall", checkAuth, checkAccessInstall, async (req, res) => {
  const { name } = req.params;
  try {
    const result = await uninstallModel(name);
    if (!result) {
      return res.status(200).json({ code: 400, message: "Can't uninstall model" });
    }
    return res.status(200).json({ code: 200 });
  } catch (error) {
    logger(error, `Uninstall model: ${name}`);
    return res.status(200).json({ code: 500, error });
  }
});
