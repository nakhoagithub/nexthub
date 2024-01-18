import plugin from "../../../plugin.js";
import logger from "../../../utils/logger.js";
import checkAuth from "../../../middlewares/auth.js";
import { Schema } from "../models/schema.js";

plugin.router.get("/model/:name/columns", checkAuth, async (req, res) => {
  const { name } = req.params;
  try {
    const { fields } = req.query;

    let filter = { modelName: name };
    if (fields) {
      filter = { ...filter, field: { $in: fields.split(",") } };
    }

    const schemas = await Schema.find(filter).sort({ sortColumn: 1 });
    return res.status(200).json({ code: 200, datas: schemas });
  } catch (error) {
    logger(error, `model-columns.js: ${name}`);
    return res.status(500).json({ code: 500, error: error });
  }
});
