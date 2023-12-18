import { createModule } from "../../utils/module.js";
import { Area } from "./model/area.js";
import { Farm } from "./model/farm.js";

Farm();
Area();

await createModule("farm", {
  id: "farm",
  name: "Farm",
  description: "Module quản lý nông trại",
  folderName: "farm",
  models: ["farm", "area"],
  state: "normal",
  install: false,
  datas: [
    {
      model: "access",
      folder: "farm",
      file: "base.access.csv",
      primaryKey: "id",
    },
    {
      model: "menu",
      folder: "farm",
      file: "base.menu.csv",
      primaryKey: "id",
    },
  ],
});
