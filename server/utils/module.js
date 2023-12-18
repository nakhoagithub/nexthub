import mongoose from "mongoose";
import { Module } from "../modules/core/models/module.js";
import { readCSV } from "./csv.js";
import logger from "./logger.js";
import { Model } from "../modules/core/models/model.js";
import { Schema } from "../modules/core/models/schema.js";
import { installModel, uninstallModel } from "../modules/core/services/init-database.js";

/**
 * @param {String} id id module
 * @param {{id: String, folderName: String, name: String, description?: String, install?: boolean, models: String[], state?: String, datas: {file: String, folder: String, model: String, modelDescription?: String, primaryKey: String, noUpdate?: boolean}[]}} data data module
 *
 * @param data.datas.noUpdate nếu là `false` thì dữ liệu sẽ cập nhật theo file csv
 */
export async function createModule(id, data) {
  await Module.updateOne({ id: id }, { ...data }, { upsert: true });

  // create model database
  for (var model of data.models) {
    try {
      const ModelMongoose = mongoose.model(model);
      // data object model

      let schemaData = { ...ModelMongoose.schema.paths };

      // schema of model
      for (var keySchemaData of Object.keys(schemaData)) {
        let newSchemaData = {
          id: `${model}.${keySchemaData}`,
          modelName: model,
          comment: schemaData[keySchemaData]?.options?.comment,
          field: keySchemaData,
          type: schemaData[keySchemaData].instance,
          required: schemaData[keySchemaData]?.options?.required,
          unique: schemaData[keySchemaData]?.options?.unique,
          readonly: schemaData[keySchemaData]?.options?.readonly,
          default: schemaData[keySchemaData]?.defaultValue,
          select: schemaData[keySchemaData]?.selected,
          ref: schemaData[keySchemaData]?.options?.ref,
        };
        await Schema.updateOne({ id: newSchemaData.id }, { ...newSchemaData }, { upsert: true });
      }

      const idsSchemaData = await Schema.find({ modelName: model });
      const idsSchema = idsSchemaData.map((e) => e._id.toHexString());

      // model data
      let newModelData = {
        id: model,
        name: model,
        collectionName: ModelMongoose.collection.name,
        idsSchema: idsSchema,
        timestamp: ModelMongoose.schema.options.timestamps,
        versionKey: ModelMongoose.schema.options.versionKey,
        install: data.install,
      };

      await Model.updateOne({ id: newModelData.id }, { ...newModelData }, { upsert: true });
    } catch (error) {
      logger(error, "createModule delete model");
    }
  }

  // create data default
  if (data?.datas) {
    for (var { file, folder, model, modelDescription, primaryKey, noUpdate } of data.datas) {
      const datasDefault = await readCSV(folder, file);
      try {
        const ModelMongoose = mongoose.model(model);

        // data default of model
        for await (var dataDefault of datasDefault) {
          const findData = await ModelMongoose.findOne({
            [primaryKey]: dataDefault[primaryKey],
          });

          if (!findData) {
            await ModelMongoose.updateOne(
              { [primaryKey]: dataDefault[primaryKey] },
              { ...dataDefault },
              { upsert: true }
            );
          }

          if (noUpdate === false) {
            await ModelMongoose.updateOne(
              { [primaryKey]: dataDefault[primaryKey] },
              { ...dataDefault },
              { upsert: true }
            );
          }
        }

        await Model.updateOne({ id: model }, { description: modelDescription }, { upsert: true });
      } catch (error) {
        logger(error, "createModule");
      }
    }
  }

  // delete model not install
  for (var model of data.models) {
    try {
      if (data.install || data.install === true) {
      } else {
        const ModelMongoose = mongoose.model(model);
        delete mongoose.connection.models[model];
        await mongoose.connection.dropCollection(ModelMongoose.collection.name);
      }
    } catch (error) {
      logger(error, "createModule delete model");
    }
  }
}

export async function installModule(id) {
  let result = false;
  try {
    const moduleData = await Module.findOne({ id: id });

    if (!moduleData) {
      return result;
    }

    let ok = true;
    for (var model of moduleData.models) {
      const result = await installModel(model);
      if (!result) ok = false;
    }

    result = ok;

    if (ok) {
      await Module.updateOne({ id: id }, { install: true });
    }

    // create data default
    if (moduleData.datas) {
      for (var { file, folder, model, modelDescription, primaryKey, noUpdate } of moduleData.datas) {
        const datasDefault = await readCSV(folder, file);
        try {
          const ModelMongoose = mongoose.model(model);

          // data default of model
          for await (var dataDefault of datasDefault) {
            const findData = await ModelMongoose.findOne({
              [primaryKey]: dataDefault[primaryKey],
            });

            if (!findData) {
              await ModelMongoose.updateOne(
                { [primaryKey]: dataDefault[primaryKey] },
                { ...dataDefault },
                { upsert: true }
              );
            }

            if (noUpdate === false) {
              await ModelMongoose.updateOne(
                { [primaryKey]: dataDefault[primaryKey] },
                { ...dataDefault },
                { upsert: true }
              );
            }
          }
          await Model.updateOne({ id: model }, { description: modelDescription }, { upsert: true });
        } catch (error) {
          logger(error, "createModule");
        }
      }
    }
  } catch (error) {
    logger(error, "installModule");
  }

  return result;
}

export async function uninstallModule(id) {
  let result = false;
  try {
    const moduleData = await Module.findOne({ id: id });

    if (!moduleData) {
      return result;
    }

    // uninstall model
    let ok = true;
    for (var model of moduleData.models) {
      const result = await uninstallModel(model);
      if (!result) ok = false;
    }
    result = ok;
    if (ok) {
      await Module.updateOne({ id: id }, { install: false });
    }

    // delete data default
    if (moduleData.datas.length > 0) {
      for (var { file, folder, model, modelDescription, primaryKey, noUpdate } of moduleData.datas) {
        console.log(model);
        const datasDefault = await readCSV(folder, file);
        try {
          const ModelMongoose = mongoose.model(model);

          // data default of model
          for await (var dataDefault of datasDefault) {
            await ModelMongoose.deleteOne({ [primaryKey]: dataDefault[primaryKey] });
          }
          await Model.updateOne({ id: model }, { description: modelDescription }, { upsert: true });
        } catch (error) {
          logger(error, "createModule");
        }
      }
    }
  } catch (error) {
    logger(error, "installModule");
  }

  return result;
}
