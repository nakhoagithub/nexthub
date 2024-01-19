import checkAuth from "../../../middlewares/auth.js";
import plugin from "../../../plugin.js";
import logger from "../../../utils/logger.js";
import { installModule, uninstallModule } from "../../../utils/module.js";
import { Module } from "../models/module.js";

plugin.router.post("/module/:id/install", checkAuth, async (req, res) => {
  const { id } = req.params;
  try {
    let result = await installModule(id);

    if (result) {
      await Module.updateOne({ id: id }, { install: true });
      return res.status(200).json({ code: 200 });
    } else {
      return res.status(200).json({ code: 400, message: "Install Error" });
    }
  } catch (error) {
    logger(error, `Install module: ${id}`);
    return res.status(200).json({ code: 500, error });
  }
});

plugin.router.post("/module/:id/uninstall", checkAuth, async (req, res) => {
  const { id } = req.params;
  try {
    let result = await uninstallModule(id);

    if (result) {
      await Module.updateOne({ id: id }, { install: false });
      return res.status(200).json({ code: 200 });
    } else {
      return res.status(200).json({ code: 400, message: "Uninstall Error" });
    }
  } catch (error) {
    logger(error, `Uninstall module: ${id}`);
    return res.status(200).json({ code: 500, error });
  }
});
