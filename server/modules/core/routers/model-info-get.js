import mongoose from "mongoose";
import plugin from "../../../plugin.js";
import logger from "../../../utils/logger.js";
import checkAuth from "../../../middlewares/auth.js";

plugin.router.get("/core/get", checkAuth, async (req, res) => {
  try {
    let models = mongoose.modelNames();
    return res.status(200).json({ code: 200, datas: models });
  } catch (error) {
    logger(error, "API /core/get");
    return res.status(500).json({ code: 500, error: error });
  }
});

plugin.router.get("/core/get/:name", checkAuth, async (req, res) => {
  try {
    const params = req.params;
    let model;
    try {
      model = mongoose.model(params.name);
    } catch (error) {
      return res.status(200).json({ code: 400, message: "Model not found" });
    }

    let paths = model?.schema?.paths;
    let obj = model?.schema?.obj;
    return res.status(200).json({ code: 200, paths: paths, obj: obj });
  } catch (error) {
    logger(error, "API /core/get/:name");
    return res.status(500).json({ code: 500, error: error });
  }
});
