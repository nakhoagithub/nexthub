import mongoose from "mongoose";
import plugin from "../../../plugin.js";
import logger from "../../../utils/logger.js";
import checkAccessRight from "../../../middlewares/access-right.js";
import checkAuth from "../../../middlewares/auth.js";

plugin.router.get("/model/:name/get", checkAuth, checkAccessRight, async (req, res) => {
  const params = req.params;
  const query = req.query;
  try {
    // filter from "document access"
    const allowFilter = req.allowFilter;

    let skip = query.skip ?? 0;
    let limit = query.limit ?? 0;
    let fields = query.fields?.split(",") ?? [];
    let ignoreFields = query.ignoreFields?.split(",") ?? [];

    if (parseInt(skip) === undefined || parseInt(limit) === undefined) {
      return res.status(200).json({ code: 400, message: "Invalid query (skip, limit)" });
    }

    const Model = mongoose.model(params.name);
    let datas = [];
    let total = 0;
    try {
      // filter
      let filter = JSON.parse(query.filter ?? "{}");
      filter = { ...filter, ...allowFilter };

      // // populate
      // let populate = JSON.parse(query.populate ?? "{}");
      // let newPopulate;
      // if (Object.keys(populate).length > 0) {
      //   newPopulate = populate;
      // }

      // get data
      total = (await Model.find(filter)).length;
      const datasModel = await Model.find(filter)
        .sort(JSON.parse(query.sort ?? "{}"))
        .skip(skip)
        .limit(limit);

      // ignore fields
      for (var data of datasModel) {
        let newData = {};

        if (fields.length > 0) {
          for (var field of fields) {
            newData = { ...newData, [field]: data[field] };
          }
        } else {
          newData = { ...{ ...data }._doc };
        }

        for (var key in newData) {
          if (Array.isArray(ignoreFields) && ignoreFields.includes(key)) {
            delete newData[key];
          }
        }

        datas.push(newData);
      }
    } catch (error) {
      logger(error, "API: /model/:name/get");
      return res.status(200).json({ code: 400, message: "Invalid query (filter, sort)" });
    }

    return res.status(200).json({ code: 200, datas, total: total });
  } catch (error) {
    logger(error, `Get model: ${params["name"]}`);
    return res.status(500).json({ code: 500, error: error });
  }
});
