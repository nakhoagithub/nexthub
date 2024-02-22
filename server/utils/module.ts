import * as fs from "fs";
import { logger } from "./logger";
import { Data, Model, ModuleInterface } from "../interfaces/module";
import mongoose, { Schema } from "mongoose";
import { moduleSchema } from "../modules/base/models/module";
import { readCSV } from "./csv";
import plugin from "../plugin";

export async function autoImportModule() {
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

async function installModel({ model, install }: { model: Model; install?: boolean }) {
  let result = false;
  try {
    const Schema = mongoose.model("schema");
    const Model = mongoose.model("model");
    const ModelMongoose = mongoose.model(model.modelName, model.schema);
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
      install: install,
    };

    // // xóa những model nếu install = false
    // if (!install) {
    //   mongoose.deleteModel(model.modelName);
    //   await mongoose.connection.dropCollection(idModel);
    // }

    await Model.updateOne({ id: newModelData.id }, { ...newModelData }, { upsert: true });
    result = true;
  } catch (error) {
    logger({ message: error, name: `INSTALL MODEL: ${model.modelName}` });
  }
  return result;
}

async function createDataDefault(data: Data) {
  const datasDefault = await readCSV(data.folder, data.file);
  try {
    const ModelMongoose = mongoose.model(data.modelName);

    // data default of model
    for await (var dataDefault of datasDefault ?? []) {
      const findData = await ModelMongoose.findOne({
        [data.primaryKey]: dataDefault[data.primaryKey],
      });

      if (!findData) {
        await ModelMongoose.updateOne(
          { [data.primaryKey]: dataDefault[data.primaryKey] },
          { ...dataDefault },
          { upsert: true }
        );
      }

      if (data.noUpdate === false) {
        await ModelMongoose.updateOne(
          { [data.primaryKey]: dataDefault[data.primaryKey] },
          { ...dataDefault },
          { upsert: true }
        );
      }
    }
  } catch (error) {
    logger({ message: error, name: `CREATE DATA DEFAULT: ${data.modelName}` });
  }
}

async function deleteDataDefault(data: Data) {
  try {
    const datasDefault = await readCSV(data.folder, data.file);
    const ModelMongoose = mongoose.model(data.modelName);

    // data default of model
    for await (var dataDefault of datasDefault ?? []) {
      await ModelMongoose.deleteMany({
        [data.primaryKey]: dataDefault[data.primaryKey],
      });
    }
  } catch (error) {
    logger({ message: error, name: `CREATE DATA DEFAULT: ${data.modelName}` });
  }
}

export async function createModule({ module, models }: { module: ModuleInterface; models: Model[] }) {
  const Module = mongoose.model("module", moduleSchema);
  const moduleData = await Module.findOne({ id: module.id });

  if (!plugin.modules.find((e) => e.id === module.id)) {
    plugin.modules.push(module);
  }

  // khởi tạo model
  for (var model of models) {
    mongoose.model(model.modelName, model.schema);
    // if (moduleData) {
    //   if (moduleData.installable) mongoose.model(model.modelName, model.schema);
    // } else {
    //   if (module.installable) mongoose.model(model.modelName, model.schema);
    // }
  }

  // tạo module
  let newModels = models.map((e) => {
    let newData: any = { ...e };
    newData.schema = e.schema.obj;
    return newData;
  });

  let install = moduleData?.installable ?? module.installable;
  await Module.updateOne(
    { id: module.id },
    { ...module, installable: install, state: module.state, models: newModels },
    { upsert: true }
  );

  // tạo model vào database
  for (var model of models) {
    await installModel({ model: model, install: install });
  }

  // create data default
  for (var data of module.datas) {
    /**
     * Nếu model chưa được tạo ra thì không tạo model trong database
     */
    if (install) {
      await createDataDefault(data);
    }
  }
}

export async function installModule(id: string) {
  let result = false;
  try {
    const Module = mongoose.model("module");
    const Model = mongoose.model("model");
    const moduleData = await Module.findOne({ id: id });

    if (!moduleData) {
      return result;
    }

    for (var model of moduleData.models) {
      await Model.updateOne({ modelName: model.modelName }, { install: true });
    }

    // create data default
    if (moduleData.datas) {
      for (var data of moduleData.datas) {
        await createDataDefault(data);
      }
    }

    await Module.updateOne({ id: id }, { installable: true });

    let depends = moduleData?.depends ?? [];

    for (var depend of depends) {
      await installModule(depend);
    }

    result = true;
  } catch (error) {
    logger({ message: error, name: `INSTALL MODULE: ${id}` });
  }
  return result;
}

export async function uninstallModule(id: string) {
  let result = false;
  try {
    const Module = mongoose.model("module");
    const Model = mongoose.model("model");

    const moduleData = await Module.findOne({ id: id });

    if (!moduleData) {
      return result;
    }
    // const colls = (await mongoose.connection.getClient().db().listCollections().toArray()).map((e) => e.name);
    for (var model of moduleData.models) {
      await Model.updateOne({ modelName: model.modelName }, { install: false });

      try {
        const ModelMongoose = mongoose.model(model.modelName);
        await ModelMongoose.deleteMany();
        //   let modelData = await Model.findOne({ modelName: model.modelName });

        //   if (colls.includes(modelData?.collectionName ?? "")) {
        //     mongoose.connection.collection(modelData?.collectionName ?? "").drop();
        //   }
      } catch (error) {}
    }

    // create data default
    if (moduleData.datas) {
      for (var data of moduleData.datas) {
        await deleteDataDefault(data);
      }
    }

    await Module.updateOne({ id: id }, { installable: false });
    result = true;
  } catch (error) {
    logger({ message: error, name: `UNINSTALL MODULE: ${id}` });
  }
  return result;
}
