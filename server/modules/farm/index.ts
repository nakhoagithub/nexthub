import { createModule } from "../../utils/module";
import { areaSchema } from "./models/area";
import { breedSchema } from "./models/breed";
import { breedCategorySchema } from "./models/breed-category";
import { farmSchema } from "./models/farm";
import { plantingScheduleSchema } from "./models/planting-schedule";
import { samplePeriodPlantingScheduleSchema } from "./models/sample-period-planting-schedule";
import { samplePlantingScheduleSchema } from "./models/sample-planting-schedule";

createModule({
  module: {
    id: "farm",
    name: "Farm",
    version: "1.0",
    description: "Module quản lý nông trại và hệ thống điều khiển",
    author: "Anh Khoa",
    depends: [],
    datas: [
      {
        modelName: "access",
        folder: "farm",
        file: "base.access.csv",
        primaryKey: "id",
        noUpdate: false,
      },
      {
        primaryKey: "id",
        modelName: "menu",
        folder: "farm",
        file: "base.menu.csv",
        noUpdate: false,
      },
      {
        primaryKey: "sourceTerm",
        modelName: "translate-term",
        folder: "farm",
        file: "base.translate.term.csv",
      },
    ],
    installable: false,
    application: true,
  },
  models: [
    {
      name: "Farm",
      modelName: "farm",
      schema: farmSchema,
    },
    {
      name: "Area",
      modelName: "area",
      schema: areaSchema,
    },
    {
      name: "Breed",
      modelName: "breed",
      schema: breedSchema,
    },
    {
      name: "Breed Category",
      modelName: "breed-category",
      schema: breedCategorySchema,
    },
    {
      name: "Sample Planting Schedule",
      modelName: "sample-planting-schedule",
      schema: samplePlantingScheduleSchema,
    },
    {
      name: "Sample Period Planting Schedule",
      modelName: "sample-period-planting-schedule",
      schema: samplePeriodPlantingScheduleSchema,
    },
    {
      name: "Planting Schedule",
      modelName: "planting-schedule",
      schema: plantingScheduleSchema,
    },
  ],
});
