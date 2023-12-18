import { createModule } from "../../utils/module.js";
import { Area } from "./model/area.js";
import { BreedCategory } from "./model/breed-category.js";
import { Breed } from "./model/breed.js";
import { Farm } from "./model/farm.js";

Farm();
Area();
Breed();
BreedCategory();

await createModule("farm", {
  id: "farm",
  name: "Farm",
  description: "Module quản lý nông trại",
  folderName: "farm",
  models: ["farm", "area", "breed-category", "breed"],
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
      model: "menu",
      folder: "farm",
      file: "base.menu.csv",
      primaryKey: "id",
      noUpdate: false,
    },
  ],
});
