import { createModule } from "../../utils/module.js";
import { Area } from "./model/area.js";
import { BreedCategory } from "./model/breed-category.js";
import { Breed } from "./model/breed.js";
import { Farm } from "./model/farm.js";
import { SamplePeriodPlantingSchedule } from "./model/sample-period-planting-schedule.js";
import { SamplePlantingSchedule } from "./model/sample-planting-schedule.js";

Farm();
Area();
Breed();
BreedCategory();
SamplePlantingSchedule();
SamplePeriodPlantingSchedule();

await createModule("farm", {
  id: "farm",
  name: "Farm",
  description: "Module quản lý nông trại",
  folderName: "farm",
  models: ["farm", "area", "breed-category", "breed", "sample-planting-schedule", "sample-period-planting-schedule"],
  state: "normal",
  install: false,
  datas: [
    {
      model: "access",
      folder: "farm",
      file: "base.access.csv",
      primaryKey: "id",
      noUpdate: false,
    },
    {
      primaryKey: "id",
      model: "menu",
      folder: "farm",
      file: "base.menu.csv",
      noUpdate: false,
    },
    {
      primaryKey: "sourceTerm",
      model: "translate-term",
      folder: "farm",
      file: "base.translate.term.csv",
    },
  ],
});
