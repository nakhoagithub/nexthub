import mongoose from "mongoose";
import checkAuth from "../middlewares/auth";
import plugin from "../../plugin";
import { logger } from "../../utils/logger";
import { installModule, uninstallModule } from "../../utils/module";

plugin.router.post("/module/:id/install", checkAuth, async (req, res) => {
  const { id } = req.params;
  try {
    let result = await installModule(id);

    if (result) {
      return res.status(200).json({ code: 200 });
    } else {
      return res.status(400).json({ code: 400, message: "Install Error" });
    }
  } catch (error) {
    logger({ message: error, name: `INSTALL MODULE: ${id}` });
    return res.status(200).json({ code: 500, error });
  }
});

plugin.router.post("/module/:id/uninstall", checkAuth, async (req, res) => {
  const { id } = req.params;
  try {
    let result = await uninstallModule(id);

    if (result) {
      return res.status(200).json({ code: 200 });
    } else {
      return res.status(400).json({ code: 400, message: "Uninstall Error" });
    }
  } catch (error) {
    logger({ message: error, name: `UNINSTALL MODULE: ${id}` });
    return res.status(200).json({ code: 500, error });
  }
});
