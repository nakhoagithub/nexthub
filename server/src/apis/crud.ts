import mongoose from "mongoose";
import { logger } from "../../utils/logger";
import plugin from "../../plugin";
import { Request, Response } from "express";
import checkAuth from "../../src/middlewares/auth";
import checkAccessRight from "../../src/middlewares/access-right";
import { checkArrayObjectId, checkObjectId } from "../../utils/validate";

async function readDatabase(req: Request, res: Response) {
  const params = req.params;
  const query = req.query;
  try {
    // filter from "document access"
    const allowFilter = (req as any).allowFilter;

    let skip = query.skip ?? 0;
    let limit = query.limit ?? 0;
    let fields = (query.fields as string)?.split(",") ?? [];
    let ignoreFields = (query.ignoreFields as string)?.split(",") ?? [];

    if (parseInt(skip as string) === undefined || parseInt(limit as string) === undefined) {
      return res.status(400).json({ code: 400, message: "Invalid query (skip, limit)" });
    }

    const ModelMongoose = mongoose.model(params.name);
    const Model = mongoose.model("model");
    let datas = [];
    let total = 0;

    try {
      // filter
      let filter = JSON.parse((query.filter as string) ?? "{}");
      filter = { ...filter, ...allowFilter };

      // // populate
      // let populate = JSON.parse(query.populate ?? "{}");
      // let newPopulate;
      // if (Object.keys(populate).length > 0) {
      //   newPopulate = populate;
      // }

      // get data
      total = (await ModelMongoose.find(filter)).length;
      const datasModel = await ModelMongoose.find(filter)
        .sort(JSON.parse((query.sort as string) ?? "{}"))
        .skip(skip as number)
        .limit(limit as number);

      // ignore fields
      for (var data of datasModel) {
        let newData: any = {};

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
      logger({ message: error, name: `CRUD GET: /db/${params["name"]}` });
      return res.status(400).json({ code: 400, message: "Invalid query (filter, sort)" });
    }

    return res.status(200).json({ code: 200, datas, total: total });
  } catch (error) {
    logger({ message: error, name: `CRUD GET: /db/${params["name"]}` });
    return res.status(500).json({ code: 500, message: error });
  }
}

async function createDatabase(req: Request, res: Response) {
  const { name } = req.params;
  const { data } = req.body;
  try {
    if (!data) {
      return res.status(400).json({ code: 400, message: "'data' is undefined" });
    }
    // filter from "document access"
    const allowFilter = (req as any).allowFilter;
    const ModelMongoose = mongoose.model(name);
    const paths = ModelMongoose.schema.paths;

    const ignorePath = ["createdAt", "updatedAt", "_id"];
    for (const [key, value] of Object.entries(paths)) {
      // ignore
      if (ignorePath.includes(key)) {
        continue;
      }

      // required
      if (value.isRequired === true && data[key] === undefined) {
        return res.status(400).json({ code: 400, message: `Field '${key}' is required` });
      }

      if (value.options?.unique === true) {
        const datasModel = await ModelMongoose.find({ [key]: data[key] });
        if (datasModel.length > 0) {
          return res.status(400).json({ code: 400, message: `Field '${key}' is duplicated` });
        }
      }
    }

    let errors: any[] = [];

    const createData = new ModelMongoose({ ...data });

    // nếu không có _id thì tạo _id cho nó
    if (!Object.keys({ ...createData }._doc).includes("_id")) {
      createData._id = new mongoose.Types.ObjectId();
    }

    try {
      await createData
        .save()
        .then(async (savedRecord: any) => {
          return await ModelMongoose.find({ ...allowFilter, _id: createData._id });
        })
        .then(async (filteredRecords: any) => {
          let allow = false;
          for (var filteredRecord of filteredRecords) {
            if (filteredRecord._id.toHexString() === createData._id.toHexString()) {
              allow = true;
            }
          }

          if (!allow) {
            errors.push({ data, error: "Data creation is not allowed" });
            return await ModelMongoose.deleteOne({ _id: createData._id });
          }
        });
    } catch (error) {
      errors.push({ data, error: error });
      logger({ message: error, name: `Save CRUD POST: /db/${name}` });
    }

    if (errors.length > 0) {
      return res.status(400).json({ code: 400, errors });
    }
    return res.status(200).json({ code: 200 });
  } catch (error) {
    logger({ message: error, name: `CRUD POST: /db/${name}` });
    return res.status(500).json({ code: 500, error });
  }
}

async function updateDatabase(req: Request, res: Response, method: "PUT" | "PATCH") {
  const { name } = req.params;
  const { fieldId, datas } = req.body;
  try {
    // filter from "document access"
    const allowFilter = (req as any).allowFilter;
    const ModelMongoose = mongoose.model(name);
    const paths = ModelMongoose.schema.paths;

    if (!fieldId) {
      return res.status(400).json({ code: 400, message: "'fieldId' is undefined" });
    }

    if (!Array.isArray(datas)) {
      return res.status(400).json({ code: 400, message: "'datas' is not array" });
    }

    let datasUpdate = [];
    for (const data of datas) {
      let newData = { ...data };
      if (data[fieldId] === undefined) {
        return res.status(400).json({ code: 400, message: `Field '${fieldId}' is required` });
      }

      const ignorePath = ["createdAt", "updatedAt"];
      for (const [key, value] of Object.entries(paths)) {
        // ignore
        if (ignorePath.includes(key)) {
          continue;
        }

        if (value.instance === "ObjectId" && data["key"] !== undefined) {
          if (!checkObjectId(data[key])) {
            return res.status(400).json({ code: 400, message: `'${key}' is not ObjectId`, data: data });
          }
        }

        if (value.instance === "Array" && value.options?.ref && data[key] !== undefined) {
          if (!checkArrayObjectId(data[key])) {
            return res.status(400).json({ code: 400, message: `'${key}' is not ArrayObjectId`, data: data });
          }
        }

        if (value.options?.readonly === true && data[key] !== undefined) {
          return res.status(400).json({ code: 400, message: `Field '${key}' is readonly`, data: data });
        }

        if (value.options?.unique === true && key !== fieldId) {
          const datasModel = await ModelMongoose.find({ [key]: data[key] });
          if (datasModel.length > 0) {
            return res.status(400).json({ code: 400, message: `Field '${key}' is duplicated`, data: data });
          }
        }
      }
      datasUpdate.push(newData);
    }

    let errors = [];

    for (const dataUpdate of datasUpdate) {
      let resultUpdate;
      try {
        const accessData = await ModelMongoose.find({ [fieldId]: dataUpdate[fieldId], ...allowFilter });
        if (accessData.length === 0) {
          errors.push({ data: dataUpdate, error: "Data updates are not allowed" });
        }
        if (method == "PUT") {
          resultUpdate = await ModelMongoose.replaceOne(
            { [fieldId]: dataUpdate[fieldId], ...allowFilter },
            { ...dataUpdate }
          );
        }
        if (method == "PATCH") {
          resultUpdate = await ModelMongoose.updateOne(
            { [fieldId]: dataUpdate[fieldId], ...allowFilter },
            { ...dataUpdate }
          );
        }
      } catch (error) {
        errors.push({ data: dataUpdate, error: error });
      }
    }
    if (errors.length > 0) {
      return res.status(400).json({ code: 400, errors });
    }
    return res.status(200).json({ code: 200 });
  } catch (error) {
    logger({ message: error, name: `CRUD ${method}: /db/${name}` });
    return res.status(500).json({ code: 500, error });
  }
}

async function deleteDatabase(req: Request, res: Response) {
  const { name } = req.params;
  const { fieldId, datas } = req.body;
  try {
    const allowFilter = (req as any).allowFilter;
    const Model = mongoose.model(name);

    if (!fieldId) {
      return res.status(400).json({ code: 400, message: "'fieldId' is undefined" });
    }

    if (!Array.isArray(datas)) {
      return res.status(400).json({ code: 400, message: "'datas' is not array" });
    }

    if (datas.length === 0) {
      return res.status(400).json({ code: 400, message: "'datas' has length 0" });
    }
    const datasAllow = await Model.find({ [fieldId]: { $in: datas }, ...allowFilter });

    if (datasAllow.length !== datas.length) {
      return res
        .status(400)
        .json({ code: 400, statusError: "warning", message: "There are some data fields that are not allowed" });
    }

    try {
      await Model.deleteMany({ [fieldId]: { $in: datas }, ...allowFilter });
    } catch (error) {
      logger({ message: error, name: `CRUD DELETE: /db/${name}` });
      return res.status(400).json({ code: 400, message: error?.toString() });
    }

    return res.status(200).json({ code: 200 });
  } catch (error) {
    logger({ message: error, name: `CRUD DELETE: /db/${name}` });
    return res.status(500).json({ code: 500, error: error });
  }
}

plugin.router.get("/db/:name", checkAuth, checkAccessRight, async (req: Request, res: Response) => {
  await readDatabase(req, res);
});

plugin.router.post("/db/:name", checkAuth, checkAccessRight, async (req, res) => {
  await createDatabase(req, res);
});

plugin.router.patch("/db/:name", checkAuth, checkAccessRight, async (req, res) => {
  await updateDatabase(req, res, "PATCH");
});

plugin.router.put("/db/:name", checkAuth, checkAccessRight, async (req, res) => {
  await updateDatabase(req, res, "PUT");
});

plugin.router.delete("/db/:name", checkAuth, checkAccessRight, async (req, res) => {
  await deleteDatabase(req, res);
});
