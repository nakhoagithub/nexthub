import plugin from "../../../plugin.js";
import logger from "../../../utils/logger.js";
import checkAccessRight from "../../../middlewares/access-right.js";
import checkAuth from "../../../middlewares/auth.js";
import mongoose from "mongoose";
import { checkArrayObjectId, checkObjectId } from "../../../utils/validate.js";

plugin.router.patch("/model/:name/update-array", checkAuth, checkAccessRight, async (req, res) => {
  const { name } = req.params;
  const { fieldId, fieldUpdate, type, datas } = req.body;
  try {
    // filter from "document access"
    const allowFilter = req.allowFilter;

    const Model = mongoose.model(name);

    const paths = Model.schema.paths;

    let typesDefault = ["add", "remove"];
    if (!typesDefault.includes(type)) {
      return res
        .status(200)
        .json({ code: 400, message: "'type' must be one of the following types", types: typesDefault });
    }

    if (!fieldId) {
      return res.status(200).json({ code: 400, message: "'fieldId' is undefined" });
    }

    if (!fieldUpdate) {
      return res.status(200).json({ code: 400, message: "'fieldUpdate' is undefined" });
    }

    if (!Array.isArray(datas)) {
      return res.status(200).json({ code: 400, message: "'datas' is not array" });
    }

    let datasUpdate = [];
    for (const data of datas) {
      if (data[fieldId] === undefined) {
        return res.status(200).json({ code: 400, message: `Field '${fieldId}' is required` });
      }

      if (data[fieldUpdate] === undefined) {
        return res.status(200).json({ code: 400, message: `Field '${fieldUpdate}' is required` });
      }

      const ignorePath = ["createdAt", "updatedAt"];
      for (const [key, value] of Object.entries(paths)) {
        // ignore
        if (ignorePath.includes(key)) {
          continue;
        }

        if (value.instance !== "Array" && value.caster?.instance !== "ObjectId") {
          continue;
        }

        if (value.instance === "Array" && value.caster?.instance === "ObjectId" && data[key] !== undefined) {
          if (!checkObjectId(data[key])) {
            return res.status(200).json({ code: 400, message: `'${key}' is not ObjectId`, data: data });
          }
        }
      }
      datasUpdate.push(data);
    }

    let errors = [];

    for (const dataUpdate of datasUpdate) {
      try {
        if (type === "add") {
          const accessData = await Model.find({ [fieldId]: dataUpdate[fieldId], ...allowFilter });
          if (accessData.length === 0) {
            errors.push({ data: dataUpdate, error: "Data updates are not allowed" });
          }
          await Model.updateMany(
            { [fieldId]: dataUpdate[fieldId], [fieldUpdate]: { $nin: dataUpdate[fieldUpdate], ...allowFilter } },
            { $push: { [fieldUpdate]: dataUpdate[fieldUpdate] } }
          );
        }

        if (type === "remove") {
          const accessData = await Model.find({ [fieldId]: dataUpdate[fieldId], ...allowFilter });
          if (accessData.length === 0) {
            errors.push({ data: dataUpdate, error: "Data updates are not allowed" });
          }
          await Model.updateMany(
            { [fieldId]: dataUpdate[fieldId], ...allowFilter },
            { $pullAll: { [fieldUpdate]: [dataUpdate[fieldUpdate]] } }
          );
        }
      } catch (error) {
        errors.push(dataUpdate);
      }
    }

    return res.status(200).json({ code: 200, errors });
  } catch (error) {
    logger(error, `Update array model: ${name}`);
    return res.status(500).json({ code: 500, error });
  }
});
