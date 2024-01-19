import mongoose from "mongoose";
import checkAuth from "../middlewares/auth";
import plugin from "../../plugin";
import { logger } from "../../utils/logger";

plugin.router.post("/module/:id/install", checkAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const Module = mongoose.model("module");
    let result = null; //await installModule(id);

    if (result) {
      await Module.updateOne({ id: id }, { install: true });
      return res.status(200).json({ code: 200 });
    } else {
      return res.status(200).json({ code: 400, message: "Install Error" });
    }
  } catch (error) {
    logger({ message: error, name: `INSTALL MODULE: ${id}` });
    return res.status(200).json({ code: 500, error });
  }
});

plugin.router.post("/module/:id/uninstall", checkAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const Module = mongoose.model("module");
    let result = null; //await uninstallModule(id);

    if (result) {
      await Module.updateOne({ id: id }, { install: false });
      return res.status(200).json({ code: 200 });
    } else {
      return res.status(200).json({ code: 400, message: "Uninstall Error" });
    }
  } catch (error) {
    logger({ message: error, name: `UNINSTALL MODULE: ${id}` });
    return res.status(200).json({ code: 500, error });
  }
});
