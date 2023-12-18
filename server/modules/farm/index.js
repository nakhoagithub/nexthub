import { createModule } from "../../utils/module.js";
import { Farm } from "./model/farm.js";

Farm();

await createModule("farm", {
  id: "farm",
  name: "Farm",
  description: "Module quản lý nông trại",
  folderName: "farm",
  models: ["farm"],
  state: "normal",
  install: false,
  datas: [
    {
      model: "access",
      folder: "farm",
      file: "base.access.csv",
      primaryKey: "id",
    },
  ],
});
