import mongoose from "mongoose";
import logger from "../../../utils/logger.js";
import { Model } from "../models/model.js";

function getType(value) {
  switch (value) {
    case "String":
      return String;
    case "Boolean":
      return Boolean;
    case "Object":
      return Object;
    case "ObjectId":
      return mongoose.Types.ObjectId;
    case "Array":
      return Array;
    case "ArrayObjectId":
      return [mongoose.Types.ObjectId];
  }
  return Object;
}

export async function installModel(id) {
  let result = false;
  try {
    const modelData = await Model.findOne({ id: id });
    if (!modelData) {
      return result;
    }
    const model = await Model.findOne({ id: id }).populate("idsSchema");
    let fields = {};
    for (const schemaData of model.idsSchema) {
      let dataField = {};
      dataField = { ...dataField, type: getType(schemaData.type) };
      fields = { ...fields, [schemaData.field]: dataField };

      if (schemaData.default !== undefined) {
        dataField = { ...dataField, default: schemaData.default };
        fields = { ...fields, [schemaData.field]: dataField };
      }

      if (schemaData.required === true) {
        dataField = { ...dataField, required: true };
        fields = { ...fields, [schemaData.field]: dataField };
      }

      if (schemaData.unique === true) {
        dataField = { ...dataField, unique: true };
        fields = { ...fields, [schemaData.field]: dataField };
      }

      if (schemaData.select === true) {
        dataField = { ...dataField, select: true };
        fields = { ...fields, [schemaData.field]: dataField };
      }
    }

    const schema = new mongoose.Schema(fields, {
      timestamps: model.timestamp,
      versionKey: model.versionKey,
      collection: model.collectionName,
    });
    let ModelCreate = mongoose.model(model.id, schema);
    ModelCreate();
    await Model.updateOne({ id: id }, { install: true });

    result = true;
  } catch (error) {
    logger(error, "installModel");
  } finally {
    return result;
  }
}

export async function uninstallModel(id) {
  let result = false;
  try {
    const model = await Model.findOne({ id: id });
    delete mongoose.connection.models[model.id];
    await Model.updateOne({ id: model.id }, { install: false });
    await mongoose.connection.dropCollection(model.collectionName);
    result = true;
  } catch (error) {
    logger(error, "uninstallModel");
  } finally {
    return result;
  }
}

export async function initDb() {
  try {
    const modelsExists = mongoose.modelNames();
    const models = await Model.find({
      id: { $nin: modelsExists },
      install: true,
    }).populate("idsSchema");

    for (const model of models) {
      await installModel(model.id);
    }
  } catch (error) {
    logger(error, "initDb");
  }
}
