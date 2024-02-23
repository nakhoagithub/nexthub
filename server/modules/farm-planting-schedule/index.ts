import { createModule } from "../../utils/module";
import { periodPlantingScheduleDetailSchema } from "../farm-planting-schedule/models/period-planting-schedule-detail";
import { plantingScheduleSchema } from "../farm-planting-schedule/models/planting-schedule";
import { plantingScheduleDetailSchema } from "../farm-planting-schedule/models/planting-schedule-detail";
import { samplePeriodPlantingScheduleSchema } from "../farm-planting-schedule/models/sample-period-planting-schedule";
import { samplePlantingScheduleSchema } from "../farm-planting-schedule/models/sample-planting-schedule";
import { productionDocumentDiseaseMamagementSchema } from "./models/production-document-disease-management";
import { productionDocumentGardenCheckDiarySchema } from "./models/production-document-garden-check-diary";
import { productionDocumentWorkDiarySchema } from "./models/production-document-work-diary";

createModule({
  module: {
    id: "farm-planting-schedule",
    filename: __filename,
    name: "Farm Planting Schedule",
    version: "1.0",
    description: "Module quản lý lịch sản xuất cho nông trại",
    author: "Anh Khoa",
    depends: ["farm"],
    datas: [
      {
        primaryKey: "id",
        modelName: "menu",
        folder: "farm-planting-schedule",
        file: "base.menu.csv",
        noUpdate: false,
      },
      {
        primaryKey: "sourceTerm",
        modelName: "translate-term",
        folder: "farm-planting-schedule",
        file: "base.translate.term.csv",
      },
    ],
    installable: false,
    application: true,
  },
  models: [
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
    {
      name: "Planting Schedule Detail",
      modelName: "planting-schedule-detail",
      schema: plantingScheduleDetailSchema,
    },
    {
      name: "Period Planting Schedule Detail",
      modelName: "period-planting-schedule-detail",
      schema: periodPlantingScheduleDetailSchema,
    },
    {
      name: "Production document work diary",
      modelName: "production-document-work-diary",
      schema: productionDocumentWorkDiarySchema,
    },
    {
      name: "Production document garden check diary",
      modelName: "production-document-garden-check-diary",
      schema: productionDocumentGardenCheckDiarySchema,
    },
    {
      name: "Production document disease management",
      modelName: "production-document-disease-management",
      schema: productionDocumentDiseaseMamagementSchema,
    },
  ],
});
