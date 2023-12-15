import plugin from "../../../plugin.js";
import logger from "../../../utils/logger.js";
import checkAccessRight from "../../../middlewares/access-right.js";
import checkAuth from "../../../middlewares/auth.js";
import mongoose from "mongoose";

plugin.router.delete("/model/:name/delete", checkAuth, checkAccessRight, async (req, res) => {
  const { name } = req.params;
  const { fieldId, datas } = req.body;
  try {
    const allowFilter = req.allowFilter;

    const Model = mongoose.model(name);

    if (!fieldId) {
      return res.status(200).json({ code: 400, message: "'fieldId' is undefined" });
    }

    if (!Array.isArray(datas)) {
      return res.status(200).json({ code: 400, message: "'datas' is not array" });
    }

    if (datas.length === 0) {
      return res.status(200).json({ code: 400, message: "'datas' has length 0" });
    }
    const datasAllow = await Model.find({ [fieldId]: { $in: datas }, ...allowFilter });

    if (datasAllow.length !== datas.length) {
      return res
        .status(200)
        .json({ code: 400, statusError: "warning", message: "There are some data fields that are not allowed" });
    }

    await Model.deleteMany({ [fieldId]: { $in: datas }, ...allowFilter });

    return res.status(200).json({ code: 200 });
  } catch (error) {
    logger(error, `Delete model: ${name}`);
    return res.status(500).json({ code: 500, error: error });
  }
});
