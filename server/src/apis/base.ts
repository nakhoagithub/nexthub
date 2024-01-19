import mongoose from "mongoose";
import plugin from "../../plugin";
import { logger } from "../../utils/logger";
import checkAuth from "../middlewares/auth";
import checkAccessRight from "../../src/middlewares/access-right";

plugin.router.get("/base/get", checkAuth, async (req, res) => {
  try {
    let models = mongoose.modelNames();
    return res.status(200).json({ code: 200, datas: models });
  } catch (error) {
    logger({ message: error, name: "API: /base/get" });
    return res.status(500).json({ code: 500, error: error });
  }
});

plugin.router.get("/base/:name", checkAuth, async (req, res) => {
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
    logger({ message: error, name: "API: /base/:name" });
    return res.status(500).json({ code: 500, error: error });
  }
});

plugin.router.get("/db/:name/access", checkAuth, checkAccessRight, async (req, res) => {
  try {
    const accessModel = (req as any).accessModel;
    return res.status(200).json({ code: 200, access: accessModel });
  } catch (error) {
    logger({ message: error, name: "API: /db/:name/access" });
    return res.status(500).json({ code: 500, error: error });
  }
});

plugin.router.get("/db/:name/columns", checkAuth, async (req, res) => {
  const { name } = req.params;
  try {
    const Schema = mongoose.model("schema");
    const { fields } = req.query;

    let filter: any = { modelName: name };
    if (fields) {
      filter = { ...filter, field: { $in: (fields as string).split(",") } };
    }

    const schemas = await Schema.find(filter).sort({ sortColumn: 1 });
    return res.status(200).json({ code: 200, datas: schemas });
  } catch (error) {
    logger({ message: error, name: `API: /db/:name/columns${name}` });
    return res.status(500).json({ code: 500, error: error });
  }
});
