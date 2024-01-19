import * as fs from "fs";
import * as path from "path";
import { logger } from "./logger";
import { Model, ModuleInterface } from "../interfaces/module";
import mongoose from "mongoose";
import { moduleSchema } from "../modules/base/models/module";
import { readCSV } from "./csv";

// let modulesPath = path.join("./", "modules");

// if (process.env.NODE_ENV === "production") {
// }

export function autoImportModule() {
  try {
    let modulesPath = "./server/modules";

    const modules = fs.readdirSync(`${modulesPath}`);
    modules.forEach((module) => {
      const filePath = `../modules/${module}/index.ts`;
      require(filePath.replace(".ts", ""));
    });
  } catch (error) {
    logger({ message: error, name: "autoImportModule" });
  }
}

function getType(value: string) {
  switch (value) {
    case "String":
      return String;
    case "Number":
      return Number;
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

export async function createModule({ module, models }: { module: ModuleInterface; models: Model[] }) {
  const Module = mongoose.model("Module", moduleSchema);
  const moduleData = await Module.findOne({ id: module.id });
  // khởi tạo model
  for (var model of models) {
    if (moduleData) {
      if (moduleData.installable) mongoose.model(model.modelName, model.schema);
    } else {
      if (module.installable) mongoose.model(model.modelName, model.schema);
    }
  }

  // tạo module
  await Module.updateOne(
    { id: module.id },
    { ...module, installable: moduleData?.installable ?? module.installable, state: module.state },
    { upsert: true }
  );

  const Model = mongoose.model("model");
  const Schema = mongoose.model("schema");
  // tạo model
  for (var model of models) {
    const ModelMongoose = mongoose.model(model.modelName);
    const idModel = ModelMongoose.collection.name;
    let schemaData = { ...ModelMongoose.schema.paths };

    // schema of model
    let sortTemp = 0;

    for (var keySchemaData of Object.keys(schemaData)) {
      sortTemp += 1;
      let type = schemaData[keySchemaData].instance;

      if (type == "Array" && schemaData[keySchemaData].options.ref) {
        type = "ArrayObjectId";
      }

      let newSchemaData = {
        id: `${idModel}.${keySchemaData}`,
        title: schemaData[keySchemaData]?.options?.title,
        idModel: idModel,
        comment: schemaData[keySchemaData]?.options?.comment,
        field: keySchemaData,
        type: type,
        required: schemaData[keySchemaData]?.options?.required,
        unique: schemaData[keySchemaData]?.options?.unique,
        readonly: schemaData[keySchemaData]?.options?.readonly,
        default: schemaData[keySchemaData]?.options?.default,
        select: schemaData[keySchemaData]?.options?.selected,
        ref: schemaData[keySchemaData]?.options?.ref,
        sortColumn: sortTemp,
      };

      await Schema.updateOne({ id: newSchemaData.id }, { ...newSchemaData }, { upsert: true });
    }

    const idsSchemaData = await Schema.find({ idModel: idModel });
    const idsSchema = idsSchemaData.map((e) => e._id.toHexString());

    let newModelData = {
      id: idModel,
      name: model.name,
      modelName: model.modelName,
      collectionName: idModel,
      idsSchema: idsSchema,
      timestamp: (ModelMongoose.schema as any).options.timestamps,
      versionKey: (ModelMongoose.schema as any).options.versionKey,
      install: moduleData?.installable ?? module.installable,
    };

    await Model.updateOne({ id: newModelData.id }, { ...newModelData }, { upsert: true });
  }

  // create data default
  for (var dataIndex of module.datas) {
    const datasDefault = await readCSV(dataIndex.folder, dataIndex.file);
    try {
      const ModelMongoose = mongoose.model(dataIndex.model);

      // data default of model
      for await (var dataDefault of datasDefault ?? []) {
        const findData = await ModelMongoose.findOne({
          [dataIndex.primaryKey]: dataDefault[dataIndex.primaryKey],
        });

        if (!findData) {
          await ModelMongoose.updateOne(
            { [dataIndex.primaryKey]: dataDefault[dataIndex.primaryKey] },
            { ...dataDefault },
            { upsert: true }
          );
        }

        if (dataIndex.noUpdate === false) {
          await ModelMongoose.updateOne(
            { [dataIndex.primaryKey]: dataDefault[dataIndex.primaryKey] },
            { ...dataDefault },
            { upsert: true }
          );
        }
      }

      await Model.updateOne(
        { id: `${module.id}.${dataIndex.model}` },
        { description: dataIndex.modelDescription },
        { upsert: true }
      );
    } catch (error) {
      logger({ message: error, name: `CREATE MODEL: ${dataIndex.model}` });
    }
  }
}
