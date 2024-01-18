import plugin from "../../../plugin.js";
import logger from "../../../utils/logger.js";
import checkAccessRight from "../../../middlewares/access-right.js";
import checkAuth from "../../../middlewares/auth.js";
import mongoose from "mongoose";

plugin.router.post("/model/:name/create", checkAuth, checkAccessRight, async (req, res) => {
  const { name } = req.params;
  const { data } = req.body;
  try {
    // filter from "document access"
    const allowFilter = req.allowFilter;

    if (!data) {
      return res.status(200).json({ code: 400, message: "'data' is undefined" });
    }

    const Model = mongoose.model(name);

    const paths = Model.schema.paths;

    const ignorePath = ["createdAt", "updatedAt", "_id"];
    for (const [key, value] of Object.entries(paths)) {
      // ignore
      if (ignorePath.includes(key)) {
        continue;
      }

      // required
      if (value.isRequired === true && data[key] === undefined) {
        return res.status(200).json({ code: 400, message: `Field '${key}' is required` });
      }

      if (value.options?.unique === true) {
        const datasModel = await Model.find({ [key]: data[key] });
        if (datasModel.length > 0) {
          return res.status(200).json({ code: 400, message: `Field '${key}' is duplicated` });
        }
      }
    }

    let errors = [];

    const createData = Model({ ...data });

    // nếu không có _id thì tạo _id cho nó
    if (!Object.keys({ ...createData }._doc).includes("_id")) {
      createData._id = new mongoose.Types.ObjectId();
    }

    await createData
      .save()
      .then(async (savedRecord) => {
        return await Model.find({ ...allowFilter, _id: createData._id });
      })
      .then(async (filteredRecords) => {
        let allow = false;
        for (var filteredRecord of filteredRecords) {
          if (filteredRecord._id.toHexString() === createData._id.toHexString()) {
            allow = true;
          }
        }

        if (!allow) {
          errors.push({ data, error: "Data creation is not allowed" });
          return await Model.deleteOne({ _id: createData._id });
        }
      });

    if (errors.length > 0) {
      return res.status(200).json({ code: 400, errors });
    }
    return res.status(200).json({ code: 200 });
  } catch (error) {
    logger(error, `Create model: ${name}`);
    return res.status(500).json({ code: 500, error });
  }
});
