import plugin from "../../../plugin.js";
import logger from "../../../utils/logger.js";
import checkAccessRight from "../../../middlewares/access-right.js";
import checkAuth from "../../../middlewares/auth.js";
import mongoose from "mongoose";
import { checkArrayObjectId, checkObjectId } from "../../../utils/validate.js";

plugin.router.patch("/model/:name/update", checkAuth, checkAccessRight, async (req, res) => {
  const { name } = req.params;
  const { fieldId, datas } = req.body;
  try {
    // filter from "document access"
    const allowFilter = req.allowFilter;

    const Model = mongoose.model(name);

    const paths = Model.schema.paths;

    if (!fieldId) {
      return res.status(200).json({ code: 400, message: "'fieldId' is undefined" });
    }

    if (!Array.isArray(datas)) {
      return res.status(200).json({ code: 400, message: "'datas' is not array" });
    }

    let datasUpdate = [];
    for (const data of datas) {
      let newData = { ...data };
      if (data[fieldId] === undefined) {
        return res.status(200).json({ code: 400, message: `Field '${fieldId}' is required` });
      }

      const ignorePath = ["createdAt", "updatedAt"];
      for (const [key, value] of Object.entries(paths)) {
        // ignore
        if (ignorePath.includes(key)) {
          continue;
        }

        if (value.instance === "ObjectId" && data["key"] !== undefined) {
          if (!checkObjectId(data[key])) {
            return res.status(200).json({ code: 400, message: `'${key}' is not ObjectId`, data: data });
          }
        }

        if (value.instance === "Array" && value.caster?.instance === "ObjectId" && data[key] !== undefined) {
          if (!checkArrayObjectId(data[key])) {
            return res.status(200).json({ code: 400, message: `'${key}' is not ArrayObjectId`, data: data });
          }
        }

        if (value.options?.readonly === true && data[key] !== undefined) {
          return res.status(200).json({ code: 400, message: `Field '${key}' is readonly`, data: data });
        }

        if (value.options?.unique === true && key !== fieldId) {
          const datasModel = await Model.find({ [key]: data[key] });
          if (datasModel.length > 0) {
            return res.status(200).json({ code: 400, message: `Field '${key}' is duplicated`, data: data });
          }
        }
      }
      datasUpdate.push(newData);
    }

    let errors = [];

    for (const dataUpdate of datasUpdate) {
      let resultUpdate;
      try {
        const accessData = await Model.find({ [fieldId]: dataUpdate[fieldId], ...allowFilter });
        if (accessData.length === 0) {
          errors.push({ data: dataUpdate, error: "Data updates are not allowed" });
        }
        resultUpdate = await Model.updateMany({ [fieldId]: dataUpdate[fieldId], ...allowFilter }, { ...dataUpdate });
      } catch (error) {
        errors.push({ data: dataUpdate, error: error });
      }
    }
    if (errors.length > 0) {
      return res.status(200).json({ code: 400, errors });
    }
    return res.status(200).json({ code: 200 });
  } catch (error) {
    logger(error, `Update model: ${name}`);
    return res.status(500).json({ code: 500, error });
  }
});
